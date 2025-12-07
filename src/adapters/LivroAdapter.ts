import { Livro, LivroProps, StatusLivro } from '../entities/Livro';
import { LivroDTO, CriarLivroDTO } from '../dtos/LivroDTO';
import { Nome } from '../value-objects/Nome';
import { ISBN } from '../value-objects/ISBN';
import { Data } from '../value-objects/Data';

/**
 * Adapter para converter entre Livro (entity) e LivroDTO (DTO)
 */
export class LivroAdapter {
  /**
   * Converte uma Entity Livro para DTO
   */
  static toDTO(livro: Livro): LivroDTO {
    const props = livro.getProps();
    return {
      id: livro.getId(),
      titulo: props.titulo.toString(),
      isbn: props.isbn.toString(),
      autorId: props.autorId,
      editoraId: props.editoraId,
      anoPublicacao: props.anoPublicacao,
      descricao: props.descricao,
      dataAquisicao: props.dataAquisicao.toPrimitive(),
      status: props.status,
      localizacao: props.localizacao,
      criadoEm: props.criadoEm.toISOString(),
      atualizadoEm: props.atualizadoEm.toISOString()
    };
  }

  /**
   * Converte um DTO de criação para props de Entity
   */
  static fromCreateDTO(dto: CriarLivroDTO): Omit<LivroProps, 'criadoEm' | 'atualizadoEm'> {
    return {
      titulo: new Nome(dto.titulo),
      isbn: new ISBN(dto.isbn),
      autorId: dto.autorId,
      editoraId: dto.editoraId,
      anoPublicacao: dto.anoPublicacao,
      descricao: dto.descricao,
      dataAquisicao: new Data(dto.dataAquisicao),
      status: (dto.status as StatusLivro) || StatusLivro.DISPONIVEL,
      localizacao: dto.localizacao
    };
  }

  /**
   * Converte uma lista de Livros para lista de DTOs
   */
  static toDTOList(livros: Livro[]): LivroDTO[] {
    return livros.map((livro) => this.toDTO(livro));
  }
}
