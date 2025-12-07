# Changelog

Todos os mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/),
e este projeto segue [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Implementação inicial de Value Objects (ISBN, Email, Nome, Data)
- Implementação de Entities (Autor, Editora, Livro) com lógica de negócio
- DTOs para transferência de dados entre camadas
- Adapters para conversão entre Entities e DTOs
- Erros customizados de domínio
- Suite completa de testes unitários (61 testes com 70%+ cobertura)
- Workflows de CI/CD com GitHub Actions (build, lint, test)
- Workflow de release automático ao criar tags
- Configuração de Dependabot para manutenção de dependências
- Documentação de contribuição (CONTRIBUTING.md)

### Next Steps (v0.2.0)
- Lambda Layer deployment guide
- DynamoDB repositories example
- AWS SDK integration helpers
- Mais entidades (Empréstimo, Devolvição, Reserva)

## [0.1.0] - 2024-12-07

### Initial Release

Primeira versão estável com:
- Estrutura base do projeto
- Setup de TypeScript, ESLint, Jest
- Package.json configurado para GitHub Packages
- README com propósito social destacado
