import Rx from "lib/rxjs/Rx";

export default class SelectRowById {

  constructor(primativeCommands) {
    this.id = "select-row-by-id";
    this.title = "Select Row";
    this.description = "Selects a row in the main table.";
    this._primativeCommands = primativeCommands;
  }

  execute(id) {
    this._primativeCommands.selectRowsById([id]);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
