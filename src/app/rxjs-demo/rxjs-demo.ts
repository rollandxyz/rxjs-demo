
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
    take, filter, pairwise,
    switchMap, throttle, mapTo,
    catchError, mergeMap, scan
} from 'rxjs/operators';


// rxjs/webSocket: Contains the web socket subject implementation
import { webSocket } from 'rxjs/webSocket';

// rxjs/ajax: Contains the Rx ajax implementation
import { ajax } from 'rxjs/ajax';

// rxjs/testing: Contains the testing utilities for RxJS
import { TestScheduler } from 'rxjs/testing';


/**
 * 1.Use Piping Instead of Chaining
 * 2.Some operators have a name change due to name collisions with JavaScript reserved words!
 *  do -> tap,
 *  catch -> catchError,
 *  switch -> switchAll,
 *  finally -> finalize.
 *
 * 3.Use Functions instead of Classes
 */
/**
 * https://www.learnrxjs.io/operators/creation/timer.html
 * https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md
 *
 * Different internal structure that requires you to change your import statements
 * pipe() as a method to chain your operators, the old way of chaining them will not work
 *
 */

export class RxjsDemo {
    public logMessages: any[];

    constructor() {
        this.logMessages = [];
    }

    // use pipeable operators
    // Use piping instead of chaining as new operator syntax.
    // The result of one operator is piped into another operator
    pipableDemo() {
        const source =  of(1, 2, 3);
        source.pipe(
            map(x => x + x),
            mergeMap(n => of(n + 1, n + 2).pipe(
              filter(x => x % 1 === 0),
              scan((acc, x) => acc + x, 0),
            )),
            catchError(err => of('error found')),
          ).subscribe();
    }
    /** Functions have replaced classes that operate on observables.
     * All observable classes have been removed.
     * Their functionality is replaced by existing operators, new operators, or functions.
     * Each of their replacement has the same functionality that each class had
     *
     */
    funcInsteadOfClass() {

    }


    // map is a function, you still need a way to connect it to your observable
    mapDemo() {
        const myObservable =  of(1, 2, 3);
        myObservable.pipe(map(data => data * 2)).subscribe(val =>
            this.logMessages.push('Example: Basic concat:', val)
        );
    }

    concatDemo() {
        // emit 0 after 1 second then complete, since no second argument is supplied
        const getPostOne$ = timer(1000);
        // output: 0
        const subscribe1 = getPostOne$.subscribe(val => this.logMessages.push(val));

        /*
          timer takes a second argument, how often to emit subsequent values
          in this case we will emit first value after 1 second and subsequent
          values every 2 seconds after
        */
        const getPostTwo$ = timer(1000, 2000);
        // output: 0,1,2,3,4,5......
        const subscribe2 = getPostTwo$.subscribe(val => this.logMessages.push(val));

        // concat 2 basic observables
        // a.pipe(concat(b, c)) becomes concat(a, b, c)

        const example = concat(getPostOne$, getPostTwo$);
        const subscribe = example.subscribe(val =>
            this.logMessages.push('Example: Basic concat:', val)
        );
    }
    concatStaticDemo() {
        // emits 1,2,3
        const sourceOne = of(1, 2, 3);

        // emits 4,5,6
        const sourceTwo = of(4, 5, 6);

        // used as static
        const example = concat(sourceOne, sourceTwo);

        // output: 1,2,3,4,5,6
        const subscribe = example.subscribe(val => console.log(val));
    }

    /** Six Operators That you Must Know */
    // combineLatest
    conbineLatestDemo() {
        this.logMessages.push('conbineLatestDemo');
        // timerOne emits first value at 1s, then once every 4s
        const timerOne = timer(1000, 4000);
        // timerTwo emits first value at 2s, then once every 4s
        const timerTwo = timer(2000, 4000);
        // timerThree emits first value at 3s, then once every 4s
        const timerThree = timer(3000, 4000);

        // when one timer emits, emit the latest values from each timer as an array
        const combined = combineLatest(timerOne, timerTwo, timerThree);
        const subscribe = combined.subscribe(
            ([timerValOne, timerValTwo, timerValThree]) => {
              /*
                Example:
              timerOne first tick: 'Timer One Latest: 1, Timer Two Latest:0, Timer Three Latest: 0
              timerTwo first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 0
              timerThree first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 1
            */
           this.logMessages.push(
                `Timer One Latest: ${timerValOne},
               Timer Two Latest: ${timerValTwo},
               Timer Three Latest: ${timerValThree}`
              );
            }
        );
    }

    /**
     * Don’t let me know until all the Observables are complete,
     * then give me all the values at once. ( Array )
     * Use this operator when you need to run the Observables in parallel.
     */
    forkJoinDemo() {
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

    /**
     * Only when the inner Observable emits,
     * let me know by merging the value to the outer Observable
     */
    mergeMapDemo() {
        const post$ = of({id: 1});
        const getPostInfo$ = timer(3000)
        .pipe(
            mapTo({title: 'Post title'}),
            mergeMap(post => getPostInfo$)
        ).subscribe(res => console.log(res));
        // const posts$ = mergeMap(post => getPostInfo$)
    }

    /**
     * Let me know when the Observable emits,
     * but also give me the previous value. ( Array )
     */
    pairwiseDemo() {
        // Tracking the scroll delta
        fromEvent(document, 'scroll')
        .pipe (
            map(e => window.pageYOffset),
            pairwise()
        )
        .subscribe(pair => console.log(pair)); // pair[1] - pair[0]
    }

    /**
     * Like mergeMap but when the source Observable emits cancel
     * any previous subscriptions of the inner Observable.
     */
    switchMapDemo() {
        const clicks$ = fromEvent(document, 'click');
        const innerObservable$ = interval(1000);

        clicks$.pipe(
            switchMap(event => innerObservable$)
        ).subscribe(val => console.log(val));
    }

    /**
     * Let me know when any Observable emits
     * but also give me the latest value from the others. ( Array )
     */
    combineLatestDemo2() {
        const intervalOne$ = interval(1000);
        const intervalTwo$ = interval(2000);

        combineLatest(
            intervalOne$,
            intervalTwo$
        ).subscribe(all => console.log(all));
    }
}
