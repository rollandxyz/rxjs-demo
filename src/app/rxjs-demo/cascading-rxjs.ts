import { Observable, empty, timer, forkJoin } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';

// xjs/operators: Contains all pipeable operators
import {
    map, reduce,
    take, filter, pairwise,
    switchMap, throttle, mapTo,
    catchError, mergeMap, scan,
    concatMap, expand, tap
} from 'rxjs/operators';

export class CascadingRxjsDemo {
    get(url: string): Observable<{
        content: object[],
        next: string | null}> {
      return ajax.get(url).pipe(
        map(response => ({
          content: response.response,
          next: this.next(response)
        }))
      );
    }
    next(response: AjaxResponse): string | null {
        let url: string | null = null;
        const link = response.xhr.getResponseHeader('Link');
        if (link) {
          const match = link.match(/<([^>]+)>;\s*rel="next"/);
          if (match) {
            [, url] = match;
          }
        }
        return url;
    }

    doIt() {
        const url = 'https://api.github.com/users/sindresorhus/repos';
        const repos = this.get(url).pipe(
          expand(({ next }) => next ? this.get(next) : empty()),
          concatMap(({ content }) => content)
        );
        repos.subscribe(repo => console.log(repo));
    }


    forkJoinOrderDemo() {
        const getPostOne$ = timer(1000).pipe(
            mapTo({id: 1})
        );
        const getPostTwo$ = timer(2000).pipe(
            mapTo({id: 2})
        );

        forkJoin(getPostOne$, getPostTwo$)
        .subscribe(
            res => console.log(res),
            error => console.error(),
            () => console.log('complete')
        );
    }
    login(username, password) {
        return ajax.get('/login', { method: 'POST', body: { username, password}})
        .pipe (
            map(r => r.response),
            tap (token => {  localStorage.setItem('auth', token); })
        );
    }
    getUser() {
        return ajax.get('/users', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('auth')}
        })
        .pipe (
            map(r => r.response)
        );
    }
    getOrders() {
        return ajax.get('/users', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('auth')}
        })
        .pipe (
            map(r => r.response)
        );
    }

    geocode() {
        // tslint:disable-next-line:max-line-length
        const url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=treas&location=-115.172783,36.114789&f=pjson';
        return ajax.get('url')
        .pipe (
            map(r => r.response)
        );

    }
}
