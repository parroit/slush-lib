/*
 * slush-lib
 * https://github.com/joelcoxokc/slush-lib
 *
 * Copyright (c) 2014 joelcoxokc
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var path = require('path');
chai.expect();
chai.should();

var lib = require(path.join('../','generators/index','lib.js'));



describe('Lib', function(){
    it('is defined', function(){
      lib 
        .should.be.a('Object');
    });
    
    
    it('Should have method read', function(){
      lib.read.should.be.a('function');
    });
    it('Should have method update', function(){
      lib.update.should.be.a('function');
    });
});
