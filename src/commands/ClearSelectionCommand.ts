import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class ClearSelectionCommand implements Command {

  _primativeCommands: any;
  id: string;
  title: string;
  description: string;

  constructor(primativeCommands: any) {
    this._primativeCommands = primativeCommands;
    this.id = "clear-selection";
    this.title = "Clear Selection";
    this.description = "Clear the current row and column selection.";
  }

  execute() {
    this._primativeCommands.selectColumn(null);

    const selectedRowIds = this._primativeCommands.getSelectedRowIds();

    this._primativeCommands.deSelectRowsById(selectedRowIds);

    this._primativeCommands.focusRow(null);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
