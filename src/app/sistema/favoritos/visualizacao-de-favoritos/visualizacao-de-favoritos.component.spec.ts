import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacaoDeFavoritosComponent } from './visualizacao-de-favoritos.component';

describe('VisualizacaoDeFavoritosComponent', () => {
  let component: VisualizacaoDeFavoritosComponent;
  let fixture: ComponentFixture<VisualizacaoDeFavoritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizacaoDeFavoritosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacaoDeFavoritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
