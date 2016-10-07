/**
 * The object that is passed via the .disabledSubject whenever the
 * disabled state of a command changes.
 * @typedef {Object} DisabledChangedEventArgs
 * @property {boolean} isDisabled
 * @property {boolean} hasReason
 * @property {string} reason
 */

/**
 * A command that can be bound to by the UI or keybinds.
 * @typedef {Object} Command
 * @property {CommandId} id - The unique ID of the command.
 * @property {string} title - A user-friendly title for the command.
 * @property {string} description - A description of the command.
 * @property {Rx.BehaviorSubject.<DisabledChangedEventArgs>} disabledSubject - A subject representing the current disabled state of the command.
 * @property {Function} execute - The function for executing the command.
 */

/**
 * Describes a command that the UI can bind to.
 */
angular
.module("plateyCommand", [])
.directive("plateyCommand", function() {

  function link(scope, element, attrs) {
    const el = element[0];
    const commandId = attrs.plateyCommand;
    const commandDetails = scope.getCommandDetails(commandId);

    const keybinds =
      Object
      .keys(scope.keybinds)
      .filter(key => {
        const keyboundCommandId = scope.keybinds[key];

        return keyboundCommandId === commandId;
      })
      .join(", ");

    const hasKeybinds = keybinds.length > 0;

    commandDetails.disabledSubject.subscribe(e => {
      el.disabled = e.isDisabled;
      el.title = (e.isDisabled && e.hasReason) ? e.reason : commandDetails.description + (hasKeybinds ? " (" + keybinds + ")" : "");
    });

    el.addEventListener("click", (e) => {
      scope.$apply(() => {
        scope.exec(commandId);
      });
    });
  }

  return { link: link };
});