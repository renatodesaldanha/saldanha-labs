# CreativeFlow — 0.1.0 preview

A local-first creative production board with four stages, portable JSON and CSV data, a CLI and a UTM URL helper. No runtime dependencies or external services.

From this directory, using Node.js 20+:

```sh
npm test
npm run demo
node src/cli.js validate examples/board.json
node src/cli.js csv examples/board.json
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000 in your browser. The optional interface stores data locally; export backups and avoid confidential data on shared computers. Browser end-to-end validation remains pending. Core tests pass locally. This is not an AI generation tool or multi-user production service.

Independently implemented with AI assistance in November 2026, inspired by a private workflow concept. No private source code, credentials or customer data were copied. Example records are fictional. MIT licensed; see the root LICENSE.
