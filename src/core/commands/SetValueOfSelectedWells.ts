import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class SetValueOfSelectedWells implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "set-value-of-selected-wells";
  title = "Set value of selected wells";
  description = "Sets the value of the currently selected wells.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
    this._currentDocument = currentDocument;
  }

  execute(newValue: string) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const selectedColumn = currentDocument.getSelectedColumnId();
      const selectedRows = currentDocument.getSelectedRowIds();

      if (selectedColumn !== null && selectedRows.length > 0) {
        currentDocument.assignValueToCells(selectedColumn, selectedRows, newValue);
      }
    }
  }
}
