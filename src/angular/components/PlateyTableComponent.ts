import {Component, Input} from "@angular/core";
import {PlateyDocument} from "../../core/document/PlateyDocument";
import {Command} from "../../core/commands/Command";

@Component({
    selector: "platey-table",
    templateUrl: "table.html"
})
export class PlateyTableComponent {

    @Input()
    document: PlateyDocument;

    @Input()
    commands: { [commandId: string]: Command };
}