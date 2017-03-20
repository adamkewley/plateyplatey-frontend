import Rx from "lib/rxjs/Rx";

export default class MoveRowFocusUpCommand {

  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "move-row-focus-up";
    this.title = "Move Row Focus Up";
    this.description = "Move the row focus up.";
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

    if (focusedRowId !== null && focusedRowIdx !== 0) {
      const rowIdToFocus = allRowIds[focusedRowIdx - 1];

      this._primativeCommands.focusRow(rowIdToFocus);
    }
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
