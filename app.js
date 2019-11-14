const express = require('express');
const routes = require('./src/routes/routes').routes;
const app = express();
const PORT = process.env.PORT || 5556;
const Request = require('./src/utils/Request');

app.listen(PORT, function () {
    console.log('App listening on port: ' + PORT);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);





