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

var module = require(path.join('../','./lib','module.js'));



describe('Module', function(){
    it('is defined', function(){
      module 
        .should.be.a('Object');
    });
    
    
    it('Should have method read', function(){
      module.read.should.be.a('function');
    });
    it('Should have method update', function(){
      module.update.should.be.a('function');
    });
});
