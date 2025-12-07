# Documentação Técnica - Minhoteca Core Layer

## 📖 Visão Geral

A **minhoteca-core-layer** é uma camada compartilhada de entidades, objetos de valor e DTOs reutilizáveis. Implementa os princípios de **Domain-Driven Design (DDD)** em TypeScript.

## 🏗️ Arquitetura

### Camadas

```
┌─────────────────────────┐
│   APIs / Lambdas        │  (Consumem a layer)
├─────────────────────────┤
│  minhoteca-core-layer   │  (Esta library)
│  - Entities             │
│  - Value Objects        │
│  - DTOs                 │
│  - Adapters             │
├─────────────────────────┤
│  External Services      │  (DynamoDB, S3, etc)
└─────────────────────────┘
```

### Padrões Utilizados

1. **Domain-Driven Design (DDD)**
   - Entities: Objetos com identidade única
   - Value Objects: Objetos imutáveis sem identidade
   - Domain Errors: Exceções de negócio

2. **Adapter Pattern**
   - Conversão Entity ↔ DTO
   - Desacoplamento de camadas

3. **Factory Pattern**
   - Criação de entidades via `create()`
   - Reconstrução via `reconstitute()`

## 🎯 Conceitos Principais

### Value Objects (Objetos de Valor)

São objetos **imutáveis** que representam um conceito com valor por si só.

**Características:**
- Validação no construtor
- Imutáveis (não pode mudar após criação)
- Comparação por valor (não por referência)

**Exemplos:**
- `ISBN`: Valida formato ISBN-10 ou ISBN-13
- `Email`: Valida formato de email
- `Nome`: Garante comprimento válido
- `Data`: Encapsula operações com datas

```typescript
// Criar um ISBN
const isbn = new ISBN('978-0-123-45678-9');
console.log(isbn.toString()); // 9780123456789

// Validação automática
try {
  new ISBN('invalid-isbn'); // Lança erro
} catch (e) {
  console.error(e.message); // "ISBN inválido..."
}

// Comparação por valor
const isbn1 = new ISBN('978-0-123-45678-9');
const isbn2 = new ISBN('978-0123456789');
console.log(isbn1.equals(isbn2)); // true
```

### Entities (Entidades)

São objetos com **identidade única** que encapsulam lógica de negócio.

**Características:**
- Têm ID único
- Mutáveis (podem mudar estado)
- Comparação por ID
- Encapsulam validações de negócio

**Exemplo - Livro:**

```typescript
import { Livro, StatusLivro } from '@GustavoAdolfo/minhoteca-core-layer';
import { Nome, ISBN, Data } from '@GustavoAdolfo/minhoteca-core-layer';

// Criar um livro
const livro = Livro.create({
  titulo: new Nome('O Alquimista'),
  isbn: new ISBN('978-8506084405'),
  autorId: 'autor-123',
  editoraId: 'editora-456',
  anoPublicacao: 1988,
  dataAquisicao: new Data('2023-01-15'),
  status: StatusLivro.DISPONIVEL
});

console.log(livro.getId()); // uuid gerado automaticamente

// Operações de negócio
livro.emprestar();          // Marca como emprestado
console.log(livro.getStatus()); // StatusLivro.EMPRESTADO

livro.devolver();           // Devolve
console.log(livro.estaDisponivel()); // true

// Localização
livro.atualizarLocalizacao('Prateleira A-3');

// Marcar como danificado
livro.marcarComoDanificado();
```

### DTOs (Data Transfer Objects)

São usados para transferir dados entre camadas sem expor implementação interna.

**Benefícios:**
- Desacoplam a camada de API da lógica de negócio
- Facilitam validação de entrada
- Permitem versionamento de API

```typescript
import { LivroAdapter, type CriarLivroDTO } from '@GustavoAdolfo/minhoteca-core-layer';

// DTO de entrada (como viria de uma API)
const dtoEntrada: CriarLivroDTO = {
  titulo: 'O Alquimista',
  isbn: '978-8506084405',
  autorId: 'autor-123',
  editoraId: 'editora-456',
  anoPublicacao: 1988,
  dataAquisicao: '2023-01-15',
  localizacao: 'Prateleira A'
};

// Converter DTO → Entity
const props = LivroAdapter.fromCreateDTO(dtoEntrada);
const livro = Livro.create(props);

// Converter Entity → DTO (para resposta)
const dtoSaida = LivroAdapter.toDTO(livro);
console.log(dtoSaida);
// {
//   id: 'uuid-123',
//   titulo: 'O Alquimista',
//   isbn: '978-8506084405',
//   autorId: 'autor-123',
//   editoraId: 'editor-456',
//   anoPublicacao: 1988,
//   dataAquisicao: '2023-01-15T00:00:00Z',
//   status: 'DISPONIVEL',
//   localizacao: 'Prateleira A',
//   criadoEm: '2024-12-07T10:30:00Z',
//   atualizadoEm: '2024-12-07T10:30:00Z'
// }
```

