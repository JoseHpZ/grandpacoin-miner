const http = require('http');

class Request {
    static get(url) {
        return Request.result(url, {method: 'get'});
    }
    static post(url) {
        return Request.result(url, {method: 'post'});
    }
    static result(url, options = {}) {
        return new Promise((resolve, reject) => {
            http[options.method](url, request => {
                let data = '';
                request.on('data', chunk => {
                    data += chunk;
                })
                request.on('end', () => {
                    return resolve(JSON.parse(data));
                })
            }).on('error', err => {
                return reject(err);
            });
        });
    }
}

module.exports = Request;