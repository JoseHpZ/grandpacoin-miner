const express = require('express');
const app = express();
const PORT = process.env.PORT || 5556;
const Request = require('./src/utils/Request');

app.listen(PORT, function () {
    console.log('App listening on port: ' + PORT);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Request.get('http://localhost:5555/mining/get-mining-job/0xb9770e899908c2a575ed14848020ab26e22a71ac')
    .then(res => console.log(res))
    .catch(err => console.log(err));



