import { AutorAdapter } from '../../adapters/AutorAdapter';
import { Autor } from '../../entities/Autor';
import { Nome } from '../../value-objects/Nome';
import { Data } from '../../value-objects/Data';

const defaultNome = new Nome('Clarice Lispector');
const defaultPais = 'Brasil';
const defaultBiografia = 'Autora modernista';
const defaultNascimento = new Data('1920-12-10');

describe('AutorAdapter', () => {
  it('deve converter Autor para DTO', () => {
    const autorProps = {
      nome: defaultNome,
      pais: defaultPais,
    };

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.id).toBe(autor.getId());
    expect(dto.nome).toBe(autorProps.nome.toString());
    expect(dto.pais).toBe(autorProps.pais);
  });

  it('deve converter DTO de criação para props', () => {
    const dto = {
      nome: defaultNome.toString(),
      pais: defaultPais,
    };

    const props = AutorAdapter.fromCreateDTO(dto);

    expect(props.nome.toString()).toBe(dto.nome);
    expect(props.pais).toBe(dto.pais);
  });

  it('deve converter lista de Autores para lista de DTOs', () => {
    const autores = [
      Autor.create({ nome: defaultNome }),
      Autor.create({ nome: new Nome('João Cabral') }),
    ];

    const dtos = AutorAdapter.toDTOList(autores);

    expect(dtos).toHaveLength(2);
    expect(dtos[0].nome).toBe(autores[0].getNome().toString());
    expect(dtos[1].nome).toBe(autores[1].getNome().toString());
  });

  it('deve incluir dados opcionais no DTO quando presentes', () => {
    const autorProps = {
      nome: defaultNome,
      biografia: defaultBiografia,
      dataNascimento: defaultNascimento,
      pais: defaultPais,
    };

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.biografia).toBe(autorProps.biografia);
    expect(dto.dataNascimento).toBe(defaultNascimento.toPrimitive());
    expect(dto.pais).toBe(defaultPais);
  });

  it('deve omitir dados opcionais no DTO quando ausentes', () => {
    const autorProps = {
      nome: defaultNome,
    };

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.biografia).toBeUndefined();
    expect(dto.dataNascimento).toBeUndefined();
    expect(dto.pais).toBeUndefined();
  });

  it('deve preservar campos extras quando atualizados no Autor', () => {
    const autor = Autor.create({ nome: defaultNome });
    autor.update({
      biografia: defaultBiografia,
      dataNascimento: defaultNascimento,
      pais: defaultPais,
    });

    const dto = AutorAdapter.toDTO(autor);

    expect(dto.biografia).toBe(defaultBiografia);
    expect(dto.dataNascimento).toBe(defaultNascimento.toPrimitive());
    expect(dto.pais).toBe(defaultPais);
  });
});
