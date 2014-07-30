/*
 * slush-node
 * https://github.com/chrisenytc/slush-node
 *
 * Copyright (c) 2014, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var rename = require('gulp-rename');
var _ = require('underscore.string');
var inquirer = require('inquirer');
var path = require('path');

var git = require('git-exec');
var github = require('octonode');
var Promise = require('bluebird');
var exists = require('npm-exists');
var gulpUtil = require('gulp-util');
var Travis = require('travis-ci');

var travis = new Travis({
    version: '2.0.0'
});
var readGitConfig = Promise.promisify(require('git-config'));
var credential = Promise.promisify(require('git-credential'));
var gitExec;



Promise.promisifyAll(github);

function promisifyNoError(fn, thisCtx) {
    return function( /*args*/ ) {
        var args = [].slice.call(arguments, 0);

        return new Promise(function(resolve) {
            args.push(resolve);
            fn.apply(thisCtx, args);
        });
    };

}


function normalize(name) {
    var chars = [];
    var nextUpper = false;
    var i = 0,
        l = name.length;

    for (; i < l; i++) {
        var c = name.charAt(i);
        if (/\w/.test(c)) {
            chars.push(nextUpper ? c.toUpperCase() : c);
            nextUpper = false;
        } else {
            nextUpper = true;
        }
    }
    name = chars.join('');
    return name;
}

function getUserHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}



function installSlushTemplate(answers) {
    var files = [__dirname + '/templates/**'];

    return new Promise(function(resolve, reject) {
        gulp.src(files)
            .pipe(template(answers))
            .pipe(rename(function(file) {
                var appReplace = file.basename.replace(new RegExp('appName', 'g'), answers.appNameSlug);
                file.basename = appReplace;

                if (file.basename[0] === '_') {
                    file.basename = '.' + file.basename.slice(1);
                }
            }))
            .pipe(conflict('./'))
            .pipe(gulp.dest('./'))
            .pipe(install())
            .pipe(gulpUtil.noop())
            .on('finish', function() {
                resolve('Slush template installed.');
            })
            .on('error', reject);


    });

}

function createRemoteRepo(answers, githubConfig) {

    var client = github.client({
        username: githubConfig.credential.username,
        password: githubConfig.credential.password
    });

    var ghme = client.me();
    var createRepo = Promise.promisify(ghme.repo, ghme);

    return createRepo({
            'name': answers.appNameSlug,
            'description': answers.appDescription,
        })

        .then(function(repo) {
            return 'Remote repository created ' + repo[0].full_name;
        });

}

function createLocalRepo(answers) {
    var gitParams = [
        'add',
        'origin',
        'https://github.com/' +
        answers.userName + '/' +
        answers.appNameSlug + '.git'

    ];

    var initRepo = promisifyNoError(git.init, git);

    return initRepo(null, '.')

    .then(function() {
        var repo = git.repo('.');
        gitExec = promisifyNoError(repo.exec, repo);

    })

    .then(function() {
        return gitExec('remote', gitParams);
    })

    .return('Local repository created');
}


function gitAddAll() {
    return gitExec('add', ['.']);
}

function gitCommitSkeleton() {
    return gitExec('commit', ['-am "slush-lib skeleton"']);
}

function gitPush() {

    return gitExec('push', ['--set-upstream', 'origin', 'master']);
}


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
        name: 'appName',
        message: 'module name?',
        default: path.basename(process.cwd()),
        validate: validateAppName
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
            answers.appNameJs = normalize(answers.appName);
            var d = new Date();
            answers.year = d.getFullYear();
            answers.date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

            resolve(answers);


        });
    });



}


function createTravisProject(slug, githubConfig) {
    console.log('slug:' + slug);
    var authenticate = Promise.promisify(travis.authenticate, travis);
    return authenticate({
        username: githubConfig.credential.username,
        password: githubConfig.credential.password
    })

    .then(function() {
        var sync = Promise.promisify(travis.users.sync, travis.users);
        return sync();
    })


    .then(function(syncResult) {
        console.log('syncResult:' + syncResult.result);
        if (!syncResult.result) {
            throw new Error('unable to synchronize your Travis account');
        }

        function findRepo(retry){
            console.log('Travis retrieving repo from Github ' + (retry ? (retry + 'retry ') : '') );
            var repos = Promise.promisify(travis.repos, travis);

            var reposPromise = repos({
                slug: slug
            });    

            return reposPromise
                .then(function(results){
                    if (results.repos.length === 0) {
                        if (retry === 10) {
                            throw new Error('unable to find repo after 5 retry');
                        }
                        return  Promise.delay(1000 * retry).then(function(){
                            return findRepo(retry + 1);
                        });
                    }
                    console.log('Travis successfully retrieved repo from Github');
                    return results.repos[0];
                });
        }

        return findRepo(0);
    })

    .then(function(repo) {
        var hooks = Promise.promisify(travis.hooks, travis);

        return hooks({
            id: repo.id,
            hook: {
                active: true
            }
        });
    })

    .then(function(response) {
        if (!response.result) {
            throw new Error('unable to activate module on Travis');
        }
    });

}



gulp.task('default', function(done) {

    Promise.longStackTraces();

    var slug;
    var githubConfig;



    readGitConfig(path.join(getUserHome(), '.gitconfig'))
        
        .then(function(gitConfig) {
            return credential()
                .then(function(data) {
                    gitConfig.credential = data;
                    return (githubConfig = gitConfig);
                });
        })
        
        .then(askOptionToUser)

        .then(function(answers) {
            slug = answers.userName + '/' + answers.appNameSlug;
            return Promise.all([
                createLocalRepo(answers),
                createRemoteRepo(answers, githubConfig),
                installSlushTemplate(answers)
            ]);


        })

        .then(function(results) {
            return createTravisProject(slug, githubConfig)
                .then(function() {
                    results.push('Module activated on Travis');
                    return results;
                });
        })

        .then(function(results) {
            return gitAddAll()
                .then(gitCommitSkeleton)
                .then(gitPush)
                .then(function() {
                    results.push('Skeleton committed and pushed to github');
                    return results;
                });
        })

        .then(function(results) {
            console.dir(results);

        })

        .then(done)

        .catch(function(err) {

            console.error(err);
        });




});



