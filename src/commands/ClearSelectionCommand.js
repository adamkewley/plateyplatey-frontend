import Rx from "lib/rxjs/Rx";

export default class ClearSelectionCommand {

  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "clear-selection";
    this.title = "Clear Selection";
    this.description = "Clear the current row and column selection.";
  }

  execute() {
    this._primativeCommands.selectColumn(null);

    const selectedRowIds = this._primativeCommands.getSelectedRowIds();

    this._primativeCommands.deSelectRowsById(selectedRowIds);

    this._primativeCommands.focusRow(null);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
