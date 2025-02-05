import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationLiveboardComponent } from './station-liveboard.component';

describe('StationLiveboardComponent', () => {
  let component: StationLiveboardComponent;
  let fixture: ComponentFixture<StationLiveboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StationLiveboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StationLiveboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
