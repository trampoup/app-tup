import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioSiteDTO } from './usuario-site-dto';
import { AuthService } from 'src/app/configs/services/auth.service';

@Component({
  selector: 'app-cadastrar-site',
  templateUrl: './cadastrar-site.component.html',
  styleUrls: ['./cadastrar-site.component.css']
})
export class CadastrarSiteComponent implements OnInit {
  submited:boolean = false;
  isEditMode:boolean = false;
  projetoId: number | null = null;
  isLoading:boolean = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  selectedImages: { [key: string]: File | null } = {};

  banner: File | null = null;
  selectedBanner: { [key: string]: File | null } = {};
  bannerPreview: string | ArrayBuffer | null = null;

  videoPreview: string | ArrayBuffer | null = null;
  selectedVideos: { [key: string]: File | null } = {};

  fotoPerfil: File | null = null;
  selectedFotoPerfil: { [key: string]: File | null } = {};
  fotoPerfilPreview: string | ArrayBuffer | null = null;

  skillsCtrl = new FormControl<string>('', { nonNullable: true });
  skills: string[] = [];
  
  constructor(
    private formBuilder : FormBuilder,
    private usuarioService:UsuarioService,
    private usuarioMidiaService: UsuarioMidiasService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadFotoPerfilFromServer();
    this.loadBannerFromServer();
    this.loadVideoFromServer();
    this.usuarioService.obterMeuSite().subscribe({
      next: (dto) => {
        if (dto) {
          this.isEditMode = true;
          this.siteForm.patchValue({
            nome: dto.nome ?? '',
            bio: dto.bio ?? '',
            tempoExperiencia: dto.tempoExperiencia ?? null
          });

          this.skills = this.parseSkills(dto.skills);
          this.syncSkillsToForm();       // mantém o formControl "skills" coerente
        }
      },
      error: () => { /* se 401/404, mantém em modo cadastro */ }
    });
  }

  siteForm = this.formBuilder.group(
    {
      fotoPerfil: new FormControl<File | null>(null),
      banner: new FormControl<File | null>(null),
      video:  new FormControl<File | null>(null),
      nome: new FormControl('', [Validators.required, Validators.minLength(2)]),
      bio: new FormControl('', [Validators.required]),
      skills: new FormControl('', [Validators.required]),
      tempoExperiencia: new FormControl<number | null>(null, [Validators.required]),
    }
  );

  private parseSkills(raw?: string | null): string[] {
    return (raw || '')
      .split(/[;,]/)        // aceita vírgula e ponto-e-vírgula
      .map(s => s.trim())
      .filter(Boolean);
  }


  private syncSkillsToForm() {
    this.siteForm.get('skills')?.setValue(this.skills.join(', '));
    this.siteForm.get('skills')?.updateValueAndValidity({ onlySelf: true });
  }

  addSkill(e?: Event) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const value = (this.skillsCtrl.value || '').trim();
    if (!value) return;

    // evita duplicadas (case-insensitive)
    const exists = this.skills.some(s => s.toLowerCase() === value.toLowerCase());
    if (!exists) {
      this.skills.push(value);
      this.syncSkillsToForm();
    }
    this.skillsCtrl.setValue('');
  }

  onSkillKeydown(e: Event) {
    const ev = e as KeyboardEvent;
    if (ev.key === ',' || ev.key === ';') {
      ev.preventDefault();
      this.addSkill();
      return;
    }
    if (ev.key === 'Backspace' && !this.skillsCtrl.value) {
      this.skills.pop();
      this.syncSkillsToForm();
    }
  }

  commitSkill() {
    // adiciona o que ficou no input ao sair do foco
    this.addSkill();
  }

  removeSkill(i: number) {
    this.skills.splice(i, 1);
    this.syncSkillsToForm();
  }


  private loadBannerFromServer() {
    this.usuarioMidiaService.getMinhaMidia('banner').subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        // Se o back vier sem content-type de imagem, força um tipo image/*
        const typedBlob = blob.type && blob.type.startsWith('image/')
          ? blob
          : new Blob([blob], { type: 'image/jpeg' }); // fallback

        const reader = new FileReader();
        reader.onload = () => {
          this.bannerPreview = reader.result as string; // "data:image/..." OK
        };
        reader.readAsDataURL(typedBlob);
      },
      error: (error) => {      
        console.error('Error loading banner:', error);
      }
    });

  }

  private loadVideoFromServer() {
    this.usuarioMidiaService.getMinhaMidia('video').subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const typed = blob.type?.startsWith('video/')
          ? blob
          : new Blob([blob], { type: 'video/mp4' });

        const reader = new FileReader();
        reader.onload = () => this.videoPreview = reader.result as string; // "data:video/..."
        reader.readAsDataURL(typed);
      }
    });
  }

  private loadFotoPerfilFromServer() {
    this.usuarioMidiaService.getMinhaMidia('foto_perfil').subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const typedBlob = blob.type?.startsWith('image/')
          ? blob
          : new Blob([blob], { type: 'image/jpeg' }); // fallback

        const reader = new FileReader();
        reader.onload = () => this.fotoPerfilPreview = reader.result as string; // data:image/...
        reader.readAsDataURL(typedBlob);
      }
    });
  }

  onVideoSelected(video: File | null, tipo: string) {
    this.selectedVideos[tipo] = video;
    this.siteForm.get('video')?.setValue(video); // opcional (mantém o form coerente)
  }


  onImageSelected(image: File | null, tipo: string) {
    this.selectedImages[tipo] = image;
    this.siteForm.get(tipo)?.setValue(image);
  }

  onSubmit(){
    if (this.siteForm.invalid) {
      this.errorMessage = 'Preencha os campos obrigatórios.';
      return;
    }
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const dto: UsuarioSiteDTO = {
      nome: (this.siteForm.value.nome || '').trim(),
      bio: this.siteForm.value.bio || '',
      skills: this.skills.join(', '),
      tempoExperiencia: Number(this.siteForm.value.tempoExperiencia) || 0,
    };


    this.usuarioService.atualizarMeuSite(dto).subscribe({
      next: () => {
        this.authService.setNomeUsuario(dto.nome!); 

        const bannerFile = this.selectedImages['banner'] ?? null;
        const fotoPerfilFIle = this.selectedImages['fotoPerfil'] ?? null;;
        const videoFile  = this.selectedVideos['video'] ?? null;
        const temArquivos = !!bannerFile || !!videoFile || !!fotoPerfilFIle;

        if (!temArquivos) {
          this.successMessage = this.isEditMode ? 'Alterações salvas!' : 'Cadastro realizado!';
          this.isLoading = false;
          return;
        } 
        
        // Upload das mídias via service de mídias
        this.usuarioMidiaService.upload({
          banner: bannerFile || undefined,
          video:  videoFile  || undefined,
          fotoPerfil: fotoPerfilFIle || undefined
        }).subscribe({
          next: () => {
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = err?.error?.message || 'Erro ao enviar mídias.';
            this.isLoading = false;
          },
          complete: () => {
            this.successMessage = this.isEditMode ? 'Perfil e mídias atualizados!' : 'Cadastro concluído com mídias!';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erro ao salvar dados do site.';
        this.isLoading = false;
      }
    });    
  
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const tecla = event.key;
    if (!/[0-9\.]/.test(tecla)) {
      event.preventDefault();
    }
  }

}
