import { Autor } from '../../entities/Autor';
import { AutorInterface } from '../../interfaces/autor.interface';

const defaultNome = 'Paulo Coelho';
const defaultPais = 'Brasil';

describe('Autor Entity', () => {
  it('deve criar um novo autor', () => {
    const autorProps = {
      name: defaultNome,
      countryName: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);

    expect(autor.getId()).toBeDefined();
    expect(autor.getName().toString()).toBe(autorProps.name.toString());
    expect(autor.getCountryName()).toBe(autorProps.countryName);
  });

  it('deve criar um autor com todos os dados', () => {
    const autorProps = {
      id: '123456-abcdef',
      name: 'Autor Exemplo',
      defaultPictureUrl: 'https://example.com/default.jpg',
      mobilePictureUrl: 'https://example.com/mobile.jpg',
      externalUrl: 'https://example.com/author?ref=id',
      countryName: 'Terra Média',
      countryPortugueseName: 'Terra Média',
      isoAlpha3: 'TRM',
      countryId: 321,
      flag: 'aaaaaaaaaaaaaaa',
      totalBooks: 1,
      reviewPending: false,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);

    expect(autor.getName().toString()).toBe(autorProps.name.toString());
    expect(autor.getDefaultPictureUrl()).toBe(autorProps.defaultPictureUrl);
    expect(autor.getMobilePictureUrl()).toBe(autorProps.mobilePictureUrl);
    expect(autor.getExternalUrl()).toBe(autorProps.externalUrl);
    expect(autor.getCountryName()).toBe(autorProps.countryName);
    expect(autor.getCountryPortugueseName()).toBe(autorProps.countryPortugueseName);
    expect(autor.getIsoAlpha3()).toBe(autorProps.isoAlpha3);
    expect(autor.getCountryId()).toBe(autorProps.countryId);
    expect(autor.getFlag()).toBe(autorProps.flag);
    expect(autor.getTotalBooks()).toBe(autorProps.totalBooks);
    expect(autor.getReviewPending()).toBe(autorProps.reviewPending);
  });

  it('deve reconstruir um autor existente', () => {
    const id = 'autor-123';
    const autorProps = {
      name: defaultNome,
      countryName: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.reconstitute(id, autorProps);

    expect(autor.getId()).toBe('autor-123');
    expect(autor.getName().toString()).toBe(autorProps.name.toString());
  });

  it('deve atualizar dados do autor', () => {
    const autorProps = {
      name: defaultNome,
      countryName: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const countryName = 'Nárnia';

    autor.update({ countryName });

    expect(autor.getCountryName()).toBe(countryName);
  });

  it('deve comparar dois autores pelo ID', () => {
    const autorProps = {
      name: defaultNome,
    } as unknown as AutorInterface;

    const id = 'autor-123';
    const autor1 = Autor.reconstitute(id, autorProps);
    const autor2 = Autor.reconstitute(id, autorProps);

    expect(autor1.equals(autor2)).toBe(true);
  });

  it('deve identificar autores diferentes', () => {
    const autorProps = {
      name: defaultNome,
    } as unknown as AutorInterface;

    const autor1 = Autor.reconstitute('autor-123', autorProps);
    const autor2 = Autor.reconstitute('autor-456', autorProps);

    expect(autor1.equals(autor2)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const autorProps = {
      name: defaultNome,
      countryName: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const str = autor.getName();

    expect(str).toContain(autorProps.name.toString());
  });

  it('deve manter dados opcionais quando atualizados', () => {
    const autor = Autor.create({ name: defaultNome } as unknown as AutorInterface);

    autor.update({
      countryName: defaultPais,
    });

    expect(autor.getCountryName()).toBe(defaultPais);
  });

  it('deve lançar erro ao criar autor sem nome', () => {
    expect(() => {
      Autor.create({ name: undefined } as unknown as AutorInterface);
    }).toThrow('Nome é obrigatório');
  });

  it('deve lançar erro ao reconstruir autor sem nome', () => {
    expect(() => {
      Autor.reconstitute('autor-123', {
        name: undefined,
      } as unknown as AutorInterface);
    }).toThrow('Nome é obrigatório');
  });

  it('deve lançar erro ao atualizar autor removendo nome', () => {
    const autor = Autor.create({ name: defaultNome } as unknown as AutorInterface);

    expect(() => {
      autor.update({ name: undefined });
    }).toThrow('Nome do autor é obrigatório');
  });
});
