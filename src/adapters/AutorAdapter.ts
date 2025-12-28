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
      name: autor.getName(),
      defaultPictureUrl: autor.getDefaultPictureUrl(),
      mobilePictureUrl: autor.getMobilePictureUrl(),
      externalUrl: autor.getExternalUrl(),
      countryName: autor.getCountryName(),
      countryPortugueseName: autor.getCountryPortugueseName(),
      isoAlpha3: autor.getIsoAlpha3(),
      countryId: autor.getCountryId(),
      flag: autor.getFlag(),
      totalBooks: autor.getTotalBooks() ?? 0,
      reviewPending: autor.getReviewPending(),
    });
  }

  static fromCreateDTO(dto: AutorDTO): Autor {
    const data: AutorInterface = {
      name: dto.name ?? '',
      defaultPictureUrl: dto.defaultPictureUrl,
      mobilePictureUrl: dto.mobilePictureUrl,
      externalUrl: dto.externalUrl,
      countryName: dto.countryName,
      countryPortugueseName: dto.countryPortugueseName,
      isoAlpha3: dto.isoAlpha3,
      countryId: dto.countryId,
      flag: dto.flag,
      totalBooks: dto.totalBooks,
      reviewPending: dto.reviewPending,
    };

    return Autor.create(data, dto.id);
  }

  static toDTOList(autores: Autor[]): AutorDTO[] {
    return autores.map((autor) => this.toDTO(autor));
  }
}
