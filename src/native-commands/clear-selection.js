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
