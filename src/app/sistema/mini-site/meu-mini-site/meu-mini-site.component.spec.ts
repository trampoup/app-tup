import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuMiniSiteComponent } from './meu-mini-site.component';

describe('MeuMiniSiteComponent', () => {
  let component: MeuMiniSiteComponent;
  let fixture: ComponentFixture<MeuMiniSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeuMiniSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeuMiniSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
