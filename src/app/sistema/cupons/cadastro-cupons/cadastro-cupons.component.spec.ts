import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCuponsComponent } from './cadastro-cupons.component';

describe('CadastroCuponsComponent', () => {
  let component: CadastroCuponsComponent;
  let fixture: ComponentFixture<CadastroCuponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroCuponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCuponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
