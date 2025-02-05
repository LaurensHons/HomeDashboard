import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuienRadarComponent } from './buien-radar.component';

describe('BuienRadarComponent', () => {
  let component: BuienRadarComponent;
  let fixture: ComponentFixture<BuienRadarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuienRadarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuienRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
