import { Pais } from '../entities/Pais';
import { PaisDTO } from '../dtos/PaisDTO';
import { PaisInterface } from '../interfaces/pais.interface';

/**
 * Adapter para converter entre Pais (entity) e PaisDTO (DTO)
 */
export class PaisAdapter {
  /**
   * Converte uma Entity Pais para DTO
   */
  static toDTO(pais: Pais): PaisDTO {
    return new PaisDTO({
      nome: pais.getNome(),
      nomePortugues: pais.getNomePortugues(),
      bandeira: pais.getBandeira(),
      isoAlpha3: pais.getIsoAlpha3(),
      isoAlpha2: pais.getIsoAlpha2(),
      isoNumeric: pais.getIsoNumeric(),
    });
  }

  /**
   * Converte um DTO de criação para props de Entity
   */
  static fromCreateDTO(dto: PaisDTO): Pais {
    return Pais.create({
      id: dto.isoNumeric.toString(),
      nome: dto.nome,
      nomePortugues: dto.nomePortugues,
      bandeira: dto.bandeira,
      isoAlpha3: dto.isoAlpha3,
      isoAlpha2: dto.isoAlpha2,
      isoNumeric: dto.isoNumeric,
    } as unknown as PaisInterface);
  }

  /**
   * Converte uma lista de Paiss para lista de DTOs
   */
  static toDTOList(paiss: Pais[]): PaisDTO[] {
    return paiss.map((pais) => this.toDTO(pais));
  }
}
