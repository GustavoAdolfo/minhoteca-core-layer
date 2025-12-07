import { AutorAdapter } from '../../adapters/AutorAdapter';
import { Autor } from '../../entities/Autor';
import { Nome } from '../../value-objects/Nome';
import { Email } from '../../value-objects/Email';
import { Data } from '../../value-objects/Data';

describe('AutorAdapter', () => {
  it('deve converter Autor para DTO', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho'),
      nacionalidade: 'Português'
    };

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.id).toBe(autor.getId());
    expect(dto.nome).toBe('Paulo Coelho');
    expect(dto.nacionalidade).toBe('Português');
  });

  it('deve converter DTO de criação para props', () => {
    const dto = {
      nome: 'Paulo Coelho',
      email: 'paulo@exemplo.com',
      nacionalidade: 'Português'
    };

    const props = AutorAdapter.fromCreateDTO(dto);

    expect(props.nome.toString()).toBe('Paulo Coelho');
    expect(props.email?.toString()).toBe('paulo@exemplo.com');
    expect(props.nacionalidade).toBe('Português');
  });

  it('deve converter lista de Autores para lista de DTOs', () => {
    const autores = [
      Autor.create({ nome: new Nome('Paulo Coelho') }),
      Autor.create({ nome: new Nome('Jorge Amado') })
    ];

    const dtos = AutorAdapter.toDTOList(autores);

    expect(dtos).toHaveLength(2);
    expect(dtos[0].nome).toBe('Paulo Coelho');
    expect(dtos[1].nome).toBe('Jorge Amado');
  });

  it('deve incluir dados opcionais no DTO quando presentes', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho'),
      biografia: 'Autor português',
      email: new Email('paulo@exemplo.com'),
      dataNascimento: new Data('1947-08-24'),
      nacionalidade: 'Português'
    };

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.biografia).toBe('Autor português');
    expect(dto.email).toBe('paulo@exemplo.com');
    expect(dto.dataNascimento).toContain('1947-08-24');
  });

  it('deve omitir dados opcionais no DTO quando ausentes', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho')
    };

    const autor = Autor.create(autorProps);
    const dto = AutorAdapter.toDTO(autor);

    expect(dto.biografia).toBeUndefined();
    expect(dto.email).toBeUndefined();
    expect(dto.dataNascimento).toBeUndefined();
  });
});
