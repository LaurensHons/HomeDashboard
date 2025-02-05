import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectComponent', () => {
  let component: SelectComponent<unknown>;
  let fixture: ComponentFixture<SelectComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
