const MiningJob = require('../MiningJob');

function routes(app) {
    app.get('/job/start', MiningJob.start);
}
module.exports = {
    routes
}