import { LivroDTO } from './LivroDTO';
import { PaisDTO } from './PaisDTO';

export class AutorDTO {
  id?: string;
  nome?: string;
  imagemPadrao?: string;
  imagemDispositivos?: string;
  urlReferencia?: string;
  idPais?: number;
  pais?: PaisDTO;
  totalLivros: number = 0;
  revisar: boolean = false;
  livros?: LivroDTO[];

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
    this.pais = Object.getOwnPropertyDescriptor(data, 'pais')?.value as PaisDTO | undefined;
    this.idPais = Object.getOwnPropertyDescriptor(data, 'idPais')?.value as number | undefined;
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
      pais: this.pais,
      idPais: this.idPais,
      totalLivros: this.totalLivros,
      revisar: this.revisar,
    });
  }
}
