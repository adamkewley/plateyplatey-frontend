require("file-loader?name=[name].[ext]!index.html");
require("file-loader?name=[name].[ext]!angular/mainUI.html");
require("file-loader?name=[name].[ext]!angular/plate.html");
require("file-loader?name=lib/requirejs/[name].[ext]!lib/requirejs/require.js");

import "lib/reflect-metadata";
import "lib/zone.js/dist/zone";
import "lib/normalize-css/normalize.css";
import "lib/bootstrap/dist/css/bootstrap.css";
import "./stylesheets/platey-style.scss";
import "lib/es6-shim/es6-shim";

// This is the module that kicks off the app
import "main";