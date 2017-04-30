import {BehaviorSubject, Observable} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";

export class InvertSelectionCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "invert-selection";
  title = "Invert Selection";
  description = "Invert the current selection, which de-selects anything that is currently selected and selects anything that is not currently selected.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = new BehaviorSubject({ isDisabled: true, reason: "Not yet initialized" });

    currentDocument
        .map(maybeDocument => {
          if (maybeDocument === null)
            return Observable.of({ isDisabled: true, reason: "No document open" });
          else {
            const calculateDisabledState = () => {
              if (maybeDocument.getSelectedRowIds().length === 0)
                return {isDisabled: true, reason: "Nothing selected "};
              else return {isDisabled: false};
            };

            const ret = new BehaviorSubject(calculateDisabledState());
            maybeDocument.afterRowSelectionChanged.subscribe(_ => ret.next(calculateDisabledState()));

            return ret;
          }
        })
        .switch()
        .subscribe(disabledState => this.disabledSubject.next(disabledState));
  }

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
