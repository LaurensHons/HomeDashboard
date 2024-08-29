import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NmbsComponent } from './nmbs.component';

describe('NmbsComponent', () => {
  let component: NmbsComponent;
  let fixture: ComponentFixture<NmbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NmbsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NmbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
