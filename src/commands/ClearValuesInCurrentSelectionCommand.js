import Rx from "lib/rxjs/Rx";

export default class ClearValuesInCurrentSelectionCommand {

  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "clear-values-in-current-selection";
    this.title = "Clear Values in Current Selection";
    this.description = "Clear the values within the current selection.";
  }

  execute(e) {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const selectedRows = this._primativeCommands.getSelectedRowIds();

    if (selectedColumn !== null && selectedRows.length > 0) {
      this._primativeCommands.assignValueToCells(selectedColumn, selectedRows, null);
    }
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
