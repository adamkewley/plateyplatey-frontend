/**
 * A command that moves the row focus up.
 */
class MoveRowFocusUpCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "move-row-focus-up";
    this.title = "Move Row Focus Up";
    this.description = "Move the row focus up.";
  }

  execute() {
    const focusedRowId = this._primativeCommands.getFocusedRowId();
    const allRowIds = this._primativeCommands.getRowIds();
    const focusedRowIdx = allRowIds.indexOf(focusedRowId);

    if (focusedRowId !== null && focusedRowIdx !== 0) {
      const rowIdToFocus = allRowIds[focusedRowIdx - 1];

      this._primativeCommands.focusRow(rowIdToFocus);
    }
  }
}
