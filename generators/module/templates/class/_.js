(function(){
  /*
   * <%= filters.names.classed %>
   * https://github.com/<%= userName %>/<%= appNameSlug %>
   *
   * Copyright (c) 2014 <%= userName %>
   * Licensed under the MIT license.
   */

  'use strict';

  var <%= filters.names.classed %> = module.exports = function <%= filters.names.classed %>( params ) {

    var _this = this;
    <% _.forEach(filters.private, function (item){ %>
    _this.<%=item%> = function( params, cb ){

    };<%})%>
  }

  <% _.forEach(filters.public, function (item){ %>

  /**
   * [<%=item%> description]
   * @param  {[type]}   params   [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  <%= filters.names.classed %>.prototype.<%=item%> = function( params, callback ){

  };<%})%>

})();