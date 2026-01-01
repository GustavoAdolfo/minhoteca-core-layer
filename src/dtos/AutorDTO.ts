export class AutorDTO {
  id?: string;
  nome?: string;
  imagemPadrao?: string;
  imagemDispositivos?: string;
  urlReferencia?: string;
  nomePais?: string;
  nomePaisPortugues?: string;
  isoAlpha3?: string;
  idPais?: number;
  bandeira?: string;
  totalLivros: number = 0;
  revisar: boolean = false;

  constructor(data: object) {
    this.id = Object.getOwnPropertyDescriptor(data, 'id')?.value as string | undefined;
    this.nome = Object.getOwnPropertyDescriptor(data, 'nome')?.value as string | undefined;
    this.imagemPadrao = Object.getOwnPropertyDescriptor(data, 'imagemPadrao')?.value as
      | string
      | undefined;
    this.imagemDispositivos = Object.getOwnPropertyDescriptor(data, 'imagemDispositivos')?.value as
      | string
      | undefined;
    this.urlReferencia = Object.getOwnPropertyDescriptor(data, 'urlReferencia')?.value as
      | string
      | undefined;
    this.nomePais = Object.getOwnPropertyDescriptor(data, 'nomePais')?.value as string | undefined;
    this.nomePaisPortugues = Object.getOwnPropertyDescriptor(data, 'nomePaisPortugues')?.value as
      | string
      | undefined;
    this.isoAlpha3 = Object.getOwnPropertyDescriptor(data, 'isoAlpha3')?.value as
      | string
      | undefined;
    this.idPais = Object.getOwnPropertyDescriptor(data, 'idPais')?.value as number | undefined;
    this.bandeira = Object.getOwnPropertyDescriptor(data, 'bandeira')?.value as string | undefined;
    this.totalLivros =
      (Object.getOwnPropertyDescriptor(data, 'totalLivros')?.value as number | undefined) ?? 0;
    this.revisar =
      (Object.getOwnPropertyDescriptor(data, 'revisar')?.value as boolean | undefined) ?? false;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      nome: this.nome,
      imagemPadrao: this.imagemPadrao,
      imagemDispositivos: this.imagemDispositivos,
      urlReferencia: this.urlReferencia,
      nomePais: this.nomePais,
      nomePaisPortugues: this.nomePaisPortugues,
      isoAlpha3: this.isoAlpha3,
      idPais: this.idPais,
      bandeira: this.bandeira,
      totalLivros: this.totalLivros,
      revisar: this.revisar,
    });
  }
}
