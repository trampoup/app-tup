import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralComunidadesComponent } from './central-comunidades.component';

describe('CentralComunidadesComponent', () => {
  let component: CentralComunidadesComponent;
  let fixture: ComponentFixture<CentralComunidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralComunidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralComunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
