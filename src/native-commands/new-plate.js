class NewPlateCommand {
  constructor(scope) {
    this.id = "new-plate";
    this.title = "New Plate";
    this.description = "Create a new plate";
    this.isAlwaysEnabled = true;
    this._scope = scope;
  }

  execute(e) {
    const scope = this._scope;

    scope.columns = [];
    scope.selectedColumn = null;
    scope.currentValue = "";
    scope.clickedWell = null;
  }
}