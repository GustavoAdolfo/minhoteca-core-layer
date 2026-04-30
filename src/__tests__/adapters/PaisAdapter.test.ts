import { PaisAdapter } from '../../adapters/PaisAdapter';
import { Pais } from '../../entities/Pais';
import { PaisDTO } from '../../dtos/PaisDTO';

describe('PaisAdapter', () => {
  const paisProps = {
    id: '1',
    nome: 'Brasil',
    nomePortugues: 'Brasil',
    bandeira: '🇧🇷',
    isoAlpha3: 'BRA',
    isoAlpha2: 'BR',
    isoNumeric: 76,
  };

  const paisEntity = Pais.create(paisProps);
  const paisDTO = new PaisDTO({
    nome: 'Brasil',
    nomePortugues: 'Brasil',
    bandeira: '🇧🇷',
    isoAlpha3: 'BRA',
    isoAlpha2: 'BR',
    isoNumeric: 76,
  });

  it('deve usar toDTO para converter Pais entity em PaisDTO', () => {
    const result = PaisAdapter.toDTO(paisEntity);
    expect(result).toEqual(paisDTO);
  });

  it('deve usar fromCreateDTO para converter PaisDTO em Pais entity', () => {
    const result = PaisAdapter.fromCreateDTO(paisDTO);
    expect(result.getNome()).toBe(paisEntity.getNome());
    expect(result.getNomePortugues()).toBe(paisEntity.getNomePortugues());
    expect(result.getBandeira()).toBe(paisEntity.getBandeira());
    expect(result.getIsoAlpha3()).toBe(paisEntity.getIsoAlpha3());
    expect(result.getIsoAlpha2()).toBe(paisEntity.getIsoAlpha2());
    expect(result.getIsoNumeric()).toBe(paisEntity.getIsoNumeric());
  });

  it('deve usar toDTOList para converter lista de Pais entities em lista de PaisDTOs', () => {
    const paisList = [paisEntity];
    const result = PaisAdapter.toDTOList(paisList);
    expect(result).toEqual([paisDTO]);
  });
});
