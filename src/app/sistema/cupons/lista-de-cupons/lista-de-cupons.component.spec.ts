import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeCuponsComponent } from './lista-de-cupons.component';

describe('ListaDeCuponsComponent', () => {
  let component: ListaDeCuponsComponent;
  let fixture: ComponentFixture<ListaDeCuponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDeCuponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDeCuponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
