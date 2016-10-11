/**
 * Select a row by ID
 */
class SelectRowsById extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "select-rows-by-id";
    this.title = "Select Rows";
    this.description = "Select rows in the main table.";
    this._primativeCommands = primativeCommands;
  }

  execute(ids) {
    this._primativeCommands.selectRowsById(ids);
  }
}