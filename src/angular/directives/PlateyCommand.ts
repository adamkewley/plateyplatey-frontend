import {Helpers} from "../../Helpers";
import {Command} from "../../core/commands/Command";
import {Directive, ElementRef, Host, HostListener, Input, OnInit} from "@angular/core";
import {PlateyApp} from "../../core/PlateyApp";
import {PlateyCommandController} from "../../core/PlateyCommandController";
import {PlateyScript} from "../../core/scripting/PlateyScript";

@Directive({ selector: "[plateyCommand]" })
export class PlateyCommand implements OnInit {

  @Input()
  plateyCommand: string;

  commandController: PlateyCommandController;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const commandId = PlateyScript.getFirstSymbolName(this.plateyCommand);
  }

  @HostListener("click")
  onClick() {
    // this.commandController.executePlateyExpression()
  }
}

/*

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
*/