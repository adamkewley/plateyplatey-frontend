import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class MoveColumnSelectionRightCommand implements Command {

  id: string;
  title: string;
  description: string;
  _primativeCommands: any;

  constructor(primativeCommands: any) {
    this._primativeCommands = primativeCommands;
    this.id = "move-column-selection-right";
    this.title = "Move Column Selection Right";
    this.description = "Select the column right of the currently selected column.";
  }

  execute() {
    const currentColumnSelection = this._primativeCommands.getSelectedColumnId();
    const columns = this._primativeCommands.getColumnIds();
    const selectionIndex = columns.indexOf(currentColumnSelection);

    if (currentColumnSelection !== null && selectionIndex !== (columns.length - 1)) {
      const newColumnSelection = columns[selectionIndex + 1];
      this._primativeCommands.selectColumn(newColumnSelection);
    }
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
