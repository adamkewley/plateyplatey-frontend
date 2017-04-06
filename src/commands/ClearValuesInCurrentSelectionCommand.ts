import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class ClearValuesInCurrentSelectionCommand implements Command {

  _primativeCommands: any;
  id: string;
  title: string;
  description: string;

  constructor(primativeCommands: any) {
    this._primativeCommands = primativeCommands;
    this.id = "clear-values-in-current-selection";
    this.title = "Clear Values in Current Selection";
    this.description = "Clear the values within the current selection.";
  }

  execute() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const selectedRows = this._primativeCommands.getSelectedRowIds();

    if (selectedColumn !== null && selectedRows.length > 0) {
      this._primativeCommands.assignValueToCells(selectedColumn, selectedRows, null);
    }
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
