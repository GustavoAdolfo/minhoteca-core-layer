# Exemplo de Repositório para Minhoteca Core Layer

Este diretório demonstra como estruturar um repositório que consome `minhoteca-core-layer` em produção.

## 📁 Estrutura Recomendada para Lambda Functions

```
seu-projeto-lambda/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI/CD pipeline
│       └── deploy.yml          # Deploy para AWS
├── src/
│   ├── handlers/
│   │   ├── createBook.ts       # Handler para criar livro
│   │   ├── getBook.ts          # Handler para obter livro
│   │   ├── listBooks.ts        # Handler para listar livros
│   │   └── updateBook.ts       # Handler para atualizar livro
│   ├── repositories/
│   │   └── BookRepository.ts   # Acesso a dados (DynamoDB)
│   └── utils/
│       ├── logger.ts           # Logging
│       └── errors.ts           # Tratamento de erros
├── tests/
│   ├── handlers/
│   │   └── createBook.test.ts
│   └── repositories/
│       └── BookRepository.test.ts
├── template.yaml               # SAM template
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🚀 Setup Inicial

```bash
# 1. Criar projeto
mkdir seu-projeto-lambda
cd seu-projeto-lambda

# 2. Inicializar Node
npm init -y

# 3. Instalar dependências
npm install @GustavoAdolfo/minhoteca-core-layer
npm install --save-dev @types/aws-lambda aws-lambda typescript

# 4. Configurar TypeScript
npx tsc --init
```

## 💾 Exemplo: Repository Pattern

```typescript
// src/repositories/BookRepository.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Livro, LivroAdapter } from '@GustavoAdolfo/minhoteca-core-layer';

export class BookRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string = process.env.BOOKS_TABLE || 'Books') {
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  async save(livro: Livro): Promise<void> {
    const item = LivroAdapter.toDTO(livro);
    
    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item
      })
    );
  }

  async findById(id: string): Promise<Livro | null> {
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id }
      })
    );

    if (!response.Item) {
      return null;
    }

    // Reconstruir entity a partir do item
    const item = response.Item;
    return Livro.reconstitute(item.id, {
      titulo: item.titulo,
      isbn: item.isbn,
      autorId: item.autorId,
      editoraId: item.editoraId,
      anoPublicacao: item.anoPublicacao,
      descricao: item.descricao,
      dataAquisicao: item.dataAquisicao,
      status: item.status,
      localizacao: item.localizacao,
      criadoEm: new Date(item.criadoEm),
      atualizadoEm: new Date(item.atualizadoEm)
    });
  }
}
```

## 🔌 Exemplo: Lambda Handler

```typescript
// src/handlers/createBook.ts
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';
import {
  Livro,
  LivroAdapter,
  type CriarLivroDTO,
  LivroInvalidoError
} from '@GustavoAdolfo/minhoteca-core-layer';
import { BookRepository } from '../repositories/BookRepository';

const repository = new BookRepository();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log('Creating book...', { requestId: context.requestId });

  try {
    // Parse DTO
    const dto = JSON.parse(event.body!) as CriarLivroDTO;

    // Criar entity
    const props = LivroAdapter.fromCreateDTO(dto);
    const livro = Livro.create(props);

    // Persistir
    await repository.save(livro);

    // Responder
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(LivroAdapter.toDTO(livro))
    };
  } catch (error) {
    console.error('Error creating book:', error);

    if (error instanceof LivroInvalidoError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        requestId: context.requestId
      })
    };
  }
}
```

## 🧪 Exemplo: Teste

```typescript
// tests/handlers/createBook.test.ts
import { handler } from '../../src/handlers/createBook';

describe('createBook handler', () => {
  it('deve criar um livro com sucesso', async () => {
    const event = {
      body: JSON.stringify({
        titulo: 'O Alquimista',
        isbn: '978-8506084405',
        autorId: 'paulo-coelho',
        editoraId: 'rocco',
        anoPublicacao: 1988,
        dataAquisicao: '2024-01-15'
      })
    };

    const result = await handler(event as any, {} as any);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.id).toBeDefined();
    expect(body.titulo).toBe('O Alquimista');
  });

  it('deve validar livro inválido', async () => {
    const event = {
      body: JSON.stringify({
        titulo: 'O Alquimista',
        isbn: 'invalid',
        autorId: 'paulo-coelho',
        editoraId: 'rocco',
        anoPublicacao: 999,
        dataAquisicao: '2024-01-15'
      })
    };

    const result = await handler(event as any, {} as any);

    expect(result.statusCode).toBe(400);
  });
});
```

## 📦 Deployment com SAM

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Description: Minhoteca Lambda Functions

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Runtime: nodejs20.x
    Environment:
      Variables:
        BOOKS_TABLE: !Ref BooksTable

Resources:
  MinhotecaCoreLayer:
    Type: AWS::Lambda::LayerVersion
    Properties:
      LayerName: minhoteca-core-layer
      ContentUri: s3://seu-bucket/layers/minhoteca-core-layer.zip
      CompatibleRuntimes:
        - nodejs18.x
        - nodejs20.x

  CreateBookFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/handlers/createBook.ts
      Handler: createBook.handler
      Layers:
        - !Ref MinhotecaCoreLayer
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref BooksTable

  BooksTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: Books
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
```

## 🚀 Deploy

```bash
# Build
npm run build

# Deploy com SAM
sam deploy --guided
```

## 📚 Recursos

- [Documentação do Minhoteca Core Layer](../docs)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)

---

Para mais exemplos, veja a [documentação técnica](../docs/EXAMPLES.md).
