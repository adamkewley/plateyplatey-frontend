angular
    .module("plateyPersistence", [])
    .service("plateyPersistence", ["$http", function($http) {

	this.fetchConfiguration = function() {
	    return $http.get("configurations/default.json").then(resp => resp.data);
	};

        this.fetchDocument = function(documentId) {
          return $http.get("documents/" + documentId).then(resp => resp.data);
        };
    }]);
