import { Editora, EditoraProps } from '../entities/Editora';
import { EditoraDTO, CriarEditoraDTO } from '../dtos/EditoraDTO';
import { Nome } from '../value-objects/Nome';
import { Email } from '../value-objects/Email';

/**
 * Adapter para converter entre Editora (entity) e EditoraDTO (DTO)
 */
export class EditoraAdapter {
  /**
   * Converte uma Entity Editora para DTO
   */
  static toDTO(editora: Editora): EditoraDTO {
    const props = editora.getProps();
    return {
      id: editora.getId(),
      nome: props.nome.toString(),
      email: props.email?.toString(),
      website: props.website,
      pais: props.pais
    };
  }

  /**
   * Converte um DTO de criação para props de Entity
   */
  static fromCreateDTO(dto: CriarEditoraDTO): EditoraProps {
    return {
      nome: new Nome(dto.nome),
      email: dto.email ? new Email(dto.email) : undefined,
      website: dto.website,
      pais: dto.pais
    };
  }

  /**
   * Converte uma lista de Editoras para lista de DTOs
   */
  static toDTOList(editoras: Editora[]): EditoraDTO[] {
    return editoras.map((editora) => this.toDTO(editora));
  }
}
