import {Directive, ElementRef, Input} from "@angular/core";

@Directive({ selector: "[vbox]" })
export class VBox {

  constructor(private el: ElementRef) {}

  @Input()
  set vbox(value: string) {
    if (value !== null)
      this.el.nativeElement.setAttribute("viewBox", value);
  }
}