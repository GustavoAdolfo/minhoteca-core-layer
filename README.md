![GitHub](https://img.shields.io/github/license/GustavoAdolfo/minhoteca-core-layer)
![npm](https://img.shields.io/npm/v/@GustavoAdolfo/minhoteca-core-layer)
![CI](https://github.com/GustavoAdolfo/minhoteca-core-layer/actions/workflows/ci.yml/badge.svg)
![Tests](https://img.shields.io/badge/tests-61%20passed-success)

# minhoteca-core-layer

**Camada principal de entidades e modelos de dados do projeto Minhoteca.**

Este projeto oferece classes, objetos de valor e DTOs reutilizáveis para acelerar o desenvolvimento das funções Lambda e microsserviços do ecossistema Minhoteca.

## 🎯 Propósito Social

Minhoteca tem como missão facilitar o acesso gratuito à leitura, gestão de empréstimos e organização de pequenas bibliotecas em comunidades, ONGs e projetos sociais, contribuindo para os Objetivos de Desenvolvimento Sustentável (ODS) da ONU — especialmente os que tratam de educação de qualidade e redução das desigualdades.

**Alinhamento aos ODS:**
- 🎓 ODS 4: Educação de Qualidade
- 📚 ODS 10: Redução das Desigualdades
- 💚 ODS 17: Parcerias para a Implementação dos Objetivos

## ✨ Funcionalidades

- **Entidades de Negócio:** Livro, Autor, Editora (com validações e lógica encapsulada)
- **Objetos de Valor:** ISBN, Nome, Email, Data (com validação automática e imutabilidade)
- **DTOs:** Facilita a integração entre camadas sem expor lógica interna
- **Adapters:** Conversão automática entre Entities e DTOs
- **Tratamento de Erros:** Erros customizados de domínio para melhor tratamento
- **Testes Completos:** 61 testes unitários com 70%+ de cobertura
- **CI/CD Automatizado:** Build, testes e deploy via GitHub Actions
- **Pronto para AWS Lambda Layers:** Documentação completa de deployment

## 🚀 Começar Rápido

### Instalação

```bash
npm install @GustavoAdolfo/minhoteca-core-layer
```

### Uso Básico

```typescript
import { Livro, Nome, ISBN, Data, StatusLivro } from '@GustavoAdolfo/minhoteca-core-layer';

// Criar um livro
const livro = Livro.create({
  titulo: new Nome('O Alquimista'),
  isbn: new ISBN('978-8506084405'),
  autorId: 'autor-123',
  editoraId: 'editora-456',
  anoPublicacao: 1988,
  dataAquisicao: new Data('2024-01-15'),
  status: StatusLivro.DISPONIVEL
});

// Emprestar livro
livro.emprestar();

// Devolver
livro.devolver();
```

## 📚 Documentação

- **[Arquitetura e Conceitos](./docs/ARCHITECTURE.md)** - Domain-Driven Design, Entities, Value Objects
- **[Exemplos Práticos](./docs/EXAMPLES.md)** - Código real para diferentes cenários
- **[Deploy em Lambda Layer](./docs/LAMBDA_LAYER_DEPLOYMENT.md)** - Guia passo-a-passo para AWS

## 🏗️ Estrutura

```
src/
├── entities/       # Livro, Autor, Editora
├── value-objects/  # ISBN, Email, Nome, Data
├── dtos/          # Data Transfer Objects
├── adapters/      # Conversão Entity ↔ DTO
├── errors/        # Erros de domínio
└── __tests__/     # Testes (61 casos)
```

## 🧪 Testes

```bash
npm test              # Rodar testes
npm test:coverage    # Ver cobertura
npm test:watch      # Modo watch
```

## 🔨 Desenvolvimento

```bash
npm run build       # Compilar TypeScript
npm run lint        # ESLint
npm run lint:fix    # Auto-corrigir
npm run clean       # Limpar dist/
```

## 📦 Como Lambda Layer

A layer é automaticamente publicada quando você cria uma tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Veja [Deploy em Lambda Layer](./docs/LAMBDA_LAYER_DEPLOYMENT.md) para instruções detalhadas.

## 🤝 Contribuir

Queremos sua contribuição! Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para:
- Padrões de código
- Como escrever testes
- Processo de PR
- Convenção de commits

Contribuições em qualquer nível são bem-vindas:
- 🐛 Reportar bugs
- 📝 Melhorar documentação
- ✨ Sugerir features
- 🔧 Submeter PRs

## 📋 Roadmap

**v0.2.0** (Próximo):
- [ ] Entidade Empréstimo
- [ ] Repository interfaces
- [ ] DynamoDB examples
- [ ] AWS SDK helpers

**v0.3.0**:
- [ ] Rate limiting utilities
- [ ] Logging helpers
- [ ] Webhook support

## 📄 Licença

Distribuído sob licença **MIT** (veja [LICENSE](./LICENSE)).

Escolhemos MIT para incentivar:
- ✅ Uso comercial
- ✅ Modificações
- ✅ Distribuição
- ✅ Uso privado

**Único requisito**: Incluir aviso de copyright e licença.

## 🔗 Links

- [GitHub](https://github.com/GustavoAdolfo/minhoteca-core-layer)
- [npm](https://www.npmjs.com/package/@GustavoAdolfo/minhoteca-core-layer)
- [Issues](https://github.com/GustavoAdolfo/minhoteca-core-layer/issues)

## 💬 Suporte

- 📖 Leia a [documentação](./docs)
- 🐛 Abra uma [Issue](https://github.com/GustavoAdolfo/minhoteca-core-layer/issues)
- 💡 Veja os [exemplos](./docs/EXAMPLES.md)

---

**Minhoteca é código aberto e feito com ❤️ para a comunidade.**

Junte-se a nós na missão de democratizar o acesso à leitura! 📚
