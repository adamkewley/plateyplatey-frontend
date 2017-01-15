class SelectRowsById {

  constructor(primativeCommands) {
    this.id = "select-rows-by-id";
    this.title = "Select Rows";
    this.description = "Select rows in the main table.";
    this._primativeCommands = primativeCommands;
  }

  execute(ids, e) {
    if (!e.shiftKey) {
      // clear selection before focusing
      const selectedRowIds = this._primativeCommands.getSelectedRowIds();
      this._primativeCommands.deSelectRowsById(selectedRowIds);
    }

    this._primativeCommands.selectRowsById(ids);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
