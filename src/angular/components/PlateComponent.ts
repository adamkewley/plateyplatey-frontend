import {Component, Input} from "@angular/core";
import {PlateyDocument} from "../../core/document/PlateyDocument";

@Component({
    selector: "plate",
    templateUrl: "plate.html"
})
export class PlateComponent {

    @Input()
    document: PlateyDocument;

    get plateVbox(): string | null {
        if (this.document !== null) {
            return `0 0 ${this.document.gridWidth} ${this.document.gridHeight}`
        } else return null;
    }
}