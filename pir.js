const app = require('express')();
const server = require('http').Server(app);
const serveStatic = require('serve-static');
const compression = require('compression');
const path = require('path');
const mime = require('mime');
const bodyParser = require("body-parser");
const io = require('socket.io')(server);
const pir = require("pi-pins").connect(4);
pir.mode('in');
server.listen(80);

errorHandler = (err, req, res, next) => {
    'use strict';
    res.status(500);
    res.render('error', {
        error: err
    });
};
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(function(req, res, next) {
    'use strict';
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(errorHandler);

app.use(serveStatic(__dirname + '/public', {
    'index': ['index.html']
}));

io.on('connection', (socket) => {
    'use strict';
    console.log('client connected');
    pir.on('rise', () => {
        console.log('PIR sensor detected movement');
        socket.emit('pir', {
            value: 1
        });
    });
    pir.on('fall', () => {
        console.log('PIR sensor detected movement expired');
        socket.emit('pir', {
            value: 0
        });
    });
});
