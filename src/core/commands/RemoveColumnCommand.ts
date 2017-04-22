import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";

export class RemoveColumnCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "remove-column";
  title = "Remove Column";
  description = "Remove a column, identified by its ID, from the table";
  disabledSubject = new BehaviorSubject<DisabledMessage>({ isDisabled: false });

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
  }

  execute(e: any, columnId: string) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null)
      currentDocument.removeColumn(columnId);
  }
}
