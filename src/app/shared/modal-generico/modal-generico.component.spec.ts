import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenericoComponent } from './modal-generico.component';

describe('ModalGenericoComponent', () => {
  let component: ModalGenericoComponent;
  let fixture: ComponentFixture<ModalGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGenericoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
