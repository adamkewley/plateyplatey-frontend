import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class SelectRowById implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "select-row-by-id";
  title = "Select Row";
  description = "Selects a row in the main table.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
    this._currentDocument = currentDocument;
  }

  execute(id: string) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null)
      currentDocument.selectRowsById([id]);
  }
}
