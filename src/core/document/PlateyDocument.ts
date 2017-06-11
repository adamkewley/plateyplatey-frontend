import {Subject} from "rxjs";
import {Helpers} from "../../Helpers";
import {PlateySavedDocument} from "../apitypes/PlateySavedDocument";
import {PlateArrangement} from "../apitypes/PlateArrangement";
import {Plate} from "../apitypes/Plate";
import {Column} from "./Column";
import {Well} from "./Well";
import {InternalSelector} from "./InternalSelector";
import {ValueAssignment} from "./ValueAssignment";
import {ColumnValue} from "../apitypes/ColumnValue";

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

  _layout: Plate;
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
  afterRowSelectionChanged = this.afterSelectingRows.merge(this.afterDeselectingRows);
  beforeAssigningValueToCells = new Subject<ValueAssignment>();
  afterAssigningValueToCells = new Subject<ValueAssignment>();
  beforeFocusRow = new Subject<string | null>();
  afterFocusRow = new Subject<string | null>();
  afterLayoutChanged = new Subject<Plate>();

  selectColumn(columnId: string | null): void {

    const columnToSelect =
      (columnId === null) ? null : this.columns.find(column => column.id === columnId);

    if (columnId !== null &&
        columnToSelect !== undefined &&
        columnToSelect !== null &&
        this.selectedColumn !== columnToSelect) {

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

    this.wells.forEach(well => {
      well.data[newColumn.id] = { value: "", color: null };
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

    const column = this.columns.find(col => col.id === columnId);

    if (column === undefined) return;
    else {
      if (column === this.selectedColumn)
        this.selectedColumn = null;

      this.beforeColumnRemoved.next(columnId);

      const idx = this.columns.indexOf(column);
      this.columns.splice(idx, 1);

      this.wells.forEach(well => {
        delete well.data[columnId];
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

    const rowIds = this.getRowIds();

    this.assignValueToCells(columnId, rowIds, "");

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

  assignValueToCells(columnId: string, rowIds: string[], value: string) {

    this.beforeAssigningValueToCells.next({
      columnId: columnId,
      rowIds: rowIds,
      value: value,
    });

    const maybeColumn = this.columns.find(column => column.id === columnId);
    const wells = this.wells.filter(well => rowIds.indexOf(well.id) !== -1);

    if (maybeColumn !== undefined && wells.length > 0) {
      const column = maybeColumn;
      const columnId = column.id;

      const colorMappings: { [value: string]: { color: string | null, numEntries: number } } = {};

      // Empty/null values should be blank.
      colorMappings[""] = { color: null, numEntries: 0 };

      this.wells
          .forEach(well => {
            const wellData = well.data[columnId];

            if (wellData.color !== null) {
              const columnValue = wellData.value;

              if (colorMappings[columnValue] === undefined) {
                colorMappings[columnValue] = { color: wellData.color, numEntries: 1 }
              } else {
                colorMappings[columnValue].numEntries++;
              }
            }
          });

      let wellColor: string | null;
      if (colorMappings[value] === undefined) {
        const previousValue = wells[0].data[columnId].value;

        const previousValueHadColorAssigned = colorMappings[previousValue] !== undefined;

        if (previousValueHadColorAssigned) {
          const selectedWellsAreOnlyWellsWithPreviousValue =
              colorMappings[previousValue].numEntries === wells.length;

          if (selectedWellsAreOnlyWellsWithPreviousValue) {
            const allSelectedWellsPreviouslyHadSameValue =
                wells.every(well => well.data[columnId].value === previousValue);

            if (allSelectedWellsPreviouslyHadSameValue) {
              wellColor = colorMappings[previousValue].color;
            } else {
              wellColor = Helpers.generateRandomColorHexString();
            }
          } else {
            wellColor = Helpers.generateRandomColorHexString();
          }
        } else {
          wellColor = Helpers.generateRandomColorHexString();
        }
      } else {
        wellColor = colorMappings[value].color;
      }

      wells.forEach((selectedWell: Well) => {
        selectedWell.data[columnId].value = value;
        selectedWell.data[columnId].color = wellColor;
      });
    }

    this.afterAssigningValueToCells.next({
      columnId: columnId,
      rowIds: rowIds,
      value: value,
    });
  }

  getTableData(): string[][] {
    const columnIds = this.columns.map(column => column.id);

    return this.wells.map(well => {
      const data = columnIds.map(columnId => well.data[columnId].value);

      return [well.id, ...data];
    });
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

    this._layout = layout;

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
      const uiWell: Well = {
        id: well.id,
        selected: false,
        hovered: false,
        x: well.x,
        y: well.y,
        radius: well.radius || layout.wellRadius || 0.3,
        data: {}
      };

      columnIds.forEach(columnId => {
        uiWell.data[columnId] = { value: "", color: null };
      });

      return uiWell;
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
        this.getSelectedWells().map(selectedWell => selectedWell.data[columnId].value);

      return values;
    }
  }

  setValueOfSelectionTo(newValue: string) {
    const selectedColumn = this.getSelectedColumnId();

    if (selectedColumn !== null) {
      const selectedRows = this.getSelectedRowIds();
      this.assignValueToCells(selectedColumn, selectedRows, newValue);
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

  getLayoutName() {
    return this._layout.name;
  }

  toPlateyDocumentFile(): PlateySavedDocument {
    // BODGE: This is a bit of a bodge because the server-side model for the
    // platey documents is designed to be super forward compatible and supports
    // multiple sheets, schemas, etc. whereas the actual in-UI model is
    // much simpler.

    const wellDataRet: { [wellId: string]: { [columnId: string]: ColumnValue }} = {};

    const data = this.wells.map(well => {
      const plateWellId = well.id;

      const dataRet: { [columnId: string]: ColumnValue } = {};

      const data = Object.keys(well.data).map(columnId => {
        return { columnId: columnId, data: { value: well.data[columnId].value }};
      }).reduce((allColumns, column) => {
        allColumns[column.columnId] = column.data;
        return allColumns;
      }, dataRet);

      return { plateWellId: plateWellId, data: data };
    }).reduce((allWellData, wellData) => {
      allWellData[wellData.plateWellId] = wellData.data;
      return allWellData;
    }, wellDataRet);

    return {
      fileSchema: { version: "1" },
      properties: { documentName: "NYI" },
      plateLayouts: { "mainLayout": this._layout },
      tableSchemas: {
        "mainTable": {
          columns: this.columns.map(col => {
            return { id: col.id, header: col.header }
          })
        }},
      workbook: {
        sheets: ["mainSheet"],
        focusedSheet: "mainSheet"
      },
      sheets: {
        "mainSheet": {
          plateTemplate: "mainLayout",
          tableSchema: "mainTable",
          data: data
        }
      }
    };
  }
}