import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniSiteComponent } from './mini-site.component';

describe('MiniSiteComponent', () => {
  let component: MiniSiteComponent;
  let fixture: ComponentFixture<MiniSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
