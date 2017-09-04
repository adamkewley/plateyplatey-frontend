import {Component, Input, ElementRef, ViewChild} from "@angular/core";
import {PlateyDocument} from "../../core/document/PlateyDocument";
import {Command} from "../../core/commands/Command";
import domtoimage from "dom-to-image";
import {Helpers} from "../../Helpers";

@Component({
    selector: "plate",
    templateUrl: "plate.html"
})
export class PlateComponent {

    @Input()
    document: PlateyDocument;

    @Input()
    commands: { [commandId: string]: Command };

    @ViewChild("platesvg")
    private plateSVG: ElementRef;

    @ViewChild("imgdownload")
    private imgDownloadBtn: ElementRef;

    ngAfterViewInit() {
        this.imgDownloadBtn.nativeElement.onclick =
            this.onDownloadImageClick.bind(this);
    }

    onDownloadImageClick() {
        domtoimage.toPng(this.plateSVG.nativeElement, {})
            .then((link: string) =>
                Helpers.clickTemporaryLink(link, "plate.png"));
    }

    get plateVbox(): string | null {
        if (this.document !== null) {
            return `0 0 ${this.document.gridWidth} ${this.document.gridHeight}`
        } else return null;
    }
}