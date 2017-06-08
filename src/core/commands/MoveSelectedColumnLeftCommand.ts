import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class MoveSelectedColumnLeftCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "move-selected-column-left";
  title = "Move Selected Column Left";
  description: "Move the currently selected column left.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);

    /* TODO: Implement
    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
    */
  }

  /* TODO: Implement
  _calculateDisabled() {
    const allColumns = this._primativeCommands.getColumnIds();
    const selectedColumn = this._primativeCommands.getSelectedColumnId();

    if (selectedColumn === null) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "No column currently selected."
      };
    }
    else if (allColumns.indexOf(selectedColumn) === 0) {
      return {
        isDisabled: true,
        hasReason:true,
        reason: "Selected column is as leftwards as it can go.",
      };
    }
    else return { isDisabled: false };
  } */

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const selectedColumn = currentDocument.getSelectedColumnId();

      if (selectedColumn !== null) {
        const allColumns = currentDocument.getColumnIds();
        const oldIndex = allColumns.indexOf(selectedColumn);
        const newIndex = oldIndex - 1;

        currentDocument.moveColumn(selectedColumn, newIndex);
      }
    }
  }
}
