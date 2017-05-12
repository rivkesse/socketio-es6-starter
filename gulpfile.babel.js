'use strict';

import gulp from 'gulp';
import webpackStream  from 'webpack-stream';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import sass from 'gulp-sass';

var gutil = require("gulp-util");
var webpack = require("webpack");
var browserSync = require('browser-sync').create();
var WebpackDevServer = require('webpack-dev-server');

gulp.task('build', ['build-client', 'build-server']);

gulp.task('build-client', ['build-shared', 'copy-js', 'copy-assets','sass'], () => {
    gulp.src('src/client/js/client.js')
        .pipe(webpackStream(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/client/js'))

        // webpack(
        //     require('./webpack.config.js'),
        // function(err, stats) {
        //     if(err) throw new gutil.PluginError("webpack", err);
        //     gutil.log("[webpack]", stats.toString({
        //         // output options
        //     }));
        //     // callback();
        // });
    }
);

gulp.task('copy-assets', () =>
    gulp.src(['src/client/**/*.*', '!src/client/js/**/*.*'])
    .pipe(gulp.dest('dist/client/'))
);

gulp.task('copy-js', () =>
    gulp.src(['src/client/**/*.*',
            '!src/client/js/client.js'])
    .pipe(gulp.dest('dist/client/'))
);

gulp.task('sass', function () {
  return gulp.src('src/client/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/client/css/'))
    .pipe(browserSync.stream());
});

gulp.task('build-server', ['build-shared'], () =>
    gulp.src(['src/server/**/*.*'])
    .pipe(babel())
    .pipe(gulp.dest('dist/server/'))
);

gulp.task('build-shared', () =>
    gulp.src(['src/shared/**/*.*'])
        .pipe(babel())
        .pipe(gulp.dest('dist/shared/'))
);
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "yourlocal.dev"
//     });
// });

gulp.task('watch', ['build'], () => {
    gulp.watch(['src/client/*.html', 'src/client/**/*.*'], ['build-client']);
    gulp.watch(['src/server/**/*.*'], ['build-server']);
    gulp.watch(['src/shared/**/*.*'], ['build-server', 'build-client']);
    gulp.start('run');

    // browserSync.init({
    //     proxy: "local.dev"
    // });
});

gulp.task('run', () => {
    nodemon({
        delay: 10,
        script: 'dist/server/server.js',
        // args: ["config.json"],
        ext: 'js',
        watch: 'src'
    });

    // webpack-dev-server --content-base /dist --inline --hot --display-error-details

});


gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack( require('./webpack.config.js') );

    new WebpackDevServer(compiler, {
        // server and middleware options

        historyApiFallback: {
          index: 'src/client/index.html',
        },
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/src/client/index.html");

        // keep the server alive or continue?
        // callback();
    });
});

gulp.task('default', ['build', 'run']);