import { Editora } from '../entities/Editora';
import { EditoraDTO } from '../dtos/EditoraDTO';
import { EditoraInterface } from '../interfaces/editora.interface';

/**
 * Adapter para converter entre Editora (entity) e EditoraDTO (DTO)
 */
export class EditoraAdapter {
  /**
   * Converte uma Entity Editora para DTO
   */
  static toDTO(editora: Editora): EditoraDTO {
    return {
      id: editora.getId(),
      nome: editora.getNome().toString(),
      email: editora.getEmail()?.toString(),
      website: editora.getWebsite(),
      pais: editora.getPais(),
    };
  }

  /**
   * Converte um DTO de criação para props de Entity
   */
  static fromCreateDTO(dto: EditoraDTO): Editora {
    return Editora.create(
      {
        nome: dto.nome ?? '',
        email: dto.email ?? '',
        website: dto.website,
        pais: dto.pais,
      } as unknown as EditoraInterface,
      dto.id
    );
  }

  /**
   * Converte uma lista de Editoras para lista de DTOs
   */
  static toDTOList(editoras: Editora[]): EditoraDTO[] {
    return editoras.map((editora) => this.toDTO(editora));
  }
}
