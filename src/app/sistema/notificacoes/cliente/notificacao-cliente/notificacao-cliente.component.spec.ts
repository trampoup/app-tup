import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacaoClienteComponent } from './notificacao-cliente.component';

describe('NotificacaoClienteComponent', () => {
  let component: NotificacaoClienteComponent;
  let fixture: ComponentFixture<NotificacaoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacaoClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacaoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
