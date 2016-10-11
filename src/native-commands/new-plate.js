/**
 * A native command that creates a new plate.
 */
class NewPlateCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "new-plate";
    this.title = "New Plate";
    this.description = "Create a new plate.";
    this._newDocument = primativeCommands.newDocument;
  }

  execute() {
    this._newDocument();
  }
}