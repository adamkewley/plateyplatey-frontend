import {Command} from "./Command";
import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "../document/PlateyDocument";
import {Helpers} from "../../Helpers";
import {DisabledMessage} from "./DisabledMessage";

export class ExportDocumentAsJSONCommand implements Command {

    private _currentDocument: BehaviorSubject<PlateyDocument | null>;
    id: string = "export-document-as-json";
    title: string = "Export Document as JSON";
    description: string = "Export the current document as JSON. The format of the JSON is the same as that used to store documents on the PlateyPlatey server.";
    disabledSubject: BehaviorSubject<DisabledMessage>;

    constructor(currentDocument: BehaviorSubject<PlateyDocument | null>) {
        this._currentDocument = currentDocument;
        this.disabledSubject = Helpers.disabledIfNull(currentDocument);
    }

    execute() {
        const currentDocument = this._currentDocument.getValue();

        if (currentDocument !== null) {
            const documentState = currentDocument.toPlateyDocumentFile();
            const documentJSON = JSON.stringify(documentState, null, 2);

            Helpers.promptUserToSaveData("document.json", "application/json;charset=utf-8;", documentJSON);
        }
    }
}
