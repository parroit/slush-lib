(function(){
  /*
   * <%= names.classed %>
   * https://github.com/<%= userName %>/<%= appNameSlug %>
   *
   * Copyright (c) 2014 <%= userName %>
   * Licensed under the MIT license.
   */

  'use strict';

  var <%=names.classed%> = module.exports = (function() {
    'use strict';

    function <%=names.classed%>(args) {
      // enforces new
      if (!(this instanceof <%=names.classed%>)) {
        return new <%=names.classed%>(args);
      }
      <% _.forEach(private, function (item){ %>

      /**
       * [<%=item%> description]
       * @param  {[type]}   params   [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      function <%=item%> ( params, cb ){

      }<%})%>
    }
    <% _.forEach(public, function (item){ %>

    /**
     * [<%=item%> description]
     * @param  {[type]}   params   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    <%=names.classed%>.prototype.<%=item%> = function(params, cb) {
      // method body
    };<%})%>

    return <%=names.classed%>;

  }());


})();
