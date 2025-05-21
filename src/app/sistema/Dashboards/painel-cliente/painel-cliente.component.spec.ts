import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelClienteComponent } from './painel-cliente.component';

describe('PainelClienteComponent', () => {
  let component: PainelClienteComponent;
  let fixture: ComponentFixture<PainelClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
