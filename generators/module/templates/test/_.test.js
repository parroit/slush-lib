/*
 * <%= appNameSlug %>
 * https://github.com/<%= userName %>/<%= appNameSlug %>
 *
 * Copyright (c) <%= year %> <%= authorName %>
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
var path = require('path');
chai.expect();
chai.should();

<%if(filters.pattern !== 'class'){%>var <%=filters.names.slug%> = require(path.join('../','<%= filters.path %>','<%= filters.names.slug %>.js'));<%}%>
<%if(filters.pattern === 'class'){%>var <%=filters.names.classed%> = require(path.join('../','<%= filters.path %>','<%= filters.names.slug %>.js'));<%}%>
<%if(filters.pattern === 'class'){%>var <%=filters.names.slug%> = new <%=filters.names.classed%><%}%>

describe('<%= filters.names.classed %>', function(){
    it('is defined', function(){
      <%if(filters.pattern === 'class'){%> <%= filters.names.classed %> <%}else {%><%= filters.names.slug %> <%}%>
        .should.be.a('<%if(filters.pattern !== "class"){%>Object<%}else{%>function<%}%>');
    });
    <%if(filters.pattern === 'class'){%>
    <% _.forEach(filters.private, function (method){%>
    it('Should have method <%=method%>', function(){
      <%=filters.names.slug%>.<%=method%>.should.be.a('function');
    });<%})%><%}%>
    <% _.forEach(filters.public, function (method){%>
    it('Should have method <%=method%>', function(){
      <%=filters.names.slug%>.<%=method%>.should.be.a('function');
    });<%})%>
});
