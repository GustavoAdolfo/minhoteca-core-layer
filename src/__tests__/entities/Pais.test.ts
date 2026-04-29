import { Pais } from '../../entities/Pais';
import { PaisInterface } from '../../interfaces/pais.interface';

describe('Pais Entity', () => {
  it('deve criar uma instância de Pais com dados válidos', () => {
    const paisData = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const pais = Pais.create(paisData);

    expect(pais).toBeInstanceOf(Pais);
    expect(pais.nome).toBe(paisData.nome);
    expect(pais.nomePortugues).toBe(paisData.nomePortugues);
    expect(pais.isoAlpha2).toBe(paisData.isoAlpha2);
    expect(pais.isoAlpha3).toBe(paisData.isoAlpha3);
    expect(pais.isoNumeric).toBe(paisData.isoNumeric);
  });

  it('deve reconstituir uma instância de Pais a partir de dados persistidos', () => {
    const paisData = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const pais = Pais.reconstitute(paisData);

    expect(pais).toBeInstanceOf(Pais);
    expect(pais.nome).toBe(paisData.nome);
    expect(pais.nomePortugues).toBe(paisData.nomePortugues);
    expect(pais.isoAlpha2).toBe(paisData.isoAlpha2);
    expect(pais.isoAlpha3).toBe(paisData.isoAlpha3);
    expect(pais.isoNumeric).toBe(paisData.isoNumeric);
  });

  it('deve atualizar as propriedades de uma instância de Pais', () => {
    const paisData = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const pais = Pais.create(paisData);

    // Atualizando propriedades
    pais.nome = 'Argentina';
    pais.nomePortugues = 'Argentina';
    pais.isoAlpha2 = 'AR';
    pais.isoAlpha3 = 'ARG';
    pais.isoNumeric = 32;

    expect(pais.nome).toBe('Argentina');
    expect(pais.nomePortugues).toBe('Argentina');
    expect(pais.isoAlpha2).toBe('AR');
    expect(pais.isoAlpha3).toBe('ARG');
    expect(pais.isoNumeric).toBe(32);
  });

  it('deve converter uma instância de Pais para JSON string', () => {
    const paisData = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const pais = Pais.create(paisData);
    const jsonString = pais.toJSONString();
    const jsonObject = JSON.parse(jsonString);

    expect(jsonObject).toHaveProperty('nome', paisData.nome);
    expect(jsonObject).toHaveProperty('nomePortugues', paisData.nomePortugues);
    expect(jsonObject).toHaveProperty('isoAlpha2', paisData.isoAlpha2);
    expect(jsonObject).toHaveProperty('isoAlpha3', paisData.isoAlpha3);
    expect(jsonObject).toHaveProperty('isoNumeric', paisData.isoNumeric);
  });

  describe('Update method scenarios', () => {
    it('deve atualizar um único campo com update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ nome: 'República Federativa do Brasil' });

      expect(pais.getNome()).toBe('República Federativa do Brasil');
      expect(pais.getNomePortugues()).toBe('Brasil');
      expect(pais.getIsoAlpha2()).toBe('BR');
      expect(pais.getIsoAlpha3()).toBe('BRA');
      expect(pais.getIsoNumeric()).toBe(76);
    });

    it('deve atualizar múltiplos campos com update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({
        nome: 'Argentina',
        nomePortugues: 'Argentina',
        isoAlpha2: 'AR',
        isoAlpha3: 'ARG',
        isoNumeric: 32,
      });

      expect(pais.getNome()).toBe('Argentina');
      expect(pais.getNomePortugues()).toBe('Argentina');
      expect(pais.getIsoAlpha2()).toBe('AR');
      expect(pais.getIsoAlpha3()).toBe('ARG');
      expect(pais.getIsoNumeric()).toBe(32);
    });

    it('deve manter valores originais quando não fornecido no update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
        bandeira: '🇧🇷',
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ nome: 'Nova Brasil' });

      expect(pais.getNome()).toBe('Nova Brasil');
      expect(pais.getNomePortugues()).toBe('Brasil');
      expect(pais.getIsoAlpha2()).toBe('BR');
      expect(pais.getIsoAlpha3()).toBe('BRA');
      expect(pais.getIsoNumeric()).toBe(76);
      expect(pais.getBandeira()).toBe('🇧🇷');
    });

    it('não deve atualizar campos com valor undefined no update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ nome: undefined } as Partial<PaisInterface>);

      expect(pais.getNome()).toBe('Brasil');
    });

    it('não deve atualizar campos com valor null no update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ nomePortugues: null } as unknown as Partial<PaisInterface>);

      expect(pais.getNomePortugues()).toBe('Brasil');
    });

    it('deve atualizar campo bandeira quando fornecido', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ bandeira: '🇧🇷' });

      expect(pais.getBandeira()).toBe('🇧🇷');
    });

    it('não deve atualizar bandeira quando valor é falsy no update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
        bandeira: '🇧🇷',
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ bandeira: '' } as Partial<PaisInterface>);

      expect(pais.getBandeira()).toBe('🇧🇷');
    });

    it('deve atualizar isoAlpha2 quando fornecido', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ isoAlpha2: 'XX' });

      expect(pais.getIsoAlpha2()).toBe('XX');
    });

    it('não deve atualizar isoAlpha2 quando valor é undefined no update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ isoAlpha2: undefined });

      expect(pais.getIsoAlpha2()).toBe('BR');
    });

    it('não deve atualizar isoNumeric quando valor é 0 no update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ isoNumeric: 0 });

      // Nota: isoNumeric não será atualizado para 0 porque 0 é falsy
      // Este é o comportamento atual do método update()
      expect(pais.getIsoNumeric()).toBe(76);
    });

    it('deve atualizar isoNumeric quando valor é um número positivo no update()', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ isoNumeric: 32 });

      expect(pais.getIsoNumeric()).toBe(32);
    });

    it('deve atualizar isoAlpha3 quando fornecido', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({ isoAlpha3: 'BRA' });

      expect(pais.getIsoAlpha3()).toBe('BRA');
    });

    it('deve executar update() com objeto vazio mantendo todos os valores', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
      } as PaisInterface;

      const pais = Pais.create(paisData);
      const originalNome = pais.getNome();
      const originalNomePortugues = pais.getNomePortugues();
      const originalIsoAlpha3 = pais.getIsoAlpha3();

      pais.update({});

      expect(pais.getNome()).toBe(originalNome);
      expect(pais.getNomePortugues()).toBe(originalNomePortugues);
      expect(pais.getIsoAlpha3()).toBe(originalIsoAlpha3);
    });

    it('deve atualizar dois campos mantendo outros intactos', () => {
      const paisData = {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha2: 'BR',
        isoAlpha3: 'BRA',
        isoNumeric: 76,
        bandeira: '🇧🇷',
      } as PaisInterface;

      const pais = Pais.create(paisData);
      pais.update({
        nome: 'Áustria',
        isoAlpha3: 'AUT',
      });

      expect(pais.getNome()).toBe('Áustria');
      expect(pais.getIsoAlpha3()).toBe('AUT');
      expect(pais.getNomePortugues()).toBe('Brasil');
      expect(pais.getIsoAlpha2()).toBe('BR');
      expect(pais.getIsoNumeric()).toBe(76);
      expect(pais.getBandeira()).toBe('🇧🇷');
    });
  });

  it('deve comparar duas instâncias de Pais corretamente com equals()', () => {
    const paisData1 = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const paisData2 = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const pais1 = Pais.create(paisData1);
    const pais2 = Pais.create(paisData2);

    expect(pais1.equals(pais2)).toBe(true);
  });

  it('deve comparar duas instâncias de Pais diferentes com equals()', () => {
    const paisData1 = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const paisData2 = {
      nome: 'Argentina',
      nomePortugues: 'Argentina',
      isoAlpha2: 'AR',
      isoAlpha3: 'ARG',
      isoNumeric: 32,
    } as PaisInterface;

    const pais1 = Pais.create(paisData1);
    const pais2 = Pais.create(paisData2);

    expect(pais1.equals(pais2)).toBe(false);
  });

  it('deve retornar false ao comparar com objeto de tipo diferente usando equals()', () => {
    const paisData = {
      nome: 'Brasil',
      nomePortugues: 'Brasil',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
    } as PaisInterface;

    const pais = Pais.create(paisData);
    const nonPaisObject = { nome: 'Brasil' };

    expect(pais.equals(nonPaisObject as unknown as Pais)).toBe(false);
  });
});
