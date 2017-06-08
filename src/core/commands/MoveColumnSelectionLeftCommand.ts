import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class MoveColumnSelectionLeftCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "move-column-selection-left";
  title = "Move Column Selection Left";
  description = "Move the column selection left";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.id = "move-column-selection-left";
    this.title = "Move Column Selection Left";
    this.description = "Move the column selection left";
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const currentColumnSelection = currentDocument.getSelectedColumnId();

      if (currentColumnSelection !== null) {
        const columns = currentDocument.getColumnIds();
        const selectionIndex = columns.indexOf(currentColumnSelection);

        if (currentColumnSelection !== null && selectionIndex !== 0) {
          const newColumnSelection = columns[selectionIndex - 1];
          currentDocument.selectColumn(newColumnSelection);
        }
      }
    }
  }
}
