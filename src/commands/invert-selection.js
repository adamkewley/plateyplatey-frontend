class InvertSelectionCommand {
  constructor(primativeCommands, applicationEvents) {
    this._primativeCommands = primativeCommands;
    this.id = "invert-selection";
    this.title = "Invert Selection";
    this.description =
      "Invert the current selection, which de-selects anything that is currently selected and selects anything that is not currently selected.";

    this.disabledSubject = new Rx.BehaviorSubject(this._calculateDisabled());
    const callback = () => this.disabledSubject.onNext(this._calculateDisabled());

    applicationEvents.subscribeTo("after-row-selection-changed", callback);
  }

  _calculateDisabled() {
    const selectedRows = this._primativeCommands.getSelectedRowIds();

    if (selectedRows.length > 0) {
      return { disabled: false };
    } else {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "Nothing currently selected.",
      };
    }
  }

  execute() {
    const allRows = this._primativeCommands.getRowIds();
    const selectedRows = this._primativeCommands.getSelectedRowIds();
    const notSelectedRows = allRows.filter(rowId => selectedRows.indexOf(rowId) === -1);

    this._primativeCommands.selectRowsById(notSelectedRows);
    this._primativeCommands.deSelectRowsById(selectedRows);
  }
}
