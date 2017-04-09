import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class InvertSelectionCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "invert-selection";
  title = "Invert Selection";
  description = "Invert the current selection, which de-selects anything that is currently selected and selects anything that is not currently selected.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);

    /* TODO: Reimplement
    this.disabledSubject = new BehaviorSubject(this._calculateDisabled());
    const callback = () => this.disabledSubject.next(this._calculateDisabled());
    applicationEvents.subscribeTo("after-row-selection-changed", callback);
    */
  }

  /* TODO: Reimplement
  _calculateDisabled() {
    if (this._currentDocument.getValue() == null)
    const selectedRows = this._primativeCommands.getSelectedRowIds();

    if (selectedRows.length > 0) {
      return { isDisabled: false };
    } else {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "Nothing currently selected.",
      };
    }
  }
  */

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const allRows = currentDocument.getRowIds();
      const selectedRows = currentDocument.getSelectedRowIds();
      const notSelectedRows = allRows.filter((rowId: string) => selectedRows.indexOf(rowId) === -1);

      currentDocument.selectRowsById(notSelectedRows);
      currentDocument.deSelectRowsById(selectedRows);
    }
  }
}
