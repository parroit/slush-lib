(function(){
  /*
   * <%= filters.names.classed %>
   * https://github.com/<%= userName %>/<%= appNameSlug %>
   *
   * Copyright (c) 2014 <%= userName %>
   * Licensed under the MIT license.
   */

  'use strict';

  var <%=filters.names.classed%> = module.exports = (function() {
    'use strict';

    var instance;

    function <%= filters.names.classed %>(args) {
      <% _.forEach(filters.private, function (item){ %>
      /**
       * [<%=item%> description]
       * @param  {[type]}   params   [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      function <%=item%> ( params, cb ){

      }<%})%>
      return {
        <% _.forEach(filters.public, function (item, index){ %>
        /**
         * [<%=item%> description]
         * @param  {[type]}   params   [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        <%=item%>: function (params, cb) {
          // method body
        }<%if(index < filters.public.length-1){%>,<%}%><%})%>
      };

    }
    if(!instance){
      return instance = <%= filters.names.classed %>();
    }

    return instance;

  }());


})();



