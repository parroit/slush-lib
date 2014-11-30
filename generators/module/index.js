(function(){
/*
   * Module
   * https://github.com/joelcoxokc/slush-lib
   *
   * Copyright (c) 2014 joelcoxokc
   * Licensed under the MIT license.
   */

  'use strict';

   var questions = require('./prompts'),
      inquirer  = require('inquirer'),
      path      = require('path'),
      gulp      = require('gulp'),
      _s        = require('underscore.string'),
      _         = require('lodash'),
      $         = require('gulp-load-plugins')({lazy:false});


  var Generator = module.exports = function ( Utility, git, travisci) {
    var Generator = {};


    /**
     * [index lib:module Sub-Generator]
     * @param  {Function} done [gulp done function]
     * @return {Stream}        [gulp stream]
     */
    Generator.index = function(done ){
      var _this = this,

          root = path.join(__dirname, 'templates'),
          templates = _this.finder(root);

          this.storage.create('store', 'lib-config.json');
          var config = _this.storage.get();

          config.filters = {}
          config.filters.generator = this.seq[0];

      if(_this.args[0]){

        _this.argv.name = _this.args[0];

      }

      _.forEach(_this.argv, function (item, key){

          if (key === '_') return;

          if( _.isString( item ) ){

              var array = config.filters[key] = item.split(',');
              if(array.length > 1) return array;

          }

          config.filters[key] = item;

      });

      if(config.filters.blank){
        config.filters.private = [];
        _this.argv.private = [];
        config.filters.public = [];
        _this.argv.public = [];
      }

      var prompts = _.filter(questions(), function (item, key){
          if(! _this.argv[ key ] ) {
            return item;
          }
      });


      inquirer.prompt(prompts, function (answers){
        _.assign(config.filters, answers)
        if(answers.private) config.filters.private = answers.private.split(',');
        if(answers.public) config.filters.public = answers.public.split(',');
        next();
      })

      /**
       * [next Next function inline after the prompts]
       */
      function next(){
        config.filters.names = {
          classed: _s.classify(config.filters.name),
          slug:    _s.slugify(config.filters.name)
        }
        config.filters.testPath = './test'
        generate_module();
        generate_test();
      }

      /**
       * [generate_module Generate node-module template]
       * @return {Stream} [return gulp-stream]
       */
      function generate_module(){
        console.log(config);
        gulp.src( templates[config.filters.pattern].all() )
          .pipe( $.template( config ) )
          .pipe( $.rename(function (file){
              if (file.basename.indexOf('_') == 0) {
                file.basename = file.basename.replace('_', config.filters.name);
              }
          }) )
          .pipe( $.conflict( config.filters.path ) )
          .pipe( gulp.dest( config.filters.path ) )

      }

      /**
       * [generate_test Generate node-module tests]
       * @return {Stream} [return gulp stream]
       */
      function generate_test(){

        gulp.src( templates.test.all() )
          .pipe( $.template( config ) )
          .pipe( $.rename(function (file){
              if (file.basename.indexOf('_') == 0) {
                file.basename = file.basename.replace('_', config.filters.name);
              }
          }) )
          .pipe( $.conflict( config.filters.testPath ) )
          .pipe( gulp.dest( config.filters.testPath ) )
          .on('end', function(){
            process.exit();
          })
      }

   }

    return Generator;
  };


})();






