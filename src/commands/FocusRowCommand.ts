import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class FocusRowCommand implements Command {

  _primativeCommands: any;
  id: string;
  title: string;
  description: string;

  constructor(primativeCommands: any) {
    this.id = "focus-row";
    this.title = "Focus Row";
    this.description = "Focus on a row";
    this._primativeCommands = primativeCommands;
  }

  execute(id: any, e: any) {
    if (!e.shiftKey) {
      // clear selection before focusing
      const selectedRowIds = this._primativeCommands.getSelectedRowIds();
      this._primativeCommands.deSelectRowsById(selectedRowIds);
    }

    this._primativeCommands.focusRow(id);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
