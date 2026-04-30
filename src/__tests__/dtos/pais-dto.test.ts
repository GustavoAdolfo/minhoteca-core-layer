import { PaisDTO } from '../../dtos';

describe('PaisDTO', () => {
  it('deve converter PaisDTO para um json válido', () => {
    const paisDTO = new PaisDTO({
      bandeira: 'https://example.com/bandeira.png',
      isoAlpha2: 'BR',
      isoAlpha3: 'BRA',
      isoNumeric: 76,
      nome: 'Brasil',
      nomePortugues: 'Brasil',
    });

    const json = paisDTO.toJSONString();
    const content = JSON.parse(json);

    expect(content).toHaveProperty('bandeira', 'https://example.com/bandeira.png');
    expect(content).toHaveProperty('isoAlpha2', 'BR');
    expect(content).toHaveProperty('isoAlpha3', 'BRA');
    expect(content).toHaveProperty('isoNumeric', 76);
    expect(content).toHaveProperty('nome', 'Brasil');
    expect(content).toHaveProperty('nomePortugues', 'Brasil');
  });
});
