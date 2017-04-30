import {NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";
import {BrowserModule} from '@angular/platform-browser';
import {PlateyComponent} from "./components/PlateyComponent";
import {PlateyAPI} from "./services/PlateyAPI";
import {FormsModule} from "@angular/forms";
import {UiCommand} from "./directives/UiCommand";
import {UiKeyup} from "./directives/UiKeyup";
import {PlateComponent} from "./components/PlateComponent";

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ PlateyComponent, UiCommand, UiKeyup, PlateComponent],
  providers: [ PlateyAPI ],
  bootstrap:    [ PlateyComponent ]
})
export class AppModule {}