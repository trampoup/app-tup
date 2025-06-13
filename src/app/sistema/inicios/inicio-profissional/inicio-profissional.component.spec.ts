import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioProfissionalComponent } from './inicio-profissional.component';

describe('InicioProfissionalComponent', () => {
  let component: InicioProfissionalComponent;
  let fixture: ComponentFixture<InicioProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioProfissionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
