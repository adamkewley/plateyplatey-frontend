/**
 * Main application controller.
 */
angular.module("plateyController", []).controller(
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
      * Sets the currently selected wells to the entered value.
      */
     $scope.setValueOfSelectedWells = function() {
       if ($scope.currentColumnIdx !== -1) {
         $scope
         .wells
         .filter(well => well.selected)
         .forEach(well => well.columns[$scope.currentColumnIdx] = $scope.currentValue);
       }
     };

     /**
      * Selects a column in the plate table.
      */
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
      * Select a well in the plate.
      */
     $scope.selectWell = function($event, wellToSelect) {
       if (!$event.shiftKey) {
         $scope.wells.forEach(well => well.selected = false);
       }

       wellToSelect.selected = true;
     };

     /**
      * Exports the main table to a CSV file format and presents the
      * download to the user.
      */
     $scope.exportTableToCSV = function() {
       const data = $scope.wells.map(well => {
         return [well.id].concat(well.columns);
       });

       const csv = Papa.unparse(data);

       const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
       const urlToBlob = URL.createObjectURL(csvBlob);

       const downloadLink = document.createElement("a");
       downloadLink.href = urlToBlob;
       downloadLink.download = "platey-export.csv";
       downloadLink.visibility = "hidden";

       document.body.appendChild(downloadLink);
       downloadLink.click();
       document.body.removeChild(downloadLink);
     };

     /**
      * Returns true if something is selected
      */
     $scope.noWellsSelected = () => !$scope.wells.some(well => well.selected);

     /**
      * Returns true if no column is selected.
      */
     $scope.noActiveColumnSelected = () => $scope.currentColumnIdx === -1;

     /**
      * Clears the current selection.
      */
     $scope.clearSelection = function() {
       $scope.wells.forEach(well => well.selected = false);
     };

     /**
      * Selects all wells.
      */
     $scope.selectAll = function () {
       $scope.wells.forEach(well => well.selected = true);
     };



     // SETUP KEYBINDS:
     const keybinds = [
       { key: "Escape", command: "clear-selection" },
       { key: "CTRL+a", command: "select-all" },
       { key: "Down", command: "move-cell-selection-down" },
       { key: "SHIFT+Down", command: "expand-selection-down" },
       { key: "Left", command: "move-column-selection-left" },
       { key: "Right", command: "move-column-selection-right" },
       { key: "Delete", command: "clear-selection-values" },
       { key: "CTRL+Z", command: "undo" },
       { key: "CTRL+Y", command: "redo" },
       { key: "CTRL+V", command: "attempt-paste" },
     ];
   }]);