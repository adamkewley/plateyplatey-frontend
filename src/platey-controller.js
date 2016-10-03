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
     // DATA - The underlying data structure. Only the UI and the
     // primatives should be able to touch these. Native and
     // non-native commands should access them indirectly via
     // primatives.

     $scope.columns = [];
     $scope.selectedColumn = null;
     $scope.wells = [];
     $scope.currentValue = "";
     $scope.clickedWell = null;

     // PRIMATIVES - The lowest-level platey commands that expose all
     // platey functionality. These are used by the **DATABINDING**
     // parts of the UI. They are also used by native
     // commands. Because they're low-level, they may change as the
     // application evolves.

     /**
      * Create a new document.
      */
     $scope.newDocument = () => {
       $scope.$broadcast("before-new-document-created", null);

       $scope.selectColumn(null);
       $scope.currentValue = "";
       $scope.columns = [];
       $scope.clickedWell = null;

       $scope.$broadcast("after-new-document-created", null);
     };

     /**
      * Add a new column to the platey table.
      * @return {ColumnId} The ID of the new column.
      */
     $scope.addColumn = () => {
       $scope.$broadcast("before-column-added", null);

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

       $scope.$broadcast("after-column-added", newColumn.id);

       return newColumn.id;
     };

     /**
      * Move a column in the table to a different index.
      * @param {ColumnId} columnId - The id of the column to move.
      * @param {integer} newIndex - The new index of the column.
      */
     $scope.moveColumn = (columnId, newIndex) => {
       const oldIndex =
         $scope
         .columns
         .map(column => column.id)
         .indexOf(columnId);

       if (oldIndex === -1)
         return; // The column wasn't in the table
       else if (oldIndex === newIndex)
         return; // It doesn't need to move
       else if (newIndex >= $scope.columns.length)
         return; // The new index is out of bounds
       else {
         $scope.$broadcast("before-column-moved", columnId);

         moveItemInArray($scope.columns, oldIndex, newIndex);

         $scope.$broadcast("after-column-moved", columnId);
       }
     };

     /**
      * Remove a column from the table.
      * @param {ColumnId} column - ID of the column to remove.
      */
     $scope.removeColumn = function(columnId) {
       $scope.$broadcast("before-column-removed", columnId);

       const columnIdx = $scope.columns.find(column => column.id === columnId);

       // Shouldn't happen, but for sanity's sake...
       if (columnIdx === -1) return;

       if ($scope.selectedColumn !== null && $scope.selectedColumn.id === columnId)
         $scope.selectedColumn = null;

       $scope.columns.splice(columnIdx, 1);

       $scope.wells.forEach(well => {
         delete well[columnId];
       });

       $scope.$broadcast("after-column-removed", columnId);
     };

     /**
      * Get the currently selected column.
      * @return {ColumnId} The currently selected column.
      */
     $scope.getSelectedColumnId = () => {
       if ($scope.selectedColumn === null)
         return null;
       else return $scope.selectedColumn.id;
     };

     /**
      * Set the currently selected column.
      * @param {ColumnId} columnId - The ID of the column to select (nullable).
      */
     $scope.selectColumn = (columnId) => {
       if (columnId === null) {
         $scope.$broadcast("before-column-selection-changed", columnId);

         $scope.selectedColumn = null;

         $scope.$broadcast("after-column-selection-changed", columnId);
       }

       const columnToSelect = $scope.columns.find(column => column.id === columnId);

       if (columnToSelect !== undefined) {
         $scope.$broadcast("before-column-selection-changed", columnId);

         $scope.selectedColumn = columnToSelect;

         $scope.$broadcast("after-column-selection-changed", columnId);
       }
     };

     /**
      * Clear all data in a column.
      * @param {ColumnId} columnId - The ID of the column to clear data from.
      */
     $scope.clearDataInColumn = (columnId) => {
       $scope.$broadcast("before-column-data-cleared", columnId);

       $scope.wells.forEach(well => well[columnId] = null);

       $scope.$broadcast("after-column-data-cleared", columnId);
     };

     /**
      * Get ids of columns in the table. The order of IDs is
      * guaranteed to reflect the order of columns in the table.
      * @return {Array.<ColumnId>}
      */
     $scope.getColumnIds = () => $scope.columns.map(column => column.id);

     /**
      * Get the header text of a column.
      * @return {string}
      */
     $scope.getColumnHeader = (columnId) => {
       const column = $scope.columns.find(column => column.id === columnId);

       if (column === undefined) return undefined;
       else return column.header;
     };

     /**
      * Get the IDs of rows in the table.
      * @return {Array.<WellId>}
      */
     $scope.getRowIds = () => $scope.wells.map(well => well.id);

     /**
      * Gets selected rows in the table.
      * @return {Array.<RowId>}
      */
     $scope.getSelectedRowIds = () => {
       return $scope
       .wells
       .filter(well => well.selected === true)
       .map(well => well.id);
     };

     /**
      * Select multiple rows in the table.
      * @param {Array.<RowId>} rowIds - The IDs of the rows to select.
      */
     $scope.selectRowsById = (rowIds) => {
       $scope.$broadcast("before-selecting-rows", rowIds);

       $scope
       .wells
       .filter(well => rowIds.indexOf(well.id) !== -1)
       .forEach(well => well.selected = true);

       $scope.$broadcast("after-selecting-rows", rowIds);
     };

     /**
      * Deselect multiple rows in the table.
      */
     $scope.deSelectRowsById = (rowIds) => {
       $scope.$broadcast("before-deselecting-rows", rowIds);

       $scope
       .wells
       .filter(well => rowIds.indexOf(well.id) !== -1)
       .forEach(well => well.selected = false);

       $scope.$broadcast("after-deselecting-rows", rowIds);
     };

     /**
      * Assign a column value to multiple rows of the table.
      * @param {ColumnId} columnId
      * @param {Array.<RowId>} rowIds
      * @param {string} value
      */
     $scope.assignValueToCells = (columnId, rowIds, value) => {
       const columnExists = $scope.columns.find(column => column.id === columnId);
       const rows = $scope.wells.filter(well => rowIds.indexOf(well.id) !== -1);

       if (columnExists !== undefined && rows.length > 0) {
         rows.forEach(row => row[columnId] = value);
       }
     };

     /**
      * Create a prompt that allows the user to save the data to a
      * location on their disk.
      * @param {string} fileName - Proposed name of the file to save.
      * @param {string} contentType - The content-type of the data (e.g. "text/csv;charset=utf-8;".
      * @param {byte} data - The data to save.
      */
     $scope.promptUserToSaveData = (fileName, contentType, data) => {
       const blob = new Blob([data], { type: contentType });
       const blobUrl = URL.createObjectURL(blob);

       const downloadLink = document.createElement("a");
       downloadLink.href = blobUrl;
       downloadLink.download = fileName;
       downloadLink.visibility = "hidden";

       document.body.appendChild(downloadLink);
       downloadLink.click();
       document.body.removeChild(downloadLink);
     };

     /**
      * Copy text to the user's clipboard.
      * @param {string} text - The text to copy.
      */
     $scope.copyTextToClipboard = (text) => {
       const $textElement = document.createElement("textarea");
       $textElement.visibility = "hidden";
       $textElement.value = text;
       document.body.appendChild($textElement);
       $textElement.select();
       document.execCommand("copy");
       document.body.removeChild($textElement);
     };

     /**
      * Returns the table's data in a row-by-row format
      * @return {Array.<Array.<TableDataValue>>}
      */
     $scope.getTableData = () => {
       const orderedColumnIds = ["id"].concat($scope.columns.map(column => column.id));

       return $scope.wells.map(wellData => orderedColumnIds.map(columnId => wellData[columnId]));
     };

     /**
      * Get the ID of the focused row (nullable).
      * @return {RowId}
      */
     $scope.getFocusedRowId = () => {
       return $scope.clickedWell.id;
     };

     /**
      * Set a row as focused.
      * @param {RowId} rowId - The ID of the row to focus.
      */
     $scope.focusRow = (rowId) => {
       const row = $scope.wells.find(well => well.id === rowId);

       if (row !== undefined) {
         $scope.$broadcast("before-focus-row", rowId);

         $scope.clickedWell = row;
         $scope.selectRowsById([rowId]);

         $scope.$broadcast("after-focused-row", rowId);
       }
     };

     // Aggregate / co-dependant events.
     $scope.$on("after-column-added", () => $scope.$broadcast("after-table-columns-changed", null));
     $scope.$on("after-column-removed", () => $scope.$broadcast("after-table-columns-changed", null));
     $scope.$on("after-column-moved", () => $scope.$broadcast("after-table-columns-changed", null));

     $scope.$on("after-table-columns-changed", () => $scope.$broadcast("after-table-changed", null));

     $scope.$on("after-selecting-rows", () => $scope.$broadcast("after-row-selection-changed", null));
     $scope.$on("after-deselecting-rows", () => $scope.$broadcast("after-row-selection-changed", null));

     $scope.$on("after-row-selection-changed", () => $scope.$broadcast("after-table-selection-changed", null));
     $scope.$on("after-column-selection-changed", () => $scope.$broadcast("after-table-selection-changed", null));

     const primativeCommands = {
       newDocument: $scope.newDocument,
       addColumn: $scope.addColumn,
       moveColumn: $scope.moveColumn,
       removeColumn: $scope.removeColumn,
       getSelectedColumnId: $scope.getSelectedColumnId,
       selectColumn: $scope.selectColumn,
       clearDataInColumn: $scope.clearDataInColumn,
       getColumnIds: $scope.getColumnIds,
       getRowIds: $scope.getRowIds,
       getSelectedRowIds: $scope.getSelectedRowIds,
       selectRowsById: $scope.selectRowsById,
       deSelectRowsById: $scope.deSelectRowsById,
       assignValueToCells: $scope.assignValueToCells,
       promptUserToSaveData: $scope.promptUserToSaveData,
       getColumnHeader: $scope.getColumnHeader,
       getTableData: $scope.getTableData,
       copyTextToClipboard: $scope.copyTextToClipboard,
       getFocusedRowId: $scope.getFocusedRowId,
       focusRow: $scope.focusRow,
     };

     // NATIVE COMMANDS - These commands use primatives, and any
     // standard javascript / library functionality to do higher-level
     // stuff such as inverting a selection or exporting the plate's
     // data. They offer a high degree of control over platey but may
     // need patching as the primatives evolve. The outer interface of
     // native commands should not change much over time. Because they
     // use primatives, they are the least encapsulated command.

     // Native commands hook into the core's events.
     const events = {
       subscribeTo: (eventName, callback) => $scope.$on(eventName, callback),
       broadcast: (eventName, value) => $scope.$broadcast(eventName, value),
     };

     $scope.nativeCommands = new NativeCommands(primativeCommands, events);

     // NON-NATIVE COMMANDS - These commands operate in the high-level
     // wild-west of commands-ville. Essentially, they are passed a
     // mutable context containing *at least* the native commands but
     // the context is populated by the other non-native commands at
     // runtime. These commands are the high-level ones which build on
     // top of the entire engine (without any connection to the
     // primatives that actually drive the engine).

     // NYI

     // The UI, and keybinds, bind via this getCommand interface,
     // which provides all native/non-native commands. The interface
     // should use these to *do* stuff (it may use the primatives /
     // data to *bind* to stuff).
     $scope.getCommand = (id) => $scope.nativeCommands.getCommandById(id);

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
           selectsIds: selector.selects,
           selects: selector.selects.map(wellId => $scope.wells.find(well => well.id === wellId))
         };
       });
     });

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
      * Returns true if no cells are selected.
      * @returns {boolean}
      */
     $scope.noCellsSelected = () => {
       return $scope.selectedColumn === null ||
              !$scope.wells.some(well => well.selected);
     };

     // Extra Behaviors
     $scope.$on("after-column-added", (_, columnId) => {
       $scope.selectColumn(columnId);
     });

     $scope.$on("after-table-selection-changed", () => {
       $scope.currentValue = determineCurrentValueFromSelection();
     });

     const keybinds = {
       "Escape": "clear-selection",
       "C-a": "select-all",
       "C-n": "new-plate",
       "ArrowLeft": "move-column-selection-left",
       "ArrowRight": "move-column-selection-right",
       "ArrowDown": "move-row-focus-down",
       "ArrowUp": "move-row-focus-up",
       "Delete": "clear-values-in-current-selection",
       "C-i": "add-column",
       "Enter": "move-row-focus-down",
       "Tab": "move-column-selection-right",
       "M-ArrowLeft": "move-selected-column-left",
       "M-ArrowRight": "move-selected-column-right",
     };

     // So that buttons etc. can see the current keybinds.
     $scope.keybinds = keybinds;

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
         const commandName = keybinds[key];
         const command = $scope.getCommand(commandName);
         if (command !== undefined) {
           command.execute($event);
           $event.preventDefault();
         }
       } else if (key === "Backspace") {
         const currentValue = $scope.currentValue;
         const len = currentValue.length;

         $scope.currentValue = currentValue.substring(0, len - 1);
         $scope.setValueOfSelectedWells();
         $event.stopPropagation();
         $event.preventDefault();
       } else if ($event.which !== 0 && !$event.ctrlKey) {
         document.activeElement || document.activeElement.blur || document.activeElement.blur();
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

     const clearRowSelectionCommand = $scope.getCommand("clear-row-selection");

     /**
      * Handles clicks that have bubbled all the way upto the body.
      */
     $scope.bodyClickEventHandler = function($event) {
       // .originalTarget does not work on IE11
       const sourceElement = ($event.originalTarget || $event.srcElement).tagName.toLowerCase();
       const sourceHandled =
        sourcesWithClickHandlers.indexOf(sourceElement) !== -1;

       if (sourceHandled) return;
       else clearRowSelectionCommand.execute();
     };

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
      * Internal function for moving items in an array.
      */
     function moveItemInArray(array, old_index, new_index) {
       if (new_index >= array.length) {
         var k = new_index - array.length;
         while ((k--) + 1) {
           array.push(undefined);
         }
       }
       array.splice(new_index, 0, array.splice(old_index, 1)[0]);
       return array; // for testing purposes
     };
   }]);
