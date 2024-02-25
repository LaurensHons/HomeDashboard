import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalteSelectComponent } from './halte-select.component';

describe('HalteSelectComponent', () => {
  let component: HalteSelectComponent;
  let fixture: ComponentFixture<HalteSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalteSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HalteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
