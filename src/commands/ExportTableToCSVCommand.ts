import {BehaviorSubject} from "rxjs/Rx";
import {Command} from "./Command";
import {DisabledMessage} from "./DisabledMessage";
import Papa from "papaparse";

export class ExportTableToCSVCommand implements Command {

  _primativeCommands: any;
  id: string;
  title: string;
  description: string;

  constructor(primativeCommands: any) {
    this._primativeCommands = primativeCommands;
    this.id = "export-table-to-csv";
    this.title = "Export Table to CSV";
    this.description = "Export the current content of the table as a downloadable CSV file.";
  }

  execute() {
    const primativeCommands = this._primativeCommands;

    const columnIds = primativeCommands.getColumnIds();

    const tableHeaders =
      ["Well ID"].concat(columnIds.map((columnId: string) => primativeCommands.getColumnHeader(columnId)));

    const tableData = primativeCommands.getTableData();

    const entireTable = [tableHeaders].concat(tableData);

    const csvData = (<any>Papa).unparse(entireTable);

    primativeCommands.promptUserToSaveData(
      "platey-export.csv",
      "text/csv;charset=utf-8;",
      csvData);
  }

  get disabledSubject() {
    return new BehaviorSubject<DisabledMessage>({ isDisabled: false });
  }
}
