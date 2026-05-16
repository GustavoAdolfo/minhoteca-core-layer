# Changelog

Todos os mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/),
e este projeto segue [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Nova entidade `Pais` com lógica de negócio e testes unitários (suporte a padrões ISO 3166)
- Integração de deploy de infraestrutura com Terraform no pipeline de CI/CD utilizando autenticação AWS OIDC

## [1.0.2] - 2026-05-01

### Added

- Exportação da interface PageData para uso em casos de uso e repositórios

## [1.0.1] - 2026-04-29

### Added

- Ajuste de versionamento para publicação de pacote

## [1.0.0] - 2026-04-29

### Added

- Implementação inicial de Value Objects (ISBN, Email, Nome, Data)
- Implementação de Entities (Autor, Editora, Livro) com lógica de negócio
- DTOs para transferência de dados entre camadas
- Adapters para conversão entre Entities e DTOs
- Erros customizados de domínio
- Suite completa de testes unitários com cobertura de código
- Workflows de CI/CD com GitHub Actions (build, lint, test)
- Workflow de release automático ao criar tags
- Configuração de Dependabot para manutenção de dependências
- Documentação de contribuição (CONTRIBUTING.md)

### Changed

- Atualização da estrutura do changelog para versionamento semântico
- Refinamentos na organização de camadas e pacotes internos

### Fixed

- Correções gerais de tipagem e consistência de domínio

## [0.1.0] - 2024-12-07

### Initial Release

Primeira versão estável com:

- Estrutura base do projeto
- Setup de TypeScript, ESLint, Jest
- Package.json configurado para GitHub Packages
- README com propósito social destacado
