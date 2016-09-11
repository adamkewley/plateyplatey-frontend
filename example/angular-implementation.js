const plateyModule = angular.module("plateyModule", []);

plateyModule.controller(
  "plateyController",
  ["$scope", "$http",
   function($scope, $http) {
     // Load a plate layout
     $http.get("96-well-plate.json")
     .then(function(plateData) {
       $scope.plateLayout = plateData.data.wells;
     });

     $scope.wellIds = [];
     $scope.selectedWellIds = [];
   }]);

plateyModule.directive("plateyPlate", function() {
  function link(scope, element) {
    function onPlateSelectionChanged(selectionChangeDetails) {
      scope.$apply(() => {
        scope.selectedWellIds = scope.selectedWellIds.concat(selectionChangeDetails.newItems);
      });
    }

    function onLayoutChanged(element, newLayout) {
      if (newLayout !== undefined) {
        const plate = new Platey(newLayout, { gridWidth: 13, gridHeight: 9, element: element[0] });

        document.addEventListener("keypress", function(e) {
          if (e.key === "Escape")
            plate.clearSelection();
        });

        document.body.onclick = function(e) {
          if (e.target != plate.htmlElement)
            plate.clearSelection();
        };

        // Whenever the plate's selection changes, update
        // the angular scope
        plate.onSelectionChanged.add(onPlateSelectionChanged);

        scope.wellIds = plate.wellIds;
      }
    }

    scope.$watch(
      (scope) => scope.plateLayout,
      (newLayout) => onLayoutChanged(element, newLayout));
  }

  return { link: link };
});