import Rx from "rxjs/Rx";

export default class MoveRowFocusDownCommand {

  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "move-row-focus-down";
    this.title = "Move Row Focus Down";
    this.description = "Focus the row immediately beneath the currently focused row.";
  }

  execute(e) {
    if (!e.shiftKey) {
      // clear selection before focusing
      const selectedRowIds = this._primativeCommands.getSelectedRowIds();
      this._primativeCommands.deSelectRowsById(selectedRowIds);
    }

    const focusedRowId = this._primativeCommands.getFocusedRowId();
    const allRowIds = this._primativeCommands.getRowIds();
    const focusedRowIdx = allRowIds.indexOf(focusedRowId);

    if (focusedRowId !== null && focusedRowIdx !== (allRowIds.length - 1)) {
      const rowIdToFocus = allRowIds[focusedRowIdx + 1];

      this._primativeCommands.focusRow(rowIdToFocus);
    }
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
