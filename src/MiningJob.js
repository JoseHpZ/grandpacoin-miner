const Request = require('./utils/Request');
const crypto = require('crypto');

class MiningJob {
    static start({res: response}) {
        MiningJob.mineBlock();
            return response.status(200).json({message: 'Miner started.'});
    }
    static mineBlock() {
        Request.get('http://localhost:5555/mining/get-mining-job/0xb9770e899908c2a575ed14848020ab26e22a71ac')
            .then(blockInfo => {
                const minedBlock = MiningJob.createBlockHash(blockInfo)

                Request.post('http://localhost:5555/mining/submit-mined-block', {
                    body: minedBlock
                })
                .then(res => console.log(res))
                .catch(err => console.log(err))
                .finally(() => {
                    // MiningJob.mineBlock();
                })
            })
            .catch(err => {
                MiningJob.mineBlock();
            });
    }
    static createBlockHash({ difficulty, blockDataHash }) {
        let nonce = 0;
        let dateCreated = (new Date()).toISOString();  
        let hash = '';

        while (difficulty > hash.match(/^0*/)[0].length) {
            hash = crypto.createHash('sha256')
                .update(JSON.stringify({
                    blockDataHash,
                    dateCreated,
                    nonce
                }))
                .digest('hex')
            nonce += 1;
            dateCreated = (new Date()).toISOString();
        }
        return {
            blockDataHash,
            dateCreated,
            nonce,
            blockhash: hash
        };
    }
}
module.exports = MiningJob;