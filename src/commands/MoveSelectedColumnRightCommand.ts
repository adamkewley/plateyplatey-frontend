import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull} from "../helpers";

export class MoveSelectedColumnRightCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "move-selected-column-right";
  title = "Move Selected Column Right";
  description = "Move the currently selected column right.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = disabledIfNull(currentDocument);

    /* TODO: Implement
    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
    */
  }

  /* TODO: Implement
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
  */

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const selectedColumn = currentDocument.getSelectedColumnId();

      if (selectedColumn !== null) {
        const allColumns = currentDocument.getColumnIds();
        const oldIndex = allColumns.indexOf(selectedColumn);
        const newIndex = oldIndex + 1;

        currentDocument.moveColumn(selectedColumn, newIndex);
      }
    }
  }
}
