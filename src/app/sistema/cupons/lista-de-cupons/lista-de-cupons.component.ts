import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';

@Component({
  selector: 'app-lista-de-cupons',
  templateUrl: './lista-de-cupons.component.html',
  styleUrls: ['./lista-de-cupons.component.css']
})
export class ListaDeCuponsComponent implements OnInit {
  cupons: any[] = [];
  
  constructor(private router: Router,private authService:AuthService) { }

  ngOnInit(): void {
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  isCliente():boolean{
    return this.authService.isAdministrador() || this.authService.isProfissional();
  }
}
