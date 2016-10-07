/**
 * Command that exports a plate to a CSV file and prompts the user to
 * save the CSV file.
 */
class ExportTableToCSVCommand extends AlwaysEnabledCommand {
  constructor(primativeCommands) {
    super();
    this._primativeCommands = primativeCommands;
    this.id = "export-table-to-csv";
    this.title = "Export Table to CSV";
    this.description = "Export the current content of the table as a downloadable CSV file.";
  }

  execute() {
    const primativeCommands = this._primativeCommands;

    const columnIds = primativeCommands.getColumnIds();

    const tableHeaders =
      ["Well ID"].concat(columnIds.map(columnId => primativeCommands.getColumnHeader(columnId)));

    const tableData = primativeCommands.getTableData();

    const entireTable = [tableHeaders].concat(tableData);

    const csvData = Papa.unparse(entireTable);

    primativeCommands.promptUserToSaveData(
      "platey-export.csv",
      "text/csv;charset=utf-8;",
      csvData);
  }
}
