import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";
import {Well} from "../document/Well";

export class SelectRows implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "select-rows";
  title = "Select Rows";
  description = "Select rows in the main table.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute(e: KeyboardEvent, ...rows: Well[]) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      if (!e.shiftKey) {
        // clear selection before focusing
        const selectedRowIds = currentDocument.getSelectedRowIds();
        currentDocument.deSelectRowsById(selectedRowIds);
      }

      if (rows.length > 0)
        currentDocument.focusRow(rows[0].id);

      currentDocument.selectRows(rows);
    }
  }
}
