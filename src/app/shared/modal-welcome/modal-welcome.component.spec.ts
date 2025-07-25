import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWelcomeComponent } from './modal-welcome.component';

describe('ModalWelcomeComponent', () => {
  let component: ModalWelcomeComponent;
  let fixture: ComponentFixture<ModalWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalWelcomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
