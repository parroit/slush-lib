(function(){
/*
   * Lib
   * https://github.com/joelcoxokc/slush-lib
   *
   * Copyright (c) 2014 joelcoxokc
   * Licensed under the MIT license.
   */

  'use strict';
  var $           = require('gulp-load-plugins')({lazy:false}),
      path        = require('path'),
      Promise     = require('bluebird'),
      readGitConfig = Promise.promisify(require('git-config')),
      credential = Promise.promisify(require('git-credential')),
      gulp        = require('gulp');

      Promise.longStackTraces();


  var Lib = module.exports = function (utility, git, TravisUtil) {
    var lib = {};

    var config      = require('./config')(utility);
    var slug;
    var githubConfig;
    var _this = this;

    /**
     * [validateCredenitals description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function validateCredenitals ( gitConfig ){
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
    function configureGit ( answers ){

        slug = answers.userName + '/' + answers.appNameSlug;
        var slushOps = [Promise.resolve(answers)];
        slushOps.push( git.createLocalRepo(answers));


        if (answers.githubPublished) {
            slushOps.push(
                git.createRemoteRepo(answers, githubConfig)
            );
        }

        slushOps.push( lib.install(answers) );

        return Promise.all(slushOps);
    }

    /**
     * [configureTravis description]
     * @param  {[type]}   params   [description]
     * @return {[type]}            [description]
     */
    function configureTravis ( answers ){

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
    function runGitCommands ( results ){

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


     /**
     * [install description]
     * @param  {[type]} answers [description]
     * @return {Promise}        [Promise when the install is complete]
     */
    lib.install = function ( answers ){
      var files = [__dirname + '/templates/**'];


      return new Promise(function(resolve, reject) {
          gulp.src(files)
              .pipe($.template(answers))
              .pipe($.rename( config.renameFiles( answers.appNameSlug ) ))
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

    /**
     * [index description]
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    lib.index = function(done){

        var _this = this;

        var userHome = path.join(utility.getUserHome(), '.gitconfig')

        readGitConfig( userHome )

          .then( validateCredenitals )

          .then( config.askOptionToUser )

          .then( createConfigStore )

          .then( configureGit )

          .then( configureTravis )

          .then( runGitCommands )

          .then( splitResults )

          .then(done)

          .catch( catchHandler );


          /**
           * [createConfigStore description]
           * @param  {[type]} answers [description]
           * @return {[type]}         [description]
           */
          function createConfigStore(answers){
            _this.storage.create('store', 'lib-config.json');
            _this.storage.store(answers);
            return answers;
          }
          /**
           * [splitResults description]
           * @param  {[type]} results [description]
           * @return {[type]}         [description]
           */
          function splitResults(results){
            results.splice(0,1);
            console.dir(results);
            return results;
          }
          /**
           * [catchHandler description]
           * @param  {[type]} error [description]
           * @return {[type]}       [description]
           */
          function catchHandler(error){
            console.error(error)
          }
    };


    return lib;
  };


})();






