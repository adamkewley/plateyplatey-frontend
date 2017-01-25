class HoverOverRow {

  constructor(primativeCommands) {
    this.id = "hover-over-row";
    this.title = "Hover over row";
    this.description = "Hover over a row in the data.";
    this._primativeCommands = primativeCommands;
  }

  execute(well) {
    this._primativeCommands.hoverOverWell(well);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}