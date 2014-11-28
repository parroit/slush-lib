(function(){
  'use strict';

  var parseArgs = require('minimist');
  var gulp      = require('gulp');
  var finder    = require('gulp-finder')(gulp);
  var storage   = require('gulp-storage')(gulp);

  var utility = new Utility;
  module.exports = utility;



  /**
   * [Utility description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  function Utility( options ){
    var _this = this;

    _this.gulpInst = gulp;
    _this.args = parseArgs(process.argv.slice(2));

    _this.gulpInst.Gulp.prototype.argv = _this.args;
    // _this.gulpInst.Gulp.prototype.storage = storage;
  }

  /**
   * [init description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  Utility.prototype.init = function( params ){

  };


})();
