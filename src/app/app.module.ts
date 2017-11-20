import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { NoContentComponent } from '../no-content/no-content.component';


@NgModule ({
  declarations: [
    AppComponent,
    NoContentComponent
  ],
  imports     : [
    BrowserModule
  ],
  providers   : [],
  bootstrap   : [ AppComponent ]
})
export class AppModule {

  constructor () {

  }
}
