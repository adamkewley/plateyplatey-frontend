import {IHttpService} from "@types/angular";

export const plateyAPI = ["$http", function($http: IHttpService) {

    this.fetchConfiguration = function() {
        return $http.get("api/configurations/default").then(resp => resp.data);
    };

    this.fetchDocument = function(documentId: string) {
        return $http.get("api/documents/" + documentId).then(resp => resp.data);
    };

    this.fetchPlateTemplateSummaries = function () {
        return $http.get("api/plates").then(resp => resp.data);
    };

    this.fetchPlateTemplateById = function(plateTemplateID: string) {
      return $http.get("api/plates/" + plateTemplateID).then(resp => resp.data);
    };
}];
