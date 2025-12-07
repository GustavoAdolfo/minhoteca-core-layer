import { Autor, AutorProps } from '../entities/Autor';
import { AutorDTO, CriarAutorDTO } from '../dtos/AutorDTO';
import { Nome } from '../value-objects/Nome';
import { Data } from '../value-objects/Data';

/**
 * Adapter para converter entre Autor (entity) e AutorDTO (DTO)
 * Adapters facilitam a transformação entre diferentes representações de dados
 */
export class AutorAdapter {
  /**
   * Converte uma Entity Autor para DTO
   */
  static toDTO(autor: Autor): AutorDTO {
    const props = autor.getProps();
    return {
      id: autor.getId(),
      nome: props.nome.toString(),
      biografia: props.biografia,
      dataNascimento: props.dataNascimento?.toPrimitive(),
      pais: props.pais,
    };
  }

  /**
   * Converte um DTO de criação para props de Entity
   */
  static fromCreateDTO(dto: CriarAutorDTO): AutorProps {
    return {
      nome: new Nome(dto.nome),
      biografia: dto.biografia,
      dataNascimento: dto.dataNascimento ? new Data(dto.dataNascimento) : undefined,
      pais: dto.pais,
    };
  }

  /**
   * Converte uma lista de Autores para lista de DTOs
   */
  static toDTOList(autores: Autor[]): AutorDTO[] {
    return autores.map((autor) => this.toDTO(autor));
  }
}
