class RemoveColumnCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._removeColumn = primativeCommands.removeColumn;
    this.id = "remove-column";
    this.title = "Remove Column";
    this.description = "Remove a column, identified by its ID, from the table";
  }

  execute(columnId) {
    this._removeColumn(columnId);
  }
}