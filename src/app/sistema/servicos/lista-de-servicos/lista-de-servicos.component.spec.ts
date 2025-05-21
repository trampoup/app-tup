import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDeServicosComponent } from './lista-de-servicos.component';

describe('ListaDeServicosComponent', () => {
  let component: ListaDeServicosComponent;
  let fixture: ComponentFixture<ListaDeServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDeServicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaDeServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
