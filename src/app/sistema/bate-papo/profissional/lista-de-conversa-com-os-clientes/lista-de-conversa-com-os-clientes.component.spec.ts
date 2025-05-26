import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeConversaComOsClientesComponent } from './lista-de-conversa-com-os-clientes.component';

describe('ListaDeConversaComOsClientesComponent', () => {
  let component: ListaDeConversaComOsClientesComponent;
  let fixture: ComponentFixture<ListaDeConversaComOsClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDeConversaComOsClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDeConversaComOsClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
