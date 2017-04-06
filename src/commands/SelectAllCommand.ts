import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class SelectAllCommand implements Command {

  id: string;
  title: string;
  description: string;
  _primativeCommands: any;

  constructor(primativeCommands: any) {
    this._primativeCommands = primativeCommands;
    this.id = "select-all";
    this.title = "Select All";
    this.description = "Select all rows in the current column.";
  }

  execute() {
    const allRowIds = this._primativeCommands.getRowIds();

    this._primativeCommands.selectRowsById(allRowIds);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
