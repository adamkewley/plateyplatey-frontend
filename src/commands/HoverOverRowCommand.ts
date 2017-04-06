import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class HoverOverRowCommand implements Command {

  _primativeCommands: any;
  id: string;
  title: string;
  description: string;

  constructor(primativeCommands: any) {
    this.id = "hover-over-row";
    this.title = "Hover over row";
    this.description = "Hover over a row in the data.";
    this._primativeCommands = primativeCommands;
  }

  execute(well: any) {
    this._primativeCommands.hoverOverWell(well);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
