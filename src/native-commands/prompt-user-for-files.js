/**
 * A native command that prompts a user to select
 */
class PromptUserForFiles extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this.id = "prompt-user-for-files";
    this.title = "Prompt User for Files";
    this.description = "Prompt a user to browse for file(s) on their local filesystem";
    this._promptUserForFiles = primativeCommands.promptUserForFiles;
  }

  execute(mimeTypes = "") {
    return this._promptUserForFiles(mimeTypes);
  }
}