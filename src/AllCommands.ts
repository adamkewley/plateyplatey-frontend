import {NewPlateCommand} from "./commands/NewPlateCommand";
import {ClearPlateCommand} from "./commands/ClearPlateCommand";
import {InvertSelectionCommand} from "./commands/InvertSelectionCommand";
import {MoveSelectedColumnLeftCommand} from "./commands/MoveSelectedColumnLeftCommand";
import {MoveSelectedColumnRightCommand} from "./commands/MoveSelectedColumnRightCommand";
import {ExportTableToCSVCommand} from "./commands/ExportTableToCSVCommand";
import {CopyTableToClipboardCommand} from "./commands/CopyTableToClipboardCommand";
import {AddColumnCommand} from "./commands/AddColumnCommand";
import {ClearSelectionCommand} from "./commands/ClearSelectionCommand";
import {SelectAllCommand} from "./commands/SelectAllCommand";
import {MoveColumnSelectionLeftCommand} from "./commands/MoveColumnSelectionLeftCommand";
import {MoveColumnSelectionRightCommand} from "./commands/MoveColumnSelectionRightCommand";
import {MoveRowFocusDownCommand} from "./commands/MoveRowFocusDownCommand";
import {MoveRowFocusUpCommand} from "./commands/MoveRowFocusUpCommand";
import {ClearValuesInCurrentSelectionCommand} from "./commands/ClearValuesInCurrentSelectionCommand";
import {ClearRowSelectionCommand} from "./commands/ClearRowSelectionCommand";
import {RemoveColumnCommand} from "./commands/RemoveColumnCommand";
import {SelectRowById} from "./commands/SelectRowById";
import {SelectRowsById} from "./commands/SelectRowsById";
import {SelectColumnCommand} from "./commands/SelectColumnCommand";
import {FocusRowCommand} from "./commands/FocusRowCommand";
import {HoverOverRowCommand} from "./commands/HoverOverRowCommand";
import {ObjectAccessor} from "./commands/ObjectAccessor";
import {SetValueOfSelectedWells} from "./commands/SetValueOfSelectedWells";
import {PromptUserForFileCommand} from "./commands/PromptUserForFileCommand";
import {PromptUserForFilesCommand} from "./commands/PromptUserForFilesCommand";
import {ImportCSVFileCommand} from "./commands/ImportCSVFileCommand";
import {RemoveSelectedColumnCommand} from "./commands/RemoveSelectedColumnCommand";
import {Command} from "./commands/Command";
import {BehaviorSubject} from "rxjs";
import {PlateyDocument} from "./PlateyDocument";
import {PlateyApp} from "./PlateyApp";

export class AllCommands {

  _commands: Command[];
  commandsHash: { [key: string]:(...args: any[]) => any };

  constructor(currentDocument: BehaviorSubject<PlateyDocument | null>, app: PlateyApp) {

    this._commands = [
      new NewPlateCommand(app),
      new ClearPlateCommand(currentDocument),
      new InvertSelectionCommand(currentDocument),
      new MoveSelectedColumnLeftCommand(currentDocument),
      new MoveSelectedColumnRightCommand(currentDocument),
      new ExportTableToCSVCommand(currentDocument),
      new CopyTableToClipboardCommand(currentDocument),
      new AddColumnCommand(currentDocument),
      new ClearSelectionCommand(currentDocument),
      new SelectAllCommand(currentDocument),
      new MoveColumnSelectionLeftCommand(currentDocument),
      new MoveColumnSelectionRightCommand(currentDocument),
      new MoveRowFocusDownCommand(currentDocument),
      new MoveRowFocusUpCommand(currentDocument),
      new ClearValuesInCurrentSelectionCommand(currentDocument),
      new ClearRowSelectionCommand(currentDocument),
      new RemoveColumnCommand(currentDocument),
      new SelectRowById(currentDocument),
      new SelectRowsById(currentDocument),
      new SelectColumnCommand(currentDocument),
      new FocusRowCommand(currentDocument),
      new HoverOverRowCommand(currentDocument),
      new ObjectAccessor(),
      new SetValueOfSelectedWells(currentDocument),
      new PromptUserForFileCommand(),
      new PromptUserForFilesCommand(),
      new ImportCSVFileCommand(app),
      new RemoveSelectedColumnCommand(currentDocument),
    ];

    this.commandsHash = {};
    this._commands.forEach(cmd => this.commandsHash[cmd.id] = (...args) => cmd.execute(...args));
  }

  getCommandById(id: string): Command | null {
    const command = this._commands.find(command => command.id === id);

    return command === undefined ? null : command;
  }
}
