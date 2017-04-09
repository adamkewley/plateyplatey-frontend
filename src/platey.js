require("file-loader?name=[name].[ext]!index.html");
require("file-loader?name=[name].[ext]!angular/plateyApp.html");
require("file-loader?name=lib/requirejs/[name].[ext]!lib/requirejs/require.js");

import "lib/reflect-metadata";
import "lib/zone.js/dist/zone";
import "./stylesheets/platey-style.scss";
import "lib/normalize-css/normalize.css";
import "lib/bootstrap/dist/css/bootstrap.css";
import "lib/es6-shim/es6-shim";

// This is the module that kicks off the app
import "main";