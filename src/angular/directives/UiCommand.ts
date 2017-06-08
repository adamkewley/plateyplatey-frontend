import {Directive, Input, ElementRef, HostListener, OnInit} from "@angular/core";
import {Command} from "../../core/commands/Command";
import {DisabledMessage} from "../../core/commands/DisabledMessage";

@Directive({ selector: "[command]" })
export class UiCommand implements OnInit {

    @Input()
    command: Command;

    @Input()
    commandArguments: any[] | any | null = null;

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        this.el.nativeElement.title = this.command.description;

        this.command.disabledSubject.subscribe((disabledState: DisabledMessage) => {
            if (disabledState.isDisabled) {
                this.el.nativeElement.disabled = true;
                this.el.nativeElement.title = disabledState.reason;
            } else {
                this.el.nativeElement.disabled = false;
                this.el.nativeElement.title = this.command.description;
            }
        });
    }

    @HostListener("click", ['$event'])
    onClick(e: any) {
        if (this.commandArguments === null) {
            this.command.execute(e);
        } else if (this.commandArguments instanceof Array) {
            this.command.execute(e, ...this.commandArguments);
        } else {
            this.command.execute(e, this.commandArguments);
        }
    }
}