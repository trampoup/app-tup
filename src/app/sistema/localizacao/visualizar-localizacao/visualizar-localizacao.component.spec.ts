import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarLocalizacaoComponent } from './visualizar-localizacao.component';

describe('VisualizarLocalizacaoComponent', () => {
  let component: VisualizarLocalizacaoComponent;
  let fixture: ComponentFixture<VisualizarLocalizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarLocalizacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarLocalizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
