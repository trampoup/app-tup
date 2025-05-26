import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeConversaComOsProfissionaisComponent } from './lista-de-conversa-com-os-profissionais.component';

describe('ListaDeConversaComOsProfissionaisComponent', () => {
  let component: ListaDeConversaComOsProfissionaisComponent;
  let fixture: ComponentFixture<ListaDeConversaComOsProfissionaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDeConversaComOsProfissionaisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDeConversaComOsProfissionaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
