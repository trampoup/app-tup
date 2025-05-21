import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarSiteComponent } from './visualizar-site.component';

describe('VisualizarSiteComponent', () => {
  let component: VisualizarSiteComponent;
  let fixture: ComponentFixture<VisualizarSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarSiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
