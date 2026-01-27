import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

interface MessageMock {
  username: string;
  message: string;
  timestamp: string;
  isMe: boolean;
}


@Component({
  selector: 'app-conversa-com-profissional',
  templateUrl: './conversa-com-profissional.component.html',
  styleUrls: ['./conversa-com-profissional.component.css']
})
export class ConversaComProfissionalComponent implements OnInit {
  chatForm = new FormGroup({
    replymessage: new FormControl<string>('', { nonNullable: true })
  });

  myUsername = 'Você';

  targetName = 'Profissional';
  targetSubtitle = 'Profissional';
  targetAvatar = '';

  messages: MessageMock[] = [
    {
      username: 'Você',
      message: 'Olá! 🙂',
      timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      isMe: true
    },
    {
      username: 'Profissional',
      message: 'Olá! Como posso ajudar hoje?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      isMe: false
    },
  ];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('replyTextarea') private replyTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qp => {
      this.targetName = qp.get('contactName') || 'Profissional';
      this.targetSubtitle = qp.get('contactSubtitle') || 'Profissional';
      this.targetAvatar = qp.get('contactAvatar') || '';
      setTimeout(() => this.scrollToBottom(), 30);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 50);
  }

  goBack(): void {
    // volta para lista
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
}
