class CommandController {
  /**
   * Construct a command controller.
   */
  constructor(commands) {
    this._commands = commands;
    this._onAfterExec = new Rx.Subject();
  }

  /**
   * Attempt to execute the command string.
   */
  exec(cmd) {
    const command = this._commands.getCommandById(cmd);

    if (command === undefined)
      throw `Failed to exec ${cmd}: does not exist.`;
    else {
      command.execute();
      this._onAfterExec.onNext(cmd);
    }
  }

  /**
   * Get details about the command (description, disabled state, etc.)
   */
  getCommandDetails(cmd) {
    const command = this._commands.getCommandById(cmd);

    if (command === undefined)
      return null;
    else {
      return {
        title: command.title,
        description: command.description,
        disabledSubject: command.disabledSubject
      };
    }
  }

  get onAfterExec() { return this._onAfterExec; }
}