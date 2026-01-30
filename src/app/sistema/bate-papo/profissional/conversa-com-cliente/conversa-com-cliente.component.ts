import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';
import { AnimationOptions } from 'ngx-lottie';

interface MessageMock {
  username: string;
  message: string;
  timestamp: string;
  isMe: boolean;
}

@Component({
  selector: 'app-conversa-com-cliente',
  templateUrl: './conversa-com-cliente.component.html',
  styleUrls: ['./conversa-com-cliente.component.css']
})
export class ConversaComClienteComponent implements OnInit, AfterViewInit {
  finalizadoAnimOptions: AnimationOptions = {
    path: '/assets/animations/Success Check.json',
    loop: false,
    autoplay: true
  };

  @ViewChild('codigoValidacaoTemplate')
  codigoValidacaoTemplate!: TemplateRef<any>;

  @ViewChild('servicoFinalizadoTemplate', { static: true })
  servicoFinalizadoTemplate!: TemplateRef<any>;
  
  avaliarCliente: boolean = false;
  chatForm = new FormGroup({
    replymessage: new FormControl<string>('', { nonNullable: true })
  });

  myUsername = 'Você';

  targetName = 'Cliente';
  targetSubtitle = 'Cliente';
  targetAvatar = '';
  clientRating = 4.6; 

  private shouldOpenFinalizado = false;
  private viewReady = false; //pra evitar bug
  private finalizadoOpened = false;

  messages: MessageMock[] = [
    {
      username: 'Cliente',
      message: 'Olá! Você consegue me atender hoje?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      isMe: false
    },
    {
      username: 'Você',
      message: 'Consigo sim! Me diga o que você precisa 🙂',
      timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      isMe: true
    }
  ];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('replyTextarea') private replyTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalGenericoService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qp => {
      this.targetName = qp.get('contactName') || 'Cliente';
      this.targetSubtitle = qp.get('contactSubtitle') || 'Cliente';
      this.targetAvatar = qp.get('contactAvatar') || '';
      this.shouldOpenFinalizado = qp.get('serviceFinalized') === '1';
      setTimeout(() => this.scrollToBottom(), 30);
      this.tryOpenFinalizadoModal();
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    setTimeout(() => this.scrollToBottom(), 50);
    this.tryOpenFinalizadoModal();
  }

  private tryOpenFinalizadoModal(): void {
    if (!this.viewReady) return;
    if (!this.shouldOpenFinalizado) return;
    if (this.finalizadoOpened) return;

    this.finalizadoOpened = true;

    this.modalService.openModal(
      {
        title: '',
        showHeader: false,
        showFooter: false,
        size: 'md'
      },
      undefined,
      this.servicoFinalizadoTemplate
    );
  }

  closeServicoFinalizadoModal(): void {
    this.modalService.closeModal();

    this.avaliarCliente = true;

    //remove a flag da URL pra não abrir de novo ao dar refresh
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { serviceFinalized: null },
      queryParamsHandling: 'merge'
    });
  }


  goBack(): void {
    this.router.navigate(['/usuario/lista-de-conversas-com-os-profissionais'], {
      relativeTo: this.route
    });
  }

  enviarMensagem(): void {
    const text = (this.chatForm.value.replymessage || '').trim();
    if (!text) return;

    this.messages.push({
      username: this.myUsername,
      message: text,
      timestamp: new Date().toISOString(),
      isMe: true
    });

    this.chatForm.reset({ replymessage: '' });
    this.resetTextareaHeight();
    this.scrollToBottom();

    // resposta mock automática (opcional)
    setTimeout(() => {
      this.messages.push({
        username: this.targetName,
        message: 'Perfeito! Já vou te passar os detalhes 😊',
        timestamp: new Date().toISOString(),
        isMe: false
      });
      this.scrollToBottom();
    }, 600);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarMensagem();
    }
  }

  autoGrow(): void {
    try {
      const ta = this.replyTextarea.nativeElement;
      ta.style.height = 'auto';
      const max = 140;
      ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
    } catch {}
  }

  resetTextareaHeight(): void {
    try {
      const ta = this.replyTextarea?.nativeElement;
      if (ta) ta.style.height = '40px';
    } catch {}
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) setTimeout(() => (el.scrollTop = el.scrollHeight), 20);
    } catch {}
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRandomColor(seed: string): string {
    const colors = ['#FFB3BA', '#FFDFBA', '#BAFFC9', '#BAE1FF', '#D5BAFF'];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  openCodigoValidacaoModal(): void {
    this.modalService.openModal(
      {
        title: 'Código de validação',
        showHeader: false,
        showFooter: false,
        size: 'sm:max-w-md'
      },
      undefined,
      this.codigoValidacaoTemplate
    );
  }


  closeCodigoValidacaoModal(): void {
    this.modalService.closeModal();
  }
}
