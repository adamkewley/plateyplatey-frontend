/**
 * A command that adds a new column onto the end of the table.
 */
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