(function(){
  /*
   * <%= names.classed %>
   * https://github.com/<%= userName %>/<%= appNameSlug %>
   *
   * Copyright (c) 2014 <%= userName %>
   * Licensed under the MIT license.
   */

  'use strict';

  var <%= names.classed %> = module.exports function <%= names.classed %>( params ) {

    var _this = this;
    <% _.forEach(private, function (item){ %>
    _this.<%=item%> = function( params, cb ){

    };<%})%>
  }

  <% _.forEach(public, function (item){ %>

  /**
   * [<%=item%> description]
   * @param  {[type]}   params   [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  <%= names.classed %>.prototype.<%=item%> = function( params, callback ){

  };<%})%>

})();