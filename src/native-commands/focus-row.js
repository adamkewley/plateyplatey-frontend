/**
 * Focus on a row (usually, initiated by clicking)
 */
class FocusRow extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "focus-row";
    this.title = "Focus Row";
    this.description = "Focus on a row";
    this._primativeCommands = primativeCommands;
  }

  execute(id) {
    this._primativeCommands.focusRow(id);
  }
}