/*
 * <%= appNameSlug %>
 * https://github.com/<%= userName %>/<%= appNameSlug %>
 *
 * Copyright (c) <%= year %> <%= authorName %>
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var <%= appNameJs %> = require('../lib/<%= appNameSlug %>.js');

describe('<%= appNameJs %>', function(){
    it('is defined', function(){
      <%= appNameJs %>.should.be.a('function');
    });

});
