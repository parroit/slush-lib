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
     * [filter description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function filter ( params, cb ){

    }
    /**
     * [configure description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function configure ( params, cb ){

    }


    /**
     * [gitAddAll description]
     * @return {[type]} [description]
     */
    git.gitAddAll = function () {

        return gitExec('add', ['.']);
    };

    /**
     * [gitCommitSkeleton description]
     * @return {[type]} [description]
     */
    git.gitCommitSkeleton = function () {

        return gitExec('commit', ['-am "slush-lib skeleton"']);
    };

    /**
     * [gitPush description]
     * @return {[type]} [description]
     */
    git.gitPush = function () {

        return gitExec('push', ['--set-upstream', 'origin', 'master']);
    };


    /**
     * [createRemoteRepo description]
     * @param  {[type]} answers      [description]
     * @param  {[type]} githubConfig [description]
     * @return {[type]}              [description]
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






