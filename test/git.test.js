/*
 * slush-lib
 * https://github.com/joelcoxokc/slush-lib
 *
 * Copyright (c) 2014 joelcoxokc
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var git = require('../lib/git');


describe('Git', function(){
    it('is defined', function(){
      git 
        .should.be.a('Object');
    });
        
    it('Should have method read', function(){
      git.read.should.be.a('function');
    });

    it('Should have method update', function(){
      git.update.should.be.a('function');
    });
});
