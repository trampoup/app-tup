import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarComunidadeComponent } from './visualizar-comunidade.component';

describe('VisualizarComunidadeComponent', () => {
  let component: VisualizarComunidadeComponent;
  let fixture: ComponentFixture<VisualizarComunidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarComunidadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarComunidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
