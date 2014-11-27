(function(){
/*
   * <%= names.classed %>
   * https://github.com/<%= userName %>/<%= appNameSlug %>
   *
   * Copyright (c) 2014 <%= userName %>
   * Licensed under the MIT license.
   */

  'use strict';

  var <%= names.classed %> = module.exports = (function () {
    var <%= names.slug %> = {};

    <% _.forEach(private, function (item){ %>
    /**
     * [<%=item%> description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function <%=item%> ( params, cb ){

    }<%})%>

    <% _.forEach(public, function (item){ %>
    /**
     * [<%=item%> description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    <%= names.slug %>.<%=item%> = function( params, callback ){

    };<%})%>

    return <%= names.slug %>;
  }());


})();






