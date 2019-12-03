const express = require('express');
const routes = require('./src/routes/routes').routes;
const app = express();
const PORT = process.env.PORT || 2000;
const path = require('path');
const socketServer = require('http').createServer(app);
const io = require('socket.io')(socketServer);
const MiningJob = require('./src/MiningJob');

MiningJob.io = io;

socketServer.listen(4000, () => console.log('SOCKET IO SERVER LISTENING At PORT 4000'));

app.listen(PORT, function () {
    console.log('App listening on port: ' + PORT);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
routes(app);






