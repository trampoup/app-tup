import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ModalWelcomeService } from 'src/app/configs/services/modal-welcome.service';

@Component({
  selector: 'app-painel-cliente',
  templateUrl: './painel-cliente.component.html',
  styleUrls: ['./painel-cliente.component.css']
})
export class PainelClienteComponent implements OnInit {
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

  constructor(
    private authService:AuthService,
    private modalWelcomeService:ModalWelcomeService
  ) { }

  ngOnInit(): void {
    this.mostrarModalWelcome();
  }

  mostrarModalWelcome(){
    if (this.authService.isCadastro) {
      this.modalWelcomeService.openModal({
        title: '👋 Bem-vindo!',
        // description: 'Aqui vai a mensagem que você quiser...',
        size: 'md'     // sm | md | lg | full  (ajuste para as classes que você definiu no CSS)
      });
      this.authService.showModal = false;
      this.authService.isCadastro = false;
    }
  }

}
