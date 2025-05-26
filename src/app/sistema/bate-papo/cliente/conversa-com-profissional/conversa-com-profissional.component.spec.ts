import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversaComProfissionalComponent } from './conversa-com-profissional.component';

describe('ConversaComProfissionalComponent', () => {
  let component: ConversaComProfissionalComponent;
  let fixture: ComponentFixture<ConversaComProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversaComProfissionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversaComProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
