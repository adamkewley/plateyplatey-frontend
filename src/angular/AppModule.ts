import {NgModule} from '@angular/core';
import {Http, HttpModule} from "@angular/http";
import {BrowserModule} from '@angular/platform-browser';
import {PlateyComponent} from "./components/PlateyComponent";
import {PlateyCommand} from "./directives/PlateyCommand";
import {PlateyKeyup} from "./directives/PlateyKeyup";
import {PlateyRadius} from "./directives/PlateyRadius";
import {VBox} from "./directives/VBox";
import {PlateyAPI} from "./PlateyAPI";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ PlateyComponent, PlateyCommand, PlateyKeyup, PlateyRadius, VBox ],
  providers: [ PlateyAPI ],
  bootstrap:    [ PlateyComponent ]
})
export class AppModule {}