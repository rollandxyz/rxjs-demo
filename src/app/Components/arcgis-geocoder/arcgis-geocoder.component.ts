import { Candidate } from './../../Models/candidate';
import { GeoCodeService } from './../../Services/geocoder.service';
import { Component, OnInit } from '@angular/core';
import { Suggestion } from '../../Models/suggestion';

@Component({
  selector: 'app-arcgis-geocoder',
  templateUrl: './arcgis-geocoder.component.html',
  styleUrls: ['./arcgis-geocoder.component.css']
})
export class ArcgisGeocoderComponent implements OnInit {
  suggestions: Suggestion[];

  candidates: Candidate[];
  constructor(private geocoder: GeoCodeService) { }

  ngOnInit() {

    /*
    this.geocoder.getSuggestionsWithoutLocation('coffee')
    .subscribe(results => {
      this.suggestions = results.filter((s: Suggestion) => !s.isCollection);
    });

    this.geocoder.getThreeForkJoin().subscribe(
      results => {
        const coffees = results[0];
        const detroit = results[1];
        const newyork = results[2];
        console.log('getThreeForkJoin=', results);
      });

    this.geocoder.getConcat().subscribe(results => {
        console.log('getConcat=', results);
      });
    */

    this.geocoder.getFlatMap().subscribe(results => {
        console.log('getFlatMap=', results);
        this.candidates = results;
      });
  }

}
