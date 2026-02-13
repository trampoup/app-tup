import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UsuarioDadosDTO } from '../../cupons/UsuarioDadosDTO';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CidadesService, listaEstados } from 'src/app/configs/services/cidade.service';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioAtualizacaoDTO } from '../UsuarioAtualizarDTO';
import { AuthService } from 'src/app/configs/services/auth.service';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-meu-perfil-profissional',
  templateUrl: './meu-perfil-profissional.component.html',
  styleUrls: ['./meu-perfil-profissional.component.css']
})
export class MeuPerfilProfissionalComponent implements OnInit {
  isLoading: boolean = false;
  readonly DEFAULT_AVATAR = '/assets/imagens/foto-perfil-generico.png';
  fotoUrl: string = '/assets/imagens/foto-perfil-generico.png';
  perfil: UsuarioDadosDTO | null = null;
  categoriasDescricoes = categoriasDescricoes;

  private infoUser: boolean = true;
  private alterarSenha: boolean = false;
  private pagamentos: boolean = false;

    // === Novos estados de edição e listas ===
  isEditing = false;
  submited = false;
  initialFormValues: any;
  public listaCidades: any[] = [];
  protected readonly listaEstados = listaEstados;


  isSavingProfile = false;
  successPerfilMessage: string | null = null;
  errorPerfilMessage: string | null = null;

  // Estados e mensagens — Alterar Senha
  isSavingPwd = false;
  successPwdMessage: string | null = null;
  errorPwdMessage: string | null = null;

  // FOTO DE PERFIL
  @ViewChild('modalUploadFoto') modalUploadFoto!: TemplateRef<any>;
  @ViewChild('modalOutlet', { read: ViewContainerRef }) modalOutlet?: ViewContainerRef;

  selectedFoto: File | null = null;
  fotoPreviewTemp: string | ArrayBuffer | null = null;
  removeFotoPerfil = false;

