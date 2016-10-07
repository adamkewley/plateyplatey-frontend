/**
 * A command that clears the values in the current selection.
 */
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