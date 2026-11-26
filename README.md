# Saldanha Labs

**Building intelligence. Creating impact.**

An independent open-source initiative focused on reusable creative production, editorial planning and automation tools. The modules are early previews, independently implemented with AI assistance; they do not claim verified adoption or AI generation capabilities.

| Module | Purpose | Status |
| --- | --- | --- |
| [CreativeFlow](apps/creativeflow) | Local-first production board, CLI and portable data | Core tested; browser preview |
| [Editorial Planner](packages/editorial-planner) | Dependency-free editorial scheduling and production metrics | Core tested; library preview |
| [Story Canvas Engine](packages/story-canvas) | Portable slide documents, HTML rendering and separate speaker notes | Core tested; render preview |
| [AI Workflow Toolkit](packages/workflow-toolkit) | Dependency graphs and local async execution | Core tested; library preview |
| [Prompt Engineering Framework](packages/prompt-framework) | Strict prompt templates and literal output checks | Core tested; library preview |

## Getting started

Requires Node.js 20+. No npm dependencies. Clone the repository and run `npm test` from its root. See each module for examples and usage. Run `npm run demo` for a local workflow combining editorial planning and prompt templates. No model or API is called.

## Integrated production kit

Try the [browser production kit](demos/production-kit.html) when serving the repository locally or via GitHub Pages (once enabled). It generates six individually downloadable files without installing Node.js on the client. Browser validation remains pending.

Turn one editorial plan into six portable files: a schedule, prompt briefs, CreativeFlow JSON and CSV boards, a Story Canvas HTML presentation and separate speaker notes. This example exercises all five modules without a model API or external service.

```sh
node examples/production-kit-cli.js examples/production-kit-input.json production-kit-output
```

The output directory must not exist. Import `board.json` into CreativeFlow and open `presentation.html` locally. Use the separate notes JSON for presenter preparation. The included input is fictional; do not publish sensitive data. See [pilot instructions](docs/pilot.md) for a real-world trial and feedback.

## Browser demos

Serve the repository root with `python -m http.server 8000 --bind 127.0.0.1`, then open `http://127.0.0.1:8000/`. The [demo landing page](index.html) includes the CreativeFlow board, a generated Story Canvas deck and a playground combining the other three libraries. No external model or credentials are required. Browser smoke tests are configured in GitHub Actions; passing browser results have not yet been confirmed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). We welcome substantive fixes, accessibility testing and real-world feedback. Examples are fictional and no production services or credentials are included. Contributions must respect third-party licenses and attribution. Please do not submit artificial activity.

## License

[MIT](LICENSE) for the independently authored code included here. This license does not cover separate private products, third-party marks or external services.
