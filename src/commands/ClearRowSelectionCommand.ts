import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class ClearRowSelectionCommand implements Command {

  _primativeCommands: any;
  id: string = "clear-row-selection";
  title: string = "Clear Row Selection";
  description: string = "Clear the current row selection, leaving the column selection intact.";
  disabledSubject: BehaviorSubject<DisabledMessage> =
      new BehaviorSubject({ isDisabled: false });

  constructor(primativeCommands: any) {
    this._primativeCommands = primativeCommands;
    this.id = "clear-row-selection";
    this.title = "Clear Row Selection";
    this.description = "Clear the current row selection, leaving the column selection intact.";
  }

  execute() {
    const selectedRows = this._primativeCommands.getSelectedRowIds();
    this._primativeCommands.deSelectRowsById(selectedRows);
    this._primativeCommands.focusRow(null);
  }
}
