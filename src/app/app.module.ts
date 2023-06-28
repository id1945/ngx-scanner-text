import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxScannerTextModule } from 'ngx-scanner-text';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxScannerTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
