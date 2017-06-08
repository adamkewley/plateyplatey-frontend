import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class ClearPlateCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "clear-plate";
  title = "Clear Plate";
  description = "Clear the plate of data, leaving the columns intact.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const columnIds = currentDocument.getColumnIds();
      columnIds.forEach((columnId: any) => currentDocument.clearDataInColumn(columnId));
    }
  }
}
