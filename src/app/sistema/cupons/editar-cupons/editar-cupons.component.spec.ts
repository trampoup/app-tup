import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCuponsComponent } from './editar-cupons.component';

describe('EditarCuponsComponent', () => {
  let component: EditarCuponsComponent;
  let fixture: ComponentFixture<EditarCuponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCuponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCuponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
