import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, forkJoin, interval } from 'rxjs';
import { map, filter, concatMap, concat, merge, flatMap, delay } from 'rxjs/operators';
import { Suggestion, SuggestOutput } from '../Models/suggestion';

@Injectable()
export class RxjsDemoService {

    // the next transaction (subscription) cannot start until the previous completes!
    // output 1 2 3 a b c A B C
    getConcat(): Observable<any> {
        const observableOne$ = of(1, 2, 3).pipe(delay(500));
        const observableTwo$ = of('a', 'b', 'c').pipe(delay(1000));
        const observableThree$ = of('A', 'B', 'C');
        return observableOne$.pipe(
          concat(observableTwo$, observableThree$)
        );
      }
    // output A B C 1 2 3 a b c
    getMerge(): Observable<any> {
        const observableOne$ = of(1, 2, 3).pipe(delay(50));
        const observableTwo$ = of('a', 'b', 'c').pipe(delay(100));
        const observableThree$ = of('A', 'B', 'C');
        return observableOne$.pipe(
          merge(observableTwo$, observableThree$)
        );
      }
    // output 3 c C
    getThreeForkJoin(): Observable<any> {
        const observableOne$ = of(1, 2, 3).pipe(delay(50));
        const observableTwo$ = of('a', 'b', 'c').pipe(delay(100));
        const observableThree$ = of('A', 'B', 'C');
        return forkJoin(observableOne$, observableTwo$, observableThree$);
      }

    /*
        when all observables complete, give the last
        emitted value from each as an array
    */
    getFlatMap(): Observable<any> {
        const observableOne$ = of(1, 2, 3).pipe(delay(1000));
        const observableTwo$ = of('a', 'b', 'c').pipe(delay(100));
        const observableThree$ = of('A', 'B', 'C');
        return observableOne$.pipe(
            flatMap(x => x % 2 ? observableTwo$ : observableThree$)
        );
      }
}
