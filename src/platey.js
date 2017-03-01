import angular from "lib/angular";

require("file-loader?name=[name].[ext]!index.html");
require("file-loader?name=lib/requirejs/[name].[ext]!lib/requirejs/require.js");

import "stylesheets/platey-style.scss";
import "lib/normalize-css/normalize.css";
import "lib/bootstrap/dist/css/bootstrap.css";

import "lib/es6-shim/es6-shim";

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
  "plateyPersistence"
]);
