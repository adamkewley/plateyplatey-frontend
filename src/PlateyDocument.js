import Rx from "lib/rxjs/Rx";
import { generateGuid, moveItemInArray, shuffle } from "helpers";

export class PlateyDocument {

  static fromPlateyDocumentFile(document) {
    if (document.fileSchema.version !== "1")
      throw "Unsupported document version: " + document.fileSchema.version;

    if (document.workbook.sheets.length > 1)
      console.log("Multiple workspaces found in document. Platey can only load the first");

    const focusedSheetId = document.workbook.focusedSheet;
    const focusedSheet = document.sheets[focusedSheetId];
    const tableSchemaId = focusedSheet.tableSchema;
    const tableSchema = document.tableSchemas[tableSchemaId];
    const sheetData = focusedSheet.data;
    const plateLayoutId = focusedSheet.plateTemplate;
    const plateLayout = document.plateLayouts[plateLayoutId];

    const plateyDocument = new PlateyDocument();

    plateyDocument.getColumnIds().forEach(plateyDocument.removeColumn);
    plateyDocument.setLayout(plateLayout);

    tableSchema.columns.forEach(column => {
      plateyDocument.addColumnWithId(column.id);
      plateyDocument.setColumnHeader(column.header, column.id);
    });

    Object.keys(sheetData).forEach(rowId => {
      const rowData = sheetData[rowId];

      Object.keys(rowData).forEach(columnId => {
        const cellValue = rowData[columnId].value;

        plateyDocument.assignValueToCells(columnId, rowId, cellValue);
      });
    });

    return plateyDocument;
  }

  constructor() {
    this.columns = [];
    this.selectedColumn = null;
    this.wells = [];
    this.clickedWell = null;
    this.arrangement = null;
    this.availableArrangements = [];
    this.selectors = [];

    this.beforeColumnSelectionChanged = new Rx.Subject();
    this.afterColumnSelectionChanged = new Rx.Subject();
    this.beforeColumnAdded = new Rx.Subject();
    this.afterColumnAdded = new Rx.Subject();
    this.beforeColumnMoved = new Rx.Subject();
    this.afterColumnMoved = new Rx.Subject();
    this.beforeColumnRemoved = new Rx.Subject();
    this.afterColumnRemoved = new Rx.Subject();
    this.beforeColumnDataCleared = new Rx.Subject();
    this.afterColumnDataCleared = new Rx.Subject();
    this.beforeSelectingRows = new Rx.Subject();
    this.afterSelectingRows = new Rx.Subject();
    this.beforeDeselectingRows = new Rx.Subject();
    this.afterDeselectingRows = new Rx.Subject();
    this.beforeAssigningValueToCells = new Rx.Subject();
    this.afterAssigningValueToCells = new Rx.Subject();
    this.beforeFocusRow = new Rx.Subject();
    this.afterFocusRow = new Rx.Subject();
    this.afterLayoutChanged = new Rx.Subject();
  }

  selectColumn(columnId) {

    const columnToSelect =
      (columnId === null) ? null : this.columns.find(column => column.id === columnId);

    if (columnToSelect !== undefined) {

      this.beforeColumnSelectionChanged.next(columnId);
      this.selectedColumn = columnToSelect;
      this.afterColumnSelectionChanged.next(columnId);
    }
  }

  addColumn() {
    const randomId = generateGuid();
    this.addColumnWithId(randomId);
  }

  addColumnWithId(id) {
    this.beforeColumnAdded.next(null);

    const newColumn = {
      header: "Column " + (this.columns.length + 1),
      id: id
    };

    this.columns.push(newColumn);

    // Populate the wells with null values
    // for this new column
    this.wells.forEach(well => {
      well[newColumn.id] = null;
    });

    this.afterColumnAdded.next(newColumn.id);

    return newColumn.id;
  }

  moveColumn(columnId, newIndex) {
    const oldIndex =
      this.columns.map(column => column.id).indexOf(columnId);

    if (oldIndex === -1)
      return; // The column wasn't in the table
    else if (oldIndex === newIndex)
      return; // It doesn't need to move
    else if (newIndex >= this.columns.length)
      return; // The new index is out of bounds
    else {
      this.beforeColumnMoved.next(columnId);

      moveItemInArray(this.columns, oldIndex, newIndex);

      this.afterColumnMoved.next(columnId);
    }
  }

  removeColumn(columnId) {
    this.beforeColumnRemoved.next(columnId);

    const column = this.columns.find(col => col.id === columnId);

    if (column === undefined) return;
    else {
      if (column === this.selectedColumn)
        this.selectedColumn = null;

      const idx = this.columns.indexOf(column);
      this.columns.splice(idx, 1);

      this.wells.forEach(well => {
        delete well[columnId];
      });

      this.afterColumnRemoved.next(columnId);
    }
  }

  getSelectedColumnId() {
    if (this.selectedColumn === null)
      return null;
    else return this.selectedColumn.id;
  }

  clearDataInColumn(columnId) {
    this.beforeColumnDataCleared.next(columnId);

    this.wells.forEach(well => well[columnId] = null);

    this.afterColumnDataCleared.next(columnId);
  }

