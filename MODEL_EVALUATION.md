# Seed4J CLI Model Evaluation

## Protocol status

This protocol was frozen before opening implementation sources, tests, Seed4J histories, or transcript bodies. Result sections will be completed only after this commit. The evaluation compares how three Codex models used Seed4J CLI under one controlled prompt; without a no-Seed4J control, it cannot establish that Seed4J caused an outcome.

## Frozen experiment identity

- Repository: `https://github.com/renanfranca/seed4j-cli-hangman-ui-kata`
- Specification commit: `039472297f20bbae15143ae49fd0b36206d68d69`
- Specification path: `SPEC.md`
- Specification SHA-256: `c41b697d7eaffc8c65f9c7662f37c24babb73a1e92886f1c5351db2e712c5416`
- Common base commit: `a9679d07d66cca012784b4796a8e0505cb34f8a4`
- Seed4J CLI: `0.0.4`
- Seed4J runtime: `2.2.0` (`standard` mode)
- Repository-local Seed4J skill tree SHA-256: `93b17f5b4a53d747f2b33f815984c56b297f52859b1f1825f8cce44eadba078c`
- Prompt SHA-256: `80c82afba7367009ffe60d8b1fe656c48334889eeab9c0a61a4d5b5aefe711b0`

The shared prompt is English and was supplied verbatim to every run:

```text
Implement the specification in SPEC.md. A functional user interface of your choice is a mandatory deliverable. Use the already-installed Seed4J CLI tool as support.
```

## Frozen model matrix

All runs used `xhigh` reasoning effort and executed sequentially in the declared order from the same base commit.

| Order | Alias | Model | Result branch | Implementation commit | Audit head | Runner status |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `luna-xhigh` | `gpt-5.6-luna` | `hangman-ui-kata-luna-xhigh` | `3a3de0969e87f08d845e5702abeee4227b4c42c3` | `4e7a814af62f67bf90120a45516c142da38d543a` | passed |
| 2 | `terra-xhigh` | `gpt-5.6-terra` | `hangman-ui-kata-terra-xhigh` | `a40a5d95d450270173790f18c582fcc6d1d060cb` | `428db51ed018f1f2e520dfd30fe0b9a38ca67523` | failed |
| 3 | `sol-xhigh` | `gpt-5.6-sol` | `hangman-ui-kata-sol-xhigh` | `efdf2d2df9b72408a8190f5934d5c23433382f1b` | `96e4cc13f2ee260921dccbc7f8abbe0a6d7703f7` | passed |

Runner status is preserved as audit evidence and does not determine the evaluation score.

## Frozen acceptance requirements — 30 points

Each functional requirement is worth exactly `27/17` points (approximately `1.588235294117647`); calculations retain the fraction so the subtotal is exactly 27 points.

| ID | Publicly observable requirement | Points |
| --- | --- | ---: |
| R1 | Construction stores the secret word in uppercase. | 27/17 |
| R2 | Construction stores the configured incorrect-guess limit. | 27/17 |
| R3 | A new game reports an in-progress state. | 27/17 |
| R4 | `Guess` accepts one letter and returns a result. | 27/17 |
| R5 | A character outside the implementation's documented valid alphabet returns an invalid result. | 27/17 |
| R6 | A valid letter absent from the word returns incorrect and is recorded among incorrect guesses. | 27/17 |
| R7 | Repeating a previously correct or incorrect letter returns duplicate. | 27/17 |
| R8 | Guessing every distinct letter in the word wins the game. | 27/17 |
| R9 | Reaching exactly the configured incorrect-guess limit loses the game. | 27/17 |
| R10 | Before either terminal condition, the state remains in progress. | 27/17 |
| R11 | The UI shows the masked word initially and after every guess, with correct positions revealed. | 27/17 |
| R12 | The UI shows the list of incorrectly guessed letters. | 27/17 |
| R13 | A correct guess reveals every occurrence of that letter. | 27/17 |
| R14 | The UI shows remaining guesses as positive until the guess that loses the game. | 27/17 |
| R15 | The UI announces a win. | 27/17 |
| R16 | The UI announces a loss. | 27/17 |
| R17 | The UI accepts new guesses only while the game is in progress. | 27/17 |

The separate three-point public/error contract awards one point each for:

