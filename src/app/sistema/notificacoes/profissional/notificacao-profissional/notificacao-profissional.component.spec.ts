import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacaoProfissionalComponent } from './notificacao-profissional.component';

describe('NotificacaoProfissionalComponent', () => {
  let component: NotificacaoProfissionalComponent;
  let fixture: ComponentFixture<NotificacaoProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacaoProfissionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacaoProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
