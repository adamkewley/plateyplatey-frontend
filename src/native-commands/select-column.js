/**
 * A native command that selects a column.
 */
class SelectColumn extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "select-column";
    this.title = "Select Column";
    this.description = "Select a column in the table.";
    this._primativeCommands = primativeCommands;
  }

  execute(columnId) {
    this._primativeCommands.selectColumn(columnId);
  }
}