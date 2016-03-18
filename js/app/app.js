(function () {
  'use strict';

  var app = angular.module('pvestats', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar']);

  app.controller('rankController', function($scope, $http, $state) {

    /* Retrieve all characters data */
    $http.get( app.api + "achievement_progress" )
      .success(function (data, status, header, config) {
      $scope.ranks = data;

      for (var i = 0; i < $scope.ranks.length; i++)
      {
        if ($scope.ranks[i].race == 1 || $scope.ranks[i].race == 3 || $scope.ranks[i].race == 4 || $scope.ranks[i].race == 7 || $scope.ranks[i].race == 11)
          $scope.ranks[i].faction = "alliance";
        else
          $scope.ranks[i].faction = "horde";
      }

    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in rankController!");
    });
    
    $scope.showPlayerStats = function(id) {
      $state.go('player', {id: id});
    };

  });

  app.controller('playerController', function($scope, $http) {

  });

}());
