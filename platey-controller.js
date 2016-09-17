/**
 * A column in the platey table.
 * @typedef {Object} Column
 * @property {String} id The unique ID of the column.
 * @property {String} header The header text for the column.
 */

/**
 * Main platey application controller.
 */
angular.module("plateyController", []).controller(
  "plateyController",
  ["$scope", "$http",
   function($scope, $http) {
     $scope.plateLayout = null;
     $scope.columns = [];
     $scope.selectedColumn = null;
     $scope.wells = [];
     $scope.currentValue = "";

     // Load a plate layout
     $http.get("96-well-plate.json")
     .then(function(plateData) {
       $scope.plateLayout = plateData.data.wells;
     });

     /**
      * Internal guid generator - used for IDing columns in the table.
      * @returns {String} A guid string.
      */
     function generateGuid() {
       function s4() {
         return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
       }
       return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
     }

     /**
      * Sets the currently selected wells to currentValue.
      */
     $scope.setValueOfSelectedWells = function() {
       const selectedColumn = $scope.selectedColumn;

       if (selectedColumn !== null) {
         $scope
         .wells
         .filter(well => well.selected)
         .forEach(well => well[selectedColumn.id] = $scope.currentValue);
       }

       $scope.$broadcast("values-updated");
     };

     /**
      * Selects a column in the plate table.
      * @param {Column} column The column to select.
      */
     $scope.selectColumn = function(column) {
       $scope.selectedColumn = column;

       $scope.$broadcast("column-selected", column);
     };

     /**
      * Add a column to the data entry table.
      * @returns {Column} The new column.
      */
     $scope.addColumn = function() {
       const newColumn = {
         header: generateGuid(),
         id: generateGuid()
       };

       $scope.columns.push(newColumn);

       // Populate the wells with null values
       // for this new column
       $scope.wells.forEach(well => {
         well[newColumn.id] = null;
       });

       $scope.$broadcast("column-added", newColumn);

       return newColumn;
     };

     /**
      * Clear the plate of all data.
      */
     $scope.clearPlate = function() {
       const columnIds = $scope.columns.map(column => column.id);

       $scope.wells.forEach(well => {
         columnIds.forEach(id => {
           well[id] = null;
         });
       });

       $scope.$broadcast("plate-cleared");
     };

     /**
      * Select a well in the plate.
      * @param event The JQueryLite event that triggered the call.
      * @param {Well} wellToSelect The well to select.
      */
     $scope.selectWell = function($event, wellToSelect) {
       if (!$event.shiftKey) {
         $scope.wells.forEach(well => well.selected = false);
       }

       wellToSelect.selected = true;
     };

     /**
      * Exports the main table to a CSV file format and presents it as
      * a download prompt to the user.
      */
     $scope.exportTableToCSV = function() {
       const columnIds = $scope.columns.map(column => column.id);

       const data = $scope.wells.map(well => {
         const rowData = columnIds.map(columnId => well[columnId]);

         return [well.id].concat(rowData);
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
      * Returns true if no wells are selected.
      * @returns {boolean}
      */
     $scope.noWellsSelected = () => !$scope.wells.some(well => well.selected);

     /**
      * Returns true if no column is selected.
      * @returns {boolean}
      */
     $scope.noActiveColumnSelected = () => $scope.selectedColumn === null;

     /**
      * Clears the current selection.
      */
     $scope.clearSelection = function() {
       $scope.wells.forEach(well => well.selected = false);
     };

     /**
      * Selects all wells in the plate.
      */
     $scope.selectAll = function () {
       $scope.wells.forEach(well => well.selected = true);
     };

     // Extra Behaviors
     $scope.$on("column-added", $scope.selectColumn);

     /**
      * Handles keypresses that have be bubbled all the way
      * upto the body.
      */
     $scope.bodyKeypressHandler = function($event) {
       if ($event.key === "Escape") {
         $scope.clearSelection();
       } else if ($event.key === "a" && $event.ctrlKey) {
         $scope.selectAll();
       }
     };

     /**
      * Handles clicks that have bubbled all the way upto the body.
      */
     $scope.bodyClickEventHandler = function($event) {
     };
   }]);
