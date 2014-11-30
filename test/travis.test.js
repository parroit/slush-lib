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

var travis = require(path.join('../','./lib','travis.js'));



describe('Travis', function(){
    it('is defined', function(){
      travis 
        .should.be.a('Object');
    });
    
    
    it('Should have method read', function(){
      travis.read.should.be.a('function');
    });
    it('Should have method update', function(){
      travis.update.should.be.a('function');
    });
});
