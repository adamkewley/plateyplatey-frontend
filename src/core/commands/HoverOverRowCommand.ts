import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class HoverOverRowCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "hover-over-row";
  title = "Hover over row";
  description = "Hover over a row in the data.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute(e: any, well: any) {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      currentDocument.hoverOverWell(well);
    }
  }
}
