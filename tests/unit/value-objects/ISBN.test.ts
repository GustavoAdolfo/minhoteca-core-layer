import { ISBN } from '../../../layer/nodejs/src/value-objects/ISBN';

describe('ISBN Value Object', () => {
  it('deve criar um ISBN-13 válido', () => {
    const isbn = new ISBN('978-0-123-45678-9');
    expect(isbn.toPrimitive()).toBe('9780123456789');
  });

  it('deve criar um ISBN-10 válido', () => {
    const isbn = new ISBN('0-123-45678-X');
    expect(isbn.toPrimitive()).toBe('012345678X');
  });

  it.each([
    ['9788556710239', '9788556710239'],
    [{ value: '9786587817644' }, '9786587817644'],
    [{ value: '978-6587817644' }, '9786587817644'],
    [new ISBN('9786587817644'), '9786587817644'],
    [9788535900736, '9788535900736'],
    [8535900736, '8535900736'],
  ])('deve normalizar ISBN persistido %p para %s', (value, esperado) => {
    expect(new ISBN(value).toPrimitive()).toBe(esperado);
  });

  it.each([
    null,
    {},
    [],
    true,
    NaN,
    Infinity,
    -9788535900736,
    1.5,
    Number.MAX_SAFE_INTEGER + 1,
    { value: null },
    { value: {} },
    { value: { value: '9786587817644' } },
  ])('deve rejeitar tipo ou valor inválido %p', (value) => {
    expect(() => new ISBN(value)).toThrow(TypeError);
    expect(() => new ISBN(value)).toThrow('Tipo ou valor de ISBN inválido.');
  });

  it('deve validar o formato do ISBN serializado', () => {
    expect(() => new ISBN({ value: '123' })).toThrow('ISBN inválido');
  });

  it('deve retornar erro ao criar um ISBN nulo', () => {
    expect(() => new ISBN(undefined)).toThrow('ISBN é obrigatório');
  });

  it('deve retornar desigualdade para objetos diferentes', () => {
    const isbn = new ISBN('978-0-123-45678-9');
    expect(isbn.equals('978-0-123-45678-9' as unknown as ISBN)).toBe(false);
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
