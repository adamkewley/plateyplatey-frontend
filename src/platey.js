class Platey {
  constructor(wells, options = {}) {
    if(wells === undefined)
      throw "Platey: No wells provided to constructor. An array containing well definitions must be provided";

    if(!wells instanceof Array)
      throw "Platey: Invalid wells type provided to Platey constructor. Must be an Array containing well definitions";

    const wellsContainDuplicateIds =
      Platey._containsDuplicates(wells.map(well => well.id).filter(id => id !== undefined));

    if (wellsContainDuplicateIds)
      throw "Platey: Duplicate Ids found in the supplied plate";

    wells.forEach(well => {
      Platey._testWellCoordinate(well.x);
      Platey._testWellCoordinate(well.y);

      if (well.id  === undefined)
        well.id = Platey._generateGuid();
    });

    this._element = document.createElement("canvas");
    this._wells = wells;
  }

  get htmlElement() {
    return this._element;
  }

  get hasWells() {
    return this._wells.length > 0;
  }

  get numberOfWells() {
    return this._wells.length;
  }

  get wellIds() {
    return this._wells.map(well => well.id).filter(id => id !== undefined);
  }

  get wellPositions() {
    return this._wells.map(well => { return { x: well.x, y: well.y, id: well.id }});
  }

  get isInFocus() {
    throw "Not implemented";
  }

  get focusedWellId() {
    throw "Not implemented";
  }

  get selectedWellIds() {
    throw "Not implemented";
  }

  get notSelectedWellIds() {
    throw "Not implemented";
  }

  selectWell(wellId) {
  }

  selectWells(wellIds) {
  }

  deSelectWell(wellId) {
  }

  deSelectWells(wellIds) {
  }

  clearSelection() {
  }

  serialize() {
  }

  static deserialize(json) {
  }

  static _testWellCoordinate(coordinate) {
    if(coordinate === undefined)
      throw "Platey: A well provided to the Platey constructor did not have an `x` property";

    if(Platey._isNotNumeric(coordinate))
      throw "Platey: A well provided to the Platey constructor has an invalid `x` value (${well.x}). Value must be a number between 0 and 100";

    if(coordinate >= 100 || coordinate < 0)
      throw "Platey: A well provided to the Platey constructor has an invalid `x` value (${well.x}). Value must be a number between 0 and 100";
  }

  static _isNotNumeric(n) {
    // From: http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric#1830844
    return isNaN(parseFloat(n)) || !isFinite(n);
  }

  static _containsDuplicates(array) {
    return array.some(function(element, i) {
      return array.indexOf(element) != i;
    });
  }

  static _generateGuid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}

const Shapes = {
    CIRCLE: 1
};

class Well {
  constructor(x, y, id, shape = Shapes.CIRCLE, diameter = 1) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.diameter = diameter;
    this.isSelected = false;
  }
}