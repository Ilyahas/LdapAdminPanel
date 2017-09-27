const express = require('express');
const app = express();
const appClient = express();
const appAdmin = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const config = require('./app/config');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(config.prefClient, appClient);
app.use(config.prefAdmin, appAdmin);

app.listen(config.listen, () => {
    console.log('App run on port ' + config.listen + '!');
});


appClient.use(express.static(__dirname + '/ng2-client/dist/'));
appClient.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/ng2-client/dist/index.html'));
});

appAdmin.use(express.static(__dirname + '/ng2-admin/dist/'));
appAdmin.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/ng2-admin/dist/index.html'));
});


require('./app/routes')(appAdmin);
require('./app/routesClient')(appClient);