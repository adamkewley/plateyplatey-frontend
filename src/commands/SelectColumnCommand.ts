import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class SelectColumnCommand implements Command {

  id: string;
  title: string;
  description: string;
  _primativeCommands: any;

  constructor(primativeCommands: any) {
    this.id = "select-column";
    this.title = "Select Column";
    this.description = "Select a column in the table.";
    this._primativeCommands = primativeCommands;
  }

  execute(columnId: string) {
    this._primativeCommands.selectColumn(columnId);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
