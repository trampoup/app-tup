import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroSiteComponent } from './cadastro-site.component';

describe('CadastroSiteComponent', () => {
  let component: CadastroSiteComponent;
  let fixture: ComponentFixture<CadastroSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
