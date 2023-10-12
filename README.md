# syntax-sandbox

This repository contains my experiments on creating a query language for [the CodeMirror](https://codemirror.net/). It is arranged as a monorepo so that I can easily try new ideas without dealing with infrastructure.

## Structure

Applications:

- [codemirror-lezer](./apps/codemirror-lezer) — an editor with lezer-defined grammar

Packages:

- [ui](./packages/ui) — a bunch of ui components that are not related to grammar

## Development

1. Install nodejs version specified in [.nvmrc](./.nvmrc).
2. Install pnpm:
    ```bash
    npm install -g pnpm@8
    ```
3. Bootstrap the monorepo:
    ```
    pnpm install
    ```
4. Run tests:
    ```
    pnpm test
    ```
