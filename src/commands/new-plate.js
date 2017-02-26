import Rx from "lib/rxjs/Rx";

export default class NewPlateCommand {

  constructor(primativeCommands) {
    this.id = "new-plate";
    this.title = "New Plate";
    this.description = "Create a new plate.";
    this._newDocument = primativeCommands.newDocument;
  }

  execute() {
    this._newDocument();
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }

}
