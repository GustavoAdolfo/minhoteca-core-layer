# Exemplos de Uso

Exemplos práticos de como usar a **minhoteca-core-layer** em diferentes cenários.

## 📖 Exemplo 1: Criar um Livro Simples

```typescript
import { Livro, Nome, ISBN, Data, StatusLivro } from '@GustavoAdolfo/minhoteca-core-layer';

const livro = Livro.create({
  titulo: new Nome('1984'),
  isbn: new ISBN('978-0451524935'),
  autorId: 'george-orwell-id',
  editoraId: 'penguin-classics-id',
  anoPublicacao: 1949,
  dataAquisicao: new Data('2024-01-10'),
  status: StatusLivro.DISPONIVEL,
  descricao: 'Uma obra de ficção distópica de George Orwell',
  localizacao: 'Prateleira B-2'
});

console.log(livro.getId());
console.log(livro.getTitulo().toString()); // "1984"
console.log(livro.getISBN().toString());   // "9780451524935"
```

## 📖 Exemplo 2: Gerenciar Empréstimos

```typescript
// Inicialmente disponível
console.log(livro.estaDisponivel()); // true

// Emprestar livro
try {
  livro.emprestar();
  console.log(livro.getStatus()); // StatusLivro.EMPRESTADO
} catch (error) {
  console.error('Não foi possível emprestar:', error.message);
}

// Tentar emprestar novamente (erro!)
try {
  livro.emprestar();
} catch (error) {
  console.error(error.message); // "Não é possível emprestar livro com status EMPRESTADO"
}

// Devolver
livro.devolver();
console.log(livro.estaDisponivel()); // true
```

## 👤 Exemplo 3: Criar e Atualizar Autor

```typescript
import { Autor, Nome, Email, Data } from '@GustavoAdolfo/minhoteca-core-layer';

// Criar autor
const autor = Autor.create({
  nome: new Nome('George Orwell'),
  email: new Email('george@exemplo.com'),
  dataNascimento: new Data('1903-06-25'),
  nacionalidade: 'Britânico',
  biografia: 'Escritor e jornalista britânico do século XX'
});

console.log(autor.getId());

// Atualizar dados
autor.update({
  biografia: 'Um dos autores mais influentes da literatura inglesa'
});

console.log(autor.getBiografia());
```

## 📚 Exemplo 4: Usar Adapters para API

```typescript
import {
  Livro,
  LivroAdapter,
  type CriarLivroDTO,
  type LivroDTO
} from '@GustavoAdolfo/minhoteca-core-layer';

// Simular dados vindos de uma API REST
const bodyDaAPI: CriarLivroDTO = {
  titulo: 'O Cortiço',
  isbn: '978-8526020671',
  autorId: 'aluisio-azevedo-id',
  editoraId: 'companhia-das-letras-id',
  anoPublicacao: 1890,
  dataAquisicao: '2024-01-15',
  status: 'DISPONIVEL'
};

// Converter para entity
const props = LivroAdapter.fromCreateDTO(bodyDaAPI);
const livro = Livro.create(props);

// Fazer operações
livro.emprestar();

// Converter de volta para DTO (resposta da API)
const resposta: LivroDTO = LivroAdapter.toDTO(livro);

console.log(JSON.stringify(resposta, null, 2));
// {
//   "id": "uuid-aqui",
//   "titulo": "O Cortiço",
//   "isbn": "978-8526020671",
//   "autorId": "aluisio-azevedo-id",
//   "editoraId": "companhia-das-letras-id",
//   "anoPublicacao": 1890,
//   "dataAquisicao": "2024-01-15T00:00:00.000Z",
//   "status": "EMPRESTADO",
//   "criadoEm": "2024-12-07T10:30:00.000Z",
//   "atualizadoEm": "2024-12-07T10:30:02.000Z"
// }
```

## 🏗️ Exemplo 5: Lambda Handler Completo

