import {Directive, ElementRef, Input} from "@angular/core";

@Directive({ selector: "[plateyRadius]" })
export class PlateyRadius {

  constructor(private el: ElementRef) {}

  @Input()
  set plateyRadius(value: string) {
    if (value !== null)
      this.el.nativeElement.setAttribute("r", value);
  }
}