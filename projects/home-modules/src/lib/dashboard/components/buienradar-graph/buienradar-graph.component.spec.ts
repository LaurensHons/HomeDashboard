import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuienradarGraphComponent } from './buienradar-graph.component';

describe('BuienradarGraphComponent', () => {
  let component: BuienradarGraphComponent;
  let fixture: ComponentFixture<BuienradarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuienradarGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuienradarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
