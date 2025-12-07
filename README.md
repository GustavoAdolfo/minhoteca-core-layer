![GitHub](https://img.shields.io/github/license/GustavoAdolfo/minhoteca-core-layer)
![npm](https://img.shields.io/npm/v/@GustavoAdolfo/minhoteca-core-layer)
![CI](https://github.com/GustavoAdolfo/minhoteca-core-layer/actions/workflows/ci.yml/badge.svg)

# minhoteca-core-layer

**Camada principal de entidades e modelos de dados do projeto Minhoteca.**

Este projeto oferece classes, objetos de valor e DTOs reutilizáveis para acelerar o desenvolvimento das funções Lambda e microsserviços do ecossistema Minhoteca.

## Propósito social

Minhoteca tem como missão facilitar o acesso gratuito à leitura, gestão de empréstimos e organização de pequenas bibliotecas em comunidades, ONGs e projetos sociais, contribuindo para os Objetivos de Desenvolvimento Sustentável (ODS) da ONU — especialmente os que tratam de educação de qualidade e redução das desigualdades.

## Funcionalidades

- **Entidades principais:** Livro, Autor, Editora (e futuras extensões)
- **Objetos de Valor:** ISBN, Nome, Email, Datas, etc.
- **DTOs:** Facilita a integração entre camadas sem expor lógica interna de negócio

Este projeto é [Open Source](./LICENSE) e incentiva a colaboração para promover o acesso democrático à leitura.

## Como usar

1. Instale como dependência npm:
    ```bash
    npm install @seuusuario/minhoteca-core-layer
    ```
2. Importe os modelos em seu projeto:
    ```typescript
    import { Livro, Autor } from '@seuusuario/minhoteca-core-layer/entities';
    ```
3. [Veja a documentação técnica aqui.](/docs)

## Licença

Distribuído sob licença MIT (veja [LICENSE](./LICENSE)).

## Como contribuir

Pull Requests, sugestões e melhorias são muito bem-vindas! Veja as instruções em [CONTRIBUTING.md](./CONTRIBUTING.md).
