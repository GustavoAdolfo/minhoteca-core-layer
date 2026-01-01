import { Autor } from '../entities/Autor';
import { AutorDTO } from '../dtos/AutorDTO';
import { AutorInterface } from '../interfaces/autor.interface';

/**
 * Adapter para converter entre Autor (entity) e AutorDTO (DTO)
 * Adapters facilitam a transformação entre diferentes representações de dados
 */
export class AutorAdapter {
  static toDTO(autor: Autor): AutorDTO {
    return new AutorDTO({
      id: autor.getId(),
      nome: autor.getNome(),
      imagemPadrao: autor.getImagemPadrao(),
      imagemDispositivos: autor.getImagemDispositivos(),
      urlReferencia: autor.getUrlReferencia(),
      nomePais: autor.getNomePais(),
      nomePaisPortugues: autor.getNomePaisPortugues(),
      isoAlpha3: autor.getIsoAlpha3(),
      idPais: autor.getIdPais(),
      bandeira: autor.getBandeira(),
      totalLivros: autor.getTotalLivros() ?? 0,
      revisar: autor.getRevisar(),
    });
  }

  static fromCreateDTO(dto: AutorDTO): Autor {
    const data: AutorInterface = {
      nome: dto.nome ?? '',
      imagemPadrao: dto.imagemPadrao,
      imagemDispositivos: dto.imagemDispositivos,
      urlReferencia: dto.urlReferencia,
      nomePais: dto.nomePais,
      nomePaisPortugues: dto.nomePaisPortugues,
      isoAlpha3: dto.isoAlpha3,
      idPais: dto.idPais,
      bandeira: dto.bandeira,
      totalLivros: dto.totalLivros,
      revisar: dto.revisar,
    };

    return Autor.create(data, dto.id);
  }

  static toDTOList(autores: Autor[]): AutorDTO[] {
    return autores.map((autor) => this.toDTO(autor));
  }
}
