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

    /* Retrieve all achievement_category data */
    $http.get( app.api + "achievement_category" )
      .success(function (data, status, header, config) {

      /* Initialize all categories */
      $scope.categories = data;

      /* Initialize parentCategories and collapseCategories */
      $scope.parentCategories = [];
      $scope.collapseCategory = [];

      for (var i = 0; i < $scope.categories.length; i++) {
        if ($scope.categories[i].ParentID == -1) {
          $scope.parentCategories.push($scope.categories[i]);
          $scope.collapseCategory.push(true);
        }
      }

      /* Initialize childCategories */
      $scope.childCategories = [];

      for (var i = 0; i < $scope.parentCategories.length; i++) {
        $scope.childCategories[i] = [];

        for (var j = 0; j < $scope.categories.length; j++) {
          if ($scope.categories[j].ParentID == $scope.parentCategories[i].ID)
            $scope.childCategories[i].push($scope.categories[j]);
        }

      }

      /* Manage Statistics (the last category with subcategories of childCategories) */
      $scope.childStatistics = [];
      $scope.collapseStatistics = [];

      // Get last category (Statistics)
      var statsIndex = $scope.childCategories.length-1;

      for (var i = 0; i < $scope.childCategories[statsIndex].length; i++) {
        $scope.childStatistics[i] = [];
        $scope.collapseStatistics[i] = true;

        for (var j = 0; j < $scope.categories.length; j++) {
          if ($scope.categories[j].ParentID == $scope.childCategories[statsIndex][i].ID)
            $scope.childStatistics[i].push($scope.categories[j]);
        }
      }
    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in playerController!");
    });

    /* Manage categories and view */
    $scope.currentCategory = 92;

    $scope.showCategory = function(categoryIndex, parentCategoryId) {
      $scope.collapseCategory[categoryIndex] = !$scope.collapseCategory[categoryIndex];

      if ($scope.collapseCategory[categoryIndex] == false)
        $scope.currentCategory = parentCategoryId;

      // if category is 'General' or 'Feast of Strength' re-change the collapse status
      if (parentCategoryId == 92 || parentCategoryId == 81)
        $scope.collapseCategory[categoryIndex] = !$scope.collapseCategory[categoryIndex];
    };

    $scope.collapseChildCategories = function(childCategoryId, Class, childCategoriesIndex) {
      // if the category is a subcategory of 'Statistics'
      if (Class == 'statistic')
      {
        if ($scope.collapseStatistics[childCategoriesIndex] == true)
          $scope.currentCategory = childCategoryId;

        $scope.collapseStatistics[childCategoriesIndex] = !$scope.collapseStatistics[childCategoriesIndex];

        // if category is 'Combat', 'Quests', 'Travel' or 'Social' re-change the collapse status
        if (childCategoryId == 141 || childCategoryId == 133 || childCategoryId == 134 || childCategoryId == 131)
          $scope.collapseStatistics[childCategoriesIndex] = !$scope.collapseStatistics[childCategoriesIndex];
      }
      else
        $scope.currentCategory = childCategoryId;
    };

    $scope.updateCurrentCategory = function(categoryId)
    {
      $scope.currentCategory = categoryId;
    };

  });

  app.controller('achController', function($scope, $http, $stateParams) {

    /* Retrieve all achievements data */
    $http.get( app.api + "achievement?category=" + $stateParams.achId )
      .success(function (data, status, header, config) {

      $scope.achievements = data;
      for (var i = 0; i < $scope.achievements.length; i++) {
        if ($scope.achievements[i].icon == "NULL")
          $scope.achievements[i].icon = "trade_engineering";
      }

    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in achController!");
    });

  });

}());
