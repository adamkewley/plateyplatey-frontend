import Rx from "lib/rxjs/Rx";
import Papa from "lib/papaparse";

export default class ImportCsvFile {

  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "import-csv-file";
    this.title = "Import CSV File";
    this.description = "Import a CSV file into the main table.";
  }

  execute() {
    this._primativeCommands
    .promptUserForFile("text/csv")
    .then(this._primativeCommands.readFileAsText)
    .then((text) => {
      const tableData = Papa.parse(text).data;
      const headerRow = tableData[0];
      const dataRows = tableData.slice(1);

      const longestRow =
        tableData.reduce((maxLen, row) => Math.max(maxLen, row.length), 0);

      this._primativeCommands.newDocument();

      const columns = [];

      for(var i = 0; i < longestRow; i++) {
        const header = headerRow[i];
        const hasHeader = header !== undefined;
        const column = this._primativeCommands.addColumn();
        if (hasHeader)
          this._primativeCommands.setColumnHeader(header, column);

        columns.push(column);
      }

      const rowIds = this._primativeCommands.getRowIds();

      rowIds.forEach((rowId, rowIdx) => {
        const row = dataRows[rowIdx];
        columns.forEach((columnId, columnIdx) => {
          const val = row[columnIdx];
          this._primativeCommands.assignValueToCells(columnId, [rowId], val);
        });
      });
    })
     .catch((err) => console.log(err));
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}
