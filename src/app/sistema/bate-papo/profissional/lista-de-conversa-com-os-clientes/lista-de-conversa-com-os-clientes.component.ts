import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';

interface ContactMock {
  id: number;
  nome: string;
  cargo?: string;
  avatarUrl?: string;
  ultimaMensagem?: string;
  ultimaMensagemEm?: Date;
  naoLidas?: number;
}

@Component({
  selector: 'app-lista-de-conversa-como-os-clientes',
  templateUrl: './lista-de-conversa-com-os-clientes.component.html',
  styleUrls: ['./lista-de-conversa-com-os-clientes.component.css']
})
export class ListaDeConversaComOsClientesComponent {
  isLoading = false;

  contacts: ContactMock[] = [
    {
      id: 101,
      nome: 'Maria Eduarda',
      cargo: 'Cliente',
      avatarUrl: 'https://i.pravatar.cc/150?img=32',
      ultimaMensagem: 'Oi! Pode me passar um orçamento para a troca de lente?',
      ultimaMensagemEm: new Date(Date.now() - 1000 * 60 * 12),
      naoLidas: 2
    },
    {
      id: 102,
      nome: 'João Pedro',
      cargo: 'Cliente',
      avatarUrl: '',
      ultimaMensagem: 'Fechado! Pode agendar pra amanhã às 15h?',
      ultimaMensagemEm: new Date(Date.now() - 1000 * 60 * 60 * 3),
      naoLidas: 0
    },
    {
      id: 103,
      nome: 'Ana Clara',
      cargo: 'Cliente',
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
      ultimaMensagem: 'Obrigada, ficou perfeito 🙌',
      ultimaMensagemEm: new Date(Date.now() - 1000 * 60 * 60 * 27),
      naoLidas: 1
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  openChat(c: ContactMock): void {
    // navega para /usuario/conversa-com-cliente (se suas rotas forem filhas de /usuario)
    this.router.navigate(['../conversa-com-cliente'], {
      relativeTo: this.route,
      queryParams: {
        contactId: c.id,
        contactName: c.nome,
        contactSubtitle: c.cargo || 'Cliente',
        contactAvatar: c.avatarUrl || ''
      }
    });
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRandomColor(seed: string): string {
    const colors = ['#FFB3BA', '#FFDFBA', '#BAFFC9', '#BAE1FF', '#D5BAFF'];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }
  
  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }
}
