import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoServicosComponent } from './historico-servicos.component';

describe('HistoricoServicosComponent', () => {
  let component: HistoricoServicosComponent;
  let fixture: ComponentFixture<HistoricoServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoServicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
