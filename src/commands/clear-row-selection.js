import Rx from "rxjs/Rx";

export default class ClearRowSelectionCommand {
  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "clear-row-selection";
    this.title = "Clear Row Selection";
    this.description = "Clear the current row selection, leaving the column selection intact.";
  }

  execute() {
    const selectedRows = this._primativeCommands.getSelectedRowIds();
    this._primativeCommands.deSelectRowsById(selectedRows);
    this._primativeCommands.focusRow(null);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
