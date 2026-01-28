import { StatusServico } from "src/app/sistema/servicos/StatusServico";


export const STATUS_SERVICO_META: Record<StatusServico, { label: string; className: string }> = {
  [StatusServico.CONCLUIDO]: { label: 'Concluído', className: 'concluido' },
  [StatusServico.EM_PROGRESSO]: { label: 'Em progresso', className: 'em-progresso' },
  [StatusServico.CANCELADO]: { label: 'Cancelado', className: 'cancelado' },
};

export function getStatusLabel(status: StatusServico): string {
  return STATUS_SERVICO_META[status]?.label ?? '-';
}

export function getStatusClass(status: StatusServico): string {
  return STATUS_SERVICO_META[status]?.className ?? '';
}
