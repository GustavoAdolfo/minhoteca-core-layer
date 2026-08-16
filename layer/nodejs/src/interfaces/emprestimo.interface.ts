export interface EmprestimoInterface {
  id?: string;
  livroId: string;
  usuarioId: string;
  solicitacaoDataHora: string;
  emprestimoDataHora?: string;
  prazoDias?: number;
  previsaoDevolucaoDataHora?: string;
  devolucaoDataHora?: string;
  renovacaoDataHora?: string;
  situacao: string;
  observacao?: string;
}
