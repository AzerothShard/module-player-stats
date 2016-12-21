(function() {
  'use strict';

  var app = angular.module('playerstats');

  app.controller('achController', function($scope, $rootScope, $http, $stateParams, $state) {

      /* Check if the category passed in catId doesn't belong to the statistics subcategory */
      var statsCategoryId = [130, 141, 128, 122, 133, 14807, 132, 134, 131, 21, 123, 135, 140, 152, 178, 14821, 124, 136, 145, 153, 173, 14822, 125, 137, 147, 154, 14823, 126, 191, 14963, 127, 15021, 15062];

      var enablestats = true;
      for (var i = 0; i < statsCategoryId.length; i++) {
          if (statsCategoryId[i] == $stateParams.catId) {
              enablestats = false;
              break;
          }
      }

      if (!enablestats) {
          $state.go('player.stats', {
              statsId: $stateParams.catId
          });
          return;
      }

      /* Retrieve category data */
      $http.get(app.api + "achievement_category?id=" + $stateParams.catId)
          .success(function(data, status, header, config) {
              $scope.category = data[0];
          })
          .error(function(data, status, header, config) {
              console.log("[ERROR] $http.get request failed in achController!");
          });

      /* Retrieve character_achievements data */
      $http.get(app.api + "character_achievement/" + $stateParams.id + "?category=" + $stateParams.catId)
          .success(function(data, status, header, config) {

              $scope.character_achievements = data;

              /* Retrieve all achievements data */
              $http.get(app.api + "achievement?category=" + $stateParams.catId + "&faction=" + $rootScope.faction)
                  .success(function(data, status, header, config) {

                      $scope.achievements = data;
                      for (var i = 0; i < $scope.achievements.length; i++) {

                          if ($scope.achievements[i].icon == "NULL")
                              $scope.achievements[i].icon = "trade_engineering";

                          for (var j = 0; j < $scope.character_achievements.length; j++) {

                              if ($scope.achievements[i].ID == $scope.character_achievements[j].ID) {
                                  $scope.achievements[i].class = "noopacity";
                                  break;
                              } else
                                  $scope.achievements[i].class = "";
                          }
                      }

                  })
                .error(function(data, status, header, config) {
                    console.log("[ERROR] $http.get request failed in achController!");
                });

          })
        .error(function(data, status, header, config) {
            console.log("[ERROR] $http.get request failed in achController!");
        });

    });

}());
