import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class MoveColumnSelectionRightCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "move-column-selection-right";
  title = "Move Column Selection Right";
  description = "Select the column right of the currently selected column.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const currentColumnSelection = currentDocument.getSelectedColumnId();

      if (currentColumnSelection !== null) {
        const columns = currentDocument.getColumnIds();
        const selectionIndex = columns.indexOf(currentColumnSelection);

        if (currentColumnSelection !== null && selectionIndex !== (columns.length - 1)) {
          const newColumnSelection = columns[selectionIndex + 1];
          currentDocument.selectColumn(newColumnSelection);
        }
      }
    }
  }
}
