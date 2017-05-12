'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _util = require('../shared/util');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ dest: './public/uploads/' });

var app = (0, _express2.default)();
var server = _http2.default.Server(app);
var io = new _socket2.default(server);
var port = process.env.PORT || 3000;
var users = [];
var sockets = {};

app.use((0, _compression2.default)({}));
app.use(_express2.default['static'](__dirname + '/../client'));

app.post('/index', _bodyParser2.default.json(), function (req, res) {

  console.log(req.files);

  res.write('uploaded!', req);

  // res.render('index.html');
});

app.post('/upload', upload.single('capture'), function (req, res, next) {

  console.log(req.file.name, req.file);

  var base64data = fs.createReadStream(req.file.path);

  _upload2.default.upload_file_to_s3(base64data, req.file.originalname).then(function () {
    console.log('done');
    res.write('done!');
  });

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
});

server.listen(port, function () {
  console.log('[INFO] Listening on *:' + port);
});