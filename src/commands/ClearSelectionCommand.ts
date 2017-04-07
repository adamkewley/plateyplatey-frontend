import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull} from "../helpers";

export class ClearSelectionCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "clear-selection";
  title = "Clear Selection";
  description = "Clear the current row and column selection";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      currentDocument.selectColumn(null);

      const selectedRowIds = currentDocument.getSelectedRowIds();
      currentDocument.deSelectRowsById(selectedRowIds);

      currentDocument.focusRow(null);
    }
  }
}
