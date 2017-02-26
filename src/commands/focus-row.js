import Rx from "lib/rxjs/Rx";

export default class FocusRow {

  constructor(primativeCommands) {
    this.id = "focus-row";
    this.title = "Focus Row";
    this.description = "Focus on a row";
    this._primativeCommands = primativeCommands;
  }

  execute(id, e) {
    if (!e.shiftKey) {
      // clear selection before focusing
      const selectedRowIds = this._primativeCommands.getSelectedRowIds();
      this._primativeCommands.deSelectRowsById(selectedRowIds);
    }

    this._primativeCommands.focusRow(id);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
