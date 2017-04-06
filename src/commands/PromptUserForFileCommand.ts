import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class PromptUserForFileCommand implements Command {

  id: string;
  title: string;
  description: string;
  _promptUserForFile: (mimeTypes: string) => any;

  constructor(primativeCommands: any) {
    this.id = "prompt-user-for-file";
    this.title = "Prompt User for File";
    this.description = "Prompt a user to browse for a file on their local filesystem";
    this._promptUserForFile = primativeCommands.promptUserForFile;
  }

  execute(mimeTypes = "") {
    return this._promptUserForFile(mimeTypes);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
