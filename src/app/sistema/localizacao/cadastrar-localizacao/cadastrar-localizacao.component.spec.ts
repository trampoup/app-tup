import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarLocalizacaoComponent } from './cadastrar-localizacao.component';

describe('CadastrarLocalizacaoComponent', () => {
  let component: CadastrarLocalizacaoComponent;
  let fixture: ComponentFixture<CadastrarLocalizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrarLocalizacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarLocalizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
