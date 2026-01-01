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
      nome: defaultNome.toString(),
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.id).toBe(autor.getId());
    expect(dto.nome).toBe(autorProps.nome.toString());
    expect(dto.nomePais).toBe(autorProps.nomePais);
  });

  it('deve converter DTO de criação para props', () => {
    const dto = {
      nome: defaultNome.toString(),
      nomePais: defaultPais,
    } as unknown as AutorDTO;

    const props = AutorAdapter.fromCreateDTO(dto);

    expect(props.getNome()).toBe(dto.nome);
    expect(props.getNomePais()).toBe(dto.nomePais);
  });

  it('deve converter lista de Autores para lista de DTOs', () => {
    const autores = [
      Autor.create({ nome: defaultNome.toString() } as unknown as AutorInterface),
      Autor.create({ nome: 'João Cabral' } as unknown as AutorInterface),
    ];

    const dtos = AutorAdapter.toDTOList(autores);

    expect(dtos).toHaveLength(2);
    expect(dtos[0].nome).toBe(autores[0].getNome().toString());
    expect(dtos[1].nome).toBe(autores[1].getNome().toString());
  });

  it('deve incluir dados opcionais no DTO quando presentes', () => {
    const autorProps = {
      nome: defaultNome.toString(),
      nomePais: defaultPais,
      imagemPadrao: 'https://example.com/default.jpg',
      imagemDispositivos: 'https://example.com/mobile.jpg',
      urlReferencia: 'https://example.com/author?ref=id',
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.nome).toBe(autorProps.nome);
    expect(dto.nomePais).toBe(defaultPais);
    expect(dto.imagemPadrao).toBe(autorProps.imagemPadrao);
    expect(dto.imagemDispositivos).toBe(autorProps.imagemDispositivos);
    expect(dto.urlReferencia).toBe(autorProps.urlReferencia);
  });

  it('deve omitir dados opcionais no DTO quando ausentes', () => {
    const autorProps = {
      nome: defaultNome.toString(),
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.nomePais).toBeUndefined();
    expect(dto.urlReferencia).toBeUndefined();
    expect(dto.imagemPadrao).toBeUndefined();
  });

  it('deve preservar campos extras quando atualizados no Autor', () => {
    const autor = Autor.create({ nome: defaultNome.toString() } as unknown as AutorInterface);
    autor.update({
      nomePais: defaultPais,
    });

    const dto = AutorAdapter.toDTO(autor);

    expect(dto.nomePais).toBe(defaultPais);
  });
});
