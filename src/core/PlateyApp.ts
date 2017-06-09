import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "./document/PlateyDocument";
import {PlateySavedDocument} from "./apitypes/PlateySavedDocument";
import {PlateyConfiguration} from "./apitypes/PlateyConfiguration";

export class PlateyApp {

    public currentDocument: BehaviorSubject<PlateyDocument | null>;
    private _configuration: PlateyConfiguration;
    private _defaultDocument: PlateySavedDocument;

    constructor(configuration: PlateyConfiguration, defaultDocument: PlateySavedDocument) {
        this.currentDocument = new BehaviorSubject(null);
        this._configuration = configuration;
        this._defaultDocument = defaultDocument;
    }

    newDocument(): PlateyDocument {
        const document = PlateyDocument.fromPlateyDocumentFile(this._defaultDocument);
        this.currentDocument.next(document);
        return document;
    }

    getKeybinds(): { [key: string]: string } {
        return this._configuration.keybinds;
    }

    loadDocument(savedDocument: PlateySavedDocument): PlateyDocument {
        const document = PlateyDocument.fromPlateyDocumentFile(savedDocument);
        this.currentDocument.next(document);
        return document;
    }
}