```typescript
// handler.ts
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';
import {
  Livro,
  LivroAdapter,
  type CriarLivroDTO,
  LivroInvalidoError,
  DomainError
} from '@GustavoAdolfo/minhoteca-core-layer';

export async function createBook(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log('Criando novo livro...', event.body);

  try {
    // 1. Validar entrada
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Body é obrigatório' })
      };
    }

    const dto: CriarLivroDTO = JSON.parse(event.body);

    // 2. Converter para entity
    const props = LivroAdapter.fromCreateDTO(dto);
    const livro = Livro.create(props);

    // 3. Persistir em DynamoDB (seu código)
    // await salvarLivro(livro);

    // 4. Retornar DTO
    const resposta = LivroAdapter.toDTO(livro);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resposta)
    };
  } catch (error) {
    console.error('Erro ao criar livro:', error);

    if (error instanceof LivroInvalidoError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Livro inválido',
          message: error.message
        })
      };
    }

    if (error instanceof DomainError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Erro de negócio',
          message: error.message
        })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro interno do servidor',
        requestId: context.requestId
      })
    };
  }
}
```

## 🔍 Exemplo 6: Validação de Value Objects

```typescript
import { ISBN, Email, Nome, Data } from '@GustavoAdolfo/minhoteca-core-layer';

// ISBN
try {
  new ISBN('invalid');
} catch (e) {
  console.error(e.message); // "ISBN inválido: invalid. Use ISBN-10 ou ISBN-13"
}

// Email
try {
  new Email('not-an-email');
} catch (e) {
  console.error(e.message); // "Email inválido: not-an-email"
}

// Nome
try {
  new Nome('A'); // Muito curto
} catch (e) {
  console.error(e.message); // "Nome deve ter no mínimo 2 caracteres"
}

// Data
try {
  new Data('not-a-date');
} catch (e) {
  console.error(e.message); // "Data inválida: not-a-date"
}
```

## 📋 Exemplo 7: Comparação de Entities

```typescript
import { Livro, Nome, ISBN, Data, StatusLivro } from '@GustavoAdolfo/minhoteca-core-layer';

const livro1 = Livro.create({
  titulo: new Nome('1984'),
  isbn: new ISBN('978-0451524935'),
  autorId: 'id-1',
  editoraId: 'id-2',
  anoPublicacao: 1949,
  dataAquisicao: new Data('2024-01-10'),
  status: StatusLivro.DISPONIVEL
});

const livro2 = Livro.reconstitute(livro1.getId(), livro1.getProps());

console.log(livro1.equals(livro2)); // true (mesmo ID)

const livro3 = Livro.create({
  titulo: new Nome('1984'),
  isbn: new ISBN('978-0451524935'),
  autorId: 'id-1',
  editoraId: 'id-2',
  anoPublicacao: 1949,
  dataAquisicao: new Data('2024-01-10'),
  status: StatusLivro.DISPONIVEL
});

console.log(livro1.equals(livro3)); // false (IDs diferentes)
```

## 🎯 Exemplo 8: Listas de Entidades

```typescript
import { AutorAdapter, Autor, Nome } from '@GustavoAdolfo/minhoteca-core-layer';

const autores = [
  Autor.create({ nome: new Nome('Machado de Assis') }),
  Autor.create({ nome: new Nome('Clarice Lispector') }),
  Autor.create({ nome: new Nome('Fernando Pessoa') })
];

// Converter lista de entities para DTOs
const dtos = AutorAdapter.toDTOList(autores);

console.log(dtos);
// [
//   { id: 'uuid-1', nome: 'Machado de Assis', ... },
//   { id: 'uuid-2', nome: 'Clarice Lispector', ... },
//   { id: 'uuid-3', nome: 'Fernando Pessoa', ... }
// ]
```

## 📅 Exemplo 9: Operações com Datas

```typescript
import { Data } from '@GustavoAdolfo/minhoteca-core-layer';

const data1 = new Data('2024-01-15');
const data2 = new Data('2024-12-31');

// Comparações
console.log(data1.isBefore(data2)); // true
console.log(data2.isAfter(data1));  // true
console.log(data1.equals(data1));   // true

// Formatting
console.log(data1.toString());      // "15/01/2024" (formato português)
console.log(data1.toPrimitive());   // "2024-01-15T00:00:00.000Z" (ISO)

// Obter objeto Date nativo
const dateNativo = data1.asDate();
console.log(dateNativo instanceof Date); // true
```

---

Para mais exemplos e padrões, veja a [documentação arquitetural](./ARCHITECTURE.md) e [testes](../src/__tests__).
