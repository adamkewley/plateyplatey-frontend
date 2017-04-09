import {Helpers} from "../Helpers";
import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "../core/document/PlateyDocument";
import {AppCommands} from "../core/AppCommands";

export class BodyKeydownHandler {

  private _keybinds: { [key: string]: string };
  private _scriptExecutor: (plateyExpression: string, ...scopes: object[]) => void;
  private _currentDocument: BehaviorSubject<PlateyDocument | null>;
  private _allCommands: AppCommands;

  constructor(
    keybinds: { [key: string]: string },
    scriptExecutor: (plateyExpression: string, ...scopes: object[]) => void,
    currentDocument: BehaviorSubject<PlateyDocument | null>,
    commands: AppCommands) {

    this._keybinds = keybinds;
    this._scriptExecutor = scriptExecutor;
    this._currentDocument = currentDocument;
    this._allCommands = commands;
  }

  handler(e: KeyboardEvent) {
    if ((<HTMLElement>e.target).tagName.toLowerCase() === "input")
      return;

    const keypressIdentifier = Helpers.eventToKeybindKey(e);
    const commandIdentifier = this._keybinds[keypressIdentifier];

    if (commandIdentifier !== undefined) {
      this._scriptExecutor(commandIdentifier, this._allCommands.commandsHash, { e: e });
      e.stopPropagation();
      e.preventDefault();
    }

    // Prevent the backspace key from navigating back. This must be
    // handled in the keyDown handler because IE11 will navigate
    // backwards in its history before the keyPress handler gets a
    // chance to call.
    const currentDocument = this._currentDocument.getValue();
    if (e.keyCode === 8 && currentDocument !== null) {

      const currentValue = currentDocument.getCurrentSelectionValue();
      const len = currentValue.length;
      const newValue = currentValue.substring(0, len - 1);
      currentDocument.setValueOfSelectionTo(newValue);

      e.stopPropagation();
      e.preventDefault();
    }
  }
}