import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteConfigComponent } from './website-config.component';

describe('WebsiteConfigComponent', () => {
  let component: WebsiteConfigComponent;
  let fixture: ComponentFixture<WebsiteConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebsiteConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
