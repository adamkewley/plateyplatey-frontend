import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class PromptUserForFilesCommand implements Command {

  id: string;
  title: string;
  description: string;
  _promptUserForFiles: (mimeTypes: string) => any;

  constructor(primativeCommands: any) {
    this.id = "prompt-user-for-files";
    this.title = "Prompt User for Files";
    this.description = "Prompt a user to browse for file(s) on their local filesystem";
    this._promptUserForFiles = primativeCommands.promptUserForFiles;
  }

  execute(mimeTypes = "") {
    return this._promptUserForFiles(mimeTypes);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
