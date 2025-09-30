import { Component, OnInit } from '@angular/core';
import { LocalizacaoService } from 'src/app/configs/services/localizacao.service';
import { Localizacao } from '../localizacao';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualizar-localizacao',
  templateUrl: './visualizar-localizacao.component.html',
  styleUrls: ['./visualizar-localizacao.component.css']
})
export class VisualizarLocalizacaoComponent implements OnInit {
  isLoading: boolean = false;
  localizacaoId: number | string | null = null;

  selectedLocalizacao: Localizacao | null = null;

  


  constructor(
    private localizacaoService: LocalizacaoService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.carregarLocalizacao();
  }

  carregarLocalizacao(){
    this.localizacaoId = this.router.snapshot.paramMap.get('id');
    if (!this.localizacaoId) { return; }
    this.isLoading = true;

    this.localizacaoService.obterPorId(this.localizacaoId).subscribe({
      next: (localizacao: Localizacao) => {
        this.selectedLocalizacao = localizacao;
        console.log(this.selectedLocalizacao);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao carregar localizacao:', err);
      }
    });
  }




}
