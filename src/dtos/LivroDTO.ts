import { StatusLivro } from '../enums';
import { AutorDTO } from './AutorDTO';
import { EditoraDTO } from './EditoraDTO';

export class LivroDTO {
  titulo: string;
  autorId: string;
  id?: string;
  isbn?: string;
  editoraId?: string;
  anoPublicacao?: number;
  sinopse?: string;
  status: StatusLivro;
  localizacao?: string;
  revisar?: boolean;
  autor?: AutorDTO;
  editora?: EditoraDTO;
  criadoEm?: string;
  atualizadoEm?: string;

  constructor(data: object) {
    this.id = Object.getOwnPropertyDescriptor(data, 'id')?.value as string | undefined;
    this.titulo = Object.getOwnPropertyDescriptor(data, 'titulo')?.value as string | '';
    this.autorId = Object.getOwnPropertyDescriptor(data, 'autorId')?.value as string | '';
    this.editoraId = Object.getOwnPropertyDescriptor(data, 'editoraId')?.value as
      | string
      | undefined;
    this.isbn = Object.getOwnPropertyDescriptor(data, 'isbn')?.value as string | undefined;
    this.anoPublicacao = Object.getOwnPropertyDescriptor(data, 'anoPublicacao')?.value as
      | number
      | undefined;
    this.sinopse = Object.getOwnPropertyDescriptor(data, 'sinopse')?.value as string | undefined;
    this.status = Object.getOwnPropertyDescriptor(data, 'status')?.value as
      | StatusLivro
      | StatusLivro.REVISAO;
    this.localizacao = Object.getOwnPropertyDescriptor(data, 'localizacao')?.value as
      | string
      | undefined;
    this.revisar = Object.getOwnPropertyDescriptor(data, 'revisar')?.value as boolean | true;
    this.autor = Object.getOwnPropertyDescriptor(data, 'autor')
      ? new AutorDTO(Object.getOwnPropertyDescriptor(data, 'autor')?.value as object)
      : undefined;
    this.editora = Object.getOwnPropertyDescriptor(data, 'editora')
      ? new EditoraDTO(Object.getOwnPropertyDescriptor(data, 'editora')?.value as object)
      : undefined;
    this.criadoEm = Object.getOwnPropertyDescriptor(data, 'criadoEm')?.value as string | undefined;
    this.atualizadoEm = Object.getOwnPropertyDescriptor(data, 'atualizadoEm')?.value as
      | string
      | undefined;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      titulo: this.titulo,
      autorId: this.autorId,
      editoraId: this.editoraId,
      isbn: this.isbn,
      anoPublicacao: this.anoPublicacao,
      sinopse: this.sinopse,
      status: this.status,
      localizacao: this.localizacao,
      revisar: this.revisar,
      autor: this.autor,
      editora: this.editora,
      criadoEm: this.criadoEm,
      atualizadoEm: this.atualizadoEm,
    });
  }
}
