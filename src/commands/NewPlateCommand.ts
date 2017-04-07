import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyApp} from "../PlateyApp";

export class NewPlateCommand implements Command {

  private _app: PlateyApp;
  id = "new-plate";
  title = "New Plate";
  description: "Create a new plate.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(app: PlateyApp) {
    this._app = app;
    this.disabledSubject = new BehaviorSubject({ isDisabled: false });
  }

  execute() {
    this._app.newDocument();
  }
}
