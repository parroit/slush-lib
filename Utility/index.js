'use strict';

var parseArgs = require('minimist');
var gulp = require('gulp');
var Promise = require('bluebird');

/**
 * [Utility Class for General Purpose Utilities]
 */
function Utility() {
    var _this = this;
    _this.args = parseArgs(process.argv.slice(2));
    gulp.Gulp.prototype.argv = _this.args;
}


module.exports = new Utility();



/**
 * [promisifyNoError description]
 * @param  {Function} fn      [description]
 * @param  {function}   thisCtx [description]
 * @return {function}           [function that returns a promise]
 */
Utility.prototype.promisifyNoError = function(fn, thisCtx) {
    return function( /*args*/ ) {
        var args = [].slice.call(arguments, 0);

        return new Promise(function(resolve) {
            args.push(resolve);
            fn.apply(thisCtx, args);
        });
    };
};

/**
 * [normalize description]
 * @param  {String} name [String to be normalized]
 * @return {String}      [Normalized String]
 */
Utility.prototype.normalize = function(name) {

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
};

/**
 * getUserHome Get the user's Home Directory, on the given platforms
 * @return {String}     Home Dir
 */
Utility.prototype.getUserHome = function() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
};
