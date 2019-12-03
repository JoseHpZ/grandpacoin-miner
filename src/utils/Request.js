const http = require('http');

class Request {
    static get(url) {
        return Request.readOnlyResult(url, {method: 'get'});
    }
    static post(url, options = {}) {
        return Request.sendResult(url, options);
    }
    
    static readOnlyResult(url, options = {}) {
        return new Promise((resolve, reject) => {
            http[options.method](url, res => {
                Request.formatDataChunk(res, resolve, reject);
            }).on('error', err => {
                reject(err)
            });
        });
    }
    static sendResult(url, options = {}) {
        return new Promise((resolve, reject) => {
            const config = {
                hostname: 'localhost',
                port: 5555,
                path: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };
            
            const req = http.request(config, res => {
                Request.formatDataChunk(res, resolve, reject);
            });

            if (options.body) req.write(JSON.stringify(options.body));
            req.on('error', err => {
                err.code = req.code;
                reject(err)
            });
            req.end()
        });
    }
    static formatDataChunk(res, resolve, reject) {
        let data = '';
    
        res.on('data', d => {
            data += d;
        });
        res.on('end', () => {
            const result = res.statusCode >= 200 && res.statusCode < 300 ? resolve : reject;
            data = JSON.parse(data);
            data.status = res.statusCode
            result(data)
        })
    }
}

module.exports = Request;