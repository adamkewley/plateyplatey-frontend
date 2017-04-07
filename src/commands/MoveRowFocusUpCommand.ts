import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull} from "../helpers";

export class MoveRowFocusUpCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "move-row-focus-up";
  title = "Move Row Focus Up";
  description = "Move the row focus up.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = disabledIfNull(currentDocument);
  }

  execute(e: KeyboardEvent) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      if (!e.shiftKey) {
        // clear selection before focusing
        const selectedRowIds = currentDocument.getSelectedRowIds();
        currentDocument.deSelectRowsById(selectedRowIds);
      }

      const focusedRowId = currentDocument.getFocusedRowId();

      if (focusedRowId !== null) {
        const allRowIds = currentDocument.getRowIds();
        const focusedRowIdx = allRowIds.indexOf(focusedRowId);

        if (focusedRowId !== null && focusedRowIdx !== 0) {
          const rowIdToFocus = allRowIds[focusedRowIdx - 1];

          currentDocument.focusRow(rowIdToFocus);
        }
      }
    }
  }
}
