import Rx from "lib/rxjs/Rx";

export default class MoveSelectedColumnRightCommand {

  constructor(primativeCommands, applicationEvents) {
    this._primativeCommands = primativeCommands;
    this.id = "move-selected-column-right";
    this.title = "Move Selected Column Right";
    this.description = "Move the currently selected column right.";

    this.disabledSubject = new Rx.BehaviorSubject(this._calculateDisabled());

    const updateCallback = () => this.disabledSubject.next(this._calculateDisabled());

    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
  }

  _calculateDisabled() {
    const allColumns = this._primativeCommands.getColumnIds();
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const idx = allColumns.indexOf(selectedColumn);
    const len = allColumns.length;

    if (idx === -1) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "No column currently selected.",
      };
    } else if (idx === (len - 1)) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "Selected column is as rightwards as it can go.",
      };
    } else return { isDisabled: false };
  }

  execute() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const allColumns = this._primativeCommands.getColumnIds();
    const oldIndex = allColumns.indexOf(selectedColumn);
    const newIndex = oldIndex + 1;

    this._primativeCommands.moveColumn(selectedColumn, newIndex);
  }
}