import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import Papa from "papaparse";
import {Helpers} from "../../Helpers";
import {PlateyApp} from "../PlateyApp";

export class ImportCSVFileCommand implements Command {

  private _app: PlateyApp;
  id = "import-csv-file";
  title = "Import CSV File";
  description = "Import a CSV file into the main table.";
  disabledSubject: BehaviorSubject<DisabledMessage>;

  constructor(app: PlateyApp) {
    this._app = app;
    this.disabledSubject = Helpers.disabledIfNull(app.currentDocument);
  }

  execute() {
    Helpers.promptUserForFile("text/csv")
        .then(Helpers.readFileAsText)
        .then((text: string) => {
          const tableData = (<any>Papa).parse(text).data;
          const headerRow = tableData[0];
          const dataRows = tableData.slice(1);

          const longestRow =
              tableData.reduce((maxLen: number, row: Array<any>) => Math.max(maxLen, row.length), 0);

          const document = this._app.newDocument();

          const columns: any[] = [];

          for(var i = 0; i < longestRow; i++) {
            const header = headerRow[i];
            const hasHeader = header !== undefined;
            const column = document.addColumn();
            if (hasHeader)
              document.setColumnHeader(header, column);

            columns.push(column);
          }

          const rowIds = document.getRowIds();

          rowIds.forEach((rowId: string, rowIdx: number) => {
            const row = dataRows[rowIdx];
            columns.forEach((columnId, columnIdx) => {
              const val = row[columnIdx];
              document.assignValueToCells(columnId, [rowId], val);
            });
          });
        })
        .catch((err: any) => console.log(err));
  }
}
