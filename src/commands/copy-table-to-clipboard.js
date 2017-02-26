import Rx from "lib/rxjs/Rx";

export default class CopyTableToClipboardCommand {

  constructor(primativeCommands) {
    this._primativeCommands = primativeCommands;
    this.id = "copy-table-to-clipboard";
    this.title = "Copy Table to Clipboard";
    this.description = "Copy the table to the clipboard as a tab-separated text block.";
  }

  execute() {
    const primativeCommands = this._primativeCommands;
    const columnSeparator = "\t";
    const rowSeparator = "\n";

    const columnIds = primativeCommands.getColumnIds();

    const tableHeaders =
      ["Well ID"].concat(columnIds.map(columnId => primativeCommands.getColumnHeader(columnId)));

    const tableData = primativeCommands.getTableData();

    const entireTable = [tableHeaders].concat(tableData);

    const tsvData = entireTable.map(row => row.join(columnSeparator)).join(rowSeparator);

    primativeCommands.copyTextToClipboard(tsvData);
  }

  get disabledSubject() {
    return new Rx.BehaviorSubject(false);
  }
}