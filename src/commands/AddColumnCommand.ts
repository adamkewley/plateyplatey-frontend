import {Command} from "./Command";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {DisabledMessage} from "./DisabledMessage";

export class AddColumnCommand implements Command {

  _addColumn: () => void;
  id: string = "add-column";
  title: string = "Add Column";
  description: string = "Add a column to the table";
  disabledSubject: BehaviorSubject<DisabledMessage> =
      new BehaviorSubject({ isDisabled: false });

  constructor(primativeCommands: any) {
    this._addColumn = primativeCommands.addColumn;
  }

  execute() {
    this._addColumn();
  }
}