  isUploadingFoto = false;
  uploadProgress = 0;
  successFotoMessage: string | null = null;
  errorFotoMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService,
    private usuarioService: UsuarioService,
    private authService: AuthService,                
    private usuarioMidiasService: UsuarioMidiasService ,
    private modalService: ModalGenericoService,
  ) { }

  ngOnInit(): void {
    this.carregarInformacoesPessoais();  
    this.carregarFotoPerfil();         
  }

  get isInfoUser() { return this.infoUser; }
  get isAlterarSenha() { return this.alterarSenha; }
  get isPagamentos() { return this.pagamentos; }

  ativarInfo() { this.infoUser = true; this.alterarSenha = this.pagamentos = false; }
  ativarSenha() { this.alterarSenha = true; this.infoUser = this.pagamentos = false; }
  ativarPagamentos() { this.pagamentos = true; this.infoUser = this.alterarSenha = false; }

  // === Formulário de edição de perfil ===
  editarUsuarioForm = this.formBuilder.group({
    nome:      new FormControl({ value: '', disabled: true }, Validators.required),
    sobrenome: new FormControl({ value: '', disabled: true }, Validators.required),
    email:     new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    cpf:       new FormControl({ value: '', disabled: true }, Validators.required),
    estado:    new FormControl({ value: '', disabled: true }, Validators.required),
    cidade:    new FormControl({ value: '', disabled: true }, Validators.required),
  });

  private patchFromPerfil(p: UsuarioDadosDTO) {
    this.editarUsuarioForm.patchValue({
      nome: p.nome ?? '',
      sobrenome: p.sobrenome ?? '',
      email: p.email ?? '',
      cpf: p.cpf ?? '',
      estado: p.estado ?? '',
    });
    if (p.estado) {
      this.obterCidadePorEstado(p.estado);
    }
    this.editarUsuarioForm.patchValue({
      cidade: p.cidade ?? '',
    });

    this.initialFormValues = this.editarUsuarioForm.getRawValue();
  }

  private carregarInformacoesPessoais(): void {
    this.isLoading = true;

    this.authService.getUsuarioComCache$().subscribe({
      next: (u) => {
        this.isLoading = false;
        if (!u) return;

        this.perfil = u;

        const estado = u.estado ?? '';
        const cidade = u.cidade ?? '';

        this.editarUsuarioForm.patchValue({
          nome: u.nome ?? '',
          email: u.email ?? '',
          sobrenome: u.sobrenome || '',
          cpf: u.cpf || '',
          estado: estado || ''
        });

        if (estado) {
          this.serviceLocalidade.getCidadesByEstado(estado).subscribe({
            next: (lista) => {
              this.listaCidades = lista;
              this.editarUsuarioForm.patchValue({ cidade: cidade || '' });
              this.initialFormValues = this.editarUsuarioForm.getRawValue();
            },
            error: () => {
              this.editarUsuarioForm.patchValue({ cidade: '' });
              this.initialFormValues = this.editarUsuarioForm.getRawValue();
            }
          });
        } else {
          this.initialFormValues = this.editarUsuarioForm.getRawValue();
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorPerfilMessage = 'Não foi possível carregar seus dados.';
      }
    });
  }

  private carregarFotoPerfil(): void {
    this.usuarioMidiasService.getMinhaMidia('foto_perfil').subscribe((url) => {
      this.fotoUrl = url || this.DEFAULT_AVATAR;
    });
  }

  onEdit(): void {
    this.isEditing = true;
    this.editarUsuarioForm.enable();
  }

  onCancel(): void {
    this.isEditing = false;
    // Restaura os valores iniciais e desabilita
    this.editarUsuarioForm.patchValue(this.initialFormValues);
    this.editarUsuarioForm.disable();
  }

  onEstadoChange(event: Event) {
    const estadoSigla = (event.target as HTMLSelectElement).value;
    this.obterCidadePorEstado(estadoSigla);
    this.editarUsuarioForm.controls.cidade.setValue('');
  }

  obterCidadePorEstado(estadoSigla: string) {
    if (estadoSigla) {
      this.serviceLocalidade.getCidadesByEstado(estadoSigla)
        .subscribe(data => this.listaCidades = data);
    } else {
      this.listaCidades = [];
    }
  }

  onSubmit(): void {
    this.submited = true;

    if (this.editarUsuarioForm.invalid) return;

    // getRawValue pega até campos desabilitados (útil se CPF ficar disabled)
    const raw = this.editarUsuarioForm.getRawValue();

    // normalizações úteis
    const payload: UsuarioAtualizacaoDTO = {
      nome: (raw.nome || '').trim(),
      sobrenome: (raw.sobrenome || '').trim(),
      email: (raw.email || '').trim(),
      cpf: (raw.cpf || '').trim(),
      estado: raw.estado || '',
      cidade: raw.cidade || '',
    };

    this.usuarioService.atualizarDadosPessoais(payload).subscribe({
      next: () => {
        // sucesso: trava novamente e salva “estado inicial”
        this.initialFormValues = this.editarUsuarioForm.getRawValue();
        this.isEditing = false;
        this.editarUsuarioForm.disable();
        this.successPerfilMessage = 'Dados atualizados com sucesso.';
        this.errorPerfilMessage = null;
      },
      error: (err) => {
        // conflitos de e-mail (409) e outros
        // TODO: exibir mensagem amigável/toast
        console.error('Erro ao atualizar dados pessoais:', err);
      }
    });
  }


  // ===== ALTERAR SENHA =====
  alterarSenhaForm = this.formBuilder.group({
    senhaAtual: new FormControl<string>('', { validators: [Validators.required] }),
    novaSenha: new FormControl<string>('', { validators: [Validators.required] }),
    confirmarNovaSenha: new FormControl<string>('', { validators: [Validators.required] }),
  });

  submitedPwd = false;
  pwdErrorMessage: string | null = null;

  // Olhinhos
  currPwdFieldType: 'password' | 'text' = 'password';
  newPwdFieldType: 'password' | 'text' = 'password';
  confirmNewPwdFieldType: 'password' | 'text' = 'password';

  toggleCurrPwdVisibility() {
    this.currPwdFieldType = this.currPwdFieldType === 'password' ? 'text' : 'password';
  }
  toggleNewPwdVisibility() {
    this.newPwdFieldType = this.newPwdFieldType === 'password' ? 'text' : 'password';
  }
  toggleConfirmNewPwdVisibility() {
    this.confirmNewPwdFieldType = this.confirmNewPwdFieldType === 'password' ? 'text' : 'password';
  }

  get pwdChecks() {
    const s = this.alterarSenhaForm.controls.novaSenha.value || '';
    return {
      upper: /[A-Z]/.test(s),
      lower: /[a-z]/.test(s),
      number: /\d/.test(s),
      special: /[^A-Za-z0-9]/.test(s),
      length: s.length >= 8,
    };
  }

  onSubmitAlterarSenha(): void {
    this.submitedPwd = true;
    this.pwdErrorMessage = null;
    this.successPwdMessage = null;
    this.errorPwdMessage = null;

    const f = this.alterarSenhaForm;
    if (f.invalid) return;

    const senhaAtual = f.controls.senhaAtual.value || '';
    const nova = f.controls.novaSenha.value || '';
    const conf = f.controls.confirmarNovaSenha.value || '';

    if (nova !== conf) {
      this.pwdErrorMessage = 'As senhas não coincidem.';
      return;
    }

    const checks = this.pwdChecks;
    if (!(checks.upper && checks.lower && checks.number && checks.special && checks.length)) {
      this.pwdErrorMessage = 'A nova senha não atende aos requisitos mínimos.';
      return;
    }
    if (senhaAtual === nova) {
      this.pwdErrorMessage = 'A nova senha deve ser diferente da senha atual.';
      return;
    }

    this.isSavingPwd = true;
    this.usuarioService.alterarSenha({ senhaAtual, novaSenha: nova }).subscribe({
      next: () => {
        this.isSavingPwd = false;
        this.submitedPwd = false;
        this.alterarSenhaForm.reset();
        this.successPwdMessage = 'Senha alterada com sucesso.';
        this.errorPwdMessage = null;

        setTimeout(() => (this.successPwdMessage = null), 4000);
      },
      error: (err) => {
        this.isSavingPwd = false;
        this.errorPwdMessage = err?.error?.erro || 'Não foi possível alterar a senha.';
        this.successPwdMessage = null;

        // opcional: expor erros comuns com mensagens amigáveis
        // if (err?.status === 400) this.errorPwdMessage = err?.error?.erro || 'Dados inválidos.';
        // if (err?.status === 401) this.errorPwdMessage = 'Sessão expirada. Faça login novamente.';
      }
    });
  }

  openModalFoto(): void {
    this.selectedFoto = null;
    this.fotoPreviewTemp = (this.fotoUrl && this.fotoUrl !== this.DEFAULT_AVATAR) ? this.fotoUrl : null;    this.removeFotoPerfil = false;
    this.uploadProgress = 0;
    this.errorFotoMessage = null;

    this.modalService.openModal(
      {
        title: 'Alterar foto de perfil',
        size: 'md:max-w-md',
        showFooter: true,
        confirmTextoBotao: 'Alterar',
        cancelTextoBotao: 'Cancelar',
      },
      () => this.confirmUploadOrRemove() as any,
      this.modalUploadFoto
    );
  }


  onFotoSelected(file: File | null) {
    this.selectedFoto = file;
    this.removeFotoPerfil = false;
  }

  onFotoRemoved() {
    this.selectedFoto = null;
    this.fotoPreviewTemp = null;
    this.removeFotoPerfil = true;
  }

  confirmUploadOrRemove(): boolean | void {
    this.errorFotoMessage = null;

    if (this.removeFotoPerfil) {
      this.isUploadingFoto = true;
      this.usuarioMidiasService.delete('foto_perfil').subscribe({
        next: () => {
          this.isUploadingFoto = false;
          this.fotoUrl = '/assets/imagens/foto-perfil-generico.png';
          this.successFotoMessage = 'Foto de perfil removida.';
          this.modalService.closeModal();
        },
        error: (err) => {
          this.isUploadingFoto = false;
          this.errorFotoMessage = err?.error?.erro || 'Não foi possível remover a foto.';
        }
      });
      return false; 
    }
    if (!this.selectedFoto) {
      this.errorFotoMessage = 'Selecione uma imagem ou clique em remover.';
      return false; 
    }

    if (!this.selectedFoto.type.startsWith('image/')) {
      this.errorFotoMessage = 'Arquivo inválido. Selecione uma imagem.';
      return false;
    }
    const max = 15 * 1024 * 1024;
    if (this.selectedFoto.size > max) {
      this.errorFotoMessage = 'Imagem maior que 15MB.';
      return false;
    }

    this.isUploadingFoto = true;
    this.uploadProgress = 0;

    this.usuarioMidiasService
      .uploadWithProgress({ fotoPerfil: this.selectedFoto })
      .subscribe({
        next: (ev) => {
          if (ev.type === HttpEventType.UploadProgress && ev.total) {
            this.uploadProgress = Math.round((ev.loaded / ev.total) * 100);
          }
          if (ev.type === HttpEventType.Response) {
            this.isUploadingFoto = false;
            // Atualiza na tela
            if (this.fotoPreviewTemp) {
              this.fotoUrl = this.fotoPreviewTemp as string;
            } else {
              this.carregarFotoPerfil();
            }
            this.successFotoMessage = 'Foto de perfil atualizada.';
            this.modalService.closeModal();
          }
        },
        error: (err) => {
          this.isUploadingFoto = false;
          this.errorFotoMessage = err?.error?.erro || 'Falha ao enviar imagem.';
        }
      });

    return false;
  }
}


