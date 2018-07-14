import { Component } from '@angular/core';
import { RxjsDemo } from '../app/rxjs-demo/rxjs-demo';
import { EsriGeocoder } from './rxjs-demo/esri.geocoder';

import { Observable, from, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // rxjsDemo = new RxjsDemo();

  geocodeResults = [];
  title = 'app';

  sortByName(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  startDemo() {

    const thingsObs = from([
      { id: 1, name: of('foo') },
      { id: 2, name: of('bar') },
      { id: 3, name: of('jazz') }
    ]);


    // Now transform and subscribe to the observable.
    let sorted$ = thingsObs.pipe(
      map(items => items.sort(this.sortByName))
    );

    // this.rxjsDemo.logMessages.push('start');
    // this.rxjsDemo.concatDemo();
    // this.rxjsDemo.conbineLatestDemo();
    // this.rxjsDemo.mapDemo();
    // this.rxjsDemo.pairwiseDemo();

    const esriGeocoder = new EsriGeocoder();
    /*
    esriGeocoder.getSuggestionsWithoutLocation('detroit').subscribe(data => {
      this.geocodeResults.push(data);
      console.log(data);
    }, error => {
      this.geocodeResults.push(error);
    });
    */

    esriGeocoder.parallellRequest('caffee').subscribe(data => {
      this.geocodeResults.push(JSON.stringify(data));
    }, error => {
      this.geocodeResults.push(error);
    });

  }
}
