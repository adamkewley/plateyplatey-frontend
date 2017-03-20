import Rx from "lib/rxjs/Rx";

export default class SelectColumnCommand {

  constructor(primativeCommands) {
    this.id = "select-column";
    this.title = "Select Column";
    this.description = "Select a column in the table.";
    this._primativeCommands = primativeCommands;
  }

  execute(columnId) {
    this._primativeCommands.selectColumn(columnId);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
