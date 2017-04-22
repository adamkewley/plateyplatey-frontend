import {Subject} from "rxjs";
import {Helpers} from "../../Helpers";
import {PlateySavedDocument} from "../apitypes/PlateySavedDocument";
import {PlateArrangement} from "../apitypes/PlateArrangement";
import {Plate} from "../apitypes/Plate";
import {Column} from "./Column";
import {Well} from "./Well";
import {InternalSelector} from "./InternalSelector";
import {ValueAssignment} from "./ValueAssignment";

export class PlateyDocument {

  static fromPlateyDocumentFile(document: PlateySavedDocument) {
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

        plateyDocument.assignValueToCells(columnId, [rowId], cellValue);
      });
    });

    return plateyDocument;
  }
  
  columns: Column[] = [];
  selectedColumn: Column | null = null;
  wells: Well[] = [];
  clickedWell: Well | null = null;
  public arrangement: PlateArrangement | null = null;
  availableArrangements: PlateArrangement[] = [];
  selectors: InternalSelector[] = [];
  gridWidth: number;
  gridHeight: number;
  
  beforeColumnSelectionChanged = new Subject<string>();
  afterColumnSelectionChanged = new Subject<string>();
  beforeColumnAdded = new Subject<string>();
  afterColumnAdded = new Subject<string>();
  beforeColumnMoved = new Subject<string>();
  afterColumnMoved = new Subject<string>();
  beforeColumnRemoved = new Subject<string>();
  afterColumnRemoved = new Subject<string>();
  beforeColumnDataCleared = new Subject<string>();
  afterColumnDataCleared = new Subject<string>();
  beforeSelectingRows = new Subject<string[]>();
  afterSelectingRows = new Subject<string[]>();
  beforeDeselectingRows = new Subject<string[]>();
  afterDeselectingRows = new Subject<string[]>();
  beforeAssigningValueToCells = new Subject<ValueAssignment>();
  afterAssigningValueToCells = new Subject<ValueAssignment>();
  beforeFocusRow = new Subject<string | null>();
  afterFocusRow = new Subject<string | null>();
  afterLayoutChanged = new Subject<Plate>();

  constructor() {}

  selectColumn(columnId: string | null): void {

    const columnToSelect =
      (columnId === null) ? null : this.columns.find(column => column.id === columnId);

    if (columnToSelect !== undefined && columnToSelect !== null && columnId !== null) {

      this.beforeColumnSelectionChanged.next(columnId);
      this.selectedColumn = columnToSelect;
      this.afterColumnSelectionChanged.next(columnId);
    }
  }

  addColumn(): string {
    const randomId = Helpers.generateGuid();
    return this.addColumnWithId(randomId);
  }

  addColumnWithId(id: string): string {
    this.beforeColumnAdded.next(id);

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

  moveColumn(columnId: string, newIndex: number): void {
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

      Helpers.moveItemInArray(this.columns, oldIndex, newIndex);

      this.afterColumnMoved.next(columnId);
    }
  }

  removeColumn(columnId: string): void {
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

  getSelectedColumnId(): string | null {
    if (this.selectedColumn === null)
      return null;
    else return this.selectedColumn.id;
  }

  clearDataInColumn(columnId: string): void {
    this.beforeColumnDataCleared.next(columnId);

    this.wells.forEach(well => well[columnId] = null);

    this.afterColumnDataCleared.next(columnId);
  }

  getColumnIds(): string[] {
    return this.columns.map(column => column.id);
  }

  getColumnHeader(columnId: string): string | undefined {
    const column = this.columns.find(column => column.id === columnId);

    if (column === undefined) return undefined;
    else return column.header;
  }

  setColumnHeader(header: string, columnId: string): void {
    const column = this.columns.find(column => column.id === columnId);

    if (column === undefined) return undefined;
    else column.header = header;
  }

  getRowIds(): string[] {
    return this.wells.map(well => well.id);
  }

  getSelectedRowIds(): string[] {
    return this.wells.filter(well => well.selected === true).map(well => well.id);
  }

  selectRows(rows: Well[]) {
    const rowIds = rows.map(row => row.id);

    this.beforeSelectingRows.next(rowIds);

    rows.forEach(row => row.selected = true);

    this.afterSelectingRows.next(rowIds);
  }

  selectRowsById(rowIds: string[]): void {
    this.beforeSelectingRows.next(rowIds);

    this.wells
      .filter(well => rowIds.indexOf(well.id) !== -1)
      .forEach(well => well.selected = true);

    this.afterSelectingRows.next(rowIds);
  }

  deSelectRowsById(rowIds: string[]): void {
    this.beforeDeselectingRows.next(rowIds);

    this.wells
      .filter(well => rowIds.indexOf(well.id) !== -1)
      .forEach(well => well.selected = false);

    this.afterDeselectingRows.next(rowIds);
  }

  assignValueToCells(columnId: string, rowIds: string[], value: string | null) {

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

  getTableData(): any[] {
    const orderedColumnIds = ["id"].concat(this.columns.map(column => column.id));

    return this.wells.map(wellData => orderedColumnIds.map(columnId => wellData[columnId]));
  }

  getFocusedRowId(): string | null {
    if (this.clickedWell !== null)
      return this.clickedWell.id;
    else return null;
  }

  focusRow(rowId: string | null): void {

    // null clears focus
    if (rowId === null) {
      this.beforeFocusRow.next(null);
      this.clickedWell = null;
      this.afterFocusRow.next(null);
    } else {
      const row = this.wells.find(well => well.id === rowId);

      if (row !== undefined) {
        this.beforeFocusRow.next(rowId);

        this.clickedWell = row;
        this.selectRowsById([rowId]);

        this.afterFocusRow.next(rowId);
      }
    }
  }

  hoverOverWell(well: Well): void {
    well.hovered = true;
  }

  unHoverOverWell(well: Well): void {
    well.hovered = false;
  }

  hoverOverWells(wells: Well[]): void {
    wells.forEach(well => this.hoverOverWell(well));
  }

  unHoverOverWells(wells: Well[]): void {
    wells.forEach(well => this.unHoverOverWell(well));
  }

  setLayout(layout: Plate) {

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
        order: Helpers.shuffle(layout.wells.map(well => well.id))
      },
    ];

    this.availableArrangements =
      (layout.arrangements) ? defaultArrangements.concat(layout.arrangements) : defaultArrangements;

    this.arrangement = defaultArrangement;

    this.wells = layout.wells.map(well => {
      const wellData: Well = {
        id: well.id,
        selected: false,
        hovered: false,
        x: well.x,
        y: well.y,
        radius: well.radius || layout.wellRadius || 0.3,
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
        selects:
            <Well[]>selector
                .selects
                .map(wellId => this.wells.find(well => well.id === wellId))
                .filter(well => well !== undefined) // e.g. if the selector has an invalid ID in it
      };
    });

    this.gridWidth = layout.gridWidth;
    this.gridHeight = layout.gridHeight;

    this.afterLayoutChanged.next(layout);
  }

  setRowArrangement(arrangement: PlateArrangement): void {
    const arrangementWells = arrangement.order;

    const arrangedWells: Well[] =
      <Well[]>arrangementWells
        .map(wellId => this.wells.find(well => well.id === wellId))
        .filter(well => well !== undefined);

    const remainingWells: Well[] =
      this.wells.filter(well => arrangement.order.indexOf(well.id) === -1);

    this.wells = arrangedWells.concat(remainingWells);
  }

  getSelectedWells(): Well[] {
    return this.wells.filter(well => well.selected);
  }

  getSelectionValues(): string[] {
    if (this.selectedColumn === null) return [];
    else {
      const columnId = this.selectedColumn.id;

      const values =
        this.getSelectedWells().map(selectedWell => selectedWell[columnId]);

      return values;
    }
  }

  setValueOfSelectionTo(value: string) {
    const selectedColumn = this.selectedColumn;

    if (selectedColumn !== null) {
      const selectedColumnId = selectedColumn.id;

      this.getSelectedWells().forEach((selectedWell: Well) => {
        selectedWell[selectedColumnId] = value;
      });
    }
  }

  getCurrentSelectionValue(): string {
    const selectionValues = this.getSelectionValues();

    if (selectionValues.length === 0) {
      return "";
    } else {
      const firstValue = selectionValues[0];

      if (firstValue === null) return "";

      const allWellsHaveSameValue =
          selectionValues.every((selectedWell: string) => selectedWell === firstValue);

      if (allWellsHaveSameValue) return firstValue;
      else return "";
    }
  }

  hasNoCellsSelected() {
    return this.selectedColumn === null ||
      !this.wells.some((well: Well) => well.selected);
  }
}