### Adapters

Convertem entre Entities e DTOs.

```typescript
import { AutorAdapter, Autor } from '@GustavoAdolfo/minhoteca-core-layer';
import { Nome } from '@GustavoAdolfo/minhoteca-core-layer';

// Criar autor
const autor = Autor.create({
  nome: new Nome('Paulo Coelho')
});

// Converter para DTO
const dto = AutorAdapter.toDTO(autor);

// Converter lista de entities para DTOs
const autores = [
  Autor.create({ nome: new Nome('Paulo Coelho') }),
  Autor.create({ nome: new Nome('Jorge Amado') })
];
const dtos = AutorAdapter.toDTOList(autores);
```

## 🔧 Entidades Implementadas

### Autor

Representa um autor de livros.

```typescript
interface AutorProps {
  nome: Nome;
  biografia?: string;
  email?: Email;
  dataNascimento?: Data;
  nacionalidade?: string;
}
```

### Editora

Representa uma editora.

```typescript
interface EditoraProps {
  nome: Nome;
  email?: Email;
  website?: string;
  pais?: string;
}
```

### Livro

Representa um livro com gerenciamento de status.

```typescript
enum StatusLivro {
  DISPONIVEL = 'DISPONIVEL',
  EMPRESTADO = 'EMPRESTADO',
  DANIFICADO = 'DANIFICADO',
  DESCARTADO = 'DESCARTADO'
}

interface LivroProps {
  titulo: Nome;
  isbn: ISBN;
  autorId: string;
  editoraId: string;
  anoPublicacao: number;
  descricao?: string;
  dataAquisicao: Data;
  status: StatusLivro;
  localizacao?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}
```

## 📋 Uso em Lambda Functions

### Exemplo: Lambda de Criação de Livro

```typescript
// handler.ts
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Livro, LivroAdapter, type CriarLivroDTO } from 'minhoteca-core-layer';

export async function createBook(event: APIGatewayProxyEvent) {
  try {
    // Parse do body
    const dto = JSON.parse(event.body!) as CriarLivroDTO;

    // Criar entity
    const props = LivroAdapter.fromCreateDTO(dto);
    const livro = Livro.create(props);

    // Persistir em DynamoDB (seu código)
    await salvarEmDynamoDB(livro);

    // Responder com DTO
    const response = LivroAdapter.toDTO(livro);

    return {
      statusCode: 201,
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
}
```

## ⚠️ Tratamento de Erros

Use os erros customizados de domínio:

```typescript
import {
  LivroInvalidoError,
  AutorInvalidoError,
  EditoraInvalidaError,
  DomainError
} from '@GustavoAdolfo/minhoteca-core-layer';

try {
  const livro = Livro.create({
    // ...
    anoPublicacao: 999 // Inválido
  });
} catch (error) {
  if (error instanceof LivroInvalidoError) {
    // Tratamento específico para erro de livro
    console.error('Livro inválido:', error.message);
  } else if (error instanceof DomainError) {
    // Tratamento genérico de erro de domínio
    console.error('Erro de negócio:', error.message);
  }
}
```

## 🧪 Testes

Todos os componentes têm testes unitários. Execute:

```bash
npm test              # Rodar testes
npm test:coverage    # Ver cobertura
npm test:watch      # Modo watch
```

## 📦 Export de Módulos

O `index.ts` exporta tudo que você precisa:

```typescript
// Importar tudo
import * as Minhoteca from '@GustavoAdolfo/minhoteca-core-layer';

// Ou importar específico
import { Livro, StatusLivro, ISBN } from '@GustavoAdolfo/minhoteca-core-layer';
```

## 🔄 Próximos Passos

- [ ] Entidades adicionais (Empréstimo, Reserva, etc)
- [ ] Repository interfaces para persistência
- [ ] Especificação de DynamoDB schemas
- [ ] Rate limiting utilities
- [ ] Logging helpers

---

Para mais informações, veja [README.md](/README.md) e [CONTRIBUTING.md](/CONTRIBUTING.md).
