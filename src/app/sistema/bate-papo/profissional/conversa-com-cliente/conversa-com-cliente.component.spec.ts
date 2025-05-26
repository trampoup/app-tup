import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversaComClienteComponent } from './conversa-com-cliente.component';

describe('ConversaComClienteComponent', () => {
  let component: ConversaComClienteComponent;
  let fixture: ComponentFixture<ConversaComClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversaComClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversaComClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
