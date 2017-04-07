import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "./PlateyDocument";
import {PlateySavedDocument} from "./api/PlateySavedDocument";
import {PlateyConfiguration} from "./api/PlateyConfiguration";

export class PlateyApp {

    currentDocument: BehaviorSubject<PlateyDocument | null>;
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
}