  getColumnIds() {
    return this.columns.map(column => column.id);
  }

  getColumnHeader(columnId) {
    const column = this.columns.find(column => column.id === columnId);

    if (column === undefined) return undefined;
    else return column.header;
  }

  setColumnHeader(header, columnId) {
    const column = this.columns.find(column => column.id === columnId);

    if (column === undefined) return undefined;
    else column.header = header;
  }

  getRowIds() {
    return this.wells.map(well => well.id);
  }

  getSelectedRowIds() {
    return this.wells.filter(well => well.selected === true).map(well => well.id);
  }

  selectRowsById(rowIds) {
    this.beforeSelectingRows.next(rowIds);

    this.wells
      .filter(well => rowIds.indexOf(well.id) !== -1)
      .forEach(well => well.selected = true);

    this.afterSelectingRows.next(rowIds);
  }

  deSelectRowsById(rowIds) {
    this.beforeDeselectingRows.next(rowIds);

    this.wells
      .filter(well => rowIds.indexOf(well.id) !== -1)
      .forEach(well => well.selected = false);

    this.afterDeselectingRows.next(rowIds);
  }

  assignValueToCells(columnId, rowIds, value) {

    this.beforeAssigningValueToCells.next({
      columnId: columnId,
      rowIds: rowIds,
      value: value,
    });

    const columnExists = this.columns.find(column => column.id === columnId);
    const rows = this.wells.filter(well => rowIds.indexOf(well.id) !== -1);

    if (columnExists !== undefined && rows.length > 0) {
      rows.forEach(row => row[columnId] = value);
    }

    this.afterAssigningValueToCells.next({
      columnId: columnId,
      rowIds: rowIds,
      value: value,
    });
  }

  getTableData() {
    const orderedColumnIds = ["id"].concat(this.columns.map(column => column.id));

    return this.wells.map(wellData => orderedColumnIds.map(columnId => wellData[columnId]));
  }

  getFocusedRowId() {
    if (this.clickedWell !== null)
      return this.clickedWell.id;
    else return null;
  }

  focusRow(rowId) {

    // null clears focus
    if (rowId === null) {
      this.beforeFocusRow.next(null);
      this.clickedWell = null;
      this.afterFocusRow.next(null);
    }

    const row = this.wells.find(well => well.id === rowId);

    if (row !== undefined) {
      this.beforeFocusRow.next(rowId);

      this.clickedWell = row;
      this.selectRowsById([rowId]);

      this.afterFocusRow.next(rowId);
    }
  }

  hoverOverWell(wellId) {
    const well = this.wells.find(well => well.id === wellId);

    if (well !== undefined) well.hovered = true;
  }

  unHoverOverWell(wellId) {
    const well = this.wells.find(well => well.id === wellId);

    if (well !== undefined) well.hovered = false;
  }

  hoverOverWells(wellIds) {
    wellIds.forEach(wellId => this.hoverOverWell(wellId));
  }

  unHoverOverWells(wellIds) {
    wellIds.forEach(wellId => this.unHoverOverWell(wellId));
  }

  setLayout(layout) {

    const columnIds = this.columns.map(column => column.id);

    // Supply random and default arrangements for all
    // plates
    const defaultArrangement = {
      name: "Default",
      order: layout.wells.map(well => well.id)
    };

    const defaultArrangements = [
      defaultArrangement,
      {
        name: "Random",
        order: shuffle(layout.wells.map(well => well.id))
      },
    ];

    this.availableArrangements =
      (layout.arrangements) ? defaultArrangements.concat(layout.arrangements) : defaultArrangements;

    this.arrangement = defaultArrangement;

    this.wells = layout.wells.map(well => {
      const wellData = {
        id: well.id,
        columns: [],
        selected: false,
        hovered: false,
        x: well.x,
        y: well.y,
        radius: well.radius || layout.defaultWellRadius || 0.3,
      };

      columnIds.forEach(id => {
        wellData[id] = null;
      });

      return wellData;
    });

    this.selectors = layout.selectors.map(selector => {
      return {
        x: selector.x,
        y: selector.y,
        label: selector.label,
        selectsIds: selector.selects,
        selects: selector
          .selects
          .map(wellId => this.wells.find(well => well.id === wellId))
          .filter(well => well !== undefined) // e.g. if the selector has an invalid ID in it
      };
    });

    this.gridWidth = layout.gridWidth;
    this.gridHeight = layout.gridHeight;

    this.afterLayoutChanged.next(layout);
  }

  setRowArrangement(arrangement) {
    const arrangementWells = arrangement.order;

    const arrangedWells =
      arrangementWells
        .map(wellId => this.wells.find(well => well.id === wellId))
        .filter(well => well !== undefined);

    const remainingWells =
      this.wells.filter(well => arrangement.order.indexOf(well.id) === -1);

    this.wells = arrangedWells.concat(remainingWells);
  }

  getSelectedWells() {
    return this.wells.filter(well => well.selected);
  }

  getSelectionValues() {
    if (this.selectedColumn === null) return [];
    else {
      const columnId = this.selectedColumn.id;

      const values =
        this.getSelectedWells().map(selectedWell => selectedWell[columnId]);

      return values;
    }
  }
}