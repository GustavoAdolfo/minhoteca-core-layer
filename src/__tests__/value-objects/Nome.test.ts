import { Nome } from '../../value-objects/Nome';

describe('Nome Value Object', () => {
  it('deve criar um nome válido', () => {
    const nome = new Nome('João da Silva');
    expect(nome.toPrimitive()).toBe('João da Silva');
  });

  it('deve remover espaços em branco desnecessários', () => {
    const nome = new Nome('  João Silva  ');
    expect(nome.toPrimitive()).toBe('João Silva');
  });

  it('deve lançar erro para nome muito curto', () => {
    expect(() => new Nome('A')).toThrow('Nome deve ter no mínimo 2 caracteres');
  });

  it('deve lançar erro para nome vazio', () => {
    expect(() => new Nome('')).toThrow('Nome deve ter no mínimo 2 caracteres');
  });

  it('deve lançar erro para nome muito longo', () => {
    const nomeLongo = 'a'.repeat(256);
    expect(() => new Nome(nomeLongo)).toThrow('Nome não pode exceder 255 caracteres');
  });

  it('deve aceitar nome com exatamente 2 caracteres', () => {
    const nome = new Nome('Jo');
    expect(nome.toPrimitive()).toBe('Jo');
  });

  it('deve aceitar nome com exatamente 255 caracteres', () => {
    const nomeLongo = 'a'.repeat(255);
    const nome = new Nome(nomeLongo);
    expect(nome.toPrimitive()).toBe(nomeLongo);
  });

  it('deve comparar dois nomes iguais', () => {
    const nome1 = new Nome('João Silva');
    const nome2 = new Nome('João Silva');
    expect(nome1.equals(nome2)).toBe(true);
  });

  it('deve comparar dois nomes diferentes', () => {
    const nome1 = new Nome('João Silva');
    const nome2 = new Nome('Maria Silva');
    expect(nome1.equals(nome2)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const nome = new Nome('João Silva');
    expect(nome.toString()).toBe('João Silva');
  });
});
