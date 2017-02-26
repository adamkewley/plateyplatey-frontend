import Rx from "lib/rxjs/Rx";

export default class SelectRowsById {

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

    if (ids.length > 0)
      this._primativeCommands.focusRow(ids[0]);

    this._primativeCommands.selectRowsById(ids);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
