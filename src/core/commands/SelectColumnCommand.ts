import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class SelectColumnCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "select-column";
  title = "Select Column";
  description = "Select a column in the table.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute(columnId: string) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      currentDocument.selectColumn(columnId);
    }
  }
}
