import { Component, OnInit } from '@angular/core';
import { RxjsDemoService } from '../../Services/rxjs.demo.service';

@Component({
  selector: 'app-rxjs-demo',
  templateUrl: './rxjs-demo.component.html',
  styleUrls: ['./rxjs-demo.component.css']
})
export class RxjsDemoComponent implements OnInit {
  rxjsResultConcat: any[] = [];
  rxjsResultMerge: any[] = [];
  rxjsResultForkJoin: any[] = [];
  rxjsResultFlatMap: any[] = [];
  rxjsResult: any[] = [];

  constructor(private rxjsDemoService: RxjsDemoService) { }

  ngOnInit() {
  }
  onGetConcat() {
    this.rxjsResult = [];
    this.rxjsDemoService.getConcat().subscribe(value => {
      this.rxjsResult.push(value);
    });
  }
  onGetMerge() {
    this.rxjsResult = [];
    this.rxjsDemoService.getMerge().subscribe(value => {
      this.rxjsResult.push(value);
    });
  }
  onGetForkJoin() {
    this.rxjsResult = [];
    this.rxjsDemoService.getThreeForkJoin().subscribe(([res1, res2, res3]) => {
      this.rxjsResult.push(res1);
      this.rxjsResult.push(res2);
      this.rxjsResult.push(res3);
    });
  }

  onGetFlatMap() {
    this.rxjsResult = [];
    this.rxjsDemoService.getFlatMap().subscribe(value => {
      this.rxjsResult.push(value);
    });
  }
}
