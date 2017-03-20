export const plateyAPI = ["$http", function($http) {

    this.fetchConfiguration = function() {
        return $http.get("api/configurations/default").then(resp => resp.data);
    };

    this.fetchDocument = function(documentId) {
        return $http.get("api/documents/" + documentId).then(resp => resp.data);
    };

    this.getPlateTemplateSummaries = function () {
        return $http.get("api/plates").then(resp => resp.data);
    };

    this.getPlateTemplateByID = function(plateTemplateID) {
      return $http.get("api/plates/" + plateTemplateID).then(resp => resp.data);
    };
}];
