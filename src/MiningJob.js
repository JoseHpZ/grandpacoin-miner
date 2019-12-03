const Request = require('./utils/Request');
const crypto = require('crypto');
const BigNumber = require('bignumber.js');

class MiningJob {
    static io;
    static start({res: response}) {
        if (global.shouldMine) return response.status(404).json({message: 'Miner still active. You must stop it before you can start the miner again.'})

        MiningJob.emit('Starting Miner.');
        MiningJob.mineBlock();

        global.didMinerStart = false;
        return response.status(200).json(true);
    }
    static stop({res: response}) {
        if (!global.shouldMine) {
            MiningJob.emit('No active miner to stop.');
            return response.json();
        }
        global.shouldMine = false;

        return response.status(200).json(true);
    }
    static mineBlock() {
        global.shouldMine = true;

        Request.get('http://localhost:5555/mining/get-mining-job/0xb9770e899908c2a575ed14848020ab26e22a71ac')
            .then(blockInfo => {
                if (!global.didMinerStart) {
                    global.didMinerStart = true;
                    MiningJob.emit('Miner started.');
                }
                const body = MiningJob.createBlockHash(blockInfo);
                
                if (global.shouldMine) {
                    Request.post('http://localhost:5555/mining/submit-mined-block', {
                        body 
                    })
                    .then(res => {
                        MiningJob.emit(res.message);
                    })
                    .catch(err => {
                        if (err.errno && err.errno === 'ECONNREFUSED') {
                            MiningJob.errorTimeoutHandler();
                        } else {
                            MiningJob.emit(err.message);
                        }
                    })
                    .finally(() => {
                        if (global.shouldMine) {
                            MiningJob.mineBlock();
                        } else {
                            MiningJob.emit('Miner stopped.');
                        }
                    })
                }
            })
            .catch(err => {
                if (err.message && !err.code) {
                    MiningJob.emit(err);
                }
                if (global.shouldMine && !err.code) {
                    MiningJob.mineBlock();
                }
                if (err.errno && err.errno === 'ECONNREFUSED') {
                    MiningJob.errorTimeoutHandler();
                }
            });
    }
    static createBlockHash({ difficulty, blockDataHash }) {
        let nonce = BigNumber(0);
        let dateCreated = (new Date()).toISOString();  
        let hash = '';

        while (difficulty > hash.match(/^0*/)[0].length && global.shouldMine) {
            hash = crypto.createHash('sha256')
                .update(JSON.stringify({
                    blockDataHash,
                    dateCreated,
                    nonce
                }))
                .digest('hex');

            if (difficulty > hash.match(/^0*/)[0].length) {
                nonce = nonce.plus(1);
                dateCreated = (new Date()).toISOString();
            }

        }
        if (!global.shouldMine) {
            return;
        }
        return {
            blockDataHash,
            dateCreated,
            nonce,
            blockHash: hash
        };
    }
    static emit(message) {
        MiningJob.io.sockets.emit('event', {message});
    }
    static errorTimeoutHandler(err) {
        global.shouldMine = false;
        MiningJob.emit('Network connection error. Trying to connect in 30 seconds.');

        if (global._conectionTimeout) clearTimeout(global._conectionTimeout);
        global._conectionTimeout = setTimeout(() => {
            MiningJob.emit('Reconnecting...');
            MiningJob.mineBlock();
        }, 30000);
    }
}
module.exports = MiningJob;