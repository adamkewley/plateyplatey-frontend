/**
 * A row ID.
 * @typedef {string} RowId
 */

/**
 * A column ID.
 * @typedef {string} ColumnId
 */

/**
 * A column definition.
 * @typedef {Object} ColumnDefinition
 * @property {ColumnId} id The ID of the column.
 * @property {string} header The header text of the column.
 */

/**
 * A cell ID.
 * @typedef {Object} CellId
 * @property {RowId} rowId The ID of the row in which the cell resides.
 * @property {ColumnId} columnId The ID of the column in which the cell resides.
 */


/**
 * A table that is populated by Platey. The table holds data for each
 * row & column populated by the platey instance.
 */
class PlateyTable {
  /**
   * Construct a PlateyTable instance.
   *
   * @constructor
   * @this {PlateyTable}
   * @param {Array.<RowId>} rowIds IDs of rows in the table.
   * @param {Array.<ColumnDefinition>} columnDefinitions Definitions of columns in the table.
   */
  constructor(rowIds = [], columnDefinitions = []) {
    if (!(rowIds instanceof Array))
      throw "Invalid rowIds argument passed to PlateyTable constructor, expecting an array of row IDs";

    // Each id should be unique
    const rowIdsAreNotUnique = PlateyTable._containsDuplicates(rowIds);

    if (rowIdsAreNotUnique)
      throw "Non-unqiue row ids were passed to the PlateyTable constructor.";

    if (!(columnDefinitions instanceof Array))
      throw "Invalid columnDefinitions argument passed to PlateyTable constructor, expecting an array of column IDs";
    const allColumnDefinitionsHaveAnIdProperty =
      columnDefinitions.every(columnDefinition => columnDefinition.id !== undefined);

    if (!allColumnDefinitionsHaveAnIdProperty)
      throw "Invalid columnDefinitions passed to a PlateyTable constructor, a column definition does not have an ID property";

    const allColumnDefinitionsHaveHeaderProperty =
      columnDefinitions.every(columnDefinition => columnDefinition.header !== undefined);

    if (!allColumnDefinitionsHaveHeaderProperty)
      throw "Invalid columnDefinitions passed to PlateyTable constructor, a column definition does not have a header property";

    const columnIds = columnDefinitions.map(columnDefinition => columnDefinition.id);

    const containsDuplicateColumnIds = PlateyTable._containsDuplicates(columnIds);

    if (containsDuplicateColumnIds)
      throw "Invalid columnDefinitions passed to PlateyTable constructor, a column definition contains a duplicate ID";

    this._columnDefinitions = columnDefinitions;

    this._data = {};
    rowIds.forEach(rowId => {
      const data = {};

      columnDefinitions.forEach(columnDefinition => {
        data[columnDefinition.id] = null;
      });

      this._data[rowId] = data;
    });
  }

  // VIEW
  get element() {
    return document.createElement("table");
  }

  // DATA-VIEW SYNCING

  /**
   * Completely refresh the HTML view of the PlateyTable.
   */
  _refresh() {
  }

  // TABLE DATA

  // TABLE DATA: ROWS

  /**
   * Get the number of rows in the PlateyTable.
   * @return {number}
   */
  get numberOfRows() {
    return Object.keys(this._data).length;
  }

  /**
   * Get the IDs of rows in the PlateyTable.
   * @return {Array.<RowId>} IDs of rows in the PlateyTable.
   */
  get rowIds() {
    return Object.keys(this._data);
  }

  /**
   * Data in a PlateyTable.
   * @typedef {Object} Data
   * @property {ColumnId} columnId The ID of the column (in effect, the field name).
   * @property {string} value The value of the data.
   */

  /**
   * Data associated with a row in the PlateyTable.
   * @typedef {Object} RowData
   * @property {RowId} id The ID of the row.
   * @property {Array.<Data>} columnData The data in the row.
   */

  /**
   * Get the data associated with each row in the PlateyTable.
   * @return {Array.<RowData>}
   */
  get rowData() {
    return Object.keys(this._data).map(rowId => {
      const dataObj = this._data[rowId];

      const dataArr = Object.keys(dataObj).map(columnId => {
        return { columnId: columnId, value: dataObj[columnId] };
      });

      return {
        id: rowId,
        columnData: dataArr
      };
    });
  }

