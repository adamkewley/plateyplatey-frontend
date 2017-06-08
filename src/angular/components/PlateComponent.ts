import {Component, Input} from "@angular/core";
import {PlateyDocument} from "../../core/document/PlateyDocument";
import {Command} from "../../core/commands/Command";

@Component({
    selector: "plate",
    templateUrl: "plate.html"
})
export class PlateComponent {

    @Input()
    document: PlateyDocument;

    @Input()
    commands: { [commandId: string]: Command };

    get plateVbox(): string | null {
        if (this.document !== null) {
            return `0 0 ${this.document.gridWidth} ${this.document.gridHeight}`
        } else return null;
    }
}