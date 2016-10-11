/**
 * A command that moves the row focus down.
 */
class MoveRowFocusDownCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "move-row-focus-down";
    this.title = "Move Row Focus Down";
    this.description = "Focus the row immediately beneath the currently focused row.";
  }

  execute() {
    const focusedRowId = this._primativeCommands.getFocusedRowId();
    const allRowIds = this._primativeCommands.getRowIds();
    const focusedRowIdx = allRowIds.indexOf(focusedRowId);

    if (focusedRowId !== null && focusedRowIdx !== (allRowIds.length - 1)) {
      const rowIdToFocus = allRowIds[focusedRowIdx + 1];

      this._primativeCommands.focusRow(rowIdToFocus);
    }
  }
}
