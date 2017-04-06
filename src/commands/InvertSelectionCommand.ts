import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class InvertSelectionCommand implements Command {

  _primativeCommands: any;
  id: string;
  title: string;
  description: string;
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(primativeCommands: any, applicationEvents: any) {
    this._primativeCommands = primativeCommands;
    this.id = "invert-selection";
    this.title = "Invert Selection";
    this.description =
      "Invert the current selection, which de-selects anything that is currently selected and selects anything that is not currently selected.";

    this.disabledSubject = new BehaviorSubject(this._calculateDisabled());
    const callback = () => this.disabledSubject.next(this._calculateDisabled());

    applicationEvents.subscribeTo("after-row-selection-changed", callback);
  }

  _calculateDisabled() {
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

  execute() {
    const allRows = this._primativeCommands.getRowIds();
    const selectedRows = this._primativeCommands.getSelectedRowIds();
    const notSelectedRows = allRows.filter((rowId: string) => selectedRows.indexOf(rowId) === -1);

    this._primativeCommands.selectRowsById(notSelectedRows);
    this._primativeCommands.deSelectRowsById(selectedRows);
  }
}
