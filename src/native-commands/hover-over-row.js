/**
 * A native command that hovers over a row
 */
class HoverOverRow extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "hover-over-row";
    this.title = "Hover over row";
    this.description = "Hover over a row in the data.";
    this._primativeCommands = primativeCommands;
  }

  execute(well) {
    this._primativeCommands.hoverOverWell(well);
  }
}