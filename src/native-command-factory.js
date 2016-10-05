/**
 * Abstract mixin for commands that are always enabled.
 */
class AlwaysEnabledCommand {
  constructor() {}

  get disabledSubject() {
    return AlwaysEnabledCommand.sharedDisabledAgent;
  }
}

AlwaysEnabledCommand.sharedDisabledAgent = new Rx.BehaviorSubject(false);

/**
 * A native command that creates a new plate.
 */
class NewPlateCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "new-plate";
    this.title = "New Plate";
    this.description = "Create a new plate.";
    this._newDocument = primativeCommands.newDocument;
  }

  execute() {
    this._newDocument();
  }
}

/**
 * A native command that clears data from the plate.
 */
class ClearPlateCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "clear-plate";
    this.title = "Clear Plate";
    this.description = "Clear the plate of data, leaving the columns intact.";
    this._primativeCommands = primativeCommands;
  }

  execute() {
    const columnIds = this._primativeCommands.getColumnIds();
    columnIds.forEach(columnId => this._primativeCommands.clearDataInColumn(columnId));
  }
}

/**
 * A native command that inverts the selection in the plate.
 */
class InvertSelectionCommand {
  constructor(primativeCommands, applicationEvents) {
    this._primativeCommands = primativeCommands;
    this.id = "invert-selection";
    this.title = "Invert Selection";
    this.description =
      "Invert the current selection, which de-selects anything that is currently selected and selects anything that is not currently selected.";

    this.disabledSubject = new Rx.BehaviorSubject(this._calculateDisabled());
    const callback = () => this.disabledSubject.onNext(this._calculateDisabled());

    applicationEvents.subscribeTo("after-row-selection-changed", callback);
  }

  _calculateDisabled() {
    const selectedRows = this._primativeCommands.getSelectedRowIds();

    if (selectedRows.length > 0) {
      return { disabled: false };
    } else {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "Nothing currently selected.",
      };
    }
  }

  execute() {
    const allRows = this._primativeCommands.getRowIds();
    const selectedRows = this._primativeCommands.getSelectedRowIds();
    const notSelectedRows = allRows.filter(rowId => selectedRows.indexOf(rowId) === -1);

    this._primativeCommands.selectRowsById(notSelectedRows);
    this._primativeCommands.deSelectRowsById(selectedRows);
  }
}

/**
 * A native command that moves the column selection left.
 */
class MoveSelectedColumnLeftCommand {
  constructor(primativeCommands, applicationEvents) {
    this._primativeCommands = primativeCommands;
    this.id = "move-selected-column-left";
    this.title = "Move Selected Column Left";
    this.description = "Move the currently selected column left.";

    this.disabledSubject = new Rx.BehaviorSubject(this._calculateDisabled());

    const updateCallback = () => this.disabledSubject.onNext(this._calculateDisabled());

    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
  }

  _calculateDisabled() {
    const allColumns = this._primativeCommands.getColumnIds();
    const selectedColumn = this._primativeCommands.getSelectedColumnId();

    if (selectedColumn === null) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "No column currently selected."
      };
    }
    else if (allColumns.indexOf(selectedColumn) === 0) {
      return {
        isDisabled: true,
        hasReason:true,
        reason: "Selected column is as leftwards as it can go.",
      };
    }
    else return { isDisabled: false };
  }

  execute() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const allColumns = this._primativeCommands.getColumnIds();
    const oldIndex = allColumns.indexOf(selectedColumn);
    const newIndex = oldIndex - 1;

    this._primativeCommands.moveColumn(selectedColumn, newIndex);
  }
}

/**
 * A native command that moves the column selection right.
 */
class MoveSelectedColumnRightCommand {
  constructor(primativeCommands, applicationEvents) {
    this._primativeCommands = primativeCommands;
    this.id = "move-selected-column-right";
    this.title = "Move Selected Column Right";
    this.description = "Move the currently selected column right.";

    this.disabledSubject = new Rx.BehaviorSubject(this._calculateDisabled());

    const updateCallback = () => this.disabledSubject.onNext(this._calculateDisabled());

    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
  }

  _calculateDisabled() {
    const allColumns = this._primativeCommands.getColumnIds();
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const idx = allColumns.indexOf(selectedColumn);
    const len = allColumns.length;

    if (idx === -1) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "No column currently selected.",
      };
    } else if (idx === (len - 1)) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "Selected column is as rightwards as it can go.",
      };
    } else return { isDisabled: false };
  }

  execute() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const allColumns = this._primativeCommands.getColumnIds();
    const oldIndex = allColumns.indexOf(selectedColumn);
    const newIndex = oldIndex + 1;

    this._primativeCommands.moveColumn(selectedColumn, newIndex);
  }
}

class ExportTableToCSVCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "export-table-to-csv";
    this.title = "Export Table to CSV";
    this.description = "Export the current content of the table as a downloadable CSV file.";
  }

  execute() {
    const primativeCommands = this._primativeCommands;

    const columnIds = primativeCommands.getColumnIds();

    const tableHeaders =
      ["Well ID"].concat(columnIds.map(columnId => primativeCommands.getColumnHeader(columnId)));

    const tableData = primativeCommands.getTableData();

    const entireTable = [tableHeaders].concat(tableData);

    const csvData = Papa.unparse(entireTable);

    primativeCommands.promptUserToSaveData(
      "platey-export.csv",
      "text/csv;charset=utf-8;",
      csvData);
  }
}

class CopyTableToClipboardCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "copy-table-to-clipboard";
    this.title = "Copy Table to Clipboard";
    this.description = "Copy the table to the clipboard as a tab-separated text block.";
  }

  execute() {
    const primativeCommands = this._primativeCommands;
    const columnSeparator = "\t";
    const rowSeparator = "\n";

    const columnIds = primativeCommands.getColumnIds();

    const tableHeaders =
      ["Well ID"].concat(columnIds.map(columnId => primativeCommands.getColumnHeader(columnId)));

    const tableData = primativeCommands.getTableData();

    const entireTable = [tableHeaders].concat(tableData);

    const tsvData = entireTable.map(row => row.join(columnSeparator)).join(rowSeparator);

    primativeCommands.copyTextToClipboard(tsvData);
  }
}

class AddColumnCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._addColumn = primativeCommands.addColumn;
    this.id = "add-column";
    this.title = "Add Column";
    this.description = "Add a column to the table.";
  }

  execute() {
    this._addColumn();
  }
}

/**
 * A command the clears the current row and column selection.
 */
class ClearSelectionCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "clear-selection";
    this.title = "Clear Selection";
    this.description = "Clear the current row and column selection.";
  }

  execute() {
    this._primativeCommands.selectColumn(null);

    const selectedRowIds = this._primativeCommands.getSelectedRowIds();

    this._primativeCommands.deSelectRowsById(selectedRowIds);
  }
}

/**
 * A command that selects all rows in the current column.
 */
class SelectAllCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "select-all";
    this.title = "Select All";
    this.description = "Select all rows in the current column.";
  }

  execute() {
    const allRowIds = this._primativeCommands.getRowIds();

    this._primativeCommands.selectRowsById(allRowIds);
  }
}

/**
 * A command that moves the current column selection left.
 */
class MoveColumnSelectionLeftCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "move-column-selection-left";
    this.title = "Move Column Selection Left";
    this.description = "Move the column selection left";
  }

  execute() {
    const currentColumnSelection = this._primativeCommands.getSelectedColumnId();
    const columns = this._primativeCommands.getColumnIds();
    const selectionIndex = columns.indexOf(currentColumnSelection);

    if (currentColumnSelection !== null && selectionIndex !== 0) {
      const newColumnSelection = columns[selectionIndex - 1];
      this._primativeCommands.selectColumn(newColumnSelection);
    }
  }
}

/**
 * A command that moves the current column selection right.
 */
class MoveColumnSelectionRightCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "move-column-selection-right";
    this.title = "Move Column Selection Right";
    this.description = "Select the column right of the currently selected column.";

    this.isAlwaysEnabled = true;
  }

  execute() {
    const currentColumnSelection = this._primativeCommands.getSelectedColumnId();
    const columns = this._primativeCommands.getColumnIds();
    const selectionIndex = columns.indexOf(currentColumnSelection);

    if (currentColumnSelection !== null && selectionIndex !== (columns.length - 1)) {
      const newColumnSelection = columns[selectionIndex + 1];
      this._primativeCommands.selectColumn(newColumnSelection);
    }
  }
}

/**
 * A command that moves the row focus down.
 */
class MoveRowFocusDownCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "move-row-focus-down";
    this.title = "Move Row Focus Down";
    this.description = "Focus the row immediately beneath the currently focused row.";
  }

  execute() {
    const focusedRowId = this._primativeCommands.getFocusedRowId();
    const allRowIds = this._primativeCommands.getRowIds();
    const focusedRowIdx = allRowIds.indexOf(focusedRowId);

    if (focusedRowId !== null && focusedRowIdx !== (allRowIds.length - 1)) {
      const rowIdToFocus = allRowIds[focusedRowIdx + 1];

      this._primativeCommands.focusRow(rowIdToFocus);
    }
  }
}

/**
 * A command that moves the row focus up.
 */
class MoveRowFocusUpCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "move-row-focus-up";
    this.title = "Move Row Focus Up";
    this.description = "Move the row focus up.";
  }

  execute() {
    const focusedRowId = this._primativeCommands.getFocusedRowId();
    const allRowIds = this._primativeCommands.getRowIds();
    const focusedRowIdx = allRowIds.indexOf(focusedRowId);

    if (focusedRowId !== null && focusedRowIdx !== 0) {
      const rowIdToFocus = allRowIds[focusedRowIdx - 1];

      this._primativeCommands.focusRow(rowIdToFocus);
    }
  }
}

class ClearValuesInCurrentSelectionCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "clear-values-in-current-selection";
    this.title = "Clear Values in Current Selection";
    this.description = "Clear the values within the current selection.";
  }

  execute(e) {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const selectedRows = this._primativeCommands.getSelectedRowIds();

    if (selectedColumn !== null && selectedRows.length > 0) {
      this._primativeCommands.assignValueToCells(selectedColumn, selectedRows, null);
    }
  }
}

class ClearRowSelectionCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "clear-row-selection";
    this.title = "Clear Row Selection";
    this.description = "Clear the current row selection, leaving the column selection intact.";
  }

  execute() {
    const selectedRows = this._primativeCommands.getSelectedRowIds();
    this._primativeCommands.deSelectRowsById(selectedRows);
  }
}

class NativeCommands {
  constructor(primativeCommands, events) {
    const commandClasses = [
      NewPlateCommand,
      ClearPlateCommand,
      InvertSelectionCommand,
      MoveSelectedColumnLeftCommand,
      MoveSelectedColumnRightCommand,
      ExportTableToCSVCommand,
      CopyTableToClipboardCommand,
      AddColumnCommand,
      ClearSelectionCommand,
      SelectAllCommand,
      MoveColumnSelectionLeftCommand,
      MoveColumnSelectionRightCommand,
      MoveRowFocusDownCommand,
      MoveRowFocusUpCommand,
      ClearValuesInCurrentSelectionCommand,
      ClearRowSelectionCommand,
    ];

    this._commands =
      commandClasses.map(CommandClass => new CommandClass(primativeCommands, events));
  }

  getCommandById(id) {
    return this._commands.find(command => command.id === id);
  }
}