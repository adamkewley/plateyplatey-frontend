import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import Papa from "papaparse";
import {PlateyDocument} from "../PlateyDocument";
import {disabledIfNull, promptUserToSaveData} from "../helpers";

export class ExportTableToCSVCommand implements Command {

  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  id = "export-table-to-csv";
  title = "Export Table to CSV";
  description = "Export the current content of the table as a downloadable CSV file.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
    this._currentDocument = currentDocument;
    this.disabledSubject = disabledIfNull(currentDocument);
  }

  execute() {
    const currentDocument = this._currentDocument.getValue();

    if (currentDocument !== null) {
      const columnIds = currentDocument.getColumnIds();

      const tableHeaders =
          ["Well ID"].concat(<string[]>columnIds.map(columnId => currentDocument.getColumnHeader(columnId)));

      const tableData = currentDocument.getTableData();

      const entireTable = [tableHeaders].concat(tableData);

      const csvData = (<any>Papa).unparse(entireTable);

      promptUserToSaveData("platey-export.csv", "text/csv;charset=utf-8;", csvData);
    }
  }
}
