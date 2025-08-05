import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameficacaoComponent } from './gameficacao.component';

describe('GameficacaoComponent', () => {
  let component: GameficacaoComponent;
  let fixture: ComponentFixture<GameficacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameficacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameficacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