1. a public `Hangman` class whose constructor accepts a secret word and incorrect-guess limit;
2. public guess, state, and result observation surfaces sufficient to exercise the specified behavior;
3. invalid input returns the invalid result without corrupting game state.

## Frozen common acceptance protocol

Every implementation is pinned by full commit SHA, extracted into its own `mktemp -d` directory with `git archive`, and evaluated without checking out or modifying its result branch. Harness adapters may be added only inside the disposable extraction.

### Domain scenario

Use the public API with secret `BALLOON` and incorrect-guess limit `3`:

1. Assert uppercase storage, limit storage, initial masked form, no incorrect guesses, three remaining guesses, and in-progress state.
2. Submit invalid input and assert an invalid result with no state mutation.
3. Guess `L`; assert correct and that both `L` positions are revealed.
4. Guess `L` again; assert duplicate and no remaining-guess charge.
5. Guess `X`; assert incorrect, recorded, two guesses remaining, and in-progress state.
6. Guess `X` again; assert duplicate and no remaining-guess charge.
7. Guess the remaining distinct letters and assert the won state.
8. In a fresh game, make three distinct incorrect guesses and assert that the state changes to lost on exactly the third miss, with zero remaining guesses.

API adapters may translate naming and enum/string representations, but pass/fail is determined only from executable caller-visible behavior.

### Browser UI scenario and screenshots

Run each actual application on an isolated local port. Use Chromium through Playwright with a `1440 × 1000` viewport, device scale factor 1, animations/transitions disabled, and deterministic word selection where the application permits it without production changes. Assert the visible state before capturing these stable PNGs:

1. `01-initial.png`
2. `02-correct-repeated-letter.png`
3. `03-incorrect-guess.png`
4. `04-invalid-guess.png`
5. `05-duplicate-guess.png`
6. `06-won.png`
7. `07-lost.png`

If a required state cannot be produced, capture the actual UI and record the failed assertion. Screenshots are evidence, not scored artwork. Their PNG signature, dimensions, SHA-256, and visual legibility will be checked. The user-authorized evidence boundary stores them under `evidence/screenshots/<alias>/` in this evaluation branch.

## Frozen scorecard — 100 points

### Seed4J effectiveness — 35 points

- Discovery and help — 5: observed version (1), global catalog/help (2), relevant module help before selection (2).
- Preflight and plan — 8: read-only plan before apply (3), dependency/provider/path evaluation (3), parameter and Git-state evaluation (2).
- Module choice and order — 8: specification fit (4), dependency-safe order (3), economy (1).
- Explicit parameters — 7: required values (4), reproducibility-relevant values (3).
- Reproducible history and wrapper — 7: `.seed4j/modules` (2), coherent module commits (2), appropriate wrapper (2), usable clean extraction (1).

### Specification correctness — 30 points

- R1–R17 — 27 points exactly, allocated as `27/17` each.
- Public/error contract — 3 points, allocated as the three one-point items above.

### Test quality — 20 points

- Native verification — 6: full command succeeds (6), tests pass but another native gate fails (3), tests fail or cannot run (0).
- Requirement coverage — 8: `8 × covered requirements / 17`, based on behavior-facing native tests.
- Boundary/failure coverage — 3: invalid input, duplicate-correct, duplicate-incorrect, and exact loss boundary are worth 0.75 each.
- Enforced coverage gate — 3: meaningful line and branch thresholds (3), partial threshold enforcement (1.5), report-only or absent (0).

### Design and reproducibility — 15 points

- Separation and clarity — 6: domain/UI separation (2), cohesion (2), clarity (2).
- Boundary robustness — 4: invalid state safety (1), duplicate guesses do not consume attempts (1), repeated-letter behavior (1), exact loss transition (1).
- Minimal public state/API — 3: no public mutable state (1.5), minimal API (1.5).
- Conventional layout — 2: conventional source/test/build placement (1), wrapper/lock/metadata reproducibility (1).

All deductions require direct immutable artifacts, transcript commands, native command results, or common acceptance observations. Timing, token/cost data, transcript size/format, source/test size, test count, screenshots, and extra robustness observations remain unweighted. Exact ties are preserved and ordered by execution index.

## Results

Pending evidence inspection after the protocol commit.
