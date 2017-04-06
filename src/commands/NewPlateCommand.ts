import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class NewPlateCommand implements Command {

  id: string;
  title: string;
  description: string;
  _newDocument: () => void;

  constructor(primativeCommands: any) {

    this.id = "new-plate";
    this.title = "New Plate";
    this.description = "Create a new plate.";
    this._newDocument = primativeCommands.newDocument;
  }

  execute() {
    this._newDocument();
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }

}
