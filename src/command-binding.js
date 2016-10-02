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
 * An example native command implementation.
 */
class ExampleCommand {
  constructor(scope) {
    // Hook into the scope etc.

    this._id = "clear-plate";
    this._title = "Clear Plate";
    this._description = "Clear the plate of data, leaving the columns intact.";
    this._disabledSubject =
      new Rx.BehaviorSubject({ isDisabled: false, hasReason: true, reason: "Fuck you" });
  }

  /**
   * The unique ID of the command.
   */
  get id () { return this._id; }

  /**
   * The user-friendly title of the command.
   */
  get title () { return this._title; }

  get description() { return this._description; }

  /**
   * The current disabled state of the command.
   * {Rx.BehaviorSubject.<false|true|string>}
   */
  get disabledSubject() { return this._disabledSubject; }

  /**
   * Execute the command.
   * @param {Event} e The event that triggered the command.
   */
  execute() {
    alert("hello world");
  }
}

const exampleCommand = new ExampleCommand(null);

/**
 * Describes a command that the UI can bind to.
 */
angular
.module("plateyCommand", [])
.directive("plateyCommand", function() {

  function link(scope, element, attrs) {
    const el = element[0];

    // TODO: this command is just here to test the idea
    const command = exampleCommand;

    command.disabledSubject.subscribe(e => {
      el.disabled = e.isDisabled;
      el.title = (e.isDisabled && e.hasReason) ? e.reason : command.description;
    });

    el.addEventListener("click", (e) => {
      scope.$apply(() => command.execute(e));
    });
  }

  return { link: link };
});