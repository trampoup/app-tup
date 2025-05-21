import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuPerfilProfissionalComponent } from './meu-perfil-profissional.component';

describe('MeuPerfilProfissionalComponent', () => {
  let component: MeuPerfilProfissionalComponent;
  let fixture: ComponentFixture<MeuPerfilProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeuPerfilProfissionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeuPerfilProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
