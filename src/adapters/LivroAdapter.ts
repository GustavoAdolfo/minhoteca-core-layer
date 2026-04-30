import { Livro } from '../entities/Livro';
import { LivroDTO } from '../dtos/LivroDTO';
import { StatusLivro } from '../enums';
import { ISBN } from '../value-objects/ISBN';
import { LivroInterface } from '../interfaces/livro.interface';

/**
 * Adapter para converter entre Livro (entity) e LivroDTO (DTO)
 */
export class LivroAdapter {
  /**
   * Converte uma Entity Livro para DTO
   */
  static toDTO(livro: Livro): LivroDTO {
    return new LivroDTO({
      id: livro.getId(),
      titulo: livro.getTitulo()?.toString(),
      subtitulo: livro.getSubtitulo(),
      isbn: livro.getISBN().toString(),
      autorId: livro.getAutorId(),
      editoraId: livro.getEditoraId(),
      anoPublicacao: livro.getAnoPublicacao(),
      paginas: livro.getPaginas(),
      sinopse: livro.getSinopse(),
      status: livro.getStatus(),
      localizacao: livro.getLocalizacao(),
      criadoEm: livro.getCriadoEm(),
      atualizadoEm: livro.getAtualizadoEm(),
      revisar: livro.getRevisar(),
      idioma: livro.getIdioma(),
      imagemCapaUrl: livro.getImagemCapaUrl(),
      imagemCapaMiniUrl: livro.getImagemCapaMiniUrl(),
    });
  }

  /**
   * Converte um DTO de criação para props de Entity
   */
  static fromCreateDTO(dto: LivroDTO): Livro {
    const data: LivroInterface = {
      titulo: dto.titulo,
      subtitulo: dto.subtitulo,
      isbn: new ISBN(dto.isbn),
      autorId: dto.autorId,
      editoraId: dto.editoraId,
      anoPublicacao: dto.anoPublicacao,
      paginas: dto.paginas ?? 0,
      sinopse: dto.sinopse,
      status: (dto.status as StatusLivro) ?? StatusLivro.DISPONIVEL,
      localizacao: dto.localizacao,
      id: dto.id ?? '',
      revisar: dto.revisar,
      idioma: dto.idioma,
      imagemCapaUrl: dto.imagemCapaUrl,
      imagemCapaMiniUrl: dto.imagemCapaMiniUrl,
    };

    return Livro.create(data);
  }

  /**
   * Converte uma lista de Livros para lista de DTOs
   */
  static toDTOList(livros: Livro[], full: boolean = false): LivroDTO[] {
    const result = livros.map((livro) => this.toDTO(livro));
    if (!full) {
      result.forEach((dto) => {
        delete dto.sinopse;
        delete dto.localizacao;
        delete dto.anoPublicacao;
      });
    }
    return result;
  }
}
