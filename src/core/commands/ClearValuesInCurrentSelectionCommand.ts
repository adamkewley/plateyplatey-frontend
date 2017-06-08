import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class ClearValuesInCurrentSelectionCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "clear-values-in-current-selection";
  title = "Clear Values in Current Selection";
  description = "Clear the values within the current selection.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const selectedColumn = currentDocument.getSelectedColumnId();
      const selectedRows = currentDocument.getSelectedRowIds();

      if (selectedColumn !== null && selectedRows.length > 0) {
        currentDocument.assignValueToCells(selectedColumn, selectedRows, "");
      }
    }
  }
}
