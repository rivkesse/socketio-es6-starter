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

  s3Upload.upload_file_to_s3(base64data, req.file.originalname)
    .then(function () {
        console.log('done');
        res.write('done!');
    })

  // if(!req.body.hasOwnProperty('img') ||
  //    !req.body.hasOwnProperty('frames')) {
  //   res.statusCode = 400;
  //   return res.send('Error 400: Incomplete request');
  // }


  // var imageStream = fs.createReadStream(req.file.path, { encoding: 'binary' })
  //   , cloudStream = cloudinary.uploader.upload_stream( function() { res.redirect('/'); });

  // imageStream.on('data', cloudStream.write).on('end', cloudStream.end);

    // fs.readFile(req.file.originalname, function (err, data) {
    //   if (err) { throw err; }

    //   var base64data = new Buffer(data, 'binary');

    //   s3Upload.upload_file_to_s3(base64data, req.file.path)
    //     .then(function () {
    //         res.write('done!');
    //     })

    //   // var s3 = new AWS.S3();
    //   // s3.client.putObject({
    //   //   Bucket: 'banners-adxs',
    //   //   Key: 'del2.txt',
    //   //   Body: base64data,
    //   //   ACL: 'public-read'
    //   // },function (resp) {
    //   //   console.log(arguments);
    //   //   console.log('Successfully uploaded package.');
    //   // });

    // });

  // star-wars-logo.png
})

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});