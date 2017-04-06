import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";

export class CopyTableToClipboardCommand implements Command {

  _primativeCommands: any;
  id: string;
  title: string;
  description: string;

  constructor(primativeCommands: any) {
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
      ["Well ID"].concat(columnIds.map((columnId: string) => primativeCommands.getColumnHeader(columnId)));

    const tableData = primativeCommands.getTableData();

    const entireTable = [tableHeaders].concat(tableData);

    const tsvData = entireTable.map(row => row.join(columnSeparator)).join(rowSeparator);

    primativeCommands.copyTextToClipboard(tsvData);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
