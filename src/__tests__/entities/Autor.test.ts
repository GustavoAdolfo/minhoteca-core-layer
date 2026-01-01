import { Autor } from '../../entities/Autor';
import { AutorInterface } from '../../interfaces/autor.interface';

const defaultNome = 'Paulo Coelho';
const defaultPais = 'Brasil';

describe('Autor Entity', () => {
  it('deve criar um novo autor', () => {
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);

    expect(autor.getId()).toBeDefined();
    expect(autor.getNome().toString()).toBe(autorProps.nome.toString());
    expect(autor.getNomePais()).toBe(autorProps.nomePais);
  });

  it('deve criar um autor com todos os dados', () => {
    const autorProps = {
      id: '123456-abcdef',
      nome: 'Autor Exemplo',
      imagemPadrao: 'https://example.com/default.jpg',
      imagemDispositivos: 'https://example.com/mobile.jpg',
      urlReferencia: 'https://example.com/author?ref=id',
      nomePais: 'Terra Média',
      nomePaisPortugues: 'Terra Média',
      isoAlpha3: 'TRM',
      idPais: 321,
      bandeira: 'aaaaaaaaaaaaaaa',
      totalLivros: 1,
      revisar: false,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);

    expect(autor.getNome().toString()).toBe(autorProps.nome.toString());
    expect(autor.getImagemPadrao()).toBe(autorProps.imagemPadrao);
    expect(autor.getImagemDispositivos()).toBe(autorProps.imagemDispositivos);
    expect(autor.getUrlReferencia()).toBe(autorProps.urlReferencia);
    expect(autor.getNomePais()).toBe(autorProps.nomePais);
    expect(autor.getNomePaisPortugues()).toBe(autorProps.nomePaisPortugues);
    expect(autor.getIsoAlpha3()).toBe(autorProps.isoAlpha3);
    expect(autor.getIdPais()).toBe(autorProps.idPais);
    expect(autor.getBandeira()).toBe(autorProps.bandeira);
    expect(autor.getTotalLivros()).toBe(autorProps.totalLivros);
    expect(autor.getRevisar()).toBe(autorProps.revisar);
  });

  it('deve reconstruir um autor existente', () => {
    const id = 'autor-123';
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.reconstitute(id, autorProps);

    expect(autor.getId()).toBe('autor-123');
    expect(autor.getNome().toString()).toBe(autorProps.nome.toString());
  });

  it('deve atualizar dados do autor', () => {
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const nomePais = 'Nárnia';

    autor.update({ nomePais });

    expect(autor.getNomePais()).toBe(nomePais);
  });

  it('deve comparar dois autores pelo ID', () => {
    const autorProps = {
      nome: defaultNome,
    } as unknown as AutorInterface;

    const id = 'autor-123';
    const autor1 = Autor.reconstitute(id, autorProps);
    const autor2 = Autor.reconstitute(id, autorProps);

    expect(autor1.equals(autor2)).toBe(true);
  });

  it('deve identificar autores diferentes', () => {
    const autorProps = {
      nome: defaultNome,
    } as unknown as AutorInterface;

    const autor1 = Autor.reconstitute('autor-123', autorProps);
    const autor2 = Autor.reconstitute('autor-456', autorProps);

    expect(autor1.equals(autor2)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const str = autor.getNome();

    expect(str).toContain(autorProps.nome.toString());
  });

  it('deve manter dados opcionais quando atualizados', () => {
    const autor = Autor.create({ nome: defaultNome } as unknown as AutorInterface);
    autor.update({
      nomePais: defaultPais,
    });

    expect(autor.getNomePais()).toBe(defaultPais);
  });

  it('deve lançar erro ao criar autor sem nome', () => {
    expect(() => {
      Autor.create({ nome: undefined } as unknown as AutorInterface);
    }).toThrow('Nome é obrigatório');
  });

  it('deve lançar erro ao reconstruir autor sem nome', () => {
    expect(() => {
      Autor.reconstitute('autor-123', {
        nome: undefined,
      } as unknown as AutorInterface);
    }).toThrow('Nome é obrigatório');
  });

  it('deve lançar erro ao atualizar autor removendo nome', () => {
    const autor = Autor.create({ nome: defaultNome } as unknown as AutorInterface);

    expect(() => {
      autor.update({ nome: undefined });
    }).toThrow('Nome do autor é obrigatório');
  });
});
