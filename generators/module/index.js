(function(){
  'use strict'

  var questions = require('./prompts'),
      inquirer  = require('inquirer'),
      path      = require('path'),
      gulp      = require('gulp'),
      _s        = require('underscore.string'),
      _         = require('lodash'),
      $         = require('gulp-load-plugins')({lazy:false});


  module.exports = function( done ){
    var _this = this,
        root = path.join(__dirname, 'templates'),
        templates = _this.finder(root),
        filters = {}


    if(_this.args[0]){

      _this.argv.name = _this.args[0];

    }

    _.forEach(_this.argv, function (item, key){

        if (key === '_') return;

        if( _.isString( item ) ){

            var array = filters[key] = item.split(',');
            if(array.length > 1) return array;

        }

        filters[key] = item;

    });

    var prompts = _.filter(questions(), function (item, key){
        if(! _this.argv[ key ] ) {
          return item;
        }
    });


    inquirer.prompt(prompts, function (answers){
      _.assign(filters, answers)
      if(answers.private) filters.private = answers.private.split(',');
      if(answers.public) filters.public = answers.public.split(',');
      next();
    })

    function next(){
      filters.names = {
        classed: _s.classify(filters.name),
        slug:    _s.slugify(filters.name)
      }
      generate();
    }

    function generate(){

      gulp.src( templates[filters.pattern].all() )
        .pipe( $.template( filters ) )
        .pipe( $.rename(function (file){
            if (file.basename.indexOf('_') == 0) {
              file.basename = file.basename.replace('_', filters.name);
            }
        }) )
        .pipe( $.conflict( filters.path ) )
        .pipe( gulp.dest( filters.path ) )
        .on('end', function(){
          process.exit()
          done();
        })
    }
  }

})();