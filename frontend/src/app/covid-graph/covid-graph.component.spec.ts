import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidGraphComponent } from './covid-graph.component';

describe('CovidGraphComponent', () => {
  let component: CovidGraphComponent;
  let fixture: ComponentFixture<CovidGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
