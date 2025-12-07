# Deployment em AWS Lambda Layer

## 📚 O que é uma Lambda Layer?

Uma **Lambda Layer** é um arquivo ZIP que contém bibliotecas, código customizado ou outras dependências que podem ser usadas por funções Lambda. É ideal para código compartilhado entre múltiplas funções.

## 🎯 Estrutura Esperada

AWS Lambda espera a seguinte estrutura em uma Layer:

```
layer.zip
└── nodejs/
    └── node_modules/
        └── @GustavoAdolfo/
            └── minhoteca-core-layer/
                ├── dist/          # Código compilado
                ├── package.json
                └── ...
```

## 📦 Build para Lambda Layer

### Opção 1: Automatizado via GitHub Actions (Recomendado)

O workflow de release já está configurado! Quando você criar uma tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

O GitHub Actions:
1. ✅ Instala dependências
2. ✅ Roda testes
3. ✅ Faz build
4. ✅ Publica em GitHub Packages

### Opção 2: Build Local

```bash
# 1. Build o projeto
npm run clean
npm run build

# 2. Criar estrutura de layer
mkdir -p layer/nodejs/node_modules/@GustavoAdolfo

# 3. Copiar build
cp -r dist layer/nodejs/node_modules/@GustavoAdolfo/minhoteca-core-layer
cp package.json layer/nodejs/node_modules/@GustavoAdolfo/minhoteca-core-layer

# 4. Criar ZIP
cd layer
zip -r ../minhoteca-core-layer.zip .
cd ..
```

## 🚀 Upload para AWS Lambda

### Pré-requisitos

```bash
# Instalar AWS CLI
pip install awscli

# Configurar credenciais
aws configure
```

### Upload da Layer

```bash
# 1. Upload para S3 (opcional, para armazenamento)
aws s3 cp minhoteca-core-layer.zip s3://seu-bucket/layers/

# 2. Criar Lambda Layer
aws lambda publish-layer-version \
  --layer-name minhoteca-core-layer \
  --zip-file fileb://minhoteca-core-layer.zip \
  --compatible-runtimes nodejs18.x nodejs20.x \
  --region us-east-1

# 3. Resposta (guarde o LayerVersionArn)
# {
#   "LayerVersionArn": "arn:aws:lambda:us-east-1:ACCOUNT_ID:layer:minhoteca-core-layer:1",
#   ...
# }
```

## 🔗 Usar Layer em uma Lambda Function

### Método 1: AWS Console

1. Vá para Lambda → Functions
2. Selecione sua função
3. Em "Layers", clique "Add a layer"
4. Cole o LayerVersionArn da layer
5. Save

### Método 2: AWS CLI

```bash
aws lambda update-function-configuration \
  --function-name sua-funcao \
  --layers arn:aws:lambda:us-east-1:ACCOUNT_ID:layer:minhoteca-core-layer:1 \
  --region us-east-1
```

### Método 3: CloudFormation/SAM

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    MemorySize: 256
    Runtime: nodejs20.x

Resources:
  MinhotecaCoreLayer:
    Type: AWS::Lambda::LayerVersion
    Properties:
      LayerName: minhoteca-core-layer
      Content:
        S3Bucket: seu-bucket
        S3Key: layers/minhoteca-core-layer.zip
      CompatibleRuntimes:
        - nodejs18.x
        - nodejs20.x

  SuaFuncao:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/handlers/
      Handler: index.handler
      Layers:
        - !Ref MinhotecaCoreLayer
```

### Método 4: Terraform

```hcl
data "archive_file" "minhoteca_layer" {
  type        = "zip"
  source_dir  = "${path.module}/layer"
  output_path = "${path.module}/minhoteca-core-layer.zip"
}

resource "aws_lambda_layer_version" "minhoteca" {
  filename                 = data.archive_file.minhoteca_layer.output_path
  layer_name               = "minhoteca-core-layer"
  compatible_runtimes      = ["nodejs18.x", "nodejs20.x"]
  source_code_hash         = data.archive_file.minhoteca_layer.output_base64sha256
}

