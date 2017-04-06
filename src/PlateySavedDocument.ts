export interface DocumentSchemaDetails {
    version: String;
}

export interface DocumentProperties {
    documentName: String;
}

export interface Plate {
    name: String;
    gridWidth: number;
    gridHeight: number;
    selectors: PlateWellSelector[];
    wells: PlateWell[];
    wellRadius: number;
    arrangements: PlateArrangement[];
}

export interface PlateWellSelector {
    x: number;
    y: number;
    label: string;
    selects: string[];
}

export interface PlateWell {
    id: string;
    x: number;
    y: number;
    radius: number;
}

export interface PlateArrangement {
    name: string;
    order: string[];
}

export interface TableSchema {
    columns: ColumnSchema[];
}

export interface ColumnSchema {
    id: string;
    header: string;
}

export interface DocumentWorkbook {
    sheets: string[];
    focusedSheet: string;
}

export interface DocumentSheet {
    plateTemplate: string;
    tableSchema: string;
    data: { [plateId: string]: { [columnId: string]: ColumnValue }};
}

export interface ColumnValue {
    value: string;
}

export interface PlateySavedDocument {
    fileSchema: DocumentSchemaDetails;
    properties: DocumentProperties;
    plateLayouts: { [plateId: string]: Plate };
    tableSchemas: { [key: string]: TableSchema };
    workbook: DocumentWorkbook;
    sheets: { [key: string]: DocumentSheet };
}