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
     $scope.clickedWell = null;

     const SELECTION_CHANGED = "selection-changed";
     const COLUMN_ADDED = "column-added";

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
      * Returns an array of the currently selected wells.
      * @returns {Array.<Well>}
      */
     function getSelectedWells() {
       return $scope.wells.filter(well => well.selected);
     }

     /**
      * Returns an array of values in the current selection.
      * @returns {Array.<String>}
      */
     function getSelectionValues() {
       if ($scope.selectedColumn === null) return [];
       else {
         const columnId = $scope.selectedColumn.id;

         const values =
           getSelectedWells().map(selectedWell => selectedWell[columnId]);

         return values;
       }
     }

     /**
      * Determines what should be shown as the current value based on
      * what is selected.
      * @returns {String}
      */
     function determineCurrentValueFromSelection() {
       const selectionValues = getSelectionValues();

       if (selectionValues.length === 0) {
         return "";
       } else {
         const firstValue = selectionValues[0];

         if (firstValue === null) return "";

         const allWellsHaveSameValue =
            selectionValues.every(selectedWell => selectedWell === firstValue);

         if (allWellsHaveSameValue) return firstValue;
         else return "";
       }
     }

     /**
      * Sets the currently selected wells to currentValue.
      */
     $scope.setValueOfSelectedWells = function() {
       const selectedColumn = $scope.selectedColumn;

       if (selectedColumn !== null) {
         const selectedColumnId = selectedColumn.id;

         getSelectedWells().forEach(selectedWell => {
           selectedWell[selectedColumnId] = $scope.currentValue;
         });
       }
     };

     /**
      * Selects a column in the plate table.
      * @param {Column} column The column to select.
      */
     $scope.selectColumn = function(column) {
       $scope.selectedColumn = column;

       $scope.$broadcast(SELECTION_CHANGED);
     };

     /**
      * Add a column to the data entry table.
      * @returns {Column} The new column.
      */
     $scope.addColumn = function() {
       const newColumn = {
         header: "Column " + ($scope.columns.length + 1),
         id: generateGuid()
       };

       $scope.columns.push(newColumn);

       // Populate the wells with null values
       // for this new column
       $scope.wells.forEach(well => {
         well[newColumn.id] = null;
       });

       $scope.$broadcast(COLUMN_ADDED, newColumn);

       return newColumn;
     };

     /**
      * Remove a column from the table.
      * @param {Column} column The column to remove.
      */
     $scope.removeColumn = function(column) {
       const columnIdx = $scope.columns.indexOf(column);
       const columnId = column.id;

       // Shouldn't happen, but for sanity's sake...
       if (columnIdx === -1) return;

       if ($scope.selectedColumn === column)
         $scope.selectedColumn = null;

       $scope.columns.splice(columnIdx, 1);

       $scope.wells.forEach(well => {
         delete well[columnId];
       });
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
     };

     /**
      * Create an entirely new plate, whiping the data and
      * columns from the current plate.
      */
     $scope.newPlate = function() {
       $scope.columns = [];
       $scope.selectedColumn = null;
       $scope.currentValue = "";
       $scope.clickedWell = null;
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

       $scope.$broadcast(SELECTION_CHANGED);
     };

     /**
      * Select wells in the plate.
      * @param {Array.<Well>} wells The wells to select.
      */
     $scope.selectWells = function(wells) {
       wells.forEach(well => well.selected = true);
       $scope.$broadcast(SELECTION_CHANGED);
     };

     $scope.deSelectWells = function(wells) {
       wells.forEach(well => well.selected = false);
       $scope.$broadcast(SELECTION_CHANGED);
     };

     /**
      * Click a well in the plate. A clicked well is a kind of a
      * "higher ranked" selected well. In effect, all arrow-based
      * selection logic goes relative to the clicked well.
      */
     $scope.clickWell = function($event, wellToClick) {
       $scope.clickedWell = wellToClick;
       $scope.selectWell($event, wellToClick);
     };

     /**
      * Exports the main table to a CSV file format and presents it as
      * a download prompt to the user.
      */
     $scope.exportTableToCSV = function() {
       const columnIds = $scope.columns.map(column => column.id);

       const headers =
         ["Well ID"].concat($scope.columns.map(column => column.header));

       const data = $scope.wells.map(well => {
         const rowData = columnIds.map(columnId => well[columnId]);

         return [well.id].concat(rowData);
       });

       const table = [headers].concat(data);

       const csv = Papa.unparse(table);

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
      * Returns true if no cells are selected.
      * @returns {boolean}
      */
     $scope.noCellsSelected = () => {
       return $scope.selectedColumn === null ||
              !$scope.wells.some(well => well.selected);
     };

     /**
      * Clears the current selection.
      */
     $scope.clearSelection = function() {
       $scope.wells.forEach(well => well.selected = false);
       $scope.currentValue = "";
     };

     /**
      * Selects all wells in the plate.
      */
     $scope.selectAll = function() {
       $scope.wells.forEach(well => well.selected = true);
       $scope.currentValue = determineCurrentValueFromSelection();
     };

     /**
      * Moves the column selection (if any) left.
      */
     $scope.moveColumnSelectionLeft = () => {
       const selectedColumnIdx = $scope.columns.indexOf($scope.selectedColumn);

       // -1 is an indexOf sanity check.
       if (selectedColumnIdx !== 0 && selectedColumnIdx !== -1) {
         const newIdx = selectedColumnIdx - 1;
         const columnToSelect = $scope.columns[newIdx];

         $scope.selectColumn(columnToSelect);
       }
     };

     /**
      * Moves the column selection (if any) right.
      */
     $scope.moveColumnSelectionRight = () => {
       const selectedColumnIdx = $scope.columns.indexOf($scope.selectedColumn);
       const idxOfLastColumn = $scope.columns.length - 1;

       if (selectedColumnIdx !== idxOfLastColumn && selectedColumnIdx !== -1) {
         const newIdx = selectedColumnIdx + 1;
         const columnToSelect = $scope.columns[newIdx];

         $scope.selectColumn(columnToSelect);
       }
     };

     /**
      * Moves the well selection down relative to the last
      * user-clicked well. Does nothing if the user hasn't
      * specifically clicked a well to move from.
      */
     $scope.moveWellSelectionDown = ($event) => {
       if ($scope.clickedWell !== null) {
         const clickedWellIdx = $scope.wells.indexOf($scope.clickedWell);
         const lastWellIdx = $scope.wells.length - 1;

         if (clickedWellIdx !== -1 && clickedWellIdx !== lastWellIdx) {
           // Move, don't grow.
           $scope.clearSelection();
           const newIdx = clickedWellIdx + 1;
           const newWell = $scope.wells[newIdx];

           $scope.clickWell($event, newWell);
         }
       }
     };

     /**
      * Grows a well selection down relative to the last
      * user-clicked well. Does nothing if the user hasn't
      * specifically clicked a well to move from.
      */
     $scope.growWellSelectionDown = ($event) => {
       if ($scope.clickedWell !== null) {
         const clickedWellIdx = $scope.wells.indexOf($scope.clickedWell);
         const lastWellIdx = $scope.wells.length - 1;

         if (clickedWellIdx !== -1 && clickedWellIdx !== lastWellIdx) {
           const newIdx = clickedWellIdx + 1;
           const newWell = $scope.wells[newIdx];

           $scope.clickWell($event, newWell);
         }
       }
     };

     /**
      * Moves the well selection up relative to the last user-clicked
      * well. Does nothing if the user hasn't specifically clicked a
      * well to move relative to.
      */
     $scope.moveWellSelectionUp = ($event) => {
       if ($scope.clickedWell !== null) {
         const clickedWellIdx = $scope.wells.indexOf($scope.clickedWell);
         const firstWellIdx = 0;

         if (clickedWellIdx !== -1 && clickedWellIdx !== firstWellIdx) {
           // Move, don't grow
           $scope.clearSelection();
           const newIdx = clickedWellIdx - 1;
           const newWell = $scope.wells[newIdx];

           $scope.clickWell($event, newWell);
         }
       }
     };

     /**
      * Clears the values assigned to the currently selected
      * wells.
      */
     $scope.clearValuesInCurrentSelection = () => {
       if ($scope.selectedColumn !== null) {
         const currentColumnId = $scope.selectedColumn.id;
         const selectedWells = getSelectedWells();

         selectedWells.forEach(well => well[currentColumnId] = null);

         $scope.currentValue = "";
       }
     };

     // Extra Behaviors
     $scope.$on(COLUMN_ADDED, (_, newColumn) => {
       $scope.selectColumn(newColumn);
     });

     $scope.$on(SELECTION_CHANGED, () => {
       $scope.currentValue = determineCurrentValueFromSelection();
     });

     // Keybindings
     const keybinds = {
       "Escape": $scope.clearSelection,
       "C-a": $scope.selectAll,
       "C-n": $scope.newPlate,
       "ArrowLeft": $scope.moveColumnSelectionLeft,
       "ArrowRight": $scope.moveColumnSelectionRight,
       "ArrowDown": $scope.moveWellSelectionDown,
       "C-ArrowDown": $scope.growWellSelectionDown,
       "ArrowUp": $scope.moveWellSelectionUp,
       "Delete": $scope.clearValuesInCurrentSelection,
       "C-i": $scope.addColumn,
     };

     /**
      * Transforms a jQueryLite keyboard event into the
      * key syntax used internally.
      */
     function eventToKeybindKey($event) {
       let returnValue = "";
       // Emacs style for modifier keys
       if ($event.ctrlKey) {
         returnValue += "C-";
       }

       returnValue += $event.key;

       return returnValue;
     }

     /**
      * Handles keypresses that have be bubbled all the way
      * upto the body.
      */
     $scope.bodyKeypressHandler = ($event) => {
       const key = eventToKeybindKey($event);
       const inputIsFocused =
         document.activeElement.tagName.toLowerCase() === "input";

       if (keybinds[key] !== undefined) {
         keybinds[key].call(this, $event);
         $event.preventDefault();
       } else if (inputIsFocused) {
         return;
       } else if (key === "Backspace") {
         const currentValue = $scope.currentValue;
         const len = currentValue.length;

         $scope.currentValue = currentValue.substring(0, len - 1);
         $scope.setValueOfSelectedWells();
         $event.stopPropagation();
         $event.preventDefault();
       } else if ($event.which !== 0 && !$event.ctrlKey) {
         document.activeElement.blur();
         document.body.focus();
         const charCode = $event.charCode;
         const char = String.fromCharCode(charCode);
         $scope.currentValue += char;
         $scope.setValueOfSelectedWells();
         $event.stopPropagation();
         $event.preventDefault();
       }
     };

     const sourcesWithClickHandlers =
        ["button", "input", "td", "th"];

     /**
      * Handles clicks that have bubbled all the way upto the body.
      */
     $scope.bodyClickEventHandler = function($event) {
       const sourceElement = $event.originalTarget.tagName.toLowerCase();
       const sourceHandled =
        sourcesWithClickHandlers.indexOf(sourceElement) !== -1;

       if (sourceHandled) return;
       else $scope.clearSelection();
     };
   }]);
