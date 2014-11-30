/**
 * Copyright (c) 2014, Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var gulp        = require('gulp');
var install     = require('gulp-install');
var conflict    = require('gulp-conflict');
var template    = require('gulp-template');
var rename      = require('gulp-rename');
var inquirer    = require('inquirer');
var path        = require('path');
var git         = require('git-exec');
var github      = require('octonode');
var Promise     = require('bluebird');
var exists      = require('npm-exists');
var gulpUtil    = require('gulp-util');
var Travis      = require('travis-ci');
var TravisUtil  = require('./lib/travis');

/**
 * Gulp Storage.. Stored in lib-config.json on user's device.
 * This is used to save configuration on the CWD
 */
require('gulp-storage')(gulp);

/**
 * utility General Purpose Utilities
 * @type {Object}
 *
 * @promisifyNoError
 * @normalize
 * @getUserHome
 */
var Utility  = require('./Utility');



/**
 * GitUtil General Purpose Utilities for git hub
 * @type {Object}
 *
 * @gitAddAll
 * @gitCommitSkeleton
 * @gitPush
 * @createRemoteRepo
 * @createLocalRepo
 */
var GitUtil = require('./lib/git')

/**
 * TravilUtil General Purpose Utilities for Travis Ci
 * @type {Object}
 *
 * @createTravisProject
 */
var TravisUtil  = require('./lib/travis');


var Generators = {
  lib: require('./generators/index')(Utility, GitUtil, TravisUtil),
  module: require('./generators/module')(Utility, GitUtil, TravisUtil),
};

Promise.longStackTraces();
Promise.promisifyAll(github);

gulp
  .task('default', Generators.lib.index);
gulp
  .task('module', Generators.module.index);



