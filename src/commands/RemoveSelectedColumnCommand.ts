import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class RemoveSelectedColumnCommand implements Command {

  id: string;
  title: string;
  description: string;
  disabledSubject: BehaviorSubject<DisabledMessage>;
  _primativeCommands: any;

  constructor(primativeCommands: any, applicationEvents: any) {
    this._primativeCommands = primativeCommands;
    this.id = "remove-selected-column";
    this.title = "Remove selected column";
    this.description = "Remove the currently selected column";

    this.disabledSubject = new BehaviorSubject<DisabledMessage>(this._calculateDisabled());

    const updateCallback = () => this.disabledSubject.next(this._calculateDisabled());

    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
  }

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

  execute() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();

    this._primativeCommands.removeColumn(selectedColumn);
  }
}
