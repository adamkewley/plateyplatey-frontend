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
     $scope.columns = [];
     $scope.selectedColumn = null;
     $scope.wells = [];
     $scope.currentValue = "";
     $scope.clickedWell = null;

     const SELECTION_CHANGED = "selection-changed";
     const COLUMN_ADDED = "column-added";

     // Load a plate layout
     $http.get("96-well-plate.json")
     .then(function(response) {
       const data = response.data;
       $scope.vbox = `0 0 ${data.gridWidth} ${data.gridHeight}`;

       $scope.wells = data.wells.map(well => {
         return {
           id: well.id,
           columns: [],
           selected: false,
           hovered: false,
           x: well.x,
           y: well.y,
         };
       });

       $scope.selectors = data.selectors.map(selector => {
         return {
           x: selector.x,
           y: selector.y,
           label: selector.label,
           selects: selector.selects.map(wellId => $scope.wells.find(well => well.id === wellId))
         };
       });
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

     $scope.getWellsFromIds = (wellIds) => {
       return $scope.wells.filter(well => wellIds.indexOf(well.id) !== -1);
     };

     $scope.hoverOverWell = (well) => {
       well.hovered = true;
     };

     $scope.unHoverOverWell = (well) => {
       well.hovered = false;
     };

     $scope.hoverOverWells = (wells) => {
       wells.forEach($scope.hoverOverWell);
     };

     $scope.unHoverOverWells = (wells) => {
       wells.forEach($scope.unHoverOverWell);
     };

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
      * Exports the main table to the clipboard.
      */
     $scope.copyTableToClipboard = function() {
       const columnSeparator = "\t";
       const rowSeparator = "\n";

       const columnIds = $scope.columns.map(column => column.id);

       const headers =
         ["Well ID"].concat($scope.columns.map(column => column.header));

       const data = $scope.wells.map(well => {
         const rowData = columnIds.map(columnId => well[columnId]);

         return [well.id].concat(rowData);
       });

       const table = [headers].concat(data);

       const text = table.map(row => row.join(columnSeparator)).join(rowSeparator);

       const $textElement = document.createElement("textarea");
       $textElement.visibility = "hidden";
       $textElement.value = text;
       document.body.appendChild($textElement);
       $textElement.select();
       document.execCommand("copy");
       document.body.removeChild($textElement);
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
      * Invert the current selection, making all selected wells
      * deselect and all deselected wells select.
      */
     $scope.invertSelection = () => {
       $scope.wells.forEach(well => well.selected = !well.selected);

       $scope.currentValue = "";
     };

     /**
      * Moves the selected column left in the table.
      */
     $scope.moveSelectedColumnLeft = () => {
       const selectedColumn = $scope.selectedColumn;

       if (selectedColumn === null) {
         return; // Nothing to move.
       } else if ($scope.columns.indexOf(selectedColumn) === 0) {
         return; // Can't move leftmost column left.
       } else {
         // Swap whatever's left of the selected column
         // with the selected column.
         const idx = $scope.columns.indexOf(selectedColumn);
         const leftIdx = idx - 1;
         const left = $scope.columns[leftIdx];

         $scope.columns[leftIdx] = selectedColumn;
         $scope.columns[idx] = left;
       }
     };

     /**
      * Moves the selected column right in the table.
      */
     $scope.moveSelectedColumnRight = () => {
       const selectedColumn = $scope.selectedColumn;
       const idx = $scope.columns.indexOf(selectedColumn);
       const len = $scope.columns.length;

       if (idx === -1) {
         return; // Nothing to move
       } else if (idx === (len - 1)) {
         return; // It's already the last column
       } else {
         // Swap whatever's right of the selected column
         // with the selected column.
         const rightIdx = idx + 1;
         const right = $scope.columns[rightIdx];

         $scope.columns[rightIdx] = selectedColumn;
         $scope.columns[idx] = right;
       }
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
       "Enter": $scope.moveWellSelectionDown,
       "Tab": $scope.moveColumnSelectionRight,
       "M-ArrowLeft": $scope.moveSelectedColumnLeft,
       "M-ArrowRight": $scope.moveSelectedColumnRight,
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

       if ($event.altKey) {
         returnValue += "M-";
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

       if (inputIsFocused) {
         return;
       } else if (keybinds[key] !== undefined) {
           keybinds[key].call(this, $event);
           $event.preventDefault();
       } else if (key === "Backspace") {
         const currentValue = $scope.currentValue;
         const len = currentValue.length;

         $scope.currentValue = currentValue.substring(0, len - 1);
         $scope.setValueOfSelectedWells();
         $event.stopPropagation();
         $event.preventDefault();
       } else if ($event.which !== 0 && !$event.ctrlKey) {
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
        ["button", "input", "td", "th", "circle", "text", "svg"];

     /**
      * Handles clicks that have bubbled all the way upto the body.
      */
     $scope.bodyClickEventHandler = function($event) {
       // .originalTarget does not work on IE11
       const sourceElement = ($event.originalTarget || $event.srcElement).tagName.toLowerCase();
       const sourceHandled =
        sourcesWithClickHandlers.indexOf(sourceElement) !== -1;

       if (sourceHandled) return;
       else $scope.clearSelection();
     };

     /**
      * Handles applying pastedText to the document.
      */
     function handlePastedText(pastedText) {
       const columnSeparator = /\t/;
       const lines = pastedText.split(/r\n|\r|\n/);
       const numberOfLines = lines.length;

       if (numberOfLines === 1 && pastedText.length > 0) {
         // Treat single-line pastes as "I want to paste to the
         // current selection".
         $scope.currentValue = pastedText;
         $scope.setValueOfSelectedWells();
       } else if (numberOfLines > 1) {
         // Treat multi-line pastes as "I want to paste my (tabular)
         // data".

         const pastedTable = lines.map(line => line.split(columnSeparator));

         const startingWellIdx =
           $scope.clickedWell !== null ? $scope.wells.indexOf($scope.clickedWell) : 0;

         const startingColumnIdx =
           $scope.selectedColumn !== null ? $scope.columns.indexOf($scope.selectedColumn) : (
             $scope.columns.length > 0 ? 0 : $scope.columns.indexOf($scope.addColumn()));

         pastedTable.forEach((row, rowIdx) => {
           const targetWellIdx = startingWellIdx + rowIdx;

           if ($scope.wells.length <= targetWellIdx)
             return; // We're at the end of the table, you can't add wells
           else {
             const targetWell = $scope.wells[targetWellIdx];

             row.forEach((column, columnIdx) => {
               const targetColumnIdx = startingColumnIdx + columnIdx;

               if ($scope.columns.length <= targetColumnIdx) {
                 // We're at the end of the table, add another column.
                 $scope.addColumn();
               }

               const targetColumn = $scope.columns[targetColumnIdx];

               targetWell[targetColumn.id] = column;
             });
           }
         });
       }
     }

     /**
      * Handles when the user attempts to paste data into the
      * application.
      */
     $scope.pasteEventHandler = function($event) {
       // source: http://stackoverflow.com/questions/2176861/javascript-get-clipboard-data-on-paste-event-cross-browser

       // Stop the data from actually being pasted.
       $event.stopPropagation();
       $event.preventDefault();

       const clipboardData = $event.clipboardData || window.clipboardData;
       const text = clipboardData.getData("text/plain");

       handlePastedText(text);
     };
   }]);
