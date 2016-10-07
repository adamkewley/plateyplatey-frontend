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
