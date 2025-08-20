import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarSiteComponent } from './cadastrar-site.component';

describe('CadastrarSiteComponent', () => {
  let component: CadastrarSiteComponent;
  let fixture: ComponentFixture<CadastrarSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrarSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
