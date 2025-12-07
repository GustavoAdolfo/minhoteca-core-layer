/**
 * DTO para representar um Livro em APIs
 */
export interface LivroDTO {
  id: string;
  titulo: string;
  isbn: string;
  autorId: string;
  editoraId: string;
  anoPublicacao: number;
  descricao?: string;
  dataAquisicao: string;
  status: string;
  localizacao?: string;
  criadoEm: string;
  atualizadoEm: string;
}

/**
 * DTO para criar um novo Livro
 */
export interface CriarLivroDTO {
  titulo: string;
  isbn: string;
  autorId: string;
  editoraId: string;
  anoPublicacao: number;
  descricao?: string;
  dataAquisicao: string;
  status?: string;
  localizacao?: string;
}

/**
 * DTO para atualizar um Livro
 */
export interface AtualizarLivroDTO {
  titulo?: string;
  descricao?: string;
  localizacao?: string;
  status?: string;
}
