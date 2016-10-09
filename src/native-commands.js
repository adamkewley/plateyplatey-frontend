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
      RemoveColumnCommand,
    ];

    this._commands =
      commandClasses.map(CommandClass => new CommandClass(primativeCommands, events));

    this.commandsHash = {};
    this._commands.forEach(cmd => this.commandsHash[cmd.id] = (...args) => cmd.execute(...args));
  }

  getCommandById(id) {
    return this._commands.find(command => command.id === id);
  }
}