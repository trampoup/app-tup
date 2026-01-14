import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-video',
  templateUrl: './input-video.component.html',
  styleUrls: ['./input-video.component.css']
})
export class InputVideoComponent {
  @Input() label: string = 'Clique ou arraste o video para fazer upload';
  @Input() inputId: string = 'video';
  @Input() maxDurationSeconds: number = 30;
  @Output() videoSelected = new EventEmitter<File | null>();
  @Input() videoPreview: string | ArrayBuffer | null = null;
  @Output() fileRemoved = new EventEmitter<void>();
  @Output() validationError = new EventEmitter<string>();

  localError: string | null = null;
  selectedFile: File | null = null; 

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processFile(file, input);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const inputElement = document.getElementById(this.inputId) as HTMLInputElement;
      this.processFile(file, inputElement);
    }
  }

  private rejectFile(inputElement: HTMLInputElement, msg: string) {
    this.localError = msg;
    this.validationError.emit(msg);

    this.selectedFile = null;
    this.videoPreview = null;
    this.videoSelected.emit(null);

    if (inputElement) inputElement.value = '';
  }

  private getVideoDurationSeconds(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');

      video.preload = 'metadata';
      video.src = url;

      video.onloadedmetadata = () => {
        const dur = video.duration;
        URL.revokeObjectURL(url);
        resolve(dur);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Erro ao ler metadata do vídeo'));
      };
    });
  }


  private async processFile(file: File, inputElement: HTMLInputElement): Promise<void> {
    this.localError = null;

    const duration = await this.getVideoDurationSeconds(file).catch(() => null);

    if (duration == null || Number.isNaN(duration)) {
      this.rejectFile(inputElement, 'Não foi possível validar a duração do vídeo. Tente outro arquivo.');
      return;
    }

    if (duration > this.maxDurationSeconds) {
      this.rejectFile(inputElement, `Vídeo muito longo: ${Math.ceil(duration)}s. O máximo permitido é ${this.maxDurationSeconds}s.`);
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.videoPreview = reader.result as string;
      this.videoSelected.emit(file);
    };

    reader.readAsDataURL(file);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    inputElement.files = dataTransfer.files;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  isPreviewVideo(preview: string | ArrayBuffer): boolean {
    return typeof preview === 'string' 
    && (preview.startsWith('data:video/') 
    || /^https?:\/\//i.test(preview)
    || preview.startsWith('blob:'));
  }
  
  removeFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.videoPreview = null;

    const inputElement = document.getElementById(
      this.inputId
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }

    this.fileRemoved.emit();

    console.log('Arquivo removido');
  }

}