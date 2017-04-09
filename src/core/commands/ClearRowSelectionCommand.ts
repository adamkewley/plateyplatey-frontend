import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class ClearRowSelectionCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "clear-row-selection";
  title = "Clear Row Selection";
  description = "Clear the current row selection, leaving the column selection intact.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute() {
    const document = this._currentDocument.getValue();

    if (document !== null) {
      const selectedRows = document.getSelectedRowIds();
      document.deSelectRowsById(selectedRows);
      document.focusRow(null);
    }
  }
}
