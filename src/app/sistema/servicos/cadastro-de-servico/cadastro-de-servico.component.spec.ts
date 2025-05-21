import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDeServicoComponent } from './cadastro-de-servico.component';

describe('CadastroDeServicoComponent', () => {
  let component: CadastroDeServicoComponent;
  let fixture: ComponentFixture<CadastroDeServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroDeServicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDeServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
