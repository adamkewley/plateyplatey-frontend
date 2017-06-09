import {BehaviorSubject, Observable} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class MoveSelectedColumnLeftCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "move-selected-column-left";
  title = "Move Selected Column Left";
  description: "Move the currently selected column left.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);

    currentDocument
        .map(maybeDocument => {
          if (maybeDocument === null)
            return Observable.of({ isDisabled: true, reason: "No document open" });
          else {

            const calculateDisabledState = () => {
              const allColumns = maybeDocument.getColumnIds();
              const selectedColumn = maybeDocument.getSelectedColumnId();

              if (selectedColumn === null) {
                return { isDisabled: true, reason: "No column selected." };
              } else if(allColumns.indexOf(selectedColumn) === 0) {
                return { isDisabled: true, reason: "Column is as left as it can go." };
              } else {
                return { isDisabled: false };
              }
            };

            const ret = new BehaviorSubject(calculateDisabledState());
            maybeDocument.afterColumnSelectionChanged.subscribe(_ => ret.next(calculateDisabledState()));
            maybeDocument.afterColumnMoved.subscribe(_ => ret.next(calculateDisabledState()));

            return ret;
          }
        })
        .switch()
        .subscribe(disabledState => this.disabledSubject.next(disabledState));
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const selectedColumn = currentDocument.getSelectedColumnId();

      if (selectedColumn !== null) {
        const allColumns = currentDocument.getColumnIds();
        const oldIndex = allColumns.indexOf(selectedColumn);
        const newIndex = oldIndex - 1;

        currentDocument.moveColumn(selectedColumn, newIndex);
      }
    }
  }
}
