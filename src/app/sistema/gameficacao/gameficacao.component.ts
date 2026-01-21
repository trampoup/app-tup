import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';

interface Action {
  type: string;
  label: string;
  points: number;
  done: boolean;
}

interface Reward {
  points: number;
  description: string;
}

@Component({
  selector: 'app-gameficacao',
  templateUrl: './gameficacao.component.html',
  styleUrls: ['./gameficacao.component.css'],
})
export class GameficacaoComponent implements OnInit {
  userScore = 0;
  maxScore = 200; // maior marco definido no requisito

  // Ações que preenchem a barrinha
  actions: Action[] = [
    { type: 'login3days', label: 'Acessar 3 dias seguidos', points: 10, done: false },
    { type: 'shareProfile', label: 'Divulgar perfil', points: 15, done: false },
    { type: '5starRating', label: 'Receber avaliação 5 estrelas', points: 20, done: false },
    { type: 'updateProfile', label: 'Atualizar foto e descrição', points: 10, done: false },
    { type: 'referral', label: 'Indicar outro profissional', points: 25, done: false },
    { type: 'closeJob', label: 'Fechar um trampo', points: 30, done: false },
    { type: 'praise', label: 'Receber um comentário do cliente', points: 10, done: false },
    { type: 'publishPost',     label: 'Publicar 1 conteúdo na Comunidade',       points: 15, done: false },
    { type: 'getFavorited',    label: 'Ser adicionado aos favoritos de um cliente', points: 15, done: false },
    { type: 'socialProof',     label: 'Receber 3 avaliações (qualquer nota)',    points: 25, done: false },
  ];

  // Recompensas por nível
  rewards: Reward[] = [
    { points: 50, description: '3 dias de destaque no feed' },
    { points: 100, description: '7 dias de destaque + selo de Engajado' },
    { points: 200, description: '14 dias de destaque + selo Ouro + botão Impulsionar Grátis' },
  ];

  @ViewChild('planosImpulsoTemplate') planosImpulsoTemplate!: TemplateRef<any>;

  constructor(
    private router: Router,
    private authService:AuthService,
    private modalService: ModalGenericoService
  ){}

  

  ngOnInit(): void {
   
  }

  performAction(action: Action): void {
    if (action.done) return;
    action.done = true;
    this.userScore = Math.min(this.userScore + action.points, this.maxScore);
    this.checkMilestones();
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  private checkMilestones(): void {
    // Exemplo: notificar o usuário quando destravar uma recompensa
    const unlocked = this.rewards.filter(r => this.userScore >= r.points);
    // pode exibir um toast/modal para cada unlocked novo
  }

  boostFree(): void {
    if (this.userScore < this.maxScore) return;
    // lógica para aplicar destaque gratuito (ex: chamar API)
  }

  purchaseBoost(): void {
    this.modalService.openModal(
      {
        title: 'Planos de Impulso',
        size: 'lg',
        showFooter: false
      },
      undefined,
      this.planosImpulsoTemplate
    );
  }

  resetScore(): void {
    // reset manual (ou disparado mensalmente no backend)
    this.userScore = 0;
    this.actions.forEach(a => (a.done = false));
  }

  onSelecionarPlano(tipo: 'turbo' | 'power' | 'elite'): void {
    // aqui depois você pluga o fluxo de pagamento
    this.modalService.closeModal();
  }
}
