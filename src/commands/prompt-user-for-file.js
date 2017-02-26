import Rx from "lib/rxjs/Rx";

export default class PromptUserForFile {

  constructor(primativeCommands) {
    this.id = "prompt-user-for-file";
    this.title = "Prompt User for File";
    this.description = "Prompt a user to browse for a file on their local filesystem";
    this._promptUserForFile = primativeCommands.promptUserForFile;
  }

  execute(mimeTypes = "") {
    return this._promptUserForFile(mimeTypes);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