resource "aws_lambda_function" "sua_funcao" {
  filename         = "seu_funcao.zip"
  function_name    = "sua-funcao"
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  layers           = [aws_lambda_layer_version.minhoteca.arn]
}
```

## 💻 Usar em sua Lambda Function

```typescript
// seu_handler.ts
import { Livro, LivroAdapter, type CriarLivroDTO } from 'minhoteca-core-layer';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const dto = JSON.parse(event.body!) as CriarLivroDTO;
    
    // Usar a layer
    const props = LivroAdapter.fromCreateDTO(dto);
    const livro = Livro.create(props);

    return {
      statusCode: 201,
      body: JSON.stringify(LivroAdapter.toDTO(livro))
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
}
```

## 📊 Estrutura de Projeto Recomendada

```
seu-projeto-lambda/
├── template.yaml           # SAM template
├── src/
│   ├── handlers/
│   │   ├── createBook.ts
│   │   ├── listBooks.ts
│   │   └── updateBook.ts
│   ├── repositories/       # DynamoDB, S3, etc
│   └── utils/
├── layer/                  # Código para Lambda Layer
│   └── nodejs/
│       └── node_modules/   # Preenchido pelo build
├── tests/
├── package.json
└── tsconfig.json
```

## 🎁 Incluir outras Dependências na Layer

Se precisar incluir outras bibliotecas na layer:

```bash
# 1. Criar diretório de layer
mkdir -p layer/nodejs

# 2. Instalar dependências nele
cd layer/nodejs
npm init -y
npm install @aws-sdk/client-dynamodb
npm install uuid

# 3. O AWS SDK já vem em Lambda, mas pode ser útil ter versão específica

cd ../..

# 4. Copiar minhoteca-core-layer também
cp -r dist layer/nodejs/node_modules/@GustavoAdolfo/minhoteca-core-layer

# 5. Zipar
zip -r minhoteca-core-layer.zip layer/
```

## 🔄 Versioning da Layer

Cada vez que você publica uma layer, AWS cria uma versão automaticamente:
- v1, v2, v3, etc.

Para usar a versão específica:

```bash
arn:aws:lambda:REGION:ACCOUNT_ID:layer:minhoteca-core-layer:2
```

Para sempre usar a versão mais recente:

```bash
arn:aws:lambda:REGION:ACCOUNT_ID:layer:minhoteca-core-layer
```

## 📈 Limite de Tamanho

- **Tamanho descompactado máximo**: 250 MB
- **Tamanho compactado máximo**: 50 MB

Para verificar:

```bash
unzip -l minhoteca-core-layer.zip | tail -1
```

## 🧪 Testes Locais

### Simular ambiente Lambda

```bash
# 1. Instalar SAM CLI
pip install aws-sam-cli

# 2. Build local
sam build

# 3. Rodar função localmente
sam local invoke SuaFuncao --event events/event.json

# 4. Com layers
sam local start-api --layer-cache-basedir layer
```

## 🐛 Troubleshooting

### Erro: "Unable to import module"

**Causa**: A layer não está no formato correto.

**Solução**: Certifique-se da estrutura:
```
nodejs/node_modules/@GustavoAdolfo/minhoteca-core-layer/dist/
```

### Erro: "Lambda responded with Status 200"

**Causa**: Erro no handler, não na layer.

**Solução**: Verifique os logs:
```bash
aws logs tail /aws/lambda/sua-funcao --follow
```

### Layer não aparece em "Add a layer"

**Causa**: Layer pode estar em região diferente.

**Solução**: Especifique a região correta:
```bash
aws lambda publish-layer-version --region us-east-1 ...
```

## 📚 Recursos

- [AWS Lambda Layers Documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-layers.html)
- [SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

---

Para configuração de CI/CD automatizado, veja [.github/workflows/release.yml](../.github/workflows/release.yml).
