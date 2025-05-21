import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeuPerfilAdminComponent } from './meu-perfil-admin.component';

describe('MeuPerfilAdminComponent', () => {
  let component: MeuPerfilAdminComponent;
  let fixture: ComponentFixture<MeuPerfilAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeuPerfilAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeuPerfilAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
