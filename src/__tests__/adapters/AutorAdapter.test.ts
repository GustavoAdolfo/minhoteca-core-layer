import { AutorAdapter } from '../../adapters/AutorAdapter';
import { Autor } from '../../entities/Autor';
import { Nome } from '../../value-objects/Nome';
import { AutorInterface } from '../../interfaces/autor.interface';
import { AutorDTO } from '../../dtos/AutorDTO';

const defaultNome = new Nome('Clarice Lispector');
const defaultPais = 'Brasil';

describe('AutorAdapter', () => {
  it('deve converter Autor para DTO', () => {
    const autorProps = {
      name: defaultNome.toString(),
      countryName: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.id).toBe(autor.getId());
    expect(dto.name).toBe(autorProps.name.toString());
    expect(dto.countryName).toBe(autorProps.countryName);
  });

  it('deve converter DTO de criação para props', () => {
    const dto = {
      name: defaultNome.toString(),
      countryName: defaultPais,
    } as unknown as AutorDTO;

    const props = AutorAdapter.fromCreateDTO(dto);

    expect(props.getName()).toBe(dto.name);
    expect(props.getCountryName()).toBe(dto.countryName);
  });

  it('deve converter lista de Autores para lista de DTOs', () => {
    const autores = [
      Autor.create({ name: defaultNome.toString() } as unknown as AutorInterface),
      Autor.create({ name: 'João Cabral' } as unknown as AutorInterface),
    ];

    const dtos = AutorAdapter.toDTOList(autores);

    expect(dtos).toHaveLength(2);
    expect(dtos[0].name).toBe(autores[0].getName().toString());
    expect(dtos[1].name).toBe(autores[1].getName().toString());
  });

  it('deve incluir dados opcionais no DTO quando presentes', () => {
    const autorProps = {
      name: defaultNome.toString(),
      countryName: defaultPais,
      defaultPictureUrl: 'https://example.com/default.jpg',
      mobilePictureUrl: 'https://example.com/mobile.jpg',
      externalUrl: 'https://example.com/author?ref=id',
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.name).toBe(autorProps.name);
    expect(dto.countryName).toBe(defaultPais);
    expect(dto.defaultPictureUrl).toBe(autorProps.defaultPictureUrl);
    expect(dto.mobilePictureUrl).toBe(autorProps.mobilePictureUrl);
    expect(dto.externalUrl).toBe(autorProps.externalUrl);
  });

  it('deve omitir dados opcionais no DTO quando ausentes', () => {
    const autorProps = {
      name: defaultNome.toString(),
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.countryName).toBeUndefined();
    expect(dto.externalUrl).toBeUndefined();
    expect(dto.defaultPictureUrl).toBeUndefined();
  });

  it('deve preservar campos extras quando atualizados no Autor', () => {
    const autor = Autor.create({ name: defaultNome.toString() } as unknown as AutorInterface);
    autor.update({
      countryName: defaultPais,
    });

    const dto = AutorAdapter.toDTO(autor);

    expect(dto.countryName).toBe(defaultPais);
  });
});
