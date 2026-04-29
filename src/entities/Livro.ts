import { Entity } from './Entity';
import { StatusLivro } from '../enums';
import { ISBN } from '../value-objects/ISBN';
import { LivroInvalidoError } from '../errors/DomainErrors';
import { generateUUID } from '../utils/uuid';
import { LivroInterface } from '../interfaces/livro.interface';

/**
 * Entidade Livro
 * Representa um livro no sistema Minhoteca
 * Encapsula as regras de negócio relacionadas a livros
 */
export class Livro extends Entity {
  atualizadoEm: Date;
  criadoEm: Date;
  titulo?: string;
  subtitulo?: string;
  isbn: ISBN;
  autorId: string;
  editoraId?: string;
  anoPublicacao?: number;
  paginas: number;
  sinopse: string | undefined;
  status: StatusLivro;
  localizacao: string | undefined;
  revisar: boolean | undefined;
  idioma: string | undefined;
  imagemCapaUrl: string | undefined;
  imagemCapaMiniUrl: string | undefined;

  private constructor(id: string, props: LivroInterface) {
    super(id);
    this.atualizadoEm = props.atualizadoEm ?? new Date();
    this.criadoEm = props.criadoEm ?? new Date();
    if (this.validarTitulo(props.titulo)) {
      this.titulo = props.titulo;
    }
    this.subtitulo = props.subtitulo;
    this.isbn = props.isbn;
    this.autorId = props.autorId;
    this.editoraId = props.editoraId;
    this.anoPublicacao = props.anoPublicacao;
    this.paginas = props.paginas ?? 0;
    this.sinopse = props.sinopse;
    this.status = props.status ?? StatusLivro.REVISAO;
    this.localizacao = props.localizacao;
    this.revisar = props.revisar ?? true;
    this.idioma = props.idioma;
    this.imagemCapaUrl = props.imagemCapaUrl;
    this.imagemCapaMiniUrl = props.imagemCapaMiniUrl;
  }

  /**
   * Factory method para criar um novo Livro
   */
  static create(props: Omit<LivroInterface, 'criadoEm' | 'atualizadoEm'>, id?: string): Livro {
    this.validarPropriedades(props);

    const livroId = id ?? this.generateId().replaceAll('-', '');
    const agora = new Date();
    const isbn = Object.getOwnPropertyDescriptor(props, 'isbn')
      ? typeof props.isbn === 'string'
        ? new ISBN(props.isbn)
        : new ISBN(Object.getOwnPropertyDescriptor(props.isbn, 'value')?.value ?? '')
      : new ISBN('');

    const propsCompletas: LivroInterface = {
      ...props,
      isbn,
      criadoEm: Object.getOwnPropertyDescriptor(props, 'criadoEm')?.value ?? agora,
      atualizadoEm: Object.getOwnPropertyDescriptor(props, 'atualizadoEm')?.value ?? agora,
    };

    return new Livro(livroId, propsCompletas);
  }

  /**
   * Factory method para reconstruir um Livro a partir de dados persistidos
   */
  static reconstitute(id: string, props: LivroInterface): Livro {
    return new Livro(id, props);
  }

  /**
   * Valida as propriedades antes de criar um Livro
   */
  private static validarPropriedades(
    props: Omit<LivroInterface, 'criadoEm' | 'atualizadoEm'>
  ): void {
    if (
      props.anoPublicacao &&
      (props.anoPublicacao < 1000 || props.anoPublicacao > new Date().getFullYear())
    ) {
      throw new LivroInvalidoError(`Ano de publicação inválido: ${props.anoPublicacao}`);
    }
  }

  private validarTitulo(titulo: string | undefined): boolean {
    if (!titulo || String(titulo)?.trim().length === 0) {
      throw new LivroInvalidoError('Título é obrigatório e não pode ser vazio ou nulo');
    }
    return true;
  }

  /**
   * Gera um ID único para novo Livro (UUID v4)
   */
  private static generateId(): string {
    return generateUUID().replaceAll('-', '');
  }

  getTitulo(): string | undefined {
    return this.titulo?.toString();
  }

  getSubtitulo(): string | undefined {
    return this.subtitulo;
  }

  getISBN(): string {
    return this.isbn.toPrimitive();
  }

  getAutorId(): string {
    return this.autorId;
  }