  // TABLE DATA: COLUMNS

  /**
   * Get the number of columns in the PlateyTable.
   * @return {number}
   */
  get numberOfColumns() {
    return this._columnDefinitions.length;
  }

  /**
   * Get the IDs of columns in the PlateyTable.
   * @return {Array.<ColumnId>}
   */
  get columnIds() {
    return this._columnDefinitions.map(columnDefinition => columnDefinition.id);
  }

  /**
   * A column header.
   * @typedef {Object} ColumnHeader
   * @property {ColumnId} id The ID of the column.
   * @property {string} The header of the column.
   */

  /**
   * Get the headers of columns in the PlateyTable.
   * @return {Array.<ColumnHeader>}
   */
  get columnHeaders() {
  }

  // TABLE DATA: CELLS

  /**
   * Get the number of cells in the PlateyTable.
   * @return {number}
   */
  get numberOfCells() {
  }

  /**
   * Get the IDs of cells in the PlateyTable.
   * @return {Array.<CellId>}
   */
  get cellIds() {
  }

  /**
   * The data of a PlateyTable cell.
   * @typedef CellData
   * @property {CellId} id The ID of the cell
   * @property {Data} data Data associated with the cell.
   */

  /**
   * Get the data in the cells of the PlateyTable.
   * @return {Array.<CellData>}
   */
  get cellData() {
  }

  // SELECTION LOGIC

  // SELECTION LOGIC: COLUMNS

  /**
   * Select a column by its ID.
   * @param {ColumnId} id The ID of the column to select.
   */
  selectColumnById(id) {
  }

  /**
   * Select columns by their IDs.
   * @param {Array.<ColumnId>} ids The IDs of the columns to select.
   */
  selectColumnsById(ids) {
  }

  /**
   * Deselect a column with ID.
   * @param {ColumnId} id The ID of the column to de-select.
   */
  deSelectColumnById(id) {
  }

  /**
   * Deselect columns by their IDs.
   * @param {Array.<ColumnId>} ids The IDs of the columns to deselect.
   */
  deSelectColumnsById(ids) {
  }

  /**
   * Clear the PlateyTable's column selection.
   */
  clearColumnSelection() {
  }

  /**
   * A selection change type (DESELECT|SELECT).
   * @typedef {string} SelectionChangeType
   */

  /**
   * A column selection change.
   * @typedef {Object} ColumnSelectionChange
   * @property {SelectionChangeType} type The type of selection change.
   * @property {ColumnId} id The ID of the column undergoing the change.
   */

  /**
   * Get an observable sequence of column selection changes.
   * @return {Observable.<ColumnSelectionChange>}
   */
  get columnSelectionChanges() {
  }

  /**
   * Get the IDs of columns selected in the table.
   * @return {Array.<ColumnId>} The IDs of selected columns.
   */
  get selectedColumnIds() {
  }

  /**
   * Get the selected columns' header text.
   * @return {Array.<ColumnHeader>} The selected columns' header text.
   */
  get selectedColumnsHeaderText() {
  }

  // SELECTION LOGIC: ROWS

  /**
   * Select a row its ID.
   * @param {RowId} id The ID of the row.
   */
  selectRowById(id) {
  }

  /**
   * Select multiple rows by their IDs.
   * @param {Array.<RowId>} ids The IDs of rows to select.
   */
  selectRowsById(ids) {
  }

  /**
   * Deselect a row with the supplied ID.
   * @param {RowId} id The ID of the row to deselect.
   */
  deSelectRowById(id) {
  }

  /**
   * Deselect multiple rows by their ID.
   * @param {Array.<RowId>} ids The IDs of rows to deselect.
   */
  deSelectRows(rowIds) {
  }

  /**
   * Clear the current row selection.
   */
  clearRowSelection() {
  }

  /**
   * Row selection change information.
   * @typedef {Object} RowSelectionChange
   * @proeprty {SelectionChangeType} type The type of selection change.
   * @property {RowId} id The ID of the row undergoing the change.
   */

  /**
   * Get an observable sequence of row selection changes.
   * @return {Observable.<RowSelectionChange>}
   */
  get rowSelectionChanges() {
  }

