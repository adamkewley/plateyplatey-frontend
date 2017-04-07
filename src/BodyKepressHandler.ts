import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "./PlateyDocument";

export class BodyKepressHandler {

    private _keybinds: { [key: string]: string };
    private _currentDocument: BehaviorSubject<PlateyDocument | null>;

    constructor(keybinds: { [key: string]: string }, currentDocument: BehaviorSubject<PlateyDocument | null>) {
        this._keybinds = keybinds;
        this._currentDocument = currentDocument;
    }

    handler(e: KeyboardEvent) {
        const inputIsFocused =
            document.activeElement.tagName.toLowerCase() === "input";

        if (inputIsFocused) return;
        else if (e.which !== 0 && !e.ctrlKey) {
            // The current focus could be a button, pressing a key while
            // focused on a button can result in navigation.
            if ((<HTMLElement>document.activeElement).blur !== undefined) // In IE11, some elements don't have a .blur
                (<HTMLElement>document.activeElement).blur();

            const charCode = e.charCode;
            const char = String.fromCharCode(charCode);

            const currentDocument = this._currentDocument.getValue();

            if (currentDocument !== null) {
                const currentValue = currentDocument.getCurrentSelectionValue();
                const newValue = currentValue + char;
                currentDocument.setValueOfSelectionTo(newValue);
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }
}