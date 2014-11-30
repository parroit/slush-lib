(function(){
/*
   * Git
   * https://github.com/joelcoxokc/slush-lib
   *
   * Copyright (c) 2014 joelcoxokc
   * Licensed under the MIT license.
   */

  'use strict';
  var git      = require('git-exec');
  var github   = require('octonode');
  var Promise  = require('bluebird');
  var utility  = require('../Utility');
  var gitExec;

  Promise.promisifyAll(github);


  var Git = module.exports = (function () {
    var git = {};

    /**
     * [gitAddAll git add command]
     * @return {Object} [Git exec for add .]
     */
    git.gitAddAll = function () {

        return gitExec('add', ['.']);
    };

    /**
     * [gitCommitSkeleton git commit command]
     * @return {Object} [Git Exec for git commit -am]
     */
    git.gitCommitSkeleton = function () {

        return gitExec('commit', ['-am "slush-lib skeleton"']);
    };

    /**
     * [gitPush git push command]
     * @return {Objecy} [Git exec for git push]
     */
    git.gitPush = function () {

        return gitExec('push', ['--set-upstream', 'origin', 'master']);
    };


    /**
     * [createRemoteRepo Create a remote repo online]
     * @param  {Object} answers      [Answers from inquirer Prompt]
     * @param  {Object} githubConfig [.gitconfig information]
     * @return {Object}              [Newly created Repo information]
     */
    git.createRemoteRepo = function (answers, githubConfig) {

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

    /**
     * [createLocalRepo Create a local repo on personal device]
     * @param  {Object} answers [answers from inquirer prompts]
     * @return {Object}         [newly created local repo information]
     */
    git.createLocalRepo = function (answers) {
        var gitParams = [
            'add',
            'origin',
            'https://github.com/' +
            answers.userName + '/' +
            answers.appNameSlug + '.git'

        ];

        var initRepo = utility.promisifyNoError(git.init, git);

        return initRepo(null, '.')

        .then(function() {
            var repo = git.repo('.');
            gitExec = utility.promisifyNoError(repo.exec, repo);

        })

        .then(function() {
            return gitExec('remote', gitParams);
        })

        .return('Local repository created');
    }

    return git;
  }());


})();






