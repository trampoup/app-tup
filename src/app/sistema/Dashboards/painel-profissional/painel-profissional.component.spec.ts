import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelProfissionalComponent } from './painel-profissional.component';

describe('PainelProfissionalComponent', () => {
  let component: PainelProfissionalComponent;
  let fixture: ComponentFixture<PainelProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelProfissionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
