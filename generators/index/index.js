/*
 * Lib
 * https://github.com/joelcoxokc/slush-lib
 *
 * Copyright (c) 2014 joelcoxokc
 * Licensed under the MIT license.
 */

'use strict';
var $ = require('gulp-load-plugins')({
    lazy: false
});
var _ = require('underscore.string');
var path = require('path');
var Promise = require('bluebird');
var readGitConfig = Promise.promisify(require('git-config'));
var credential = Promise.promisify(require('git-credential'));
var git = require('../../lib/git');
var utility = require('../../Utility');
var TravisUtil = require('../../lib/travis');
var gulp = require('gulp');
var exists = require('npm-exists');
var inquirer = require('inquirer');

Promise.longStackTraces();

/**
 * [exports description]
 * @param  {[type]} utility    [description]
 * @param  {[type]} git        [description]
 * @param  {[type]} TravisUtil [description]
 * @return {[type]}            [description]
 */
var lib = module.exports = {};


var slug;
var githubConfig;

/**
 * [validateCredenitals description]
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function validateCredenitals(gitConfig) {
    return credential()
        .then(function(data) {
            gitConfig.credential = data;
            return (githubConfig = gitConfig);
        }).catch(function() {
            console.log('GitHub credentials not found.');
            return (githubConfig = gitConfig);
        });
}


/**
 * [configureGit description]
 * @param  {[type]}   params   [description]
 * @return {[type]}            [description]
 */
function configureGit(answers) {

    answers.slug = answers.userName + '/' + answers.appNameSlug;
    var slushOps = [Promise.resolve(answers)];
    slushOps.push(git.createLocalRepo(answers));

    if (answers.githubPublished) {
        slushOps.push(
            git.createRemoteRepo(answers, githubConfig)
        );
    }

    slushOps.push(lib.install(answers));

    return Promise.all(slushOps);
}

/**
 * [configureTravis description]
 * @param  {[type]}   params   [description]
 * @return {[type]}            [description]
 */
function configureTravis(results) {
    var answers = results[0];
    if (answers.travisTested) {
        return TravisUtil.createTravisProject(slug, githubConfig)
            .then(function() {
                results.push('Module activated on Travis');
                return results;
            });
    } else {
        return results;
    }

}

/**
 * [runGitCommands description]
 * @param  {Array}   results  [description]
 * @return {Promise}          [description]
 */
function runGitCommands(results) {

    var answers = results[0];
    if (answers.githubPublished) {
        return git.gitAddAll()
            .then(git.gitCommitSkeleton)
            .then(git.gitPush)
            .then(function() {
                results.push('Skeleton committed and pushed to github');
                return results;
            });
    } else {
        return git.gitAddAll()
            .then(git.gitCommitSkeleton)
            .then(function() {
                results.push('Skeleton committed');
                return results;
            });
    }

}

function renameFiles(slug) {
  return function(file) {
    var appReplace = file.basename.replace(new RegExp('appName', 'g'), slug);
    file.basename = appReplace;

    if (file.basename[0] === '_') {
        file.basename = '.' + file.basename.slice(1);
    }
  };
}


/**
 * [install description]
 * @param  {[type]} answers [description]
 * @return {Promise}        [Promise when the install is complete]
 */
lib.install = function(answers) {
    var files = [__dirname + '/templates/**'];

    return new Promise(function(resolve, reject) {
        gulp.src(files)
            .pipe($.template(answers))
            .pipe($.rename(renameFiles(answers.appNameSlug)))
            .pipe($.conflict('./'))
            .pipe(gulp.dest('./'))
            .pipe($.install())
            .pipe($.util.noop())
            .on('finish', function() {
                resolve('Slush template installed.');
            })
            .on('error', reject);
    });
};


function validateAppName(appName) {

    /* jshint validthis: true */
    var done = this.async();

    exists(appName).then(function(moduleExists) {

        if (moduleExists) {
            done(appName + ' already registered on npm.');
        } else {
            done(true);
        }
    });

}

function askOptionToUser(gitConfig) {
    var prompts = [{
        name: 'githubPublished',
        message: 'source will be hosted on GitHub?',
        type: 'confirm',
        default: true
    }, {
        name: 'npmPublished',
        message: 'will be published on NPM?',
        type: 'confirm',
        default: true
    }, {
        name: 'travisTested',
        message: 'will be tested on Travis?',
        type: 'confirm',
        default: true
    }, {
        name: 'appName',
        message: 'module name?',
        default: path.basename(process.cwd()),
        validate: validateAppName,
        when: function(answers) {
            return answers.npmPublished;
        }
    }, {
        name: 'appName',
        message: 'module name?',
        default: path.basename(process.cwd()),
        when: function(answers) {
            return !answers.npmPublished;
        }
    }, {
        name: 'appDescription',
        message: 'description?'
    }, {
        name: 'appVersion',
        message: 'module version?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'author name?',
        default: gitConfig.user && gitConfig.user.name
    }, {
        name: 'authorEmail',
        message: 'author email?',
        default: gitConfig.user && gitConfig.user.email
    }, {
        name: 'userName',
        message: 'github username?',
        default: gitConfig.github && gitConfig.github.user
    }];

    return new Promise(function(resolve) {
        inquirer.prompt(prompts, function(answers) {

            answers.appNameSlug = _.slugify(answers.appName);
            answers.appNameJs = utility.normalize(answers.appName);
            var d = new Date();
            answers.year = d.getFullYear();
            answers.date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

            resolve(answers);


        });
    });



}

/**
 * [index description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
lib.index = function(done) {

    /**
     * [createConfigStore description]
     * @param  {[type]} answers [description]
     * @return {[type]}         [description]
     */
    function createConfigStore(answers) {
            _this.storage.create('store', 'lib-config.json');
            _this.storage.store(answers);
            return answers;
        }
        /**
         * [splitResults description]
         * @param  {[type]} results [description]
         * @return {[type]}         [description]
         */
    function splitResults(results) {
            results.splice(0, 1);
            console.dir(results);
            return results;
        }
        /**
         * [catchHandler description]
         * @param  {[type]} error [description]
         * @return {[type]}       [description]
         */
    function catchHandler(error) {
        console.error(error.message + '\n' + error.stack);
    }

    var _this = this;

    var userHome = path.join(utility.getUserHome(), '.gitconfig');

    readGitConfig(userHome)

    .then(validateCredenitals)

    .then(askOptionToUser)

    .then(createConfigStore)

    .then(configureGit)

    .then(configureTravis)

    .then(runGitCommands)

    .then(splitResults)

    .then(done)

    .catch(catchHandler);



};
