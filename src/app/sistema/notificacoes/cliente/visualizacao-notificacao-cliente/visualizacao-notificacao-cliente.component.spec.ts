import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoNotificacaoClienteComponent } from './visualizacao-notificacao-cliente.component';

describe('VisualizacaoNotificacaoClienteComponent', () => {
  let component: VisualizacaoNotificacaoClienteComponent;
  let fixture: ComponentFixture<VisualizacaoNotificacaoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizacaoNotificacaoClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacaoNotificacaoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
