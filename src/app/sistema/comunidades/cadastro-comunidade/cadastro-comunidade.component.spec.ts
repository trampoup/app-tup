import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroComunidadeComponent } from './cadastro-comunidade.component';

describe('CadastroComunidadeComponent', () => {
  let component: CadastroComunidadeComponent;
  let fixture: ComponentFixture<CadastroComunidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroComunidadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroComunidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
