(function () {
  'use strict';

  var app = angular.module('pvestats', ['ui.router', 'ui.bootstrap', 'chieffancypants.loadingBar', 'ngAnimate']);

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

    // OnClick (tr) go to player details
    $scope.showPlayerStats = function(id) {
      $state.go('player', {id: id});
    };

  });

  app.controller('playerController', function($scope, $http, $stateParams) {

    /* Retrieve all characters achievement_progress data */
    $http.get( app.api + "achievement_category" )
      .success(function (data, status, header, config) {
      $scope.categories = data;

      $scope.parentCategories = [];
      $scope.collapseCategory = [];

      for (var i = 0; i < $scope.categories.length; i++) {
        if ($scope.categories[i].ParentID == -1) {
          $scope.parentCategories.push($scope.categories[i]);
          $scope.collapseCategory.push(true);
        }
      }

      $scope.childCategories = [];

      for (var i = 0; i < $scope.parentCategories.length; i++) {
        $scope.childCategories[i] = [];

        for (var j = 0; j < $scope.categories.length; j++) {
          if ($scope.categories[j].ParentID == $scope.parentCategories[i].ID)
            $scope.childCategories[i].push($scope.categories[j]);
        }

      }

      $scope.childStatistics = [];
      $scope.collapseStatistics = [];

      var statsIndex = $scope.childCategories.length-1;
      for (var i = 0; i < $scope.childCategories[statsIndex].length; i++) {
        $scope.childStatistics[i] = [];
        $scope.collapseStatistics[i] = true;

        for (var j = 0; j < $scope.categories.length; j++) {
          if ($scope.categories[j].ParentID == $scope.childCategories[statsIndex][i].ID)
            $scope.childStatistics[i].push($scope.categories[j]);
        }
      }

      console.log($scope.childStatistics);

    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in playerController!");
    });

  });

}());
