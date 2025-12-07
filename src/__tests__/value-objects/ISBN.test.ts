import { ISBN } from '../../value-objects/ISBN';

describe('ISBN Value Object', () => {
  it('deve criar um ISBN-13 válido', () => {
    const isbn = new ISBN('978-0-123-45678-9');
    expect(isbn.toPrimitive()).toBe('9780123456789');
  });

  it('deve criar um ISBN-10 válido', () => {
    const isbn = new ISBN('0-123-45678-X');
    expect(isbn.toPrimitive()).toBe('012345678X');
  });

  it('deve remover hífens e espaços', () => {
    const isbn = new ISBN('978 0 123 45678 9');
    expect(isbn.toPrimitive()).toBe('9780123456789');
  });

  it('deve lançar erro para ISBN inválido', () => {
    expect(() => new ISBN('123-456-789')).toThrow('ISBN inválido');
  });

  it('deve comparar dois ISBNs iguais', () => {
    const isbn1 = new ISBN('9780123456789');
    const isbn2 = new ISBN('978-0-123-45678-9');
    expect(isbn1.equals(isbn2)).toBe(true);
  });

  it('deve comparar dois ISBNs diferentes', () => {
    const isbn1 = new ISBN('9780123456789');
    const isbn2 = new ISBN('9780123456788');
    expect(isbn1.equals(isbn2)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const isbn = new ISBN('978-0-123-45678-9');
    expect(isbn.toString()).toBe('9780123456789');
  });
});
