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