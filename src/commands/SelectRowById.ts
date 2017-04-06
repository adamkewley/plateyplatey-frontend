import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class SelectRowById implements Command {

  id: string;
  title: string;
  description: string;
  _primativeCommands: any;

  constructor(primativeCommands: any) {
    this.id = "select-row-by-id";
    this.title = "Select Row";
    this.description = "Selects a row in the main table.";
    this._primativeCommands = primativeCommands;
  }

  execute(id: string) {
    this._primativeCommands.selectRowsById([id]);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
