import getFirstSymbolName from "platey-lang/get-first-symbol";

export default function() {

  function link(scope, element, attrs) {
    const el = element[0];
    const expr = attrs.plateyCommand;
    const commandId = getFirstSymbolName(expr);
    const commandDetails = scope.getCommandDetails(commandId);

    commandDetails.disabledSubject.subscribe(e => {
      const keybinds =
        scope.getKeybindsAssociatedWith(expr).join(", ");

      const hasKeybinds = keybinds.length > 0;

      el.disabled = e.isDisabled;
      el.title = (e.isDisabled && e.hasReason) ? e.reason : commandDetails.description + (hasKeybinds ? " (" + keybinds + ")" : "");
    });

    el.addEventListener("click", (e) => {
      scope.$apply(() => {
        scope.exec(expr, scope, scope.commands, { "e": e });
      });
    });
  }

  return { link: link };
}
