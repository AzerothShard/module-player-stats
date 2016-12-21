(function () {
  'use strict';

  var app = angular.module('playerstats');

  app.controller('SidebarController', function($scope) {

    $scope.arrow = '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
    $scope.state = false;

    $scope.toggleState = function() {
      $scope.state = !$scope.state;

      if (!$scope.state)
        $scope.arrow = '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
      else
        $scope.arrow = '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>';
    };
  });

  app.directive('sidebarDirective', function() {
    return {
      link : function(scope, element, attr) {
        scope.$watch(attr.sidebarDirective, function(newVal) {
          if(newVal) {
            element.addClass('show');
            return;
          }
          element.removeClass('show');
        });
      }
    };
  });

}());
