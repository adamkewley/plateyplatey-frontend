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
  exec(expr, ...scopes) {
    plateyEval(expr, ...scopes);
    this._onAfterExec.onNext(expr);
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