import { Email, ValueObject } from '../../../layer/nodejs/src/value-objects';

describe('Email Value Object', () => {
  it('deve criar um email válido', () => {
    const email = new Email('usuario@exemplo.com.br');
    expect(email.toPrimitive()).toBe('usuario@exemplo.com.br');
  });

  it('deve criar um email válido por objeto', () => {
    const email = new Email({ value: 'usuario@exemplo.com.br' });
    expect(email.toPrimitive()).toBe('usuario@exemplo.com.br');
  });

  it('deve normalizar para minúsculas', () => {
    const email = new Email('USUARIO@EXEMPLO.COM');
    expect(email.toPrimitive()).toBe('usuario@exemplo.com');
  });

  it('deve remover espaços em branco', () => {
    const email = new Email('  usuario@exemplo.com  ');
    expect(email.toPrimitive()).toBe('usuario@exemplo.com');
  });

  it('deve lançar erro para email inválido sem @', () => {
    expect(() => new Email('usuarioexemplo.com')).toThrow('Email inválido');
  });

  it('deve lançar erro para email inválido sem domínio', () => {
    expect(() => new Email('usuario@')).toThrow('Email inválido');
  });

  it('deve comparar dois emails iguais', () => {
    const email1 = new Email('usuario@exemplo.com');
    const email2 = new Email('USUARIO@EXEMPLO.COM');
    expect(email1.equals(email2)).toBe(true);
  });

  it('deve comparar dois emails diferentes', () => {
    const email1 = new Email('usuario@exemplo.com');
    const email2 = new Email('outro@exemplo.com');
    expect(email1.equals(email2)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const email = new Email('usuario@exemplo.com');
    expect(email.toString()).toBe('usuario@exemplo.com');
  });

  it('deve retornar desigualdade para objetos diferentes', () => {
    const email1 = new Email('usuario@exemplo.com');
    const email2 = 'outro@exemplo.com';
    expect(email1.equals(email2 as unknown as ValueObject)).toBe(false);
  });

  it('deve lançar erro para email nulo', () => {
    expect(() => new Email('')).toThrow('Email inválido');
  });

  it('deve retornar JSON com a propriedade value', () => {
    const email = new Email('usuario@exemplo.com');
    expect(email.toJSON()).toEqual(JSON.stringify({ value: 'usuario@exemplo.com' }));
  });

  it('deve retornar erro por email inválido com espaços internos', () => {
    expect(() => new Email('usuario @exemplo.com')).toThrow('Email inválido');
  });
});
