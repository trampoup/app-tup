import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarLocalizacoesComponent } from './visualizar-localizacoes.component';

describe('VisualizarLocalizacoesComponent', () => {
  let component: VisualizarLocalizacoesComponent;
  let fixture: ComponentFixture<VisualizarLocalizacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarLocalizacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarLocalizacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
