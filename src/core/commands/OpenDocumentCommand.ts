import {Command} from "./Command";
import {PlateyApp} from "../PlateyApp";
import {DisabledMessage} from "./DisabledMessage";
import {BehaviorSubject} from "rxjs";
import {Helpers} from "../../Helpers";

export class OpenDocumentCommand implements Command {

    id: string = "open-document";
    title: string = "Open PlateyPlatey JSON document";
    description: string = "Open a PlateyPlatey JSON file";
    disabledSubject: BehaviorSubject<DisabledMessage>;

    constructor(private app: PlateyApp) {
        // User can always open a document
        this.disabledSubject = new BehaviorSubject({ isDisabled: false });
    }

    execute() {
        Helpers
            .promptUserForFile("application/json")
            .then(Helpers.readFileAsText)
            .then(JSON.parse)
            .then(this.app.loadDocument.bind(this.app));
    }
}