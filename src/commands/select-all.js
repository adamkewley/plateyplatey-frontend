class SelectAllCommand {

  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "select-all";
    this.title = "Select All";
    this.description = "Select all rows in the current column.";
  }

  execute() {
    const allRowIds = this._primativeCommands.getRowIds();

    this._primativeCommands.selectRowsById(allRowIds);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
