import {
  AutorInvalidoError,
  DomainError,
  EditoraInvalidaError,
  LivroInvalidoError,
  PaisInvalidoError,
} from '../../../layer/nodejs/src/errors/DomainErrors';

describe('DomainErrors', () => {
  it('deve criar DomainError com mensagem e cause', () => {
    const cause = new Error('erro raiz');
    const error = new DomainError('erro de domínio', { cause });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe('DomainError');
    expect(error.message).toBe('erro de domínio');
    expect(error.cause).toBe(cause);
  });

  it('deve criar LivroInvalidoError com nome correto', () => {
    const error = new LivroInvalidoError('livro inválido');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe('LivroInvalidoError');
    expect(error.message).toBe('livro inválido');
  });

  it('deve criar AutorInvalidoError com nome correto', () => {
    const error = new AutorInvalidoError('autor inválido');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe('AutorInvalidoError');
    expect(error.message).toBe('autor inválido');
  });

  it('deve criar EditoraInvalidaError com nome correto', () => {
    const error = new EditoraInvalidaError('editora inválida');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe('EditoraInvalidaError');
    expect(error.message).toBe('editora inválida');
  });

  it('deve criar PaisInvalidoError com nome correto', () => {
    const error = new PaisInvalidoError('país inválido');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe('PaisInvalidoError');
    expect(error.message).toBe('país inválido');
  });
});
