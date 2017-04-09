import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {Helpers} from "../../Helpers";

export class PromptUserForFilesCommand implements Command {

  id = "prompt-user-for-files";
  title = "Prompt User for Files";
  description = "Prompt a user to browse for file(s) on their local filesystem";
  disabledSubject = new BehaviorSubject<DisabledMessage>({ isDisabled: false });

  constructor() {}

  execute(mimeTypes = "") {
    return Helpers.promptUserForFiles(mimeTypes);
  }
}
