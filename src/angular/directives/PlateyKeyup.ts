import {Directive, ElementRef, HostBinding, Input} from "@angular/core";

@Directive({ selector: "[plateyKeyup]" })
export class PlateyKeyup {

  @Input()
  plateyKeyup: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {

  }

  //@HostBinding("keyup")
  onKeyup() {

  }
}

/*

export const plateyKeyup: IDirective = [function() {
  function link(scope: IScope, element: JQuery, attrs: IAttributes) {
    const el = element[0];
    const expr = attrs.plateyKeyup;

    el.addEventListener("keyup", (e) => {
      scope.$apply(() => {
        scope.exec(expr, scope, scope.commands, { "e": e });
      });
    });
  }

  return { link: link };
}];

  */