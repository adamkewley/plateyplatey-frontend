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

export class AllCommands {

  _commands: Command[];
  commandsHash: { [key: string]:(...args: any[]) => any };


  constructor(primativeCommands: any, events: any) {
    this._commands = [
      new NewPlateCommand(primativeCommands),
      new ClearPlateCommand(primativeCommands),
      new InvertSelectionCommand(primativeCommands, events),
      new MoveSelectedColumnLeftCommand(primativeCommands, events),
      new MoveSelectedColumnRightCommand(primativeCommands, events),
      new ExportTableToCSVCommand(primativeCommands),
      new CopyTableToClipboardCommand(primativeCommands),
      new AddColumnCommand(primativeCommands),
      new ClearSelectionCommand(primativeCommands),
      new SelectAllCommand(primativeCommands),
      new MoveColumnSelectionLeftCommand(primativeCommands),
      new MoveColumnSelectionRightCommand(primativeCommands),
      new MoveRowFocusDownCommand(primativeCommands),
      new MoveRowFocusUpCommand(primativeCommands),
      new ClearValuesInCurrentSelectionCommand(primativeCommands),
      new ClearRowSelectionCommand(primativeCommands),
      new RemoveColumnCommand(primativeCommands),
      new SelectRowById(primativeCommands),
      new SelectRowsById(primativeCommands),
      new SelectColumnCommand(primativeCommands),
      new FocusRowCommand(primativeCommands),
      new HoverOverRowCommand(primativeCommands),
      new ObjectAccessor(),
      new SetValueOfSelectedWells(primativeCommands),
      new PromptUserForFileCommand(primativeCommands),
      new PromptUserForFilesCommand(primativeCommands),
      new ImportCSVFileCommand(primativeCommands),
      new RemoveSelectedColumnCommand(primativeCommands, events),
    ];

    this.commandsHash = {};
    this._commands.forEach(cmd => this.commandsHash[cmd.id] = (...args) => cmd.execute(...args));
  }

  getCommandById(id: string) {
    return this._commands.find(command => command.id === id);
  }
}
