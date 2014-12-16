/*
 * Git
 * https://github.com/joelcoxokc/slush-lib
 *
 * Copyright (c) 2014 joelcoxokc
 * Licensed under the MIT license.
 */

'use strict';
var git = require('git-exec');
var github = require('octonode');
var Promise = require('bluebird');
var gitExec;

Promise.promisifyAll(github);

function promisifyNoError(fn, thisCtx) {
    if (typeof fn !== 'function') {
        throw new TypeError('First arguments is not a function');
    }
    return function( /*args*/ ) {
        var args = [].slice.call(arguments, 0);

        return new Promise(function(resolve) {
            args.push(resolve);
            fn.apply(thisCtx, args);
        });
    };
}

var Git = {};

module.exports = Git;
/**
 * [gitAddAll git add command]
 * @return {Object} [Git exec for add .]
 */
Git.gitAddAll = function() {

    return gitExec('add', ['.']);
};

/**
 * [gitCommitSkeleton git commit command]
 * @return {Object} [Git Exec for git commit -am]
 */
Git.gitCommitSkeleton = function() {

    return gitExec('commit', ['-am "slush-lib skeleton"']);
};

/**
 * [gitPush git push command]
 * @return {Objecy} [Git exec for git push]
 */
Git.gitPush = function() {

    return gitExec('push', ['--set-upstream', 'origin', 'master']);
};


/**
 * [createRemoteRepo Create a remote repo online]
 * @param  {Object} answers      [Answers from inquirer Prompt]
 * @param  {Object} githubConfig [.gitconfig information]
 * @return {Object}              [Newly created Repo information]
 */
Git.createRemoteRepo = function(answers, githubConfig) {

    var client = github.client({
        username: githubConfig.credential.username,
        password: githubConfig.credential.password
    });



    var ghme;
    if (answers.userName !== githubConfig.github.user){
        ghme = client.org(answers.userName);
    } else {
        ghme = client.me();
    }

    var createRepo = Promise.promisify(ghme.repo, ghme);



    return createRepo({
        'name': answers.appNameSlug,
        'description': answers.appDescription,
    })

    .then(function(repo) {
        return 'Remote repository created ' + repo[0].full_name;
    });

};

/**
 * [createLocalRepo Create a local repo on personal device]
 * @param  {Object} answers [answers from inquirer prompts]
 * @return {Object}         [newly created local repo information]
 */
Git.createLocalRepo = function(answers) {
    
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
};
