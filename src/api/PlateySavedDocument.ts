import {DocumentWorkbook} from "./DocumentWorkbook";
import {TableSchema} from "./TableSchema";
import {Plate} from "./Plate";
import {DocumentProperties} from "./DocumentProperties";
import {DocumentSchemaDetails} from "./DocumentSchemaDetails";
import {DocumentSheet} from "./DocumentSheet";

export interface PlateySavedDocument {
    fileSchema: DocumentSchemaDetails;
    properties: DocumentProperties;
    plateLayouts: { [plateId: string]: Plate };
    tableSchemas: { [key: string]: TableSchema };
    workbook: DocumentWorkbook;
    sheets: { [key: string]: DocumentSheet };
}