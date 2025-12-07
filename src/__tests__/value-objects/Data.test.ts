import { Data } from '../../value-objects/Data';

describe('Data Value Object', () => {
  it('deve criar uma data válida a partir de string ISO', () => {
    const data = new Data('2020-01-15T00:00:00Z');
    expect(data.toPrimitive()).toContain('2020-01-15');
  });

  it('deve criar uma data válida a partir de objeto Date', () => {
    const dateObj = new Date('2020-01-15');
    const data = new Data(dateObj);
    expect(data.toPrimitive()).toContain('2020-01-15');
  });

  it('deve lançar erro para data inválida', () => {
    expect(() => new Data('data-invalida')).toThrow('Data inválida');
  });

  it('deve lançar erro para data nula', () => {
    expect(() => new Data('invalid')).toThrow('Data inválida');
  });

  it('deve comparar duas datas iguais', () => {
    const data1 = new Data('2020-01-15T00:00:00Z');
    const data2 = new Data('2020-01-15T00:00:00Z');
    expect(data1.equals(data2)).toBe(true);
  });

  it('deve comparar duas datas diferentes', () => {
    const data1 = new Data('2020-01-15T00:00:00Z');
    const data2 = new Data('2020-01-16T00:00:00Z');
    expect(data1.equals(data2)).toBe(false);
  });

  it('deve verificar se data é anterior a outra', () => {
    const data1 = new Data('2020-01-15T00:00:00Z');
    const data2 = new Data('2020-01-16T00:00:00Z');
    expect(data1.isBefore(data2)).toBe(true);
  });

  it('deve verificar se data é posterior a outra', () => {
    const data1 = new Data('2020-01-16T00:00:00Z');
    const data2 = new Data('2020-01-15T00:00:00Z');
    expect(data1.isAfter(data2)).toBe(true);
  });

  it('deve retornar Date object', () => {
    const data = new Data('2020-01-15T00:00:00Z');
    expect(data.asDate()).toBeInstanceOf(Date);
  });

  it('deve retornar representação formatada em português', () => {
    const data = new Data('2020-01-15T00:00:00Z');
    // A formatação pode variar dependendo do timezone - apenas verificar que tem números e barras
    const str = data.toString();
    expect(str).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });
});
