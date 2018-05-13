import { Component } from '@angular/core';
import { RxjsDemo } from '../app/rxjs-demo/rxjs-demo';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rxjsDemo = new RxjsDemo();
  title = 'app';

  startDemo() {
    this.rxjsDemo.logMessages.push('start');
    // this.rxjsDemo.concatDemo();
    this.rxjsDemo.conbineLatestDemo();
    this.rxjsDemo.mapDemo();
    this.rxjsDemo.pairwiseDemo();
  }
}
