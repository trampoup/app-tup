export const CATEGORIAS = {
  SERVICOS_TECNICOS: [
    'Técnico de Ar Condicionado',
    'Eletricista Residencial',
    'Encanador',
    'Técnico em Informática',
    'Técnico em Refrigeração',
    'Montador de Móveis',
    'Mecânico Automotivo',
    'Instalador de Câmeras de Segurança',
    'Chaveiro',
    'Técnico em Energia Solar'
  ],
  SERVICOS_DOMESTICOS: [
    'Diarista / Faxineira',
    'Passadeira',
    'Cozinheira',
    'Babá / Cuidadora Infantil',
    'Cuidador de Idosos',
    'Pet Sitter',
    'Lavadeira'
  ],
  SERVICOS_MANUTENCAO: [
    'Pintor',
    'Pedreiro',
    'Gesseiro',
    'Jardineiro',
    'Zelador / Síndico Profissional',
    'Vidraceiro',
    'Serralheiro'
  ],
  BELEZA_E_ESTETICA: [
    'Cabeleireiro(a)',
    'Maquiador(a)',
    'Manicure / Pedicure',
    'Designer de Sobrancelhas',
    'Depilador(a)',
    'Massagista',
    'Esteticista'
  ],
  SERVICOS_DE_TRANSPORTE: [
    'Motorista Particular',
    'Motoboy / Entregador',
    'Guincheiro',
    'Lavador de Carros',
    'Carreteiro / Freteiro'
  ],
  EDUCACAO_AULAS_PARTICULARES: [
    'Professor Particular (reforço escolar)',
    'Instrutor de Inglês / Espanhol / etc.',
    'Instrutor de Música',
    'Revisor de Textos',
    'Treinador de Redação / ENEM',
    'Personal Trainer'
  ],
  EVENTOS: [
    'Garçom / Garçonete',
    'Copeiro(a)',
    'Barman / Barwoman',
    'DJ',
    'Decorador(a) de Festas',
    'Cerimonialista',
    'Fotógrafo / Videomaker'
  ],
  SERVICOS_ADMINISTRATIVOS_E_ONLINE: [
    'Assistente Virtual',
    'Social Media',
    'Designer Gráfico',
    'Desenvolvedor Web',
    'Editor de Vídeo',
    'Redator Freelancer',
    'Contador / Auxiliar Contábil'
  ]
} as const;

export type CategoriaKey = keyof typeof CATEGORIAS;
export type Subcategoria = typeof CATEGORIAS[CategoriaKey][number];
