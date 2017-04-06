import getFirstSymbolName from "./getFirstSymbolName";
import {IAttributes, IDirective, IScope} from "angular";
import {Command} from "../commands/Command";

export function plateyCommand(): IDirective {

  function link(scope: IScope, element: JQuery, attrs: IAttributes) {
    const el = <HTMLInputElement>element[0];
    const expr = attrs.plateyCommand;
    const commandId = getFirstSymbolName(expr);
    const commandDetails: Command = scope.getCommandDetails(commandId);

    commandDetails.disabledSubject.subscribe(e => {
      const keybinds =
        scope.getKeybindsAssociatedWith(expr).join(", ");

      const hasKeybinds = keybinds.length > 0;

      el.disabled = e.isDisabled;
      el.title = (e.isDisabled && e.reason) ? e.reason : commandDetails.description + (hasKeybinds ? " (" + keybinds + ")" : "");
    });

    el.addEventListener("click", (e) => {
      scope.$apply(() => {
        scope.exec(expr, scope, scope.commands, { "e": e });
      });
    });
  }

  return { link: link };
}
