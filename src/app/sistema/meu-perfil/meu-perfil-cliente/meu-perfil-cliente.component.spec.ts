import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuPerfilClienteComponent } from './meu-perfil-cliente.component';

describe('MeuPerfilClienteComponent', () => {
  let component: MeuPerfilClienteComponent;
  let fixture: ComponentFixture<MeuPerfilClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeuPerfilClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeuPerfilClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