  /**
   * Get the IDs of selected rows.
   * @return {Array.<RowId>} The IDs of the selected rows.
   */
  get selectedRowIds() {
  }

  /**
   * Get the data of the selected rows.
   * @return {Array.<RowData>} The data of the selected rows.
   */
  get selectedRowsData() {
  }

  // SELECTION LOGIC: CELLS

  /**
   * Select a cell by its cell ID.
   * @param {CellId} id The ID of the cell to select.
   */
  selectCellById(id) {
  }

  /**
   * Select multiple cells by their cell IDs.
   * @param {Array.<CellId>} ids An array of cells IDs to select.
   */
  selectCellsById(ids) {
  }

  /**
   * Deselect a cell by ID.
   * @param {CellId} id The ID of the cell to deselect
   */
  deSelectCellById(id) {
  }

  /**
   * Deselect multiple cells by their cell IDs.
   * @param {Array.<CellId>} ids The ID of the cells to deselect.
   */
  deSelectCells(ids) {
  }

  /**
   * Clear the current cell selection. (Alias for .clearSelection)
   */
  clearCellSelection() {
  }

  /**
   * Get the IDs of currently selected cells.
   * @return {Array.<CellId>} IDs of the currently selected cells.
   */
  get selectedCellIds() {
  }

  /**
   * The data of a cell in the PlateyTable.
   * @typedef {CellData}
   * @property {CellId} id The ID of the cell.
   * @property {Data} The data of the cell.
   */

  /**
   * Get the data within the currently selected cells. (Alias for get
   * selectionData)
   * @return {Array.<CellData>} The data in the currently selected cells
   */
  get selectedCellData() {
  }

  /**
   * Set the data value of currently selected cells.
   * @param {string} value Value of the data to set within the currently selected cells.
   */
  set selectedCellsDataValue(value) {
  }

  /**
   * A cell selection change.
   * @typedef {Object} CellSelectionChange
   * @property {SelectionChangeType} type The type of selection change.
   * @property {CellId} id The ID of the cell undergoing the change.
   */

  /**
   * Get an observable sequence of cell selection changes.
   * @return {Observable.<CellSelectionChange>}
   */
  get cellSelectionChanges() {
  }

  // SELECTION LOGIC: GENERAL

  /**
   * Clear the current table selection.
   */
  clearSelection() {
  }

  /**
   * Get an observable sequence of selection changes.
   * @return {Observable.<CellSelectionChange>}
   */
  get selectionChanges() {
  }



  /**
   * Get the data within the currently selected cells of the table.
   * @return {Array.<CellData>}
   */
  get selectionData() {
  }

  /**
   * Set the value of data within the current selection.
   * @param {string} value The data to set wtihin the current selection
   */
  set selectionDataValue(value) {
  }

  // TABLE STRUCTURE MUTATION

  /**
   * Add a column to the table.
   * @param {string} id The id of the column.
   * @param {string} header The UI-visable header of the column.
   */
  addColumn(id, header) {
  }

  /**
   * Remove a column from the table.
   * @param {string} id The ID of the column.
   */
  removeColumn(id) {
  }

  /**
   * Get an observable sequence of column added events.
   * @return {Observable.<ColumnDefinition>}
   */
  get columnAdded() {
  }

  /**
   * Add a row to the PlateyTable.
   * @param {RowId} rowId The ID of the new row.
   */
  _addRow(rowId) {
  }

  /**
   * A PlateyTable's state.
   * @typedef {Object} PlateyTableState
   */

  // TABLE (DE)SERIALIZATION

  /**
   * Serialize the state of the PlateyTable into a plain static
   * javascript object.
   * @return {PlateyTableState} The PlateyTable's serialized state.
   */
  serialize() {
  }

  /**
   * Deserialize PlateyTable serialized data into a PlateyTable
   * instance
   * @param {PlateyTableState} state The PlateyTable's state.
   * @return {PlateyTable} The constructed PlateyTable instance.
   */
  static deserialize(state) {
  }

  /**
   * Returns true if array contains duplicates.
   * @param {Array} array Array to check.
   */
  static _containsDuplicates(array) {
    return array.some(function(element, i) {
             return array.indexOf(element) != i;
           });
  }
}