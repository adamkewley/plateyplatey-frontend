import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class RemoveColumnCommand implements Command {

  id: string;
  title: string;
  description: string;
  _removeColumn: (columnId: string) => void;

  constructor(primativeCommands: any) {
    this._removeColumn = primativeCommands.removeColumn;
    this.id = "remove-column";
    this.title = "Remove Column";
    this.description = "Remove a column, identified by its ID, from the table";
  }

  execute(columnId: string) {
    this._removeColumn(columnId);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
