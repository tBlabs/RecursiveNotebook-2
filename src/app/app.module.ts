import { StorageService } from './storage.service';
import { CqrsBus } from 'app/cqrs/cqrs.bus';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [CqrsBus,
  StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
