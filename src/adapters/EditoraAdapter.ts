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
    return new EditoraDTO({
      id: editora.getId(),
      nome: editora.getNome(),
      email: editora.getEmail(),
      website: editora.getWebsite(),
      logoUrl: editora.getLogoUrl(),
      pais: editora.getPais(),
    });
  }

  /**
   * Converte um DTO de criação para props de Entity
   */
  static fromCreateDTO(dto: EditoraDTO): Editora {
    return Editora.create(
      {
        nome: dto.nome,
        email: dto.email,
        website: dto.website,
        pais: dto.pais,
        logoUrl: dto.logoUrl,
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
