const plateyModule = angular.module("plateyModule", []);

/**
 * Create a range from the supplied number.
 */
plateyModule.filter("range", function() {
  return function(val, range) {
    range = parseInt(range);
    for (var i=0; i<range; i++)
      val.push(i);
    return val;
  };
});

/**
 * Main application controller.
 */
plateyModule.controller(
  "plateyController",
  ["$scope", "$http",
   function($scope, $http) {
     $scope.plateLayout = null;
     $scope.currentValue = "";

     $scope.numberOfColumns = 0;
     $scope.currentColumnIdx = -1;

     $scope.wells = [];

     // Load a plate layout
     $http.get("96-well-plate.json")
     .then(function(plateData) {
       $scope.plateLayout = plateData.data.wells;
     });

     /**
      * Sets the currently selected wells to the
      * entered value.
      */
     $scope.setSelectedToCurrentValue = function() {
       if ($scope.currentColumnIdx !== -1) {
         $scope
         .wells
         .filter(well => well.selected)
         .forEach(well => well.columns[$scope.currentColumnIdx] = $scope.currentValue);
       }
     };

     $scope.selectColumn = function(columnIdx) {
       $scope.currentColumnIdx = columnIdx;
     };

     /**
      * Add a column to the data entry table.
      */
     $scope.addColumn = function() {
       $scope.numberOfColumns++;

       // Select the new column
       $scope.selectColumn($scope.numberOfColumns - 1);

       // Fill in blanks into the cells of the new column
       $scope.wells.forEach(well => {
         well.columns[$scope.currentColumnIdx] = null;
       });
     };

     /**
      * Clear the plate of all data
      */
     $scope.clearPlate = function() {
       $scope.wells.forEach(well => {
         $scope.currentValue = "";
         $scope.numberOfColumns = 0;
         $scope.currentColumnIdx = -1;
         well.columns = [];
       });
     };

     /**
      * Returns true if something is selected
      */
     $scope.noWellsSelected = () => !$scope.wells.some(well => well.selected);

     $scope.noActiveColumnSelected = () => $scope.currentColumnIdx === -1;
   }]);

/**
 * The plate that appears in the UI.
 */
plateyModule.directive(
  "plateyPlate",
  [function() {
     function link(scope, element) {

       /**
        * Fires whenever the selection changes in the plate.
        */
       function onPlateSelectionChanged(selectionChangeDetails) {
         scope.$apply(() => {
           if (selectionChangeDetails.newItems.length > 0) {
             scope
             .wells
             .filter(well => selectionChangeDetails.newItems.indexOf(well.id) !== -1)
             .forEach(well => well.selected = true);
           }

           if (selectionChangeDetails.deSelectedItems.length > 0) {
             scope
             .wells
             .filter(well => selectionChangeDetails.deSelectedItems.indexOf(well.id) !== -1)
             .forEach(well => well.selected = false);
           }
         });
       }

       /**
        * Fires whenever a new layout configuration comes along.
        */
       function onLayoutChanged(element, newLayout) {
         if (newLayout !== undefined && newLayout !== null) {
           const plate = new Platey(newLayout, { gridWidth: 13, gridHeight: 9, element: element[0] });

           document.addEventListener("keypress", function(e) {
             if (e.key === "Escape")
               plate.clearSelection();
             else if (e.key === "a" && e.ctrlKey) {
               plate.selectWells(plate.wellIds);
               e.preventDefault();
             }
           });

           document.body.addEventListener("click", function(e) {
             if (e.target !== plate.htmlElement)
               plate.clearSelection();
           });

           // Whenever the plate's selection changes, update
           // the angular scope
           plate.onSelectionChanged.add(onPlateSelectionChanged);

           scope.wells =
             plate.wellIds.map(wellId => { return { id: wellId, columns: [], selected: false }});
         }
       }

       /**
        * When a new layout configuration comes along, fire
        * onLayoutChanged.
        */
       scope.$watch(
         (scope) => scope.plateLayout,
         (newLayout) => onLayoutChanged(element, newLayout));
     }

     return { link: link };
   }]);