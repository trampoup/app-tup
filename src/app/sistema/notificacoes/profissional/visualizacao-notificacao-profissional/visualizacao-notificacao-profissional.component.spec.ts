import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoNotificacaoProfissionalComponent } from './visualizacao-notificacao-profissional.component';

describe('VisualizacaoNotificacaoProfissionalComponent', () => {
  let component: VisualizacaoNotificacaoProfissionalComponent;
  let fixture: ComponentFixture<VisualizacaoNotificacaoProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizacaoNotificacaoProfissionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacaoNotificacaoProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
