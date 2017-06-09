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
import {SelectRows} from "./commands/SelectRows";
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
import {PlateyApp} from "./PlateyApp";
import {ExportDocumentAsJSONCommand} from "./commands/ExportDocumentAsJSONCommand";
import {OpenDocumentCommand} from "./commands/OpenDocumentCommand";

export class AppCommands {

  _commands: Command[];
  commandsHash: { [key: string]:Command };

  constructor(app: PlateyApp) {

    this._commands = [
      new NewPlateCommand(app),
      new ClearPlateCommand(app.currentDocument),
      new InvertSelectionCommand(app.currentDocument),
      new MoveSelectedColumnLeftCommand(app.currentDocument),
      new MoveSelectedColumnRightCommand(app.currentDocument),
      new ExportTableToCSVCommand(app.currentDocument),
      new CopyTableToClipboardCommand(app.currentDocument),
      new AddColumnCommand(app.currentDocument),
      new ClearSelectionCommand(app.currentDocument),
      new SelectAllCommand(app.currentDocument),
      new MoveColumnSelectionLeftCommand(app.currentDocument),
      new MoveColumnSelectionRightCommand(app.currentDocument),
      new MoveRowFocusDownCommand(app.currentDocument),
      new MoveRowFocusUpCommand(app.currentDocument),
      new ClearValuesInCurrentSelectionCommand(app.currentDocument),
      new ClearRowSelectionCommand(app.currentDocument),
      new RemoveColumnCommand(app.currentDocument),
      new SelectRowById(app.currentDocument),
      new SelectRows(app.currentDocument),
      new SelectColumnCommand(app.currentDocument),
      new FocusRowCommand(app.currentDocument),
      new HoverOverRowCommand(app.currentDocument),
      new ObjectAccessor(),
      new SetValueOfSelectedWells(app.currentDocument),
      new PromptUserForFileCommand(),
      new PromptUserForFilesCommand(),
      new ImportCSVFileCommand(app),
      new RemoveSelectedColumnCommand(app.currentDocument),
      new ExportDocumentAsJSONCommand(app.currentDocument),
      new OpenDocumentCommand(app)
    ];

    this.commandsHash = {};
    this._commands.forEach(cmd => this.commandsHash[cmd.id] = cmd);
  }

  getCommandById(id: string): Command | null {
    const command = this._commands.find(command => command.id === id);

    return command === undefined ? null : command;
  }
}
