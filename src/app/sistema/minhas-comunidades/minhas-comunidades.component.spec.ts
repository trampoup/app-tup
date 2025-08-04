import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasComunidadesComponent } from './minhas-comunidades.component';

describe('MinhasComunidadesComponent', () => {
  let component: MinhasComunidadesComponent;
  let fixture: ComponentFixture<MinhasComunidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinhasComunidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasComunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
