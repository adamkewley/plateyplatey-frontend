import {IHttpService, IPromise} from "@types/angular";
import {PlateySavedDocument} from "./PlateySavedDocument";
import {PlateyConfiguration} from "./PlateyConfiguration";
import {PlateSummary} from "./PlateSummary";
import {Plate} from "./Plate";

export class PlateyAPI {

    private _$http: IHttpService;

    constructor($http: IHttpService) {
        this._$http = $http;
    }

    fetchConfiguration(): IPromise<PlateyConfiguration> {
        return this._$http.get("api/configurations/default").then(resp => resp.data);
    }

    fetchDocument(documentId: string): IPromise<PlateySavedDocument> {
        return this._$http.get("api/documents/" + documentId).then(resp => resp.data);
    }

    fetchPlateTemplateSummaries(): IPromise<PlateSummary[]> {
        return this._$http.get("api/plates").then(resp => resp.data);
    }

    fetchPlateTemplateById(plateTemplateId: string): IPromise<Plate> {
        return this._$http.get("api/plates/" + plateTemplateId).then(resp => resp.data);
    }
}

export const plateyAPI = ["$http", PlateyAPI];
