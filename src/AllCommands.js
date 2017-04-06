import NewPlateCommand from "commands/NewPlateCommand.js";
import ClearPlateCommand from "commands/ClearPlateCommand";
import InvertSelectionCommand from "commands/InvertSelectionCommand";
import MoveSelectedColumnLeftCommand from "commands/MoveSelectedColumnLeftCommand";
import MoveSelectedColumnRightCommand from "commands/MoveSelectedColumnRightCommand";
import ExportTableToCSVCommand from "commands/ExportTableToCSVCommand";
import CopyTableToClipboardCommand from "commands/CopyTableToClipboardCommand";
import AddColumnCommand from "commands/AddColumnCommand";
import ClearSelectionCommand from "commands/ClearSelectionCommand";
import SelectAllCommand from "commands/SelectAllCommand";
import MoveColumnSelectionLeftCommand from "commands/MoveColumnSelectionLeftCommand";
import MoveColumnSelectionRightCommand from "commands/MoveColumnSelectionRightCommand";
import MoveRowFocusDownCommand from "commands/MoveRowFocusDownCommand";
import MoveRowFocusUpCommand from "commands/MoveRowFocusUpCommand";
import ClearValuesInCurrentSelectionCommand from "commands/ClearValuesInCurrentSelectionCommand";
import ClearRowSelectionCommand from "commands/ClearRowSelectionCommand";
import RemoveColumnCommand from "commands/RemoveColumnCommand";
import SelectRowById from "commands/SelectRowById";
import SelectRowsById from "commands/SelectRowsById";
import SelectColumn from "commands/SelectColumnCommand";
import FocusRow from "commands/FocusRowCommand";
import HoverOverRow from "commands/HoverOverRowCommand";
import ObjectAccessor from "commands/ObjectAccessor";
import SetValueOfSelectedWells from "commands/SetValueOfSelectedWells";
import PromptUserForFile from "commands/PromptUserForFileCommand";
import PromptUserForFiles from "commands/PromptUserForFilesCommand";
import ImportCsvFile from "commands/ImportCSVFileCommand";
import RemoveSelectedColumnCommand from "commands/RemoveSelectedColumnCommand";

export default class AllCommands {

  constructor(primativeCommands, events) {

    const commandClasses = [
      NewPlateCommand,
      ClearPlateCommand,
      InvertSelectionCommand,
      MoveSelectedColumnLeftCommand,
      MoveSelectedColumnRightCommand,
      ExportTableToCSVCommand,
      CopyTableToClipboardCommand,
      AddColumnCommand,
      ClearSelectionCommand,
      SelectAllCommand,
      MoveColumnSelectionLeftCommand,
      MoveColumnSelectionRightCommand,
      MoveRowFocusDownCommand,
      MoveRowFocusUpCommand,
      ClearValuesInCurrentSelectionCommand,
      ClearRowSelectionCommand,
      RemoveColumnCommand,
      SelectRowById,
      SelectRowsById,
      SelectColumn,
      FocusRow,
      HoverOverRow,
      ObjectAccessor,
      SetValueOfSelectedWells,
      PromptUserForFile,
      PromptUserForFiles,
      ImportCsvFile,
      RemoveSelectedColumnCommand,
    ];

    this._commands =
      commandClasses.map(commandClass => new commandClass(primativeCommands, events));

    this.commandsHash = {};
    this._commands.forEach(cmd => this.commandsHash[cmd.id] = (...args) => cmd.execute(...args));
  }

  getCommandById(id) {
    return this._commands.find(command => command.id === id);
  }
}
