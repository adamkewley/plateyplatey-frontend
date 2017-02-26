import Rx from "lib/rxjs/Rx";

export default class PromptUserForFiles {

  constructor(primativeCommands) {
    this.id = "prompt-user-for-files";
    this.title = "Prompt User for Files";
    this.description = "Prompt a user to browse for file(s) on their local filesystem";
    this._promptUserForFiles = primativeCommands.promptUserForFiles;
  }

  execute(mimeTypes = "") {
    return this._promptUserForFiles(mimeTypes);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
