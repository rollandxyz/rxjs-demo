import { Candidate } from './../Models/candidate';


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, filter, concatMap, concat, merge, flatMap } from 'rxjs/operators';
import { Suggestion, SuggestOutput } from '../Models/suggestion';

@Injectable()
export class GeoCodeService {
  constructor(private http: HttpClient) { }

  getSuggestionsWithoutLocation(searchfor: string): Observable<Suggestion[]> {
    const requestBaseUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest';
    const format = 'pjson';
    const url = `${requestBaseUrl}?text=${searchfor}&f=${format}`;
    return this.http.get<SuggestOutput>(url).pipe(
      map(data => data.suggestions)
    );
  }

  // Receive all the values from the first observable
  // before receiving values from the second
  getConcat(): Observable<any[]> {
    const observableOne$ = this.getSuggestionsWithoutLocation('coffee');
    const observableTwo$ = this.getSuggestionsWithoutLocation('detroit');
    const observableThree$ = this.getSuggestionsWithoutLocation('chicken');
    return observableOne$.pipe(
      concat(observableTwo$, observableThree$)
    );
  }

  // similar to concat,
  // but will interleave the emitted values
  getMerge(): Observable<any[]> {
    const observableOne$ = this.getSuggestionsWithoutLocation('coffee');
    const observableTwo$ = this.getSuggestionsWithoutLocation('detroit');
    const observableThree$ = this.getSuggestionsWithoutLocation('chicken');
    return observableOne$.pipe(
      merge(observableTwo$, observableThree$)
    );
  }

  //  execute observables in parallel
  // all observables completed before we received the result
  getThreeForkJoin(): Observable<any[]> {
    const observableOne$ = this.getSuggestionsWithoutLocation('coffee');
    const observableTwo$ = this.getSuggestionsWithoutLocation('detroit');
    const observableThree$ = this.getSuggestionsWithoutLocation('chicken');
    return forkJoin(observableOne$, observableTwo$, observableThree$);
  }

  // Using suggest result in a findAddressCandidates request when isCollection=false
  findAddressCandidates(singleLine: string, magicKey: string): Observable<Candidate[]> {
    const requestBaseUrl = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
    const format = 'pjson';
    // tslint:disable-next-line:max-line-length
    const url = `${requestBaseUrl}?singleLine=${singleLine}&magicKey=${magicKey}&f=${format}`;
    return this.http.get<any>(url).pipe (
      map(r => r.candidates)
    );
  }

  // flatMap is how we handle dependencies between observables
  getFlatMap(): Observable<Candidate[]> {
    const observableOne$ = this.getSuggestionsWithoutLocation('coffee');
    return observableOne$.pipe(
      flatMap((suggestions: Suggestion[]) => {
        suggestions.filter(s => s.isCollection);
        return this.findAddressCandidates(suggestions[0].text, suggestions[0].magicKey);
      })
    );
  }
}
