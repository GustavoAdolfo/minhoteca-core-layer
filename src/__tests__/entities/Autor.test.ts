import { Autor } from '../../entities/Autor';
import { Nome } from '../../value-objects/Nome';
import { Email } from '../../value-objects/Email';
import { Data } from '../../value-objects/Data';

describe('Autor Entity', () => {
  it('deve criar um novo autor', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho'),
      nacionalidade: 'Brasileiro'
    };

    const autor = Autor.create(autorProps);

    expect(autor.getId()).toBeDefined();
    expect(autor.getNome().toString()).toBe('Paulo Coelho');
    expect(autor.getNacionalidade()).toBe('Brasileiro');
  });

  it('deve criar um autor com todos os dados', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho'),
      biografia: 'Escritor e poeta português',
      email: new Email('paulo@exemplo.com'),
      dataNascimento: new Data('1947-08-24'),
      nacionalidade: 'Português'
    };

    const autor = Autor.create(autorProps);

    expect(autor.getNome().toString()).toBe('Paulo Coelho');
    expect(autor.getBiografia()).toBe('Escritor e poeta português');
    expect(autor.getEmail()?.toString()).toBe('paulo@exemplo.com');
    expect(autor.getNacionalidade()).toBe('Português');
  });

  it('deve reconstruir um autor existente', () => {
    const id = 'autor-123';
    const autorProps = {
      nome: new Nome('Paulo Coelho'),
      nacionalidade: 'Português'
    };

    const autor = Autor.reconstitute(id, autorProps);

    expect(autor.getId()).toBe('autor-123');
    expect(autor.getNome().toString()).toBe('Paulo Coelho');
  });

  it('deve atualizar dados do autor', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho'),
      nacionalidade: 'Português'
    };

    const autor = Autor.create(autorProps);
    const novaBiografia = 'Um dos autores mais lidos do mundo';

    autor.update({ biografia: novaBiografia });

    expect(autor.getBiografia()).toBe(novaBiografia);
  });

  it('deve comparar dois autores pelo ID', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho')
    };

    const id = 'autor-123';
    const autor1 = Autor.reconstitute(id, autorProps);
    const autor2 = Autor.reconstitute(id, autorProps);

    expect(autor1.equals(autor2)).toBe(true);
  });

  it('deve identificar autores diferentes', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho')
    };

    const autor1 = Autor.reconstitute('autor-123', autorProps);
    const autor2 = Autor.reconstitute('autor-456', autorProps);

    expect(autor1.equals(autor2)).toBe(false);
  });

  it('deve retornar representação em string', () => {
    const autorProps = {
      nome: new Nome('Paulo Coelho')
    };

    const autor = Autor.create(autorProps);
    const str = autor.toString();

    expect(str).toContain('Paulo Coelho');
    expect(str).toContain('Autor');
  });
});
