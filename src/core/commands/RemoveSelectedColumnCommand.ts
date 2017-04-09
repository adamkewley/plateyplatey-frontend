import {BehaviorSubject} from "rxjs/Rx";
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

    /* TODO: Implement
    const updateCallback = () => this.disabledSubject.next(this._calculateDisabled());

    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
    */
  }

  /* TODO: Implement
  _calculateDisabled() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();

    if (selectedColumn === null) {
      return {
        isDisabled: true,
        hasReason: true,
        reason: "No column currently selected."
      };
    } else {
      return { isDisabled: false };
    }
  }
  */

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const selectedColumn = currentDocument.getSelectedColumnId();

      if (selectedColumn !== null)
        currentDocument.removeColumn(selectedColumn);
    }
  }
}
