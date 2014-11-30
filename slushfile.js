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
 * TravisUtil General Purpose Utilities for Travis Ci
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





This is a modified version of the last pull request. I the bogs that I found.

In order to do so I had to restructure the code base. All your code is still there, I just separated it into separate files.

If you have any problems locating thing, please let me know.

NPM Installs
gulp-storage: A Yeoman like config store, but for gulp. This stores config information in the users directory.
gulp-finder: A Module that adds glob method to the templates directory.
minimist: Arguments parser for the sub-generator.

Created Classes
Utility Class: Contains General purpose Utilities

Created Modules
Git: Module: Handles all git configurations
Travis: Module: Handles all TravisCi configurations

Created INDEX Generator
The Index Generator is the primary generator for slush-lib.
all other generators are name under the ./generators directory

Each Generator has an index.js, ./templates/ dir and either a prompts.js or config.js

These files break the generator up into modular components.
You can also see the docs for how I implemented everything.

If you have any questions, please let me know!

JoelCox