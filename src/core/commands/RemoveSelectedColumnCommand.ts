import {BehaviorSubject, Observable} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class RemoveSelectedColumnCommand implements Command {
  private _currentDocument: BehaviorSubject<PlateyDocument | null>;

  id = "remove-selected-column";
  title = "Remove selected column";
  description = "Remove the currently selected column";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);

    currentDocument.map(maybeDocument => {
      if (maybeDocument === null) {
        return Observable.of({ isDisabled: true, reason: "No document open" });
      } else {
        const calculateDisabledState = () => {
          const columnId = maybeDocument.getSelectedColumnId();

          if (columnId === null) {
            return { isDisabled: true, reason: "No column selected" };
          } else {
            return { isDisabled: false };
          }
        };

        const ret = new BehaviorSubject(calculateDisabledState());
        maybeDocument.afterColumnSelectionChanged.subscribe(_ => ret.next(calculateDisabledState()));
        maybeDocument.afterColumnRemoved.subscribe(_ => ret.next(calculateDisabledState()));
        return ret;
      }
    }).switch().subscribe(disabledState => this.disabledSubject.next(disabledState));
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const selectedColumn = currentDocument.getSelectedColumnId();

      if (selectedColumn !== null)
        currentDocument.removeColumn(selectedColumn);
    }
  }
}
