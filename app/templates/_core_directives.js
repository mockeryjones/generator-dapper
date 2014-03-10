'use strict';

angular.module('<%= projectName%>').directive('ybheader', function ($rootScope, scruffyConfigService) {
  return {
    restrict: 'E',
    scope: { user_info: '@' },
    templateUrl: '/bower_components/<%= projectName%>/dist/html/directives/header.html',
    transclude: true,
    link: function (scope) {

      $rootScope.$watch('user_info', function () {
        scope.user_info = $rootScope.user_info;
      });

      if ($rootScope.user_info == null) {
        var current_user_info = scruffyConfigService.getCurrentUser()
        .then(function (data) {
          $rootScope.user_info = data;
          $rootScope.$broadcast('user_info', data);
          //console.log($rootScope.user_info);
        });
      } else {
        scope.user_info = $rootScope.user_info;
      }
    }
  };
});