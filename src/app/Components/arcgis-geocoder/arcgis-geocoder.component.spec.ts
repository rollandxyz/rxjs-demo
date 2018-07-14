import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcgisGeocoderComponent } from './arcgis-geocoder.component';

describe('ArcgisGeocoderComponent', () => {
  let component: ArcgisGeocoderComponent;
  let fixture: ComponentFixture<ArcgisGeocoderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArcgisGeocoderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcgisGeocoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
