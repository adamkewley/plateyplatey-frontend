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
