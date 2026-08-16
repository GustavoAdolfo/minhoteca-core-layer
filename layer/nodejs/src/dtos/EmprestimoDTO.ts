export class EmprestimoDTO {
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

  constructor(data: object) {
    this.id = Object.getOwnPropertyDescriptor(data, 'id')?.value as string | undefined;
    this.livroId = Object.getOwnPropertyDescriptor(data, 'livroId')?.value as string;
    this.usuarioId = Object.getOwnPropertyDescriptor(data, 'usuarioId')?.value as string;
    this.solicitacaoDataHora = Object.getOwnPropertyDescriptor(data, 'solicitacaoDataHora')
      ?.value as string;
    this.emprestimoDataHora = Object.getOwnPropertyDescriptor(data, 'emprestimoDataHora')?.value as
      | string
      | undefined;
    this.prazoDias = Object.getOwnPropertyDescriptor(data, 'prazoDias')?.value as
      | number
      | undefined;
    this.previsaoDevolucaoDataHora = Object.getOwnPropertyDescriptor(
      data,
      'previsaoDevolucaoDataHora'
    )?.value as string | undefined;
    this.devolucaoDataHora = Object.getOwnPropertyDescriptor(data, 'devolucaoDataHora')?.value as
      | string
      | undefined;
    this.renovacaoDataHora = Object.getOwnPropertyDescriptor(data, 'renovacaoDataHora')?.value as
      | string
      | undefined;
    this.situacao = Object.getOwnPropertyDescriptor(data, 'situacao')?.value as string;
    this.observacao = Object.getOwnPropertyDescriptor(data, 'observacao')?.value as
      | string
      | undefined;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      livroId: this.livroId,
      usuarioId: this.usuarioId,
      solicitacaoDataHora: this.solicitacaoDataHora,
      emprestimoDataHora: this.emprestimoDataHora,
      prazoDias: this.prazoDias,
      previsaoDevolucaoDataHora: this.previsaoDevolucaoDataHora,
      devolucaoDataHora: this.devolucaoDataHora,
      renovacaoDataHora: this.renovacaoDataHora,
      situacao: this.situacao,
      observacao: this.observacao,
    });
  }
}
