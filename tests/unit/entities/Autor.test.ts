import { Autor } from '../../../layer/nodejs/src/entities/Autor';
import { Entity } from '../../../layer/nodejs/src/entities/Entity';
import { AutorInterface } from '../../../layer/nodejs/src/interfaces/autor.interface';

const defaultNome = 'Paulo Coelho';
const defaultPais = 'Brasil';

describe('Autor Entity', () => {
  it('deve criar um novo autor', () => {
    const autorProps = {
      nome: defaultNome,
      pais: {
        nome: defaultPais,
        nomePortugues: defaultPais,
      },
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);

    expect(autor.getId()).toBeDefined();
    expect(autor.getNome().toString()).toBe(autorProps.nome?.toString());
    expect(autor.getNomePais()).toBe(defaultPais);
  });

  it('deve criar um autor com todos os dados', () => {
    const autorProps = {
      id: '123456-abcdef',
      nome: 'Autor Exemplo',
      imagemPadrao: 'https://example.com/default.jpg',
      imagemDispositivos: 'https://example.com/mobile.jpg',
      urlReferencia: 'https://example.com/author?ref=id',
      pais: {
        nome: 'Terra Média',
        nomePortugues: 'Terra Média',
        isoAlpha3: 'TRM',
        isoAlpha2: 'TM',
        isoNumeric: 321,
        bandeira: 'aaaaaaaaaaaaaaa',
      },
      idPais: 321,
      totalLivros: 1,
      revisar: false,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);

    expect(autor.getNome().toString()).toBe(autorProps.nome?.toString());
    expect(autor.getImagemPadrao()).toBe(autorProps.imagemPadrao);
    expect(autor.getImagemDispositivos()).toBe(autorProps.imagemDispositivos);
    expect(autor.getUrlReferencia()).toBe(autorProps.urlReferencia);
    const pais = Object.getOwnPropertyDescriptor(autorProps, 'pais')?.value;
    expect(autor.getNomePais()).toBe(
      Object.getOwnPropertyDescriptor(pais, 'nomePortugues')?.value ??
        Object.getOwnPropertyDescriptor(pais, 'nome')?.value
    );
    expect(autor.getIsoAlpha3()).toBe(Object.getOwnPropertyDescriptor(pais, 'isoAlpha3')?.value);
    expect(autor.getIdPais()).toBe(Object.getOwnPropertyDescriptor(autorProps, 'idPais')?.value);
    expect(autor.getBandeira()).toBe(Object.getOwnPropertyDescriptor(pais, 'bandeira')?.value);
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
    expect(autor.getNome().toString()).toBe(autorProps.nome?.toString());
  });

  it('deve atualizar dados do autor', () => {
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const nomePais = 'Nárnia';

    autor.update({ pais: { nome: nomePais, nomePortugues: nomePais } });

    expect(autor.getNomePais()).toBe(nomePais);
  });

  it('deve retornar igualdade de autores por valores', () => {
    const autorProps = {
      nome: defaultNome,
      revisar: true,
      totalLivros: 3,
      imagemPadrao: 'imagemPadrao.jpg',
      imagemDispositivos: 'imagemDispositivos.jpg',
      urlReferencia: 'https://example.com/autor',
      nomePais: 'País Exemplo',
      isoAlpha3: 'PEX',
      idPais: 25,
      bandeira: 'http://example.com/bandeira.jpg',
    } as unknown as AutorInterface;

    const autor1 = Autor.create(autorProps);
    const autor2 = Autor.reconstitute('123456', autorProps);

    expect(autor1.equals(autor2)).toBe(true);
  });

  it('deve retornar desigualdade por propriedades diferentes', () => {
    const autorProps = {
      nome: defaultNome,
      revisar: true,
      totalLivros: 3,
      imagemPadrao: 'imagemPadrao.jpg',
      imagemDispositivos: 'imagemDispositivos.jpg',
      urlReferencia: 'https://example.com/autor',
      nomePais: 'País Exemplo',
      isoAlpha3: 'PEX',
      idPais: 25,
      bandeira: 'http://example.com/bandeira.jpg',
    } as unknown as AutorInterface;

    const autor1 = Autor.create(autorProps);
    const autor2 = Autor.create({ ...autorProps, nome: 'novo autor', idPais: 26 });

    expect(autor1.equals(autor2)).toBe(false);
  });

  it('deve retornar desigualdade por objetos de tipos diferentes', () => {
    const autorProps = {
      nome: defaultNome,
      revisar: true,
      totalLivros: 3,
      imagemPadrao: 'imagemPadrao.jpg',
      imagemDispositivos: 'imagemDispositivos.jpg',
      urlReferencia: 'https://example.com/autor',
      nomePais: 'País Exemplo',
      isoAlpha3: 'PEX',
      idPais: 25,
      bandeira: 'http://example.com/bandeira.jpg',
    } as unknown as AutorInterface;

    const autor1 = Autor.create(autorProps);
    const autor2 = { nome: 'novo autor', idPais: 26 };

    expect(autor1.equals(autor2 as unknown as Entity)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const str = autor.getNome();

    expect(str).toContain(autorProps.nome?.toString());
  });

  it('deve manter dados opcionais quando atualizados', () => {
    const autor = Autor.create({ nome: defaultNome } as unknown as AutorInterface);
    autor.update({
      pais: { nome: defaultPais, nomePortugues: defaultPais },
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

  it('deve lançar erro ao reconstituir autor com id vazio', () => {
    expect(() => {
      Autor.reconstitute('', { nome: defaultNome } as unknown as AutorInterface);
    }).toThrow('ID do autor não informado ou inválido');
  });

  it('deve atualizar um autor a partir de objeto parcial', () => {
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const novoNome = 'Novo Nome do Autor';

    autor.update({ nome: novoNome });

    expect(autor.getNome().toString()).toBe(novoNome);
    expect(autor.getNomePais()).toBe(defaultPais);
  });

  it('deve retornar JSON string com os dados do autor', () => {
    const autorProps = {
      nome: defaultNome,
      nomePais: defaultPais,
    } as unknown as AutorInterface;

    const autor = Autor.create(autorProps);
    const jsonString = autor.toJSONString();
    const data = JSON.parse(jsonString);

    expect(data).toHaveProperty('id', autor.getId());
    expect(data).toHaveProperty('nome', autorProps.nome?.toString());
    expect(data).toHaveProperty('nomePais', defaultPais);
  });
});
