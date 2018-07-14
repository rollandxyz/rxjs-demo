import { filter } from 'rxjs/operators';


/**
 * RxJS 6
 * https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md
 * https://github.com/ReactiveX/rxjs
 * https://youtu.be/JCXZhe6KsxQ
 * http://reactive.how/rxjs/explorer
 */

// rxjs: Contains creation methods, types, schedulers, and utilities.
import {
    of,
    from,
    fromEvent,
    timer,
    Observable,
    Subject,
    combineLatest,
    asapScheduler,
    pipe,
    interval,
    merge,
    concat,
    race,
    zip,
    forkJoin
} from 'rxjs';

// xjs/operators: Contains all pipeable operators
import {
    map, reduce,
    take, pairwise,
    switchMap, throttle, mapTo,
    catchError, mergeMap, scan, tap
} from 'rxjs/operators';
// rxjs/webSocket: Contains the web socket subject implementation
import { webSocket } from 'rxjs/webSocket';

// rxjs/ajax: Contains the Rx ajax implementation
import { ajax } from 'rxjs/ajax';

// rxjs/testing: Contains the testing utilities for RxJS
import { TestScheduler } from 'rxjs/testing';
import { HttpClient } from '@angular/common/http';


// https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm

export class EsriGeocoder {
    public logMessages: any[];

    getSuggestionsUsingLocation(): Observable<any> {
        const requestBaseUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
        const sText = 'treas';
        const location = '-115.172783,36.114789';
        const format = 'pjson';
        const url = `${requestBaseUrl}?text=${sText}&location=${location}&f=${format}`;
        return ajax.get(url).pipe ( map(r => r.response) );
    }
    getSuggestionsWithoutLocation(searchfor: string): Observable<any> {
        const requestBaseUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
        const format = 'pjson';
        const url = `${requestBaseUrl}?text=${searchfor}&f=${format}`;
        return ajax.get(url).pipe ( map(r => r.response) );
    }

    // Using suggest result in a findAddressCandidates request when isCollection=true
    findAddressCandidatesCollection(singleLine: string, magicKey: string): Observable<any> {
        const requestBaseUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
        const maxLocations = 10;
        const outFields = 'Match_addr,Place_addr,Type';
        const format = 'pjson';
        // tslint:disable-next-line:max-line-length
        const url = `${requestBaseUrl}?singleLine=${singleLine}&magicKey=${magicKey}&maxLocations=${maxLocations}&outFields=${outFields}&f=${format}`;
        return ajax.get(url).pipe ( map(r => r.response) );
    }

    // Using suggest result in a findAddressCandidates request when isCollection=false
    findAddressCandidates(singleLine: string, magicKey: string): Observable<any> {
        const requestBaseUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
        const format = 'pjson';
        // tslint:disable-next-line:max-line-length
        const url = `${requestBaseUrl}?singleLine=${singleLine}&magicKey=${magicKey}&f=${format}`;
        return ajax.get(url).pipe ( map(r => r.response) );
    }

    cascadingRequest(searchfor: string): Observable<any>   {
        return this.getSuggestionsWithoutLocation(searchfor).pipe(
            tap (data => {
                const suggestions: any[] = data.suggestions;
                suggestions.forEach(suggestion => {
                    return this.findAddressCandidates(suggestion.text, suggestion.magicKey);
                });
                console.log(data);
            }),
            switchMap(data => {
                return this.findAddressCandidates(data.suggestions[0].text, data.suggestions[0].magicKey);
            })
        );
    }
    parallellRequest(searchfor: string): Observable<any>   {
        return this.getSuggestionsWithoutLocation(searchfor).pipe(
            tap (data => {
                console.log(data);
                // const one = this.findAddressCandidates(data.suggestions[0].text, data.suggestions[0].magicKey);
                // const two = this.findAddressCandidates(data.suggestions[1].text, data.suggestions[1].magicKey);
                // return forkJoin(one, two);
            }),
            map(data => data.suggestions),
            tap(d => console.log('after map', d) ),
            filter(data => {
                return data.filter(d => d.text.indexOf('NC') !== -1 );
            }),
            // tap(d => console.log('after filter', d) ),
            // switchMap(suggestion => { return this.findAddressCandidates(suggestion.text, suggestion.magicKey); })
        );
    }
}
