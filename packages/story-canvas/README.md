# Story Canvas Engine — 0.1.0 preview

A dependency-free JavaScript toolkit for validating portable slide documents and rendering a static, responsive HTML deck with print styles. Speaker notes are omitted from HTML and exported separately on request. It does not generate content, provide live presenter mode or implement any proprietary teaching methodology.

```sh
node packages/story-canvas/cli.js validate packages/story-canvas/examples/deck.json
node packages/story-canvas/cli.js html packages/story-canvas/examples/deck.json > deck.html
node packages/story-canvas/cli.js notes packages/story-canvas/examples/deck.json > notes.json
npm test
```

Open `deck.html` in a browser or print it. Treat the input JSON and the separately exported notes as private if they contain sensitive information. The example uses fictional content. All user text is escaped; the renderer emits no JavaScript or external assets. Browser and print layout still require manual validation.

Schema: `{version:1,title,slides:[{id,heading,bullets?,notes?}]}`; IDs must be unique alphanumeric/hyphen/underscore strings, and each deck has 1–200 slides. See the example and tests for limits.

A new AI-assisted implementation of generic presentation tooling. No third-party teaching materials, proprietary method or private project source code were incorporated. MIT licensed.
