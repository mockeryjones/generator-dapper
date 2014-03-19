var scruffyAngular = angular.module('scruffyAngular', []);

angular.module('<%=projectName%>', ['ngRoute', 'scruffyAngular'])
  .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
  	$locationProvider.html5Mode(true);


  	//define your states here;

});