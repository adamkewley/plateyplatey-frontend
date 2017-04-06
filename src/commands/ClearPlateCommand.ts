import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class ClearPlateCommand implements Command {

  id: string = "clear-plate";
  title: string = "Clear Plate";
  description: string = "Clear the plate of data, leaving the columns intact.";
  disabledSubject: BehaviorSubject<DisabledMessage> =
      new BehaviorSubject({ isDisabled: false });
  _primativeCommands: any;

  constructor(primativeCommands: any) {
    this._primativeCommands = primativeCommands;
  }

  execute() {
    const columnIds = this._primativeCommands.getColumnIds();
    columnIds.forEach((columnId: any) => this._primativeCommands.clearDataInColumn(columnId));
  }
}
