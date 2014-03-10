var scruffyAngular = angular.module('scruffyAngular', []);

angular.module('<%=projectName%>', ['ngRoute', 'scruffyAngular'])
  .config(function ($routeProvider, $locationProvider) {

  	$locationProvider.html5Mode(true);
    
    $routeProvider.when('/ui/<%=projectName%>', {
        templateUrl: '/bower_components/<%=projectName%>/dist/html/main.html',
    }).when('/ui/<%=projectName%>/', {
        templateUrl: '/bower_components/<%=projectName%>/dist/html/main.html',
    });

});