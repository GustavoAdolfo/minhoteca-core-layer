/**
 * Classe base para erros customizados de domínio
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

/**
 * Erro lançado quando um livro é inválido
 */
export class LivroInvalidoError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'LivroInvalidoError';
  }
}

/**
 * Erro lançado quando um autor é inválido
 */
export class AutorInvalidoError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'AutorInvalidoError';
  }
}

/**
 * Erro lançado quando uma editora é inválida
 */
export class EditoraInvalidaError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'EditoraInvalidaError';
  }
}
