import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSelectComponent } from './station-select.component';

describe('StationSelectComponent', () => {
  let component: StationSelectComponent;
  let fixture: ComponentFixture<StationSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
