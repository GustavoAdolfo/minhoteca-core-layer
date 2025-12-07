import { Autor } from '../../entities/Autor';
import { Nome } from '../../value-objects/Nome';
import { Data } from '../../value-objects/Data';

const defaultNome = new Nome('Paulo Coelho');
const defaultPais = 'Brasil';
const defaultBiografia = 'Autor brasileiro reconhecido internacionalmente';
const defaultNascimento = new Data('1947-08-24');

describe('Autor Entity', () => {
  it('deve criar um novo autor', () => {
    const autorProps = {
      nome: defaultNome,
      pais: defaultPais,
    };

    const autor = Autor.create(autorProps);

    expect(autor.getId()).toBeDefined();
    expect(autor.getNome().toString()).toBe(autorProps.nome.toString());
    expect(autor.getPais()).toBe(autorProps.pais);
  });

  it('deve criar um autor com todos os dados', () => {
    const autorProps = {
      nome: defaultNome,
      biografia: defaultBiografia,
      dataNascimento: defaultNascimento,
      pais: defaultPais,
    };

    const autor = Autor.create(autorProps);

    expect(autor.getNome().toString()).toBe(autorProps.nome.toString());
    expect(autor.getBiografia()).toBe(autorProps.biografia);
    expect(autor.getPais()).toBe(autorProps.pais);
  });

  it('deve reconstruir um autor existente', () => {
    const id = 'autor-123';
    const autorProps = {
      nome: defaultNome,
      pais: defaultPais,
    };

    const autor = Autor.reconstitute(id, autorProps);

    expect(autor.getId()).toBe('autor-123');
    expect(autor.getNome().toString()).toBe(autorProps.nome.toString());
  });

  it('deve atualizar dados do autor', () => {
    const autorProps = {
      nome: defaultNome,
      pais: defaultPais,
    };

    const autor = Autor.create(autorProps);
    const novaBiografia = 'Novo resumo de biografia';

    autor.update({ biografia: novaBiografia });

    expect(autor.getBiografia()).toBe(novaBiografia);
  });

  it('deve comparar dois autores pelo ID', () => {
    const autorProps = {
      nome: defaultNome,
    };

    const id = 'autor-123';
    const autor1 = Autor.reconstitute(id, autorProps);
    const autor2 = Autor.reconstitute(id, autorProps);

    expect(autor1.equals(autor2)).toBe(true);
  });

  it('deve identificar autores diferentes', () => {
    const autorProps = {
      nome: defaultNome,
    };

    const autor1 = Autor.reconstitute('autor-123', autorProps);
    const autor2 = Autor.reconstitute('autor-456', autorProps);

    expect(autor1.equals(autor2)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const autorProps = {
      nome: defaultNome,
      biografia: defaultBiografia,
      dataNascimento: defaultNascimento,
      pais: defaultPais,
    };

    const autor = Autor.create(autorProps);
    const str = autor.toString();

    expect(str).toContain(autorProps.nome.toString());
    expect(str).toContain('Autor');
  });

  it('deve manter dados opcionais quando atualizados', () => {
    const autor = Autor.create({ nome: defaultNome });

    autor.update({
      biografia: defaultBiografia,
      dataNascimento: defaultNascimento,
      pais: defaultPais,
    });

    expect(autor.getBiografia()).toBe(defaultBiografia);
    expect(autor.getDataNascimento()).toBe(defaultNascimento);
    expect(autor.getPais()).toBe(defaultPais);
  });

  it('deve lançar erro ao criar autor sem nome', () => {
    expect(() => {
      Autor.create({ nome: null as unknown as Nome });
    }).toThrow('Nome do autor é obrigatório');
  });

  it('deve lançar erro ao reconstruir autor sem nome', () => {
    expect(() => {
      Autor.reconstitute('autor-123', { nome: null as unknown as Nome });
    }).toThrow('Nome do autor é obrigatório');
  });

  it('deve lançar erro ao atualizar autor removendo nome', () => {
    const autor = Autor.create({ nome: defaultNome });

    expect(() => {
      autor.update({ nome: null as unknown as Nome });
    }).toThrow('Nome do autor é obrigatório');
  });
});
