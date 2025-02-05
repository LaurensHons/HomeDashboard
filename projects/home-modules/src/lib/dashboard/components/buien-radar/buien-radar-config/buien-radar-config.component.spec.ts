import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuienRadarConfigComponent } from './buien-radar-config.component';

describe('BuienRadarConfigComponent', () => {
  let component: BuienRadarConfigComponent;
  let fixture: ComponentFixture<BuienRadarConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuienRadarConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuienRadarConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
