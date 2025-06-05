import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/configs/auth.service';

@Component({
  selector: 'app-lista-de-cupons',
  templateUrl: './lista-de-cupons.component.html',
  styleUrls: ['./lista-de-cupons.component.css']
})
export class ListaDeCuponsComponent implements OnInit {
  cupons: any[] = [];
  
  constructor(public authService:AuthService) { }

  ngOnInit(): void {
  }

}
