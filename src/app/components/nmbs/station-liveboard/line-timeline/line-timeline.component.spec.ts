import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineTimelineComponent } from './line-timeline.component';

describe('LineTimelineComponent', () => {
  let component: LineTimelineComponent;
  let fixture: ComponentFixture<LineTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
