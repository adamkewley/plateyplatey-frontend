class NativeCommands {
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
    ];

    this._commands =
      commandClasses.map(CommandClass => new CommandClass(primativeCommands, events));
  }

  getCommandById(id) {
    return this._commands.find(command => command.id === id);
  }
}