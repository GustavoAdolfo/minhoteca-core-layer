import { Entity } from './Entity';
import { Nome } from '../value-objects/Nome';
import { ISBN } from '../value-objects/ISBN';
import { LivroInvalidoError } from '../errors/DomainErrors';
import { generateUUID } from '../utils/uuid';

/**
 * Enum para representar o status de um livro na biblioteca
 */
export enum StatusLivro {
  DISPONIVEL = 'DISPONIVEL',
  EMPRESTADO = 'EMPRESTADO',
  DANIFICADO = 'DANIFICADO',
  DESCARTADO = 'DESCARTADO',
}

/**
 * Interface com as propriedades de um Livro
 */
export interface LivroProps {
  titulo: Nome;
  isbn: ISBN;
  autorId: string;
  editoraId: string;
  anoPublicacao: number;
  sinopse?: string;
  status: StatusLivro;
  localizacao?: string; // Localização física na biblioteca (ex: Prateleira A-3)
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * Entidade Livro
 * Representa um livro no sistema Minhoteca
 * Encapsula as regras de negócio relacionadas a livros
 */
export class Livro extends Entity<LivroProps> {
  private constructor(id: string, props: LivroProps) {
    super(id, props);
  }

  /**
   * Factory method para criar um novo Livro
   */
  static create(props: Omit<LivroProps, 'criadoEm' | 'atualizadoEm'>, id?: string): Livro {
    this.validarPropriedades(props);

    const livroId = id || this.generateId();
    const agora = new Date();

    const propsCompletas: LivroProps = {
      ...props,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    return new Livro(livroId, propsCompletas);
  }

  /**
   * Factory method para reconstruir um Livro a partir de dados persistidos
   */
  static reconstitute(id: string, props: LivroProps): Livro {
    return new Livro(id, props);
  }

  /**
   * Valida as propriedades antes de criar um Livro
   */
  private static validarPropriedades(props: Omit<LivroProps, 'criadoEm' | 'atualizadoEm'>): void {
    if (props.anoPublicacao < 1000 || props.anoPublicacao > new Date().getFullYear()) {
      throw new LivroInvalidoError(`Ano de publicação inválido: ${props.anoPublicacao}`);
    }
  }

  /**
   * Gera um ID único para novo Livro (UUID v4)
   */
  private static generateId(): string {
    return generateUUID();
  }

  getTitulo(): Nome {
    return this.props.titulo;
  }

  getISBN(): ISBN {
    return this.props.isbn;
  }

  getAutorId(): string {
    return this.props.autorId;
  }

  getEditoraId(): string {
    return this.props.editoraId;
  }

  getAnoPublicacao(): number {
    return this.props.anoPublicacao;
  }

  getDescricao(): string | undefined {
    return this.props.sinopse;
  }

  getStatus(): StatusLivro {
    return this.props.status;
  }

  getLocalizacao(): string | undefined {
    return this.props.localizacao;
  }

  /**
   * Marca o livro como emprestado
   */
  emprestar(): void {
    if (this.props.status !== StatusLivro.DISPONIVEL) {
      throw new LivroInvalidoError(
        `Não é possível emprestar livro com status ${this.props.status}`
      );
    }
    this.props.status = StatusLivro.EMPRESTADO;
    this.props.atualizadoEm = new Date();
  }

  /**
   * Marca o livro como devolvido (retorna ao status DISPONIVEL)
   */
  devolver(): void {
    if (this.props.status !== StatusLivro.EMPRESTADO) {
      throw new LivroInvalidoError(`Não é possível devolver livro com status ${this.props.status}`);
    }
    this.props.status = StatusLivro.DISPONIVEL;
    this.props.atualizadoEm = new Date();
  }

  /**
   * Marca o livro como danificado
   */
  marcarComoDanificado(): void {
    this.props.status = StatusLivro.DANIFICADO;
    this.props.atualizadoEm = new Date();
  }

  /**
   * Marca o livro como descartado
   */
  descartar(): void {
    this.props.status = StatusLivro.DESCARTADO;
    this.props.atualizadoEm = new Date();
  }

  /**
   * Verifica se o livro está disponível para empréstimo
   */
  estaDisponivel(): boolean {
    return this.props.status === StatusLivro.DISPONIVEL;
  }

  /**
   * Atualiza a localização do livro na biblioteca
   */
  atualizarLocalizacao(novaLocalizacao: string): void {
    this.props.localizacao = novaLocalizacao;
    this.props.atualizadoEm = new Date();
  }

  toString(): string {
    return `Livro(id: ${this.id}, titulo: ${this.props.titulo.toString()}, isbn: ${this.props.isbn.toString()})`;
  }
}
