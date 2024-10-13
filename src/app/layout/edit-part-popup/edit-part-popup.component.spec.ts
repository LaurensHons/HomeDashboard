import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartPopupComponent } from './edit-part-popup.component';

describe('EditPartPopupComponent', () => {
  let component: EditPartPopupComponent;
  let fixture: ComponentFixture<EditPartPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPartPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPartPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
