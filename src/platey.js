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
      gridHeight: 8,  // Number of vertical grid spaces
      gridWidth: 14,  // Number of horizontal grid spaces
      width: 14 * 40, // Width in pixels
      height: 10 * 40, // Height in pixels
      element: null,  // HTML element to draw plate to
      selectors: [],  // Selector elements
    };

    this._options = Platey._extend(defaultOptions, options);

    this._gridHeight = this._options.gridHeight;
    this._gridWidth = this._options.gridWidth;
    this._wellDiameter = 0.3; // In plate coordinate space

    // Setup plate <canvas> element
    this._element = document.createElement("canvas");
    this._element.width = this._options.width;
    this._element.height = this._options.height;
    this._element.classList.add("plate");
    this._element.setAttribute("resize", true);
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

    // Setup selectors
    this._options.selectors.forEach(selector => {
      this._createSelectorUiElement(selector);
    });

    // Setup selection logic
    this._selectionChangedEvent = new Event();

    // Selection box logic
    let startPoint, endPoint, selectionBox;
    {
      // TODO: fix this interrupting other click handlers
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
              .expand(this._selectionBoxExpansionAmount, this._selectionBoxExpansionAmount);

          if (!e.event.shiftKey)
            this.clearSelection();

          this.selectWellsWithinRectangle(selectionArea);
        }
      });
    }
  }

  /**
   * Get the viewable pixel width of the plate.
   * @return {float}
   */
  get _pixelWidth() {
    return this._element.width;
  }

  /**
   * Get the viewable pixel height of the plate.
   */
  get _pixelHeight() {
    return this._element.height;
  }

  /**
   * Get the ratio between the grid (internal) and pixel
   * (viewable) coordinate systems.
   * @return {float}
   */
  get _gridSpaceToPixelSpaceRatio() {
    const pixelSpaceVector = new paper.Point(this._pixelWidth, this._pixelHeight);
    const plateSpaceVector = new paper.Point(this._gridWidth, this._gridHeight);

    return pixelSpaceVector.length / plateSpaceVector.length;
  }

  /**
   * Get the amount that selection boxes need to be scaled by in
   * order to overlap the midpoints of the well circles.
   * @return {float}
   */
  get _selectionBoxExpansionAmount() {
    return this._gridSpaceToPixelSpaceRatio * this._wellDiameter * 4;
  }

  /**
   * Get the underlying canvas HTML element being drawn to.
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._element;
  }

  /**
   * Get if the plate contains wells.
   * @return {boolean}
   */
  get hasWells() {
    return Object.keys(this._wells).length > 0;
  }

  /**
   * Get the number of wells in the plate.
   * @return {integer}
   */
  get numberOfWells() {
    return Object.keys(this._wells).length;
  }

  /**
   * Get the IDs of wells in the plate.
   * @return {Array.<String>}
   */
  get wellIds() {
    return Object.keys(this._wells);
  }

  /**
   * Get the IDs of selected wells in the plate.
   * @return {Array.<string>}
   */
  get selectedWellIds() {
    return Object.keys(this._wells).filter(key => this._wells[key].isSelected);
  }

  /**
   * Get the IDs of wells that are not selected in the plate.
   * @return {Array.<string>}
   */
  get notSelectedWellIds() {
    return Object.keys(this._wells).filter(key => !this._wells[key].isSelected);
  }

  /**
   * Get an event that triggers whenever the plate's selection changes.
   */
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

  /**
   * Select the well with ID wellId.
   * @param {String} wellId The ID of the well to select.
   */
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

  /**
   * Select multiple wells by their ID.
   * @param {Array.<String>} wellIds The IDs of the wells to select.
   */
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

  /**
   * Transforms a coordinate in the plate's grid coordinate system to
   * the view's (pixel-oriented) coordinate system.
   */
  _gridCoordinateToViewCoordinate({ x: x, y: y }) {
    const scaledX = (x / this._gridWidth) * this._element.width;
    const scaledY = (y / this._gridHeight) * this._element.height;

    return { x: scaledX, y: scaledY };
  }

  /**
   * Create a well paper.js ui element (circle) from
   * a well's coordinates.
   */
  _createWellUiElement(well) {
    var circle = new paper.Path.Circle(new paper.Point(well.x, well.y), this._wellDiameter);

    circle.scale(this._gridSpaceToPixelSpaceRatio, new paper.Point(0, 0));

    circle.strokeColor = "black";

    circle.fillColor = "white";

    return circle;
  }

  /**
   * Create a selector paper.js element (text) from
   * a selector's details.
   */
  _createSelectorUiElement(selector) {
    let selectorElement =
      new paper.PointText({
        point: [selector.x, selector.y],
        content: selector.label,
        fontSize: 0.3,
      });

    selectorElement.position = new paper.Point(selector.x, selector.y);

    selectorElement.scale(this._gridSpaceToPixelSpaceRatio, new paper.Point(0,0));

    selectorElement.attach("mousedown", (e) => {
      this.selectWells(selector.selects);

      e.stopPropagation();
    });

    return selectorElement;
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
    this._uiElement.fillColor = "#ccefff";
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