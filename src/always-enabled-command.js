/**
 * Abstract mixin for commands that are always enabled.
 */
class AlwaysEnabledCommand {
  constructor() {}

  get disabledSubject() {
    return AlwaysEnabledCommand.sharedDisabledAgent;
  }
}

AlwaysEnabledCommand.sharedDisabledAgent = new Rx.BehaviorSubject(false);