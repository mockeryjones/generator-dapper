'use strict';

angular.module('<%= projectName%>')
  .directive('ybselect', function () {
  return {
    templateUrl: '/bower_components/<%= projectName%>/dist/html/directives/ybselect.html',
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      ybmodel: '=',
      collection: '=',
    }
  };
});