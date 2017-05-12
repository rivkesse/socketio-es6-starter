'use strict';

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import {validNick, findIndex, sanitizeString} from '../shared/util';
import bodyParser from 'body-parser';
import s3Upload from './upload';

var fs          = require('fs');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest:'./public/uploads/' });

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};

app.use(compression({}));
app.use(express['static'](__dirname + '/../client'));

app.post('/index', bodyParser.json(), (req, res) => {


   console.log(req.files);

   res.write('uploaded!', req);

    // res.render('index.html');
});

app.post('/upload', upload.single('capture'), function (req, res, next) {

    console.log(req.file.name, req.file);

    let base64data = fs.createReadStream(req.file.path);

  s3Upload.upload_file_to_s3(base64data, 'test.jpg')
    .then(function (url) {
        console.log('done');
        // res.send(__dirname + '/../client/image.html');
        res.end('<html><head></head><body><img src="'+url+'" /></body></html>');
    });
});

app.get('/upload', function (req, res) {

    res.send('<html><head></head><body><img src="https://s3.amazonaws.com/fb-selfie-explore/test.jpg" /></body></html>');
});

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});