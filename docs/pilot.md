# Pilot: editorial production kit

The goal is to find out whether the kit saves real editorial work, not to collect stars or contributions for their own sake.

For a no-install trial once GitHub Pages is enabled, open the demo landing page and choose Production Kit. Enter fictional episode titles and a date, generate six files, then download and inspect them. The same demo is available when the repository is served locally.

For a CLI trial:

1. Clone this repository and run `npm test` with Node.js 20 or later.
2. Copy `examples/production-kit-input.json` to a local file outside the repository. Replace the fictional episode names, project, start date and interval with a non-confidential plan containing 2–10 episodes.
3. Run `node examples/production-kit-cli.js <your-input.json> <new-output-directory>`.
4. Inspect the schedule and briefs. Import `board.json` in the CreativeFlow browser preview; inspect `presentation.html` and the separate notes. Check that dates, titles and IDs are consistent. Use the CSV only with trusted spreadsheet settings.
5. Compare the steps with your usual process. Report what you actually tried, what failed, and which missing feature would make the tool useful. Avoid personal or customer data. Timing estimates are optional and should be based on an actual trial.

Share feedback in [the pilot issue](https://github.com/renatodesaldanha/saldanha-labs/issues/2). A thoughtful bug report or usability finding is valuable even if you never submit code. Please do not create artificial activity or superficial PRs.

Known limitations: early previews; no model calls, multi-user backend, or verified remote browser tests. The kit starts items in planning and does not publish content.
