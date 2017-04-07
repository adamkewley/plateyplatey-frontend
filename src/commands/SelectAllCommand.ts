import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull} from "../helpers";

export class SelectAllCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "select-all";
  title = "Select All";
  description = "Select all rows in the current column.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = disabledIfNull(currentDocument);

  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const allRowIds = currentDocument.getRowIds();

      currentDocument.selectRowsById(allRowIds);
    }
  }
}
