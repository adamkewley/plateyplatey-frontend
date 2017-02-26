import Rx from "rxjs/Rx";

export default class AddColumnCommand {

  constructor(primativeCommands) {
    this._addColumn = primativeCommands.addColumn;
    this.id = "add-column";
    this.title = "Add Column";
    this.description = "Add a column to the table.";
  }

  execute() {
    this._addColumn();
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
