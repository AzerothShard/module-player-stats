(function () {
  'use strict';

  var app = angular.module('playerstats');

  app.controller('playerController', function($scope, $rootScope, $http, $stateParams, $state) {

    /* Retrieve character data */
    $http.get( app.api + "characters/" + $stateParams.id )
      .success(function (data, status, header, config) {
      $scope.character = data[0];

      // get faction
      if ($scope.character.race == 1 || $scope.character.race == 3 || $scope.character.race == 4 || $scope.character.race == 7 || $scope.character.race == 11)
        $scope.character.faction = "alliance";
      else
        $scope.character.faction = "horde";

      $rootScope.faction = $scope.character.faction;
    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in playerController!");
    });

    /* Retrieve azth Points and infos */
    $http.get( app.api + "character_achievement?guid=" + $stateParams.id )
      .success(function (data, status, header, config) {
      $rootScope.charPoints = data[0].Points;
      $rootScope.infos = data[0].infos;
    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in playerController!");
    });

    /* Retrieve all achievement_category data */
    $http.get( app.api + "achievement_category" )
      .success(function (data, status, header, config) {

      /* Initialize all categories */
      $scope.categories = data;
      $scope.categoriesArray = [];
      $scope.categoriesArray[0] = "Info Formula";

      for (var i = 0; i < $scope.categories.length; i++)
        $scope.categoriesArray[$scope.categories[i].ID] = $scope.categories[i].Name;

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

    if (!$scope.infos_state)
      $state.go('player.ach', {catId: $scope.currentCategory});

    $scope.infos_state = false;
    $scope.getInfos = function() {
      $scope.infos_state = true;
      $state.go("player.info");
      $scope.currentCategory = 0;
    };

    $scope.showCategory = function(categoryIndex, parentCategoryId) {
      for (var i = 0; i < $scope.collapseCategory.length; i++)
        $scope.collapseCategory[i] = true;

      $scope.collapseCategory[categoryIndex] = !$scope.collapseCategory[categoryIndex];

      if ($scope.collapseCategory[categoryIndex] == false) {
        if (parentCategoryId != 1)
          $scope.updateCurrentCategory(parentCategoryId);
      }

      // if category is 'General' or 'Feast of Strength' re-change the collapse status
      if (parentCategoryId == 92 || parentCategoryId == 81)
        $scope.collapseCategory[categoryIndex] = !$scope.collapseCategory[categoryIndex];
    };

    $scope.collapseChildCategories = function(childCategoryId, Class, childCategoriesIndex) {
      // if the category is a subcategory of 'Statistics'
      if (Class == 'statistic')
      {
        // Get last category (Statistics)
        var statsIndex = $scope.childCategories.length-1;

        for (var i = 0; i < $scope.childCategories[statsIndex].length; i++)
          $scope.collapseStatistics[i] = true;

        if ($scope.collapseStatistics[childCategoriesIndex] == true)
          $scope.updateCurrentCategory(childCategoryId);

        $scope.collapseStatistics[childCategoriesIndex] = !$scope.collapseStatistics[childCategoriesIndex];

        // if category is 'Combat', 'Quests', 'Travel' or 'Social' re-change the collapse status
        if (childCategoryId == 141 || childCategoryId == 133 || childCategoryId == 134 || childCategoryId == 131)
          $scope.collapseStatistics[childCategoriesIndex] = !$scope.collapseStatistics[childCategoriesIndex];
      }
      else
        $scope.updateCurrentCategory(childCategoryId);
    };

    $scope.updateCurrentCategory = function(categoryId)
    {
      angular.element(document.getElementById($scope.currentCategory)).removeClass("selected");
      $scope.currentCategory = categoryId;
      angular.element(document.getElementById($scope.currentCategory)).addClass("selected");
    };

    $scope.collapseAllCategory = function() {
      console.log("collapsed");
    };

  });

}());
