(function () {
  'use strict';

  var app = angular.module('playerstats');

  app.controller('rankController', function($scope, $rootScope, $http, $state, $stateParams, $localStorage) {

    $scope.from = $stateParams.from == null ? 0 : $stateParams.from;
    $scope.name = $stateParams.name == null ? '' : $stateParams.name;
    $scope.guild = $stateParams.guild == null ? '' : $stateParams.guild;

    $scope.account = $localStorage.account == null ? "1" : $localStorage.account;

    $scope.getGuildId = function(val, reload) {
      $scope.guild = val;

      if (reload != null)
        $state.go('guild', {from: $scope.from, name: $scope.name, guild: $scope.guild});
    };

    $scope.guildId = $scope.guild;

    $scope.search = $scope.name;

    /* Retrieve guild data */
    $http.get( app.api + "guilds")
      .success(function (data, status, header, config) {
      $scope.Guilds = data;
      $scope.Guilds.unshift({guildid:"", name:"Guild..."});
    })
      .error(function (data, status, header, config) {
      console.log("[ERROR] $http.get request failed in players rankController!");
    });

    /*
     * Manage Current Tab
     */
    $scope.load_ranks = function(account) {
      $localStorage.account = account;

      /* Retrieve all achievement_progress data */
      $http.get( app.api + "character_achievement?from=" + $scope.from + "&name=" + $scope.name + "&guild=" + $scope.guild + "&per_account=" + account)
        .success(function (data, status, header, config) {
        $scope.ranks = data;

        for (var i = 0; i < $scope.ranks.length; i++)
        {
          if ($scope.ranks[i] != null) {
            // get faction
            if ($scope.ranks[i].race == 1 || $scope.ranks[i].race == 3 || $scope.ranks[i].race == 4 || $scope.ranks[i].race == 7 || $scope.ranks[i].race == 11)
              $scope.ranks[i].faction = "alliance";
            else
              $scope.ranks[i].faction = "horde";
          }
        }
      })
        .error(function (data, status, header, config) {
        console.log("[ERROR] $http.get request failed in players rankController!");
      });
    };
    $scope.load_ranks($scope.account);

    // OnClick (tr) go to player details
    $scope.showPlayerStats = function(id) {
      $state.go('player', {id: id});
    };

    /*
     * Manage Guild Tab
     */
    $scope.loadedGuildTab = false;

    $scope.guildTab = function() {

      if (!$scope.loadedGuildTab) {
        $scope.loadedGuildTab = true;
        $scope.fromGuild = 0;

        $scope.getGuildData(0);
      }

    };

    $scope.guild_lifetime = $localStorage.guild_lifetime == null ? "0" : $localStorage.guild_lifetime;

    $scope.getGuildData = function(start, searchGuild, if_lifetime) {
      $scope.fromGuild = start;

      if (searchGuild == null)
        searchGuild = "";

      if (if_lifetime == null)
        if_lifetime = $localStorage.guild_lifetime == null ? "0" : $localStorage.guild_lifetime;
      else
        $localStorage.guild_lifetime = if_lifetime;


      $http.get( app.api + "guild_points?from=" + start + "&name=" + searchGuild + "&if_lifetime=" + if_lifetime)
      .success(function (data, status, header, config) {
        $scope.guilds = data;

        for (var i = 0; i < $scope.guilds.length; i++)
          $scope.guilds[i].Points = parseFloat($scope.guilds[i].Points).toFixed(2);
      })
        .error(function (data, status, header, config) {
        console.log("[ERROR] $http.get request failed in guild rankController!");
      });

    };

    /*
     * Manage LifePoints Tab
     */
    $scope.loadedLifePointsTab = false;

    $scope.getLifePointsGuild = function(val) {
      $scope.gLifePoints = val;
    };

    $scope.lifePointsTab = function() {

      if (!$scope.loadedLifePointsTab) {
        $scope.loadedLifePointsTab = true;
        $scope.fromLifePoints = 0;

        $scope.getLifePointsData(0);
      }

    };

    $scope.getLifePointsData = function(start, searchPlayer, guild, account) {
      $scope.fromLifePoints = start;

      if (searchPlayer == null)
        searchPlayer = "";

      if (guild == null)
        guild = "";

      if (account == null)
        account = $localStorage.account == null ? "1" : $localStorage.account;
      else
        $localStorage.account = account;

      $scope.gLifePoints = guild;

      /* Retrieve all lifepoints data */
      $http.get( app.api + "character_achievement?from=" + $scope.fromLifePoints + "&name=" + searchPlayer + "&guild=" + $scope.gLifePoints + "&lifepoints=1&per_account=" + account)
        .success(function (data, status, header, config) {
        $scope.players = data;

        for (var i = 0; i < $scope.players.length; i++)
        {
          if ($scope.players[i] != null) {
            // get faction
            if ($scope.players[i].race == 1 || $scope.players[i].race == 3 || $scope.players[i].race == 4 || $scope.players[i].race == 7 || $scope.players[i].race == 11)
              $scope.players[i].faction = "alliance";
            else
              $scope.players[i].faction = "horde";
          }
        }

      })
        .error(function (data, status, header, config) {
        console.log("[ERROR] $http.get request failed in players rankController!");
      });

    };

  });

}());
