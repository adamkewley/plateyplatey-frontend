import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull} from "../helpers";

export class ClearPlateCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "clear-plate";
  title = "Clear Plate";
  description = "Clear the plate of data, leaving the columns intact.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const columnIds = currentDocument.getColumnIds();
      columnIds.forEach((columnId: any) => currentDocument.clearDataInColumn(columnId));
    }
  }
}
