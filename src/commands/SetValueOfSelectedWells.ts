import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class SetValueOfSelectedWells implements Command {

  id: string;
  title: string;
  description: string;
  _primativeCommands: any;

  constructor(primativeCommands: any) {
    this.id = "set-value-of-selected-wells";
    this.title = "Set value of selected wells";
    this.description = "Sets the value of the currently selected wells.";
    this._primativeCommands = primativeCommands;
  }

  execute(newValue: string) {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();
    const selectedRows = this._primativeCommands.getSelectedRowIds();

    if (selectedColumn !== null && selectedRows.length > 0) {
      this._primativeCommands.assignValueToCells(selectedColumn, selectedRows, newValue);
    }
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false});
  }
}
