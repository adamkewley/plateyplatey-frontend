import angular from "lib/angular";

require("stylesheets/platey-style.scss");

import plateyController from "plateyController.controller";
import plateyCommand from "plateyCommand.directive";
import plateyCommandController from "plateyCommandController.service";
import plateyKeyup from "plateyKeyup.directive";
import plateyPersistence from "plateyPersistence.service";
import plateyRadius from "plateyRadius.directive";
import rangeFilter from "rangeFilter.directive";
import vbox from "vbox.directive";

angular.module("plateyCommand", []).directive("plateyCommand", plateyCommand);
angular.module("plateyController", []).controller("plateyController", plateyController);
angular.module("plateyCommandController", []).service("plateyCommandController", plateyCommandController);
angular.module("plateyKeyup", []).directive("plateyKeyup", plateyKeyup);
angular.module("plateyPersistence", []).service("plateyPersistence", plateyPersistence);
angular.module("plateyRadius", []).directive("plateyRadius", plateyRadius);
angular.module("rangeFilter", []).filter("range", rangeFilter);
angular.module("vbox", []).directive("vbox", vbox);

angular.module("plateyApp", [
  "plateyController",
  "plateyCommand",
  "plateyKeyup",
  "plateyRadius",
  "vbox",
  "rangeFilter",
  "plateyCommandController",
  "plateyPersistence",
]);
