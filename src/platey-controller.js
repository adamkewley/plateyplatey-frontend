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
     // primatives should touch these.

     $scope.columns = [];
     $scope.selectedColumn = null;
     $scope.wells = [];
     $scope.currentValue = "";
     $scope.clickedWell = null;

     $scope.platePaths = [];
     $scope.currentPlateTemplate = null;

     $scope.plateArrangements = [];
     $scope.currentPlateArrangement = null;

     // PRIMATIVES - The lowest-level platey commands that expose all
     // platey functionality. These are used by the **DATABINDING**
     // and scripting parts of the UI.

     /**
      * Set the currently selected column.
      * @param {ColumnId} columnId - The ID of the column to select (nullable).
      */
     const selectColumn = (columnId) => {
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

     const newDocument = () => {
       $scope.$broadcast("before-new-document-created", null);

       selectColumn(null);
       $scope.currentValue = "";
       $scope.columns = [];
       $scope.clickedWell = null;

       $scope.$broadcast("after-new-document-created", null);
     };

     /**
      * Add a new column to the platey table.
      * @return {Column} A handle to the column.
      */
     const addColumn = () => {
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
      * @param {Column} column - The column to move.
      * @param {integer} newIndex - The new index of the column.
      */
     const moveColumn = (columnId, newIndex) => {
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
      * @param {Column} column - The column to remove.
      */
     const removeColumn = function(columnId) {
       $scope.$broadcast("before-column-removed", columnId);

       const column = $scope.columns.find(col => col.id === columnId);

       if (column === undefined) return;
       else {
         if (column === $scope.selectedColumn)
           $scope.selectedColumn = null;

         const idx = $scope.columns.indexOf(column);
         $scope.columns.splice(idx, 1);

         $scope.wells.forEach(well => {
           delete well[columnId];
         });

         $scope.$broadcast("after-column-removed", columnId);
       }
     };

     /**
      * Get the currently selected column.
      * @return {Column} The currently selected column.
      */
     const getSelectedColumnId = () => {
       if ($scope.selectedColumn === null)
         return null;
       else return $scope.selectedColumn.id;
     };

     /**
      * Clear all data in a column.
      * @param {ColumnId} columnId - The ID of the column to clear data from.
      */
     const clearDataInColumn = (columnId) => {
       $scope.$broadcast("before-column-data-cleared", columnId);

       $scope.wells.forEach(well => well[columnId] = null);

       $scope.$broadcast("after-column-data-cleared", columnId);
     };

     /**
      * Get ids of columns in the table. The order of IDs is
      * guaranteed to reflect the order of columns in the table.
      * @return {Array.<ColumnId>}
      */
     const getColumnIds = () => $scope.columns.map(column => column.id);

     /**
      * Get the header text of a column.
      * @return {string}
      */
     const getColumnHeader = (columnId) => {
       const column = $scope.columns.find(column => column.id === columnId);

       if (column === undefined) return undefined;
       else return column.header;
     };

     /**
      * Get the IDs of rows in the table.
      * @return {Array.<WellId>}
      */
     const getRowIds = () => $scope.wells.map(well => well.id);

     /**
      * Gets selected rows in the table.
      * @return {Array.<RowId>}
      */
     const getSelectedRowIds = () => {
       return $scope
       .wells
       .filter(well => well.selected === true)
       .map(well => well.id);
     };

     /**
      * Select multiple rows in the table.
      * @param {Array.<RowId>} rowIds - The IDs of the rows to select.
      */
     const selectRowsById = (rowIds) => {
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
     const deSelectRowsById = (rowIds) => {
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
     const assignValueToCells = (columnId, rowIds, value) => {
       $scope.$broadcast("before-assigning-value-to-cells", {
         columnId: columnId,
         rowIds: rowIds,
         value: value,
       });

       const columnExists = $scope.columns.find(column => column.id === columnId);
       const rows = $scope.wells.filter(well => rowIds.indexOf(well.id) !== -1);

       if (columnExists !== undefined && rows.length > 0) {
         rows.forEach(row => row[columnId] = value);
       }

       $scope.$broadcast("after-assigning-value-to-cells", {
         columnId: columnId,
         rowIds: rowIds,
         value: value,
       });
     };

     /**
      * Create a prompt that allows the user to save the data to a
      * location on their disk.
      * @param {string} fileName - Proposed name of the file to save.
      * @param {string} contentType - The content-type of the data (e.g. "text/csv;charset=utf-8;".
      * @param {byte} data - The data to save.
      */
     const promptUserToSaveData = (fileName, contentType, data) => {
       const blob = new Blob([data], { type: contentType });

       // If it's shitty IE
       if (window.navigator.msSaveOrOpenBlob) {
         window.navigator.msSaveOrOpenBlob(blob, fileName);
       } else {
         const blobUrl = URL.createObjectURL(blob);

         const downloadLink = document.createElement("a");
         downloadLink.href = blobUrl;
         downloadLink.download = fileName;
         downloadLink.visibility = "hidden";

         document.body.appendChild(downloadLink);
         downloadLink.click();
         document.body.removeChild(downloadLink);
       }
     };

     /**
      * Copy text to the user's clipboard.
      * @param {string} text - The text to copy.
      */
     const copyTextToClipboard = (text) => {
       const $textElement = document.createElement("textarea");
       $textElement.visibility = "hidden";
       $textElement.value = text;
       document.body.appendChild($textElement);
       $textElement.select();
       document.execCommand("copy");
       document.body.removeChild($textElement);
     };

     /**
      * Prompt the user to browse for files on their local
      * filesystem. Returns null if the user cancels out of the
      * dialog.
      * @param {string} mimeTypes - A comma-separated list of MIME
      * types that the file browser should filter to
      * @return {Array.<File>}
      */
     const promptUserForFiles = (mimeTypes = "") => {
       const fileInputEl = document.createElement("input");
       fileInputEl.multiple = "multiple";

       fileInputEl.type = "file";
       fileInputEl.accept = mimeTypes;
       fileInputEl.click();

       if (fileInputEl.files.length > 0)
         return fileInputEl.files;
       else return null;
     };

     /**
      * Prompt the user to browse for a single file on their
      * filesystem. Returns null if the user cancels out of the
      * operation.
      * @param {string} mimeTypes - A comma-delimited list of MIME
      * types the file dialog should filter against
      * @return {File} The file object for the browsed file. Null if
      * the user cancels out of the file dialog.
      */
     const promptUserForFile = (mimeTypes = "") => {
       const fileInputEl = document.createElement("input");
       fileInputEl.type = "file";
       fileInputEl.accept = mimeTypes;
       fileInputEl.click();

       if (fileInputEl.files.length === 1)
         return fileInputEl.files[0];
       else return null;
     };

     /**
      * Returns the table's data in a row-by-row format
      * @return {Array.<Array.<TableDataValue>>}
      */
     const getTableData = () => {
       const orderedColumnIds = ["id"].concat($scope.columns.map(column => column.id));

       return $scope.wells.map(wellData => orderedColumnIds.map(columnId => wellData[columnId]));
     };

     /**
      * Get the ID of the focused row (nullable).
      * @return {RowId}
      */
     const getFocusedRowId = () => {
       return $scope.clickedWell.id;
     };

     /**
      * Set a row as focused.
      * @param {RowId} rowId - The ID of the row to focus.
      */
     const focusRow = (rowId) => {
       const row = $scope.wells.find(well => well.id === rowId);

       if (row !== undefined) {
         $scope.$broadcast("before-focus-row", rowId);

         $scope.clickedWell = row;
         selectRowsById([rowId]);

         $scope.$broadcast("after-focused-row", rowId);
       }
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

     const performHttpGetRequest = (path) => {
       return $http.get(path);
     };

     const setPlateLayout = (layout) => {
       $scope.vbox = `0 0 ${layout.gridWidth} ${layout.gridHeight}`;

       const columnIds = $scope.columns.map(column => column.id);

       // Supply random and default arrangements for all
       // plates
       const defaultArrangement = {
         name: "Default",
         order: layout.wells.map(well => well.id)
       };

       const defaultArrangements = [
         defaultArrangement,
         {
           name: "Random",
           order: shuffle(layout.wells.map(well => well.id))
         },
       ];

       $scope.currentPlateArrangement = defaultArrangement;

       // If the plate comes with custom arrangements, supply
       // those as well
       $scope.plateArrangements =
         layout.arrangements ?
         defaultArrangements.concat(layout.arrangements) :
         defaultArrangements;

       $scope.wells = layout.wells.map(well => {
         const wellData = {
           id: well.id,
           columns: [],
           selected: false,
           hovered: false,
           x: well.x,
           y: well.y,
           radius: well.radius || layout.defaultWellRadius || 0.3,
         };

         columnIds.forEach(id => {
           wellData[id] = null;
         });

         return wellData;
       });

       $scope.selectors = layout.selectors.map(selector => {
         return {
           x: selector.x,
           y: selector.y,
           label: selector.label,
           selectsIds: selector.selects,
           selects: selector
                    .selects
                    .map(wellId => $scope.wells.find(well => well.id === wellId))
                    .filter(well => well !== undefined) // e.g. if the selector has an invalid ID in it
         };
       });
     };

     $scope.loadPlateLayout = (plateTemplate) => {
       $scope.currentPlateTemplate = plateTemplate;
       performHttpGetRequest(plateTemplate.path).then(response => setPlateLayout(response.data));
     };

     $scope.changePlateArrangement = (arrangement) => {
       const arrangementWells = arrangement.order;

       const arrangedWells =
         arrangementWells
         .map(wellId => $scope.wells.find(well => well.id === wellId))
         .filter(well => well !== undefined);

       const remainingWells =
         $scope.wells.filter(well => arrangement.order.indexOf(well.id) === -1);

       $scope.wells = arrangedWells.concat(remainingWells);
     };

     // Aggregate / co-dependant events.
     $scope.$on("after-column-added", () => $scope.$broadcast("after-table-columns-changed", null));
     $scope.$on("after-column-removed", () => $scope.$broadcast("after-table-columns-changed", null));
     $scope.$on("after-column-moved", () => $scope.$broadcast("after-table-columns-changed", null));

     $scope.$on("after-table-columns-changed", () => $scope.$broadcast("after-table-changed", null));
     $scope.$on("after-assigning-value-to-cells", () => $scope.$broadcast("after-table-changed", null));

     $scope.$on("after-selecting-rows", () => $scope.$broadcast("after-row-selection-changed", null));
     $scope.$on("after-deselecting-rows", () => $scope.$broadcast("after-row-selection-changed", null));

     $scope.$on("after-row-selection-changed", () => $scope.$broadcast("after-table-selection-changed", null));
     $scope.$on("after-column-selection-changed", () => $scope.$broadcast("after-table-selection-changed", null));

     const primativeCommands = {
       newDocument: newDocument,
       addColumn: addColumn,
       moveColumn: moveColumn,
       removeColumn: removeColumn,
       getSelectedColumnId: getSelectedColumnId,
       selectColumn: selectColumn,
       clearDataInColumn: clearDataInColumn,
       getColumnIds: getColumnIds,
       getRowIds: getRowIds,
       getSelectedRowIds: getSelectedRowIds,
       selectRowsById: selectRowsById,
       deSelectRowsById: deSelectRowsById,
       assignValueToCells: assignValueToCells,
       promptUserToSaveData: promptUserToSaveData,
       getColumnHeader: getColumnHeader,
       getTableData: getTableData,
       copyTextToClipboard: copyTextToClipboard,
       getFocusedRowId: getFocusedRowId,
       focusRow: focusRow,
       hoverOverWell: $scope.hoverOverWell, // TODO: Make more generic
       hoverOverWells: $scope.hoverOverWells, // TODO: Make more generic
       unHoverOverWell: $scope.unHoverOverWell, // TODO: Make more generic
       unHoverOverWells: $scope.unHoverOverWells, // TODO: Make more generic
       performHttpGetRequest: performHttpGetRequest, // TODO: Make more generic
       setPlateLayout: setPlateLayout, // TODO: Make more generic
       promptUserForFiles: promptUserForFiles,
       promptUserForFile: promptUserForFile,
     };

     // NATIVE COMMANDS - Use primative commands, but expose themselves
     // as expression-compatible functions

     // Native commands hook into the core's events.
     const events = {
       subscribeTo: (eventName, callback) => $scope.$on(eventName, callback),
       broadcast: (eventName, value) => $scope.$broadcast(eventName, value),
     };

     const nativeCommands = new NativeCommands(primativeCommands, events);
     $scope.commands = nativeCommands.commandsHash;

     // COMMANDS - Key, click, or otherwise, commands are executed
     // through a central command controller. This is so that disabled
     // logic is checked and application state changes are recorded.
     const commandController = new CommandController(nativeCommands);

     $scope.getCommandDetails = (cmd) => commandController.getCommandDetails(cmd);

     $scope.exec = (cmd, ...scopes) => {
       commandController.exec(cmd, ...scopes);
     };

     // for debugging
     commandController.onAfterExec.subscribe((cmdName) => console.log(cmdName));

     // Populate initial plate
     performHttpGetRequest("plates.json").then(function(response) {
       const plateTemplates = response.data;
       $scope.plateTemplates = plateTemplates;
       $scope.loadPlateLayout(plateTemplates[0]);
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
       selectColumn(columnId);
     });

     $scope.$on("after-table-selection-changed", () => {
       $scope.currentValue = determineCurrentValueFromSelection();
     });

     $scope.$on("after-table-changed", () => {
       $scope.currentValue = determineCurrentValueFromSelection();
     });

     // BUG: keyboard command callers don't check the disabled state
     // of a command.

     // These are used instead of directly using .key because a) it's
     // easier to understand what's going on and b) browsers are
     // inconsistient about keys (firefox: "ArrowLeft", ie: "Left")
     const KEYCODES_OF_UNPRINTABLE_KEYPRESSES = {
       "8": "<backspace>",
       "9": "<tab>",
       "13": "<return>",
       "27": "<escape>",
       "33": "<prior>",
       "34": "<next>",
       "35": "<end>",
       "36": "<home>",
       "37": "<left>",
       "38": "<up>",
       "39": "<right>",
       "40": "<down>",
       "45": "<insert>",
       "46": "<delete>"
     };

     // EMACS-style kbd representation
     const keybinds = {
       "<escape>": "(clear-selection)",
       "C-a": "(select-all)",
       "C-n": "(new-plate)",
       "<left>": "(move-column-selection-left)",
       "<right>": "(move-column-selection-right)",
       "<down>": "(move-row-focus-down)",
       "<up>": "(move-row-focus-up)",
       "<delete>": "(clear-values-in-current-selection)",
       "C-i": "(add-column)",
       "<return>": "(move-row-focus-down)",
       "<tab>": "(move-column-selection-right)",
       "M-<left>": "(move-selected-column-left)",
       "M-<right>": "(move-selected-column-right)"
     };

     $scope.getKeybindsAssociatedWith = (expr) => {
       return Object.keys(keybinds)
       .filter(key => {
         const keyboundCommandId = keybinds[key];

         return keyboundCommandId === expr;
       });
     };

     /**
      * Transforms a jQueryLite keyboard event into the
      * key syntax used internally.
      */
     function eventToKeybindKey($event) {
       let modifiers = "";

       if ($event.ctrlKey)
         modifiers += "C-";

       if ($event.altKey)
         modifiers += "M-";

       const translatedKeyCode =
         KEYCODES_OF_UNPRINTABLE_KEYPRESSES[$event.keyCode];

       if (translatedKeyCode === undefined)
         return modifiers + $event.key;
       else return modifiers + translatedKeyCode;
     }

     /**
      * Keydown events occur before anything else (input capture,
      * browser keybind execution, etc) This is the best place to do
      * any bespoke keybinds but care needs to be taken to ensure that
      * those keybinds don't wreck standard HTML elements (such as
      * input)
      */
     $scope.bodyKeydownHandler = ($event) => {
       if ($event.target.tagName.toLowerCase() === "input")
         return;

       const keypressIdentifier = eventToKeybindKey($event);
       const commandIdentifier = keybinds[keypressIdentifier];

       if (commandIdentifier !== undefined) {
         $scope.exec(commandIdentifier, $scope.commands);
         $event.stopPropagation();
         $event.preventDefault();
       }

       // Prevent the backspace key from navigating back. This must be
       // handled in the keyDown handler because IE11 will navigate
       // backwards in its history before the keyPress handler gets a
       // chance to call.
       if ($event.keyCode === 8) {
         const currentValue = $scope.currentValue;
         const len = currentValue.length;

         $scope.currentValue = currentValue.substring(0, len - 1);
         $scope.setValueOfSelectedWells();
         $event.stopPropagation();
         $event.preventDefault();
       }
     };

     /**
      * Handles keypresses that have be bubbled all the way
      * upto the body.
      */
     $scope.bodyKeypressHandler = ($event) => {
       const key = eventToKeybindKey($event);

       // Key combinations are handled here, because combinations such as
       // C-a are two separate *key-downs* and one combined *keypress*
       const keypress = eventToKeybindKey($event);
       const command = keybinds[keypress];

       const inputIsFocused =
         document.activeElement.tagName.toLowerCase() === "input";

       if (inputIsFocused) {
         return;
       } else if ($event.which !== 0 && !$event.ctrlKey) {
         // The current focus could be a button, pressing a key while
         // focused on a button can result in navigation.
         if (document.activeElement.blur !== undefined) // In IE11, some elements don't have a .blur
           document.activeElement.blur();

         const charCode = $event.charCode;
         const char = String.fromCharCode(charCode);
         $scope.currentValue += char;
         $scope.setValueOfSelectedWells();
         $event.stopPropagation();
         $event.preventDefault();
       }
       // Else, let it bubble up to the browser.
     };

     const sourcesWithClickHandlers =
        ["button", "input", "td", "th", "circle", "text", "circle", "option", "select"];

     /**
      * Handles clicks that have bubbled all the way upto the body.
      */
     $scope.bodyClickEventHandler = function($event) {
       const sourceElement = $event.target.tagName.toLowerCase();
       const sourceHandled =
        sourcesWithClickHandlers.indexOf(sourceElement) !== -1;

       if (sourceHandled) return;
       else $scope.exec("(clear-row-selection)", $scope.commands);
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

     function shuffle(a) {
       var j, x, i;
       for (i = a.length; i; i--) {
         j = Math.floor(Math.random() * i);
         x = a[i - 1];
         a[i - 1] = a[j];
         a[j] = x;
       }

       return a;
     }
   }]);
