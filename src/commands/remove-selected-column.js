import Rx from "rxjs/Rx";

export default class RemoveSelectedColumnCommand {

  constructor(primativeCommands, applicationEvents) {
    this._primativeCommands = primativeCommands;
    this.id = "remove-selected-column";
    this.title = "Remove selected column";
    this.description = "Remove the currently selected column";

    this.disabledSubject = new Rx.BehaviorSubject(this._calculateDisabled());

    const updateCallback = () => this.disabledSubject.onNext(this._calculateDisabled());

    applicationEvents.subscribeTo("after-column-selection-changed", updateCallback);
    applicationEvents.subscribeTo("after-table-columns-changed", updateCallback);
  }

  _calculateDisabled() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();

    if (selectedColumn === null) {
      return {
	isDisabled: true,
	hasReason: true,
	reason: "No column currently selected."
      };
    } else {
      return { isDisabled: false };
    }
  }

  execute() {
    const selectedColumn = this._primativeCommands.getSelectedColumnId();

    this._primativeCommands.removeColumn(selectedColumn);
  }
}
