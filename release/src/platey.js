class Platey {
  constructor(wells, options = {}) {
    // Perform input checks
    if (wells === undefined)
      throw "Platey: No wells provided to constructor. An array containing well definitions must be provided";

    if (!wells instanceof Array)
      throw "Platey: Invalid wells type provided to Platey constructor. Must be an Array containing well definitions";

    const suppliedWellIds = wells.map(well => well.id).filter(id => id !== undefined);

    if (Platey._containsDuplicates(suppliedWellIds))
      throw "Platey: Duplicate Ids found in the supplied plate";

    // Setup internal variables
    let defaultOptions = {
      gridHeight: 8,
      gridWidth: 14,
      width: 14 * 40,
      height: 8 * 40,
      element: null,
    };

    this._options = Platey._extend(defaultOptions, options);

    this._gridHeight = this._options.gridHeight;
    this._gridWidth = this._options.gridWidth;
    this._wellDiameter = 12;

    // Setup plate <canvas> element
    this._element = document.createElement("canvas");
    this._element.width = this._options.width;
    this._element.height = this._options.height;
    this._element.classList.add("plate");
    this._element.setAttribute("resize", null);
    paper.setup(this._element);

    if (this._options.element !== null)
      this._options.element.appendChild(this._element);

    // Setup wells
    this._wells = {};

    wells.forEach(well => {
      Platey._testWellCoordinate(well.x);
      Platey._testWellCoordinate(well.y);

      if (well.id === undefined)
        well.id = Platey._generateGuid();

      const wellUiElement = this._createWellUiElement(well);

      this._wells[well.id] = new _Well(wellUiElement);
    });

    // Setup selection logic
    this._selectionChangedEvent = new Event();

    // Drag and drop selection logic - will select even if it's
    // essentially just a click
    const selectionBoxExpansionAmount = 4 * this._wellDiameter;

    // Selection box logic
    let startPoint, endPoint, selectionBox;
    {
      paper.view.attach("mousedown", function(e) {
        startPoint = e.point;
        endPoint = e.point;

        selectionBox = paper.Shape.Rectangle(startPoint, endPoint);
        selectionBox.strokeColor = "black";

        paper.view.update();
      });

      paper.view.attach("mousedrag", function(e) {
        if (startPoint != null && selectionBox != null)
        {
          endPoint = e.point;

          selectionBox.remove();

          selectionBox = paper.Shape.Rectangle(startPoint, endPoint);
          selectionBox.strokeColor = "black";
        }
      });

      paper.view.attach("mouseup", (e) => {
        if (startPoint != null && selectionBox != null)
        {
          endPoint = e.point;
          selectionBox.remove();
          selectionBox = null;

          const selectionArea =
              new paper.Rectangle(startPoint, endPoint)
              .expand(selectionBoxExpansionAmount, selectionBoxExpansionAmount);

          if (!e.event.shiftKey)
            this.clearSelection();

          this.selectWellsWithinRectangle(selectionArea);
        }
      });
    }
  }

  get htmlElement() {
    return this._element;
  }

  get hasWells() {
    return Object.keys(this._wells).length > 0;
  }

  get numberOfWells() {
    return Object.keys(this._wells).length;
  }

  get wellIds() {
    return Object.keys(this._wells);
  }

  get selectedWellIds() {
    return Object.keys(this._wells).filter(key => this._wells[key].isSelected);
  }

  get notSelectedWellIds() {
    return Object.keys(this._wells).filter(key => !this._wells[key].isSelected);
  }

  get onSelectionChanged() {
    return this._selectionChangedEvent;
  }

  /**
   * Select wells that fall within rect. Rect must use the same
   * coordinate system as the plate (0,0 top-left origin from
   * this.htmlElement).
   */
  selectWellsWithinRectangle(rect) {
    const wellsToSelect = this._getIdsOfWellsUnderRect(rect);

    this.selectWells(wellsToSelect);
  }

  selectWell(wellId) {
    if (this.selectedWellIds.indexOf(wellId) === -1) {
      this._selectWell(wellId);

      this.onSelectionChanged.trigger({
        newItems: [wellId],
        deSelectedItems: [],
      });
    }
    // else: the well was already selected, do nothing.
  }

  selectWells(wellIds) {
    const previouslySelectedWells = this.selectedWellIds;

    const wellIdsToSelect =
      wellIds.filter((id) => previouslySelectedWells.indexOf(id) === -1);

    if (wellIdsToSelect.length > 0) {
      wellIdsToSelect.forEach((id) => this._selectWell(id));

      this.onSelectionChanged.trigger({
        newItems: wellIdsToSelect,
        deSelectedItems: [],
      });
    }
    // else: do nothing, because there wasn't anything to select.
  }

  /**
   * Internal well selection function. Does not trigger an
   * .onSelectionChanged callback.
   * @param {String} wellId ID of the well to select.
   */
  _selectWell(wellId) {
    const well = this._wells[wellId];

    if (well === undefined)
      throw "Cannot select ${wellId}, does not exist in the plate";
    else well.select();
  }

  /**
   * Deselect a well
   * @param {String} wellId
   */
  deSelectWell(wellId) {
    if (this.selectedWellIds.indexOf(wellId) !== -1) {
      this._deSelectWell(wellId);
      this.onSelectionChanged.trigger({
        newItems: [],
        deSelectedItems: [wellId],
      });
    }
    // else: do nothing. The well wasn't selected.
  }

  /**
   * Deselect the provided wellIds.
   * @param {Array.<String>} wellIds Array containing the well IDs to deselect.
   */
  deSelectWells(wellIds) {
    const currentlySelectedWells = this.selectedWellIds;
    const wellsToDeselect =
      wellIds.filter(wellId => currentlySelectedWells.indexOf(wellId) !== -1);

    wellsToDeselect.forEach(wellId => this.deSelectWell(wellId));

    this.onSelectionChanged.trigger({
      newItems: [],
      deSelectedItems: wellsToDeselect
    });
  }

  /**
   * Internal well deSelection function. Does not trigger an
   * .onSelectionChanged callback.
   * @param {String} wellId The ID of the well to deSelect.
   */
  _deSelectWell(wellId) {
    const well = this._wells[wellId];

    if (well === undefined)
      throw "Cannot deSelect ${wellId}, does not exist in the plate";
    else well.deSelect();
  }

  clearSelection() {
    for (var id in this._wells)
      this.deSelectWell(id);
  }

  _gridCoordinateToViewCoordinate({ x: x, y: y }) {
    const scaledX = (x / this._gridWidth) * this._element.width;
    const scaledY = (y / this._gridHeight) * this._element.height;

    return { x: scaledX, y: scaledY };
  }

  _createWellUiElement(well) {
    const coord = this._gridCoordinateToViewCoordinate(well);

    var circle = new paper.Path.Circle(new paper.Point(coord.x, coord.y), this._wellDiameter);
    circle.strokeColor = "black";

    circle.fillColor = "white";

    return circle;
  }

  _getIdsOfWellsUnderRect(rect) {
    return Object.keys(this._wells)
                 .map(wellId => { return { id: wellId, well: this._wells[wellId] }})
                 .filter(tuple => tuple.well.isUnder(rect))
                 .map(tuple => tuple.id);
  }

  serialize() {
    throw "Not yet implemented";
  }

  static deserialize(json) {
    throw "Not yet implemented";
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

  static _extend(a, b) {
    for(var key in b)
      if(b.hasOwnProperty(key))
        a[key] = b[key];
    return a;
  }
}

class _Well {
  constructor(uiElement) {
    this._uiElement = uiElement;
    this._isSelected = false;
    this._isHoveredOver = false;

    // Hovering over it
    uiElement.attach("mouseenter", this.mouseOver.bind(this));
    uiElement.attach("mouseleave", this.mouseLeave.bind(this));
  }

  get isSelected() {
    return this._isSelected;
  }

  get isHoveredOver() {
    return this._isHoveredOver;
  }

  get viewX() {
    return this._uiElement.x;
  }

  get viewY() {
    return this._uiElement.y;
  }

  select(e = null) {
    this._uiElement.fillColor = "blue";
    this._isSelected = true;
  }

  deSelect(e = null) {
    this._uiElement.fillColor = "white";
    this._isSelected = false;
  }

  mouseOver() {
    this._uiElement.strokeColor = "grey";
    this._isHoveredOver = true;
  }

  mouseLeave() {
    this._uiElement.strokeColor = "black";
    this._isHoveredOver = false;
  }

  isUnder(rect) {
    return this._uiElement.isInside(rect);
  }
}

// Simple event type, used internally to publish and hold
// the subscribers of events
var Event = function(beforeTrigger) {
  if(beforeTrigger === undefined)
    beforeTrigger = () => {};

  var subscribers = [];

  return {
    add: function(callback) {
      subscribers.push(callback);
    },
    remove: function(callback) {
      var idx = subscribers.indexOf(callback);
      if(idx > -1)
        subscribers.splice(idx, 1);
    },
    trigger: function(args) {
      beforeTrigger.call(self, args);

      subscribers.forEach(function(subscriber) {
        subscriber.call(self, args);
      });
    }
  };
};