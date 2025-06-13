import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})
export class InicioAdminComponent implements OnInit {
  anuncios = [ /*LISTA DE ANUNCIOS(TEMPORÁRIO, SOMENTE PARA MOSTRAR A INTERFACE AO ALEX)*/
    {
      titulo: 'anuncio 2',
      imagem: 'assets/imagens/imagens-de-exemplo/anuncio1-exemplo.png'
    },
    {
      titulo: 'anuncio 1',
      imagem: 'assets/imagens/imagens-de-exemplo/anuncio2-exemplo.png'
    }
  ];

  destaques = [
    {
      titulo: 'destaque1',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque2',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque3',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque4',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque5',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque6',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
