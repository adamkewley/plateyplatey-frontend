import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";

export class CopyTableToClipboardCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "copy-table-to-clipboard";
  title = "Copy Table to Clipboard";
  description = "Copy the table to the clipboard as a tab-separated text block.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = Helpers.disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const columnSeparator = "\t";
      const rowSeparator = "\n";

      const columnIds = currentDocument.getColumnIds();

      const tableHeaders =
          ["Well ID"].concat(<string[]>columnIds.map((columnId: string) => currentDocument.getColumnHeader(columnId)));

      const tableData = currentDocument.getTableData();

      const entireTable = [tableHeaders].concat(tableData);

      const tsvData = entireTable.map(row => row.join(columnSeparator)).join(rowSeparator);

      Helpers.copyTextToClipboard(tsvData);
    }
  }
}
