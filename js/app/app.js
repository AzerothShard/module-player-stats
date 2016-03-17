(function () {
  'use strict';

  var app = angular.module('pvestats', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar']);

  app.controller('rankController', function($scope, $http) {

    /* Retrieve all characters data */
    $http.get( app.api + "achievement_progress" )
      .success(function (data, status, header, config) {
      $scope.ranks = data;
    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in rankController!");
    });

  });

}());
