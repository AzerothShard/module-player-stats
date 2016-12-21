(function () {
  'use strict';

  var app = angular.module('playerstats');

  app.controller('statsController', function($scope, $rootScope, $http, $stateParams, $state) {

    /* Check if the category passed in statsId belong to the statistics subcategory */
    var statsCategoryId = [130,141,128,122,133,14807,132,134,131,21,123,135,140,152,178,14821,124,136,145,153,173,14822,125,137,147,154,14823,126,191,14963,127,15021,15062];

    var enablestats = false;
    for (var i = 0; i < statsCategoryId.length; i++) {
      if (statsCategoryId[i] == $stateParams.statsId) {
        enablestats = true;
        break;
      }
    }

    if (!enablestats) {
      $state.go('player.ach', {catId: $stateParams.statsId});
      return;
    }

    /* Retrieve category data */
    $http.get( app.api + "achievement_category?id=" + $stateParams.statsId )
      .success(function (data, status, header, config) {
      $scope.category = data[0];
    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in statsController!");
    });

    /* Retrieve character_achievement_progress data */
    $http.get( app.api + "achievement_progress?guid=" + $stateParams.id + "&category=" + $stateParams.statsId )
      .success(function (data, status, header, config) {

      $scope.character_achievements = data;

      /* Retrieve all achievements data */
      $http.get( app.api + "achievement?category=" + $stateParams.statsId )
        .success(function (data, status, header, config) {

        $scope.achievements = data;
        for (var i = 0; i < $scope.achievements.length; i++) {

          $scope.achievements[i].counter = "-";
          for (var j = 0; j < $scope.character_achievements.length; j++) {

            if ($scope.achievements[i].ID == $scope.character_achievements[j].ID && $scope.character_achievements[j].counter > 0) {
              $scope.achievements[i].class = "noopacity";
              $scope.achievements[i].counter = $scope.character_achievements[j].counter;
              $scope.achievements[i].Quantity = $scope.character_achievements[j].Quantity;

              if ($scope.achievements[i].Quantity > 1 && $scope.achievements[i].counter != "-") {
                $scope.achievements[i].counter = parseInt($scope.achievements[i].counter);
                $scope.achievements[i].Quantity = parseInt($scope.achievements[i].Quantity);
              }

              if ($stateParams.statsId == 140 && $scope.achievements[i].ID != 329 && $scope.achievements[i].ID != 330) {

                // money conversion into gold, silver, copper
                var money = $scope.achievements[i].counter;
                var gold = '<img src="img/money/gold.png">';
                var silver = '<img src="img/money/silver.png">';
                var copper = '<img src="img/money/copper.png">';

                if (money > 9999)
                  money = money.substr(0, money.length-4) + ' ' + gold + ' ' + money.substr(-4, 2) + ' ' + silver + ' ' + money.substr(-2) + ' ' + copper;
                else if (money > 99)
                  money = '00 ' + gold + ' ' + money.substr(-4, 2) + ' ' + silver + ' ' + money.substr(-2) + ' ' +copper;
                else
                  money = '00 ' + gold + ' 00 ' + silver + ' ' + money.substr(-2) + copper;

                $scope.achievements[i].counter = money;
              }

              break;
            }
            else
              $scope.achievements[i].class = "";
          }
        }

      })
        .error(function (data, status, header, config) {
        console.log("[ERROR] $http.get request failed in statsController!");
      });

    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in statsController!");
    });

  });

}());
