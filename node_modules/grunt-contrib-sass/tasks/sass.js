/*
 * grunt-contrib-sass
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */
'use strict';
var path = require('path');
var dargs = require('dargs');
var numCPUs = require('os').cpus().length;
var async = require('async');

module.exports = function (grunt) {
  var bannerCallback = function (filename, banner) {
    var content;
    grunt.log.verbose.writeln('Writing CSS banner for ' + filename);

    content = grunt.file.read(filename);
    grunt.file.write(filename, banner + grunt.util.linefeed + content);
  };

  grunt.registerMultiTask('sass', 'Compile Sass to CSS', function () {
    var cb = this.async();
    var options = this.options();
    var passedArgs;
    var bundleExec;
    var banner;

    // Unset banner option if set
    if (options.banner) {
      banner = options.banner;
      delete options.banner;
    }

    passedArgs = dargs(options, ['bundleExec']);
    bundleExec = options.bundleExec;

    async.eachLimit(this.files, numCPUs, function (file, next) {
      var src = file.src[0];
      if (typeof src !== 'string') {
        src = file.orig.src[0];
      }

      if (!grunt.file.exists(src)) {
        grunt.log.warn('Source file "' + src + '" not found.');
        return next();
      }

      if (path.basename(src)[0] === '_') {
        return next();
      }

      var args = [
        src,
        file.dest,
        '--load-path', path.dirname(src)
      ].concat(passedArgs);

      if (process.platform === 'win32') {
        args.unshift('sass.bat');
      } else {
        args.unshift('sass');
      }

      if (bundleExec) {
        args.unshift('bundle', 'exec');
      }

      // If we're compiling scss or css files
      if (path.extname(src) === '.css') {
        args.push('--scss');
      }

      // Make sure grunt creates the destination folders
      grunt.file.write(file.dest, '');

      grunt.util.spawn({
        cmd: args.shift(),
        args: args,
        opts: {
          stdio: 'inherit'
        }
      }, function (error, result, code) {
        if (code === 127) {
          return grunt.warn(
            'You need to have Ruby and Sass installed and in your PATH for\n' +
            'this task to work. More info:\n' +
            'https://github.com/gruntjs/grunt-contrib-sass'
          );
        }

        // Callback to insert banner
        if (banner) {
          bannerCallback(file.dest, banner);
        }

        grunt.log.writeln('File "' + file.dest + '" created.');
        next(error);
      });
    }, cb);
  });
};
