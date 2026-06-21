/**
 * Classe base para erros customizados de domínio
 */
export class DomainError extends Error {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'DomainError';
  }
}

/**
 * Erro lançado quando um livro é inválido
 */
export class LivroInvalidoError extends DomainError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'LivroInvalidoError';
  }
}

/**
 * Erro lançado quando um autor é inválido
 */
export class AutorInvalidoError extends DomainError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'AutorInvalidoError';
  }
}

/**
 * Erro lançado quando uma editora é inválida
 */
export class EditoraInvalidaError extends DomainError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'EditoraInvalidaError';
  }
}

/**
 * Erro lançado quando um país é inválido
 */
export class PaisInvalidoError extends DomainError {
  constructor(message: string, options?: { cause?: Error }) {
    super(message, options);
    this.name = 'PaisInvalidoError';
  }
}
