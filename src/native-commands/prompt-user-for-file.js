/**
 * A native command that prompts a user to select
 */
class PromptUserForFile extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "prompt-user-for-file";
    this.title = "Prompt User for File";
    this.description = "Prompt a user to browse for a file on their local filesystem";
    this._promptUserForFile = primativeCommands.promptUserForFile;
  }

  execute(mimeTypes = "") {
    return this._promptUserForFile(mimeTypes);
  }
}