import {ColumnValue} from "./ColumnValue";

export interface DocumentSheet {
  plateTemplate: string;
  tableSchema: string;
  data: { [plateId: string]: { [columnId: string]: ColumnValue }};
}