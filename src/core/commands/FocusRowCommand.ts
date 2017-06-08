import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class FocusRowCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "focus-row";
  title = "Focus Row";
  description = "Focus on a row";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute(e: any, id: string) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      if (!e.shiftKey) {
        // clear selection before focusing
        const selectedRowIds = currentDocument.getSelectedRowIds();
        currentDocument.deSelectRowsById(selectedRowIds);
      }

      currentDocument.focusRow(id);
    }
  }
}
