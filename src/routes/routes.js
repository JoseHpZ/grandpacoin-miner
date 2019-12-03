const MiningJob = require('../MiningJob');

function routes(app) {
    app.get('/job/start', MiningJob.start);
    app.get('/job/stop', MiningJob.stop);
    app.get('/', ({res}) => {
        res.sendFile(__dirname.replace(/src.*/g, 'public/views/index.html'));
    });
}
module.exports = {
    routes
}