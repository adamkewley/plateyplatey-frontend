import NativeCommands from "AllCommands";
import { eventToKeybindKey, promptUserToSaveData, copyTextToClipboard, promptUserForFile, promptUserForFiles, readFileAsText } from "helpers";
import { PlateyDocument } from "PlateyDocument";
import { PlateyCommandController } from "PlateyCommandController";

export const plateyController = ["$scope", "plateyAPI", function($scope, plateyAPI) {

    $scope.document = new PlateyDocument();

    $scope.currentValue = "";
    $scope.currentPlateTemplate = null;
    $scope.plateTemplates = [];

    const selectColumn = (columnId) => {
      $scope.document.selectColumn(columnId);
    };

    const newDocument = () => {
      $scope.$broadcast("before-new-document-created", null);

      $scope.document = new PlateyDocument();
    };

    const addColumn = () => {
      return $scope.document.addColumn();
    };

    const addColumnWithId = (id) => {
      return $scope.document.addColumnWithId(id);
    };

    const moveColumn = (columnId, newIndex) => {
      $scope.document.moveColumn(columnId, newIndex);
    };

    const removeColumn = function(columnId) {
      $scope.document.removeColumn(columnId);
    };

    const getSelectedColumnId = () => {
      return $scope.document.getSelectedColumnId();
    };

    const clearDataInColumn = (columnId) => {
      $scope.document.clearDataInColumn(columnId);
    };

    const getColumnIds = () => {
      return $scope.document.getColumnIds();
    };

    const getColumnHeader = (columnId) => {
      return $scope.document.getColumnHeader(columnId);
    };

    const setColumnHeader = (header, columnId) => {
      return $scope.document.setColumnHeader(header, columnId);
    };

    const getRowIds = () => {
      return $scope.document.getRowIds();
    };

    const getSelectedRowIds = () => {
      return $scope.document.getSelectedRowIds();
    };

    const selectRowsById = (rowIds) => {
      return $scope.document.selectRowsById(rowIds);
    };

    const deSelectRowsById = (rowIds) => {
      return $scope.document.deSelectRowsById(rowIds);
    };

    const assignValueToCells = (columnId, rowIds, value) => {
      $scope.document.assignValueToCells(columnId, rowIds, value);
    };

    const getTableData = () => {
      return $scope.document.getTableData();
    };

    const getFocusedRowId = () => {
      return $scope.document.getFocusedRowId();
    };

    const focusRow = (rowId) => {
      $scope.document.focusRow(rowId);
    };

    $scope.hoverOverWell = (well) => {
      $scope.document.hoverOverWell(well.id);
    };

    $scope.unHoverOverWell = (well) => {
      $scope.document.unHoverOverWell(well.id);
    };

    $scope.hoverOverWells = (wells) => {
      $scope.document.hoverOverWells(wells.map(well => well.id));
    };

    $scope.unHoverOverWells = (wells) => {
      $scope.document.unHoverOverWells(wells.map(well => well.id));
    };

    $scope.getFocusedRowId = getFocusedRowId;

    const setPlateLayout = (layout) => {
      // vbox is used by <svg> elements to calculate
      // aspect ratios
      $scope.vbox = `0 0 ${layout.gridWidth} ${layout.gridHeight}`;

      $scope.document.setLayout(layout);
    };

    $scope.loadPlateLayout = (plateTemplate) => {
      $scope.currentPlateTemplate = plateTemplate;

      $scope.$broadcast("before-plate-layout-loaded", plateTemplate);

      plateyAPI.getPlateTemplateByID(plateTemplate.id).then(plateTemplateDetails => {
        $scope.document.setLayout(plateTemplateDetails);
        setPlateLayout(plateTemplateDetails);

        $scope.$broadcast("after-plate-layout-loaded", plateTemplateDetails);
      });
    };

    $scope.changePlateArrangement = (arrangement) => {
      $scope.document.setRowArrangement(arrangement);
    };

    // EVENTS

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
      setColumnHeader: setColumnHeader,
      getTableData: getTableData,
      copyTextToClipboard: copyTextToClipboard,
      getFocusedRowId: getFocusedRowId,
      focusRow: focusRow,
      hoverOverWell: $scope.hoverOverWell, // TODO: Make more generic
      hoverOverWells: $scope.hoverOverWells, // TODO: Make more generic
      unHoverOverWell: $scope.unHoverOverWell, // TODO: Make more generic
      unHoverOverWells: $scope.unHoverOverWells, // TODO: Make more generic
      setPlateLayout: setPlateLayout, // TODO: Make more generic
      promptUserForFiles: promptUserForFiles,
      promptUserForFile: promptUserForFile,
      readFileAsText: readFileAsText,
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
    const commandController = new PlateyCommandController();

    $scope.getCommandDetails = (commandName) => {
      const command = nativeCommands.getCommandById(commandName);

      if (command === undefined) return null;
      else return {
        title: command.title,
        description: command.description,
        disabledSubject: command.disabledSubject,
      };
    };

    $scope.exec = (cmd, ...scopes) => {
      commandController.executePlateyExpression(cmd, ...scopes);
    };

    // for debugging
    commandController.afterExecPlateyExpression.subscribe((cmdName) => console.log(cmdName));

    /**
     * Determines what should be shown as the current value based on
     * what is selected.
     * @returns {String}
     */
    function determineCurrentValueFromSelection() {
      const selectionValues = $scope.document.getSelectionValues();

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

    $scope.setValueOfSelectedWells = function() {
      const selectedColumn = $scope.document.selectedColumn;

      if (selectedColumn !== null) {
        const selectedColumnId = selectedColumn.id;

        $scope.document.getSelectedWells().forEach(selectedWell => {
          selectedWell[selectedColumnId] = $scope.currentValue;
        });
      }
    };

    $scope.noCellsSelected = () => {
      if ($scope.document) {
        return $scope.document.selectedColumn === null ||
          !$scope.document.wells.some(well => well.selected);
      } else return true;
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

    $scope.$on("after-plate-layout-loaded", () => {
      const columnIds = getColumnIds();

      if (columnIds.length === 0) {
        const newColumn = addColumn();
        selectColumn(newColumn);

        const rows = getRowIds();
        const firstRow = rows[0];

        focusRow(firstRow);
      }
    });

    // EMACS-style kbd representation
    let keybinds = {};

    $scope.getKeybindsAssociatedWith = (expr) => {
      return Object.keys(keybinds)
        .filter(key => {
          const keyboundCommandId = keybinds[key];

          return keyboundCommandId === expr;
        });
    };

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
        $scope.exec(commandIdentifier, $scope.commands, { e: $event });
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
     * Handles clicks that have bubbled all the way up to the body.
     */
    $scope.bodyClickEventHandler = function($event) {
      const sourceElement = $event.target.tagName.toLowerCase();
      const sourceHandledByStandardHtmlElement =
              sourcesWithClickHandlers.indexOf(sourceElement) !== -1;

      if (sourceHandledByStandardHtmlElement) return;
      else $scope.exec("(clear-row-selection)", $scope.commands);
    };

    function loadDocument(document) {
      $scope.document = PlateyDocument.fromPlateyDocumentFile(document);
    }

    // INIT
    const configurationPromise = plateyAPI.fetchConfiguration();
    const platesPromise = plateyAPI.getPlateTemplateSummaries();

    Promise
      .all([configurationPromise, platesPromise])
      .then(responses => {
        const configuration = responses[0];
        const plates = responses[1];

        // Try to load default document
        const defaultDocumentId = configuration.defaultDocumentId;

        plateyAPI
          .fetchDocument(defaultDocumentId)
          .then(document => {
            // Initialize plates
            const plateTemplates = plates;
            $scope.plateTemplates = Object.keys(plateTemplates).map(key => plateTemplates[key]);

            const defaultPlateTemplateId = configuration.defaultPlateTemplateId;

            const plateTemplateIdToLoad =
              (defaultPlateTemplateId !== undefined &&
              plateTemplates[defaultPlateTemplateId] !== undefined) ?
                defaultPlateTemplateId :
                Object.keys(plateTemplates)[0];

            const plateTemplate = plateTemplates[plateTemplateIdToLoad];
            $scope.loadPlateLayout(plateTemplate);

            // Initialize keybinds
            if (configuration.keybinds !== undefined) {
              keybinds = configuration.keybinds;
            }

            loadDocument(document);

          });
      });
  }];
