import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull} from "../helpers";

export class MoveRowFocusDownCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "move-row-focus-down";
  title = "Move Row Focus Down";
  description = "Focus the row immediately beneath the currently focused row.";
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

        if (focusedRowId !== null && focusedRowIdx !== (allRowIds.length - 1)) {
          const rowIdToFocus = allRowIds[focusedRowIdx + 1];

          currentDocument.focusRow(rowIdToFocus);
        }
      }
    }
  }
}
