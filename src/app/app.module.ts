import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GeoCodeService } from './Services/geocoder.service';
import { ArcgisGeocoderComponent } from './Components/arcgis-geocoder/arcgis-geocoder.component';
import { RxjsDemoComponent } from './Components/rxjs-demo/rxjs-demo.component';
import { RxjsDemoService } from './Services/rxjs.demo.service';

@NgModule({
  declarations: [
    AppComponent,
    ArcgisGeocoderComponent,
    RxjsDemoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [GeoCodeService, RxjsDemoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
