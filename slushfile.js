/**
 * Copyright (c) 2014, Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var gulp        = require('gulp');
var github      = require('octonode');
var Promise     = require('bluebird');

/**
 * Gulp Storage.. Stored in lib-config.json on user's device.
 * This is used to save configuration on the CWD
 */
require('gulp-storage')(gulp);



var Generators = {
  lib: require('./generators/index'),
  module: require('./generators/module'),
};

Promise.longStackTraces();
Promise.promisifyAll(github);

gulp.task('default', Generators.lib.index);
gulp.task('module', Generators.module.index);



