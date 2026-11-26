# Saldanha Labs — guia rápido em português

O Production Kit reúne cinco módulos para transformar um planejamento editorial em arquivos reutilizáveis. É uma versão experimental, sem chamadas a modelos de IA ou serviços externos.

## Experimente

1. Acesse a [página de demonstrações](https://renatodesaldanha.github.io/saldanha-labs/) quando o GitHub Pages estiver habilitado. Se ela não estiver disponível, siga a alternativa local abaixo.
2. Abra **Production Kit**, informe dois ou três títulos fictícios e a data inicial de publicação. Clique em **Generate six files**.
3. Baixe os arquivos e compare com seu processo habitual: cronograma, prompts, quadro de produção JSON/CSV, apresentação HTML e notas do apresentador.

### Alternativa local

Com Git, Node.js 20+ e Python instalados:

```sh
git clone https://github.com/renatodesaldanha/saldanha-labs.git
cd saldanha-labs
npm test
python -m http.server 8000 --bind 127.0.0.1
```

Abra http://127.0.0.1:8000/ no navegador. Em outro terminal, você também pode executar o exemplo de linha de comando:

```sh
node examples/production-kit-cli.js examples/production-kit-input.json production-kit-output
```

A pasta de saída não pode existir. Não use dados confidenciais nem publique informações de clientes.

## Como participar

- Se você encontrar um problema real, informe os passos para reproduzi-lo na [issue de feedback](https://github.com/renatodesaldanha/saldanha-labs/issues/2).
- Se quiser corrigir um problema, leia as [orientações de contribuição](../CONTRIBUTING.md), crie um fork e uma branch, implemente a alteração útil e execute `npm test`.
- Envie um pull request explicando o problema, a solução e os testes realizados. A aceitação depende de revisão técnica. Não envie alterações artificiais ou repetitivas.
- Caso queira apenas conhecer ou usar o projeto, não é necessário abrir uma issue ou enviar código.

## Limitações

O núcleo possui testes automatizados locais; a validação completa no navegador e a execução remota do CI ainda não foram confirmadas. Não há publicação automática de conteúdo, autenticação, geração por IA ou backend compartilhado.

Licença [MIT](../LICENSE). Leia também o [guia original do piloto](pilot.md).
