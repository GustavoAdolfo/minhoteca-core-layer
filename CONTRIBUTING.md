# Contribuindo com o Minhoteca Core Layer

Obrigado por considerar contribuir com o **Minhoteca**! Este documento fornece diretrizes e instruções para colaboradores.

## 📋 Código de Conduta

Esperamos que todos os colaboradores sigam um comportamento respeitoso e inclusivo. Discriminação, assédio ou qualquer comportamento prejudicial não será tolerado.

## 🚀 Como Começar

### 0. Pré-requisitos

- Node.js **22+** (LTS mais recente)
- npm 10+

> A toolchain está alinhada para Node 22+. O TypeScript está fixado na linha 5.5.x por estabilidade (embora o stack @typescript-eslint atual suporte até 5.6.x) para garantir compatibilidade de linting.

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
git clone https://github.com/GustavoAdolfo/minhoteca-core-layer.git
cd minhoteca-core-layer
git remote add upstream https://github.com/GustavoAdolfo/minhoteca-core-layer.git
```

### 2. Instale as Dependências

```bash
npm install
```

### 2.1 Configurar GitHub Packages (Opcional)

Se você planeja instalar ou publicar pacotes privados do GitHub:

```bash
# Copie o template
cp .npmrc.example .npmrc

# Configure seu token (gere em https://github.com/settings/tokens)
# Permissões necessárias: read:packages, write:packages
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Nota:** `.npmrc` é ignorado pelo git por razões de segurança. Cada desenvolvedor deve configurar localmente.

### 2.2 Configurar hooks do Husky (pré-commit e commit-msg)

```bash
# (recomendado) rodar após o npm install caso precise reinstalar os hooks
npx husky install
```

Os hooks fazem:

- `pre-commit`: roda `lint-staged` (Prettier + ESLint nos arquivos staged)
- `commit-msg`: roda `commitlint` (convenção Conventional Commits)

### 3. Crie uma Branch para sua Feature

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/minha-correcao
```

**Padrão de naming:**

- `feature/` para novas features
- `fix/` para correções de bugs
- `docs/` para documentação
- `refactor/` para refatorações
- `test/` para testes

## ✅ Antes de Submeter um PR

### 1. Escreva Testes

Todas as novas features devem incluir testes unitários. Coloque os testes em `src/__tests__/` seguindo a estrutura de diretórios do código.

```bash
npm run test         # Rodar testes
npm run test:coverage # Ver cobertura
npm run test:watch   # Modo watch
```

### 2. Verifique o Linter

```bash
npm run lint       # Verificar estilo
npm run lint:fix   # Auto-corrigir problemas
```

### 2.1 Formatação (Prettier)

```bash
npm run format        # Formata arquivos suportados
npm run format:check  # Verifica formatação
```

### 3. Compile o TypeScript

```bash
npm run build      # Compilar
npm run clean      # Limpar dist/
```

### 4. Commit com Mensagens Claras

Siga as convenções de commit:

```
feat: adicionar novo valor de objeto para ISBN
fix: corrigir validação de email
docs: atualizar README com exemplos
test: adicionar testes para Livro
refactor: simplificar lógica de comparação
```

**Formato:**

```
<tipo>(<escopo>): <assunto resumido>

<corpo detalhado, se necessário>

<referências a issues>
```

**Validação automática:** O hook `commit-msg` roda `commitlint` e recusa commits fora do padrão.

### 5. Push e Abra um PR

```bash
git push origin feature/minha-feature
```

Então abra um Pull Request no GitHub com:

- Título claro e descritivo
- Descrição detalhada do que foi mudado e por quê
- Referência a issues relacionadas (ex: `Fixes #123`)
- Screenshots/exemplos, se aplicável

## 📐 Diretrizes de Código

### Estrutura de Arquivos

```
src/
├── entities/           # Entidades de negócio (Livro, Autor, etc)
├── value-objects/      # Objetos de valor imutáveis (ISBN, Email, etc)
├── dtos/              # Data Transfer Objects
├── adapters/          # Adapters entre entities e DTOs
├── errors/            # Erros customizados de domínio
├── __tests__/         # Testes (espelha estrutura do src/)
└── index.ts           # Barrel export
```

### Padrões de Código

1. **TypeScript Strict Mode**: Sempre use tipos explícitos
2. **Imutabilidade**: Value Objects devem ser imutáveis
3. **Factory Methods**: Use `create()` para criar novas instâncias
4. **Validação**: Valide no construtor ou na criação
5. **Documentação**: Adicione JSDoc em classes públicas e métodos

```typescript
/**
 * Entity Livro
 * Representa um livro no sistema Minhoteca
 * @example
 * const livro = Livro.create({ titulo, isbn, ... });
 */
export class Livro extends Entity<LivroProps> {
  /**
   * Factory method para criar um novo Livro
   * @throws {LivroInvalidoError} Se as propriedades forem inválidas
   */
  static create(props: Omit<LivroProps, 'criadoEm' | 'atualizadoEm'>): Livro {
    // ...
  }
}
```

### Testes

- Coloque tests em `src/__tests__/` com sufixo `.test.ts`
- Use nomes descritivos para suites e testes
- Alcance mínimo de cobertura: 70%

```typescript
describe('Livro Entity', () => {
  it('deve criar um novo livro', () => {
    const props = {
      /* ... */
    };
    const livro = Livro.create(props);
    expect(livro.getId()).toBeDefined();
  });
});
```

## 🔄 Processo de Review

1. GitHub Actions vai rodar testes, linter e build
2. Pelo menos um mantenedor revisará o PR
3. Resolva comentários e sugestões
4. Após aprovação, seu PR será mergeado

## 📦 Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis (quebras de API)
- **MINOR**: Novas features compatíveis
- **PATCH**: Correções de bugs

Tags de versão: `v1.0.0`, `v1.1.0`, etc.

## 📝 Changelog

Atualize `CHANGELOG.md` com suas mudanças. Formato:

```markdown
## [1.1.0] - 2024-12-15

### Added

- Nova feature X

### Fixed

- Correção para bug Y

### Changed

- Comportamento alterado em Z
```

## 📚 Recursos Úteis

- [Documentação de Entities e Value Objects](/docs)
- [Repositório do Projeto](https://github.com/GustavoAdolfo/minhoteca-core-layer)
- [Issues Abertas](https://github.com/GustavoAdolfo/minhoteca-core-layer/issues)

## ❓ Dúvidas?

Abra uma [Issue](https://github.com/GustavoAdolfo/minhoteca-core-layer/issues) ou discuta na seção de Discussões.

---

**Obrigado por contribuir com o Minhoteca! 🎉**
