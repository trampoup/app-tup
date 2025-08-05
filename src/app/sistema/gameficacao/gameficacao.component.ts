import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { CuponsService } from 'src/app/configs/services/cupons.service';

@Component({
  selector: 'app-gameficacao',
  templateUrl: './gameficacao.component.html',
  styleUrls: ['./gameficacao.component.css']
})
export class GameficacaoComponent implements OnInit {

  constructor(private router: Router,
    private authService:AuthService,
    private cuponsService:CuponsService
  ) { }

  ngOnInit(): void {
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

}
