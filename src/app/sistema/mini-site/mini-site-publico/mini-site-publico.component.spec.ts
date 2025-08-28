import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniSitePublicoComponent } from './mini-site-publico.component';

describe('MiniSitePublicoComponent', () => {
  let component: MiniSitePublicoComponent;
  let fixture: ComponentFixture<MiniSitePublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniSitePublicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniSitePublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
