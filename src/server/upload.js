var fs = require('fs');
var q = require('q');
var AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: "AKIAJ2CJDSKRHB3ATMHA",
    secretAccessKey: "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",
    region: "us-east-1"
});


AWS.config.credentials.get(function(err) {
  if (err) console.log(err);
  else console.log(AWS.config.credentials);
});

var s3 = new AWS.S3();
var bucketname = "fb-selfie-explore";

// function getImages () {
//                 console.log('get images for ' +  + '...');

//     var params = {
//       Bucket: bucketname, /* required */
//       Delimiter: ',',
//       EncodingType: 'url'
//     };
//     s3.listObjects(params, function(err, data) {
//       if (err) console.log(err, err.stack); // an error occurred
//       else     console.log(data);           // successful response
//     });

// }

function upload_avatar_to_s3(avatar, filename) {
    var base = avatar.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(base, 'base64');
    return upload_file_to_s3(buf, filename);
}

function make_url(filename) {
    return "https://s3.amazonaws.com/" + bucketname + '/' + filename + '?' + Date.now();
}

function upload_file_to_s3 (base64data, filename) {
    return new q.Promise(function(resolve, reject) {
        var s3 = new AWS.S3();
        s3.putObject({
            Bucket: bucketname,
            Key: filename,
            Body: base64data,
            ACL: 'public-read'
        },function (resp) {
            resolve(make_url(filename));
        });
    });
}

function getImages(dir) {

    var params = {
      Bucket: bucketname, /* required */
      Prefix: dir + '/',
      Delimiter: '/',
      EncodingType: 'url'
    };


    return new q.Promise(function(resolve, reject) {

        s3.listObjects(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
         // else     console.log(data.Contents);           // successful response

          resolve(data.Contents);
        });
    });
}

var UploadObj = {
    getTintedImages: function () {

        return getImages('tinted');
    },
    getLogos: function () {

        return getImages('logos');

    },
    upload_avatar_to_s3: function  (avatar, filename) {
        var base = avatar.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(base, 'base64');
        return upload_file_to_s3(buf, filename);
    },
    upload_file_to_s3: function (base64data, filename) {
        return new q.Promise(function(resolve, reject) {
            console.log('uploading...');
            // var s3 = new AWS.S3();
            s3.putObject({
                Bucket: bucketname,
                Key: filename,
                Body: base64data,
                ACL: 'public-read'
            },function (resp) {
                console.log('done uploading...', resp);
                resolve(make_url(filename));
            });
        });
    }
}

module.exports = UploadObj;