  getEditoraId(): string | undefined {
    return this.editoraId;
  }

  getAnoPublicacao(): number | undefined {
    return this.anoPublicacao;
  }

  getPaginas(): number {
    return this.paginas;
  }

  getSinopse(): string | undefined {
    return this.sinopse;
  }

  getStatus(): StatusLivro {
    return this.status;
  }

  getLocalizacao(): string | undefined {
    return this.localizacao;
  }

  getAtualizadoEm(): string {
    return this.atualizadoEm.toISOString();
  }
  getCriadoEm(): string {
    return this.criadoEm.toISOString();
  }

  getRevisar(): boolean | undefined {
    return this.revisar;
  }

  getIdioma(): string | undefined {
    return this.idioma;
  }

  getImagemCapaUrl(): string | undefined {
    return this.imagemCapaUrl;
  }

  getImagemCapaMiniUrl(): string | undefined {
    return this.imagemCapaMiniUrl;
  }

  /**
   * Marca o livro como emprestado
   */
  emprestar(): void {
    if (this.status !== StatusLivro.DISPONIVEL) {
      throw new LivroInvalidoError(`Não é possível emprestar livro com status ${this.status}`);
    }
    this.status = StatusLivro.EMPRESTADO;
    this.atualizadoEm = new Date();
  }

  /**
   * Marca o livro como devolvido (retorna ao status DISPONIVEL)
   */
  devolver(): void {
    if (this.status !== StatusLivro.EMPRESTADO) {
      throw new LivroInvalidoError(`Não é possível devolver livro com status ${this.status}`);
    }
    this.status = StatusLivro.DISPONIVEL;
    this.atualizadoEm = new Date();
  }

  /**
   * Marca o livro como danificado
   */
  marcarComoDanificado(): void {
    this.status = StatusLivro.DANIFICADO;
    this.atualizadoEm = new Date();
  }

  /**
   * Marca o livro como descartado
   */
  descartar(): void {
    this.status = StatusLivro.DESCARTADO;
    this.atualizadoEm = new Date();
  }

  /**
   * Verifica se o livro está disponível para empréstimo
   */
  disponivel(): boolean {
    return this.status === StatusLivro.DISPONIVEL && this.revisar !== true;
  }

  sobRevisao(): boolean {
    return this.status === StatusLivro.REVISAO || this.revisar === true;
  }

  marcarParaRevisao(): void {
    this.revisar = true;
    this.status = StatusLivro.REVISAO;
    this.atualizadoEm = new Date();
  }

  removerDaRevisao(): void {
    this.revisar = false;
    this.status = StatusLivro.DISPONIVEL;
    this.atualizadoEm = new Date();
  }

  /**
   * Atualiza a localização do livro na biblioteca
   */
  atualizarLocalizacao(novaLocalizacao: string): void {
    this.localizacao = novaLocalizacao;
    this.atualizadoEm = new Date();
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.getId(),
      titulo: this.getTitulo(),
      subtitulo: this.getSubtitulo(),
      isbn: this.getISBN().toString(),
      autorId: this.getAutorId(),
      editoraId: this.getEditoraId(),
      anoPublicacao: this.getAnoPublicacao(),
      status: this.getStatus(),
      localizacao: this.getLocalizacao(),
      criadoEm: this.getCriadoEm(),
      atualizadoEm: this.getAtualizadoEm(),
      sinopse: this.getSinopse(),
      paginas: this.getPaginas(),
    });
  }

  equals(entity: Entity): boolean {
    if (!(entity instanceof Livro)) {
      return false;
    }
    return (
      this.titulo === entity.titulo &&
      this.subtitulo === entity.subtitulo &&
      this.isbn.equals(entity.isbn) &&
      this.autorId === entity.autorId &&
      this.editoraId === entity.editoraId &&
      this.anoPublicacao === entity.anoPublicacao &&
      this.paginas === entity.paginas &&
      this.sinopse === entity.sinopse &&
      this.status === entity.status &&
      this.localizacao === entity.localizacao &&
      this.revisar === entity.revisar &&
      this.idioma === entity.idioma &&
      this.imagemCapaUrl === entity.imagemCapaUrl &&
      this.imagemCapaMiniUrl === entity.imagemCapaMiniUrl
    );
  }
}
