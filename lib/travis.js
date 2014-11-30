(function(){
/*
   * Travis
   * https://github.com/joelcoxokc/slush-lib
   *
   * Copyright (c) 2014 joelcoxokc
   * Licensed under the MIT license.
   */
  var path = require('path'),
      inquirer = require('inquirer'),
      utility  = require('../utility'),
      _s       = require('underscore.string'),
      Promise  = require('bluebird'),
      TravisCi   = require('travis-ci');



  'use strict';

  var Travis = module.exports = (function () {
    var Travis = {};

    var travisCi = new TravisCi({
        version: '2.0.0'
    });

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


    Travis.createTravisProject = function (slug, githubConfig) {

        console.log('slug:' + slug);
        var authenticate = Promise.promisify(travisCi.authenticate, travisCi);
        return authenticate({
            username: githubConfig.credential.username,
            password: githubConfig.credential.password
        })

        .then(function() {
            var sync = Promise.promisify(travisCi.users.sync, travisCi.users);
            return sync();
        })


        .then(function(syncResult) {
            console.log('syncResult:' + syncResult.result);
            if (!syncResult.result) {
                throw new Error('unable to synchronize your Travis account');
            }

            function findRepo(retry) {
                console.log('Travis retrieving repo from Github ' + (retry ? (retry + 'retry ') : ''));
                var repos = Promise.promisify(travisCi.repos, travisCi);

                var reposPromise = repos({
                    slug: slug
                });

                return reposPromise
                    .then(function(results) {
                        if (results.repos.length === 0) {
                            if (retry === 10) {
                                throw new Error('unable to find repo after 5 retry');
                            }
                            return Promise.delay(1000 * retry).then(function() {
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
            var hooks = Promise.promisify(travisCi.hooks, travisCi);

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


    return Travis;
  }());


})();






