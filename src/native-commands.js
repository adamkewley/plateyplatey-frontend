import NewPlateCommand from "commands/new-plate.js";
import ClearPlateCommand from "commands/clear-plate";
import InvertSelectionCommand from "commands/invert-selection";
import MoveSelectedColumnLeftCommand from "commands/move-selected-column-left";
import MoveSelectedColumnRightCommand from "commands/move-selected-column-right";
import ExportTableToCSVCommand from "commands/export-table-to-csv";
import CopyTableToClipboardCommand from "commands/copy-table-to-clipboard";
import AddColumnCommand from "commands/add-column";
import ClearSelectionCommand from "commands/clear-selection";
import SelectAllCommand from "commands/select-all";
import MoveColumnSelectionLeftCommand from "commands/move-column-selection-left";
import MoveColumnSelectionRightCommand from "commands/move-column-selection-right";
import MoveRowFocusDownCommand from "commands/move-row-focus-down";
import MoveRowFocusUpCommand from "commands/move-row-focus-up";
import ClearValuesInCurrentSelectionCommand from "commands/clear-values-in-current-selection";
import ClearRowSelectionCommand from "commands/clear-row-selection";
import RemoveColumnCommand from "commands/remove-column";
import SelectRowById from "commands/select-row-by-id";
import SelectRowsById from "commands/select-rows-by-id";
import SelectColumn from "commands/select-column";
import FocusRow from "commands/focus-row";
import HoverOverRow from "commands/hover-over-row";
import ObjectAccessor from "commands/object-accessor";
import SetValueOfSelectedWells from "commands/set-value-of-selected-wells";
import PromptUserForFile from "commands/prompt-user-for-file";
import PromptUserForFiles from "commands/prompt-user-for-files";
import ImportCsvFile from "commands/import-csv-file";
import RemoveSelectedColumnCommand from "commands/remove-selected-column";

export default class NativeCommands {

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
