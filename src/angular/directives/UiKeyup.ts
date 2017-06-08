import {Directive, Input, ElementRef, HostListener, OnInit} from "@angular/core";
import {Command} from "../../core/commands/Command";
import {DisabledMessage} from "../../core/commands/DisabledMessage";

@Directive({ selector: "[keyup]" })
export class UiKeyup implements OnInit {

    @Input()
    keyup: Command;

    @Input()
    keyupArguments: any[] | any | null = null;

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        this.el.nativeElement.title = this.keyup.description;

        this.keyup.disabledSubject.subscribe((disabledState: DisabledMessage) => {
            if (disabledState.isDisabled) {
                this.el.nativeElement.disabled = true;
                this.el.nativeElement.title = disabledState.reason;
            } else {
                this.el.nativeElement.disabled = false;
                this.el.nativeElement.title = this.keyup.description;
            }
        });
    }

    @HostListener("keyup", ['$event'])
    onClick(e: any) {
        if (this.keyupArguments === null) {
            this.keyup.execute(e);
        } else if (this.keyupArguments instanceof Array) {
            this.keyup.execute(e, ...this.keyupArguments);
        } else {
            this.keyup.execute(e, this.keyupArguments);
        }
    }
}