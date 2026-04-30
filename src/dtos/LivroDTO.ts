import { StatusLivro } from '../enums';
import { AutorDTO } from './AutorDTO';
import { EditoraDTO } from './EditoraDTO';

export class LivroDTO {
  id?: string;
  titulo: string;
  subtitulo?: string;
  isbn?: string;
  autorId: string;
  editoraId?: string;
  anoPublicacao?: number;
  paginas?: number;
  sinopse?: string;
  status: StatusLivro;
  localizacao?: string;
  revisar?: boolean;
  autor?: AutorDTO;
  editora?: EditoraDTO;
  // criadoEm?: string;
  // atualizadoEm?: string;
  idioma?: string;
  imagemCapaUrl?: string;
  imagemCapaMiniUrl?: string;

  constructor(data: object) {
    this.id = Object.getOwnPropertyDescriptor(data, 'id')?.value as string | undefined;
    this.titulo = Object.getOwnPropertyDescriptor(data, 'titulo')?.value as string | '';
    this.subtitulo = Object.getOwnPropertyDescriptor(data, 'subtitulo')?.value as
      | string
      | undefined;
    this.autorId = Object.getOwnPropertyDescriptor(data, 'autorId')?.value as string | '';
    this.editoraId = Object.getOwnPropertyDescriptor(data, 'editoraId')?.value as
      | string
      | undefined;
    this.isbn = Object.getOwnPropertyDescriptor(data, 'isbn')?.value as string | undefined;
    this.anoPublicacao = Object.getOwnPropertyDescriptor(data, 'anoPublicacao')?.value as
      | number
      | undefined;
    this.paginas = Object.getOwnPropertyDescriptor(data, 'paginas')?.value as number | undefined;
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
    // this.criadoEm = Object.getOwnPropertyDescriptor(data, 'criadoEm')?.value as string | undefined;
    // this.atualizadoEm = Object.getOwnPropertyDescriptor(data, 'atualizadoEm')?.value as
    //   | string
    //   | undefined;
    this.idioma = Object.getOwnPropertyDescriptor(data, 'idioma')?.value as string | undefined;
    this.imagemCapaUrl = Object.getOwnPropertyDescriptor(data, 'imagemCapaUrl')?.value as
      | string
      | undefined;
    this.imagemCapaMiniUrl = Object.getOwnPropertyDescriptor(data, 'imagemCapaMiniUrl')?.value as
      | string
      | undefined;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      titulo: this.titulo,
      subtitulo: this.subtitulo,
      autorId: this.autorId,
      editoraId: this.editoraId,
      isbn: this.isbn,
      anoPublicacao: this.anoPublicacao,
      paginas: this.paginas,
      sinopse: this.sinopse,
      status: this.status,
      localizacao: this.localizacao,
      revisar: this.revisar,
      autor: this.autor,
      editora: this.editora,
      // criadoEm: this.criadoEm,
      // atualizadoEm: this.atualizadoEm,
      idioma: this.idioma,
      imagemCapaUrl: this.imagemCapaUrl,
      imagemCapaMiniUrl: this.imagemCapaMiniUrl,
    });
  }
}
