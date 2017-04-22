import {PlateySavedDocument} from "../../core/apitypes/PlateySavedDocument";
import {PlateyConfiguration} from "../../core/apitypes/PlateyConfiguration";
import {PlateSummary} from "../../core/apitypes/PlateSummary";
import {Plate} from "../../core/apitypes/Plate";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class PlateyAPI {

    private httpService: Http;

    constructor(httpService: Http) {
        this.httpService = httpService;
    }

    fetchConfiguration(): Observable<PlateyConfiguration> {
        return this.httpService.get("api/configurations/default").map(resp => resp.json());
    }

    fetchDocument(documentId: string): Observable<PlateySavedDocument> {
        return this.httpService.get("api/documents/" + documentId).map(resp => resp.json());
    }

    fetchPlateTemplateSummaries(): Observable<{ [plateId: string]: PlateSummary }> {
        return this.httpService.get("api/plates").map(resp => resp.json());
    }

    fetchPlateTemplateById(plateTemplateId: string): Observable<Plate> {
        return this.httpService.get("api/plates/" + plateTemplateId).map(resp => resp.json());
    }
}
