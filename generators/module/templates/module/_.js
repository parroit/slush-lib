(function(){
/*
   * <%= filters.names.classed %>
   * https://github.com/<%= userName %>/<%= appNameSlug %>
   *
   * Copyright (c) 2014 <%= userName %>
   * Licensed under the MIT license.
   */

  'use strict';

  var <%= filters.names.classed %> = module.exports = (function () {
    var <%= filters.names.slug %> = {};

    <% _.forEach(filters.private, function (item){ %>
    /**
     * [<%=item%> description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function <%=item%> ( params, cb ){

    }<%})%>

    <% _.forEach(filters.public, function (item){ %>
    /**
     * [<%=item%> description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    <%= filters.names.slug %>.<%=item%> = function( params, callback ){

    };<%})%>

    return <%= filters.names.slug %>;
  }());


})();






