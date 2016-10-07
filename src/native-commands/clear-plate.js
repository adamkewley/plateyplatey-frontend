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