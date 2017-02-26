import Rx from "rxjs/Rx";

export default class ClearPlateCommand {
  constructor(primativeCommands) {
    this.id = "clear-plate";
    this.title = "Clear Plate";
    this.description = "Clear the plate of data, leaving the columns intact.";
    this._primativeCommands = primativeCommands;
  }

  execute() {
    const columnIds = this._primativeCommands.getColumnIds();
    columnIds.forEach(columnId => this._primativeCommands.clearDataInColumn(columnId));
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}