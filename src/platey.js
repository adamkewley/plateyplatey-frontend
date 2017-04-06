import angular from "lib/angular";

require("file-loader?name=[name].[ext]!index.html");
require("file-loader?name=lib/requirejs/[name].[ext]!lib/requirejs/require.js");

import "stylesheets/platey-style.scss";
import "lib/normalize-css/normalize.css";
import "lib/bootstrap/dist/css/bootstrap.css";

import "lib/es6-shim/es6-shim";

import { plateyController } from "plateyController.controller";
import { plateyCommand } from "scripting/plateyCommand.directive";
import { plateyKeyup } from "scripting/plateyKeyup.directive";
import { plateyAPI } from "api/plateyAPI.service";
import { plateyRadius } from "helpers/plateyRadius.directive";
import { rangeFilter } from "helpers/rangeFilter.directive";
import { vbox } from "helpers/vbox.directive";

angular.module("plateyController", []).controller("plateyController", plateyController);
angular.module("plateyCommand", []).directive("plateyCommand", plateyCommand);
angular.module("plateyKeyup", []).directive("plateyKeyup", plateyKeyup);
angular.module("plateyAPI", []).service("plateyAPI", plateyAPI);
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
  "plateyAPI"
]);
