# Seed4J CLI Model Evaluation

## Protocol status

This protocol was frozen before opening implementation sources, tests, Seed4J histories, or transcript bodies. Result sections will be completed only after this commit. The evaluation compares how three Codex models used Seed4J CLI under one controlled prompt; without a no-Seed4J control, it cannot establish that Seed4J caused an outcome.

## Frozen experiment identity

- Repository: [`main`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/main)
- Specification commit: [`039472297f20bbae15143ae49fd0b36206d68d69`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/039472297f20bbae15143ae49fd0b36206d68d69)
- Specification path: [`SPEC.md`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/039472297f20bbae15143ae49fd0b36206d68d69/SPEC.md)
- Specification SHA-256: `c41b697d7eaffc8c65f9c7662f37c24babb73a1e92886f1c5351db2e712c5416`
- Common base: [branch](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/hangman-ui-kata-seed4j-base), [commit `a9679d07d66cca012784b4796a8e0505cb34f8a4`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/a9679d07d66cca012784b4796a8e0505cb34f8a4), [local skill tree](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/a9679d07d66cca012784b4796a8e0505cb34f8a4/.agents/skills/seed4j-cli)
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
| 1 | `luna-xhigh` | `gpt-5.6-luna` | [branch](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/hangman-ui-kata-luna-xhigh) | [implementation](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/3a3de0969e87f08d845e5702abeee4227b4c42c3) | [audit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/4e7a814af62f67bf90120a45516c142da38d543a) | passed |
| 2 | `terra-xhigh` | `gpt-5.6-terra` | [branch](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/hangman-ui-kata-terra-xhigh) | [implementation](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/a40a5d95d450270173790f18c582fcc6d1d060cb) | [audit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/428db51ed018f1f2e520dfd30fe0b9a38ca67523) | failed |
| 3 | `sol-xhigh` | `gpt-5.6-sol` | [branch](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/hangman-ui-kata-sol-xhigh) | [implementation](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/efdf2d2df9b72408a8190f5934d5c23433382f1b) | [audit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/96e4cc13f2ee260921dccbc7f8abbe0a6d7703f7) | passed |

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

All three pinned implementations passed the frozen public domain harness and the functional browser journey. Differences in the final scores come from Seed4J use, native test coverage, and design/reproducibility—not from discretionary bonuses or raw output size.

### Aggregate scorecard

| Rank | Alias | Seed4J / 35 | Specification / 30 | Tests / 20 | Design / 15 | Total / 100 |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | `terra-xhigh` | 35.00 | 30.00 | 19.06 | 15.00 | **99.06** |
| 2 | `sol-xhigh` | 34.00 | 30.00 | 20.00 | 14.50 | **98.50** |
| 3 | `luna-xhigh` | 33.00 | 30.00 | 12.49 | 14.50 | **89.99** |

The displayed values are rounded to two decimals. Calculations retain `27/17` per functional requirement and `8/17` per native-test requirement.

### Criterion allocation

| Criterion | Luna | Terra | Sol |
| --- | ---: | ---: | ---: |
| Discovery and help / 5 | 5 | 5 | 5 |
| Preflight and plan / 8 | 8 | 8 | 8 |
| Module choice and order / 8 | 7 | 8 | 8 |
| Explicit parameters / 7 | 7 | 7 | 7 |
| Reproducible history and wrapper / 7 | 6 | 7 | 6 |
| Functional requirements / 27 | 27 | 27 | 27 |
| Public/error contract / 3 | 3 | 3 | 3 |
| Native verification / 6 | 6 | 6 | 6 |
| Native requirement coverage / 8 | 4.235294117647059 | 7.058823529411765 | 8 |
| Boundary/failure coverage / 3 | 2.25 | 3 | 3 |
| Enforced coverage gate / 3 | 0 | 3 | 3 |
| Separation and clarity / 6 | 6 | 6 | 5.5 |
| Boundary robustness / 4 | 4 | 4 | 4 |
| Minimal public state/API / 3 | 2.5 | 3 | 3 |
| Conventional layout / 2 | 2 | 2 | 2 |

## Requirement-level acceptance

The common `BALLOON` harness exercised every domain rule through each implementation's public `Hangman` API. The browser harness exercised each actual UI through visible controls and assertions. A check mark means the same frozen observation passed; it does not mean that source inspection alone looked plausible.

| Requirement | Luna | Terra | Sol |
| --- | :---: | :---: | :---: |
| R1 uppercase secret | ✅ | ✅ | ✅ |
| R2 stored miss limit | ✅ | ✅ | ✅ |
| R3 initial in-progress state | ✅ | ✅ | ✅ |
| R4 guess accepts a letter and returns a result | ✅ | ✅ | ✅ |
| R5 invalid result | ✅ | ✅ | ✅ |
| R6 incorrect result and recorded miss | ✅ | ✅ | ✅ |
| R7 duplicate correct and incorrect guesses | ✅ | ✅ | ✅ |
| R8 win after all distinct letters | ✅ | ✅ | ✅ |
| R9 lose on exactly the miss limit | ✅ | ✅ | ✅ |
| R10 otherwise remain in progress | ✅ | ✅ | ✅ |
| R11 UI masked word initially and after guesses | ✅ | ✅ | ✅ |
| R12 UI incorrect-letter list | ✅ | ✅ | ✅ |
| R13 reveal every repeated occurrence | ✅ | ✅¹ | ✅ |
| R14 UI remaining guesses | ✅ | ✅ | ✅ |
| R15 UI win announcement | ✅ | ✅ | ✅ |
| R16 UI loss announcement | ✅ | ✅ | ✅ |
| R17 UI accepts guesses only in progress | ✅ | ✅ | ✅ |
| Public class/constructor contract | ✅ | ✅ | ✅ |
| Public guess/state/result observations | ✅ | ✅ | ✅ |
| Invalid input leaves state unchanged | ✅ | ✅ | ✅ |

¹ Terra's shipped UI always uses `PIRATE`, which has no repeated letter. Its executable `BALLOON` public-API harness revealed both `L` characters, and its browser flow proved that the UI renders changes from that same domain model. The frozen `02-correct-repeated-letter.png` therefore records Terra's closest actual UI state—a correct `P`—rather than inventing a different production word.

The native tests covered different portions of the same requirements:

- Luna: R1–R6 and R8–R10, or 9/17. R7 lacked a duplicate-incorrect test, and R11–R17 had no UI-facing native test.
- Terra: R1–R13, R15, and R16, or 15/17. Native UI tests did not assert zero remaining at loss (R14) or removal/disablement of guess controls after completion (R17).
- Sol: R1–R17, or 17/17.

## Per-run evidence

### Luna — `gpt-5.6-luna` / `xhigh`

The pinned snapshot is a Spring Boot 4.0.1 and Thymeleaf application. The domain and web layers are separate, and the actual server used deterministic session word rotation.

Evidence:

- Audit: [manifest](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/4e7a814af62f67bf90120a45516c142da38d543a/.seed4j-evaluation/run.json), [transcript](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/4e7a814af62f67bf90120a45516c142da38d543a/CONVERSATION_TRANSCRIPT.md)
- Seed4J history: [`.seed4j/modules`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/3a3de0969e87f08d845e5702abeee4227b4c42c3/.seed4j/modules)
- Build and wrapper: [`pom.xml`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/pom.xml), [`mvnw`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/mvnw), [`package.json`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/package.json)
- Production: [`Hangman.java`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/main/java/com/example/hangman/Hangman.java), [`HangmanController.java`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/main/java/com/example/hangman/HangmanController.java), [`GuessResult.java`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/main/java/com/example/hangman/GuessResult.java), [`GameStatus.java`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/main/java/com/example/hangman/GameStatus.java), [`index.html`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/main/resources/templates/index.html), [`application.css`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/main/resources/static/css/application.css)
- Tests: [`HangmanTest.java`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/test/java/com/example/hangman/HangmanTest.java)

Observed discovery and relevant help:

```bash
seed4j --version
seed4j list
seed4j --help
seed4j apply-set --help
seed4j apply maven-java --help
seed4j apply spring-boot --help
seed4j apply spring-boot-tomcat --help
seed4j apply spring-boot-thymeleaf --help
seed4j apply thymeleaf-template --help
```

The first plan omitted visible dependencies and supplied an unused `--end-of-line` option; it returned `Preflight: INVALID` with no changes. Luna corrected it before applying:

```bash
seed4j apply-set init maven-java java-base spring-boot spring-boot-mvc-empty spring-boot-tomcat logs-spy spring-boot-thymeleaf thymeleaf-template --plan --base-name=hangman --project-name='Hangman UI Kata' --package-name=com.example.hangman --server-port=8080 --spring-configuration-format=properties --node-package-manager=npm --indent-size=2

seed4j apply-set init maven-java java-base spring-boot spring-boot-mvc-empty spring-boot-tomcat logs-spy spring-boot-thymeleaf thymeleaf-template --base-name=hangman --project-name='Hangman UI Kata' --package-name=com.example.hangman --server-port=8080 --spring-configuration-format=properties --node-package-manager=npm --indent-size=2
```

Seed4J resolved the order to `init → maven-java → java-base → spring-boot → logs-spy → spring-boot-mvc-empty → spring-boot-thymeleaf → spring-boot-tomcat → thymeleaf-template`. Luna later inspected, planned, and applied `maven-wrapper`. All parameters recorded in history were explicit or stable module outputs: project name, base name, npm, indentation, Java package, properties format, and port.

Native verification:

| Command | Exit | Observed result | Warm elapsed |
| --- | ---: | --- | ---: |
| `./mvnw verify` | 0 | Maven unit and integration phases passed; 251 generated/application cases were reported, including 7 Hangman-specific tests. No JaCoCo or other enforced coverage gate exists. | 7.02 s |
| Frozen public harness | 0 | 2/2 `BALLOON` scenarios passed. | 5.56 s |
| Browser flow on port 18101 | 0 | All visible-state assertions passed; screenshots used `THYMELEAF` and `JAVACODE`. | 14.9 s |

### Terra — `gpt-5.6-terra` / `xhigh`

The pinned snapshot is a React 19.2.3 and Vite 7.3.0 application with a separate TypeScript domain class and a fixed `PIRATE` UI word.

Evidence:

- Audit: [manifest](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/428db51ed018f1f2e520dfd30fe0b9a38ca67523/.seed4j-evaluation/run.json), [transcript](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/428db51ed018f1f2e520dfd30fe0b9a38ca67523/CONVERSATION_TRANSCRIPT.md)
- Seed4J history: [`.seed4j/modules`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/a40a5d95d450270173790f18c582fcc6d1d060cb/.seed4j/modules)
- Build and lock: [`package.json`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/package.json), [`package-lock.json`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/package-lock.json), [`vitest.config.ts`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/vitest.config.ts)
- Production: [`Hangman.ts`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/src/main/webapp/app/hangman/domain/Hangman.ts), [`HomePage.tsx`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/src/main/webapp/app/home/infrastructure/primary/HomePage.tsx), [`HomePage.css`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/src/main/webapp/app/home/infrastructure/primary/HomePage.css)
- Tests: [domain](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/src/test/webapp/unit/hangman/domain/Hangman.spec.ts), [UI](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/src/test/webapp/unit/home/infrastructure/primary/HomePage.spec.tsx)

Observed discovery, help, planning, and apply:

```bash
seed4j --version
seed4j list
seed4j --help
seed4j apply react-core --help
seed4j apply react-core --plan --base-name hangmanui --project-path . --indent-size 2
seed4j apply-set --help
seed4j apply init --help
seed4j apply prettier --help
seed4j apply typescript --help

seed4j apply-set init prettier typescript react-core --plan --base-name hangmanui --project-name 'Hangman UI' --node-package-manager npm --end-of-line lf --indent-size 2 --project-path .

seed4j apply-set init prettier typescript react-core --base-name hangmanui --project-name 'Hangman UI' --node-package-manager npm --end-of-line lf --indent-size 2 --project-path .
```

The requested and resolved order was `init → prettier → typescript → react-core`. All four modules succeeded with one generated commit each and explicit project name, base name, package manager, end-of-line, indentation, and project path.

Native verification:

| Command | Exit | Observed result | Warm elapsed |
| --- | ---: | --- | ---: |
| `npm ci` | 0 | 484 packages installed from lockfile. | 3.39 s |
| `npm run prettier:check` | 0 | Formatting passed. | 0.86 s |
| `npm run lint` | 0 | ESLint passed. | 1.14 s |
| `npm run test:coverage` | 0 | 21/21 tests passed; 100% statements, branches, functions, and lines; per-file 100% thresholds enforced. | 4.19 s |
| `npm run build` | 0 | TypeScript and Vite production build passed. | 1.30 s |
| Frozen public harness | 0 | 2/2 `BALLOON` scenarios passed. | 3.62 s |
| Browser flow on port 18102 | 0 | Initial, correct, incorrect, invalid, duplicate, won, lost, and terminal-control assertions passed. | 3.5 s |

The preserved runner status is `failed` because the feature commit changed the frozen `SPEC.md` heading from Setext to ATX form, changing its SHA-256 to `ce699cbb63d31ce7cd781def9e794d826e88720f90b25258e3ae5f940b72f86d`. Compare the [feature commit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/a40a5d95d450270173790f18c582fcc6d1d060cb) with the [frozen specification](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/039472297f20bbae15143ae49fd0b36206d68d69/SPEC.md). This audit fact is preserved separately; runner status is not a scorecard criterion and did not replace observed behavioral scoring.

### Sol — `gpt-5.6-sol` / `xhigh`

The pinned snapshot is a React 19.2.3 and Vite 7.3.0 application with a separate TypeScript domain class, random word rotation, an SVG hangman figure, and keyboard plus text entry.

Evidence:

- Audit: [manifest](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/96e4cc13f2ee260921dccbc7f8abbe0a6d7703f7/.seed4j-evaluation/run.json), [transcript](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/96e4cc13f2ee260921dccbc7f8abbe0a6d7703f7/CONVERSATION_TRANSCRIPT.md)
- Seed4J history: [`.seed4j/modules`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/efdf2d2df9b72408a8190f5934d5c23433382f1b/.seed4j/modules)
- Build and lock: [`package.json`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/package.json), [`package-lock.json`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/package-lock.json), [`vitest.config.ts`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/vitest.config.ts)
- Production: [`Hangman.ts`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/src/main/webapp/app/game/domain/Hangman.ts), [`HomePage.tsx`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/src/main/webapp/app/home/infrastructure/primary/HomePage.tsx), [`HomePage.css`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/src/main/webapp/app/home/infrastructure/primary/HomePage.css)
- Tests: [domain](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/src/test/webapp/unit/game/domain/Hangman.spec.ts), [UI](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/src/test/webapp/unit/home/infrastructure/primary/HomePage.spec.tsx)

Observed discovery, help, and initial plan:

```bash
seed4j --version
seed4j --help
seed4j list
seed4j apply-set --help
seed4j apply init --help
seed4j apply prettier --help
seed4j apply typescript --help
seed4j apply react-core --help

seed4j apply-set init prettier typescript react-core --project-name 'Hangman UI Kata' --base-name hangman --node-package-manager npm --indent-size 2 --end-of-line lf --project-path . --plan
```

The first apply used the same arguments but failed at `init` because the generated Husky pre-commit hook could not find `lint-staged`; Seed4J correctly skipped the remaining modules. Sol inspected the partial output and history, ran `npm install`, replanned, and reapplied the same set. The eventual module commits were `init → prettier → typescript → react-core`, but the snapshot retains two `init` history records in the [initialization commit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/a0ac7d67c61e40074b2fd0c9294402b4195b6fb0).

Native verification:

| Command | Exit | Observed result | Warm elapsed |
| --- | ---: | --- | ---: |
| `npm ci` | 0 | 481 packages installed from lockfile. | 3.02 s |
| `npm run prettier:check` | 0 | Formatting passed. | 0.85 s |
| `npm run lint` | 0 | ESLint passed. | 1.16 s |
| `npm run test:coverage` | 0 | 17/17 tests passed; 100% statements, branches, functions, and lines; per-file 100% thresholds enforced. | 1.17 s |
| `npm run build` | 0 | TypeScript and Vite production build passed. | 1.31 s |
| Frozen public harness | 0 | 2/2 `BALLOON` scenarios passed. | 3.61 s |
| Browser flow on port 18103 | 0 | All visible-state assertions passed with deterministic `JAVASCRIPT` then `HEXAGON` selection. | 3.5 s |

## Deductions

Every deduction below belongs to a frozen criterion. The Terra `failed` audit status and all unweighted observations are intentionally absent from the arithmetic.

| Alias | Criterion | Lost | Direct reason and evidence |
| --- | --- | ---: | --- |
| Luna | Module choice/economy | 1.00 | `logs-spy` and its broad generated assertion/error infrastructure were unnecessary for this kata; see the [module history](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/tree/3a3de0969e87f08d845e5702abeee4227b4c42c3/.seed4j/modules). |
| Luna | Coherent module commits | 1.00 | The [`maven-wrapper` commit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/db19a76e9077fcc8a53c15e61f1ccb440ad682f4) also committed the domain, controller, UI, CSS, JavaScript, and tests; the named [feature commit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/3a3de0969e87f08d845e5702abeee4227b4c42c3) then changed only README. |
| Luna | Native requirement coverage | 3.764705882352941 | Only 9/17 requirements were asserted by [native Hangman tests](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/test/java/com/example/hangman/HangmanTest.java); the UI had no MVC/browser/component test. |
| Luna | Boundary/failure coverage | 0.75 | Native tests cover invalid input, duplicate-correct, and exact loss, but not duplicate-incorrect. |
| Luna | Enforced coverage gate | 3.00 | The pinned [`pom.xml`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/pom.xml) has no JaCoCo or equivalent threshold. |
| Luna | Minimal API | 0.50 | The [domain API](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/3a3de0969e87f08d845e5702abeee4227b4c42c3/src/main/java/com/example/hangman/Hangman.java) exposes duplicate `guess`/`Guess` and overlapping status helpers beyond the required observation surface. |
| Terra | Native requirement coverage | 0.941176470588235 | The [UI tests](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/a40a5d95d450270173790f18c582fcc6d1d060cb/src/test/webapp/unit/home/infrastructure/primary/HomePage.spec.tsx) cover 15/17 requirements but do not assert R14's zero-at-loss display or R17's terminal guess-control state. |
| Sol | Coherent module commits | 1.00 | A failed first apply and retry left two `init` history records in one [module commit](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/commit/a0ac7d67c61e40074b2fd0c9294402b4195b6fb0). |
| Sol | UI cohesion | 0.50 | [`HomePage.tsx`](https://github.com/renanfranca/seed4j-cli-hangman-ui-kata/blob/efdf2d2df9b72408a8190f5934d5c23433382f1b/src/main/webapp/app/home/infrastructure/primary/HomePage.tsx) combines word selection, round orchestration, feedback mapping, figure construction, input handling, and page rendering in one 243-line module. |

## Comparisons

### Same-model effort comparison

Unavailable. Each model appears at only one effort level (`xhigh`), so no within-model effort effect can be estimated.

### Same-effort model comparison

All three models ran at `xhigh`. Terra's economical first-pass Seed4J history and nearly complete native requirement coverage produced the highest score. Sol had the only complete native requirement coverage but retained a duplicated `init` history record after recovering from a hook failure and concentrated more UI responsibilities in one component. Luna's executable behavior was complete, but its native tests stopped at the domain boundary and its Maven build enforced no coverage threshold.

These are observations of three single runs, not estimates of general model quality.

## Implementation overview

| Alias | Stack | Domain approach | UI approach | Notable robustness |
| --- | --- | --- | --- | --- |
| Luna | Java 25, Spring Boot, Thymeleaf, Maven | Private sets, defensive list views, computed state, exception after terminal state | Server-rendered form with session-scoped round and deterministic word rotation | Rejects invalid configuration; invalid/duplicate guesses do not mutate; HTTP form disappears at terminal state |
| Terra | TypeScript, React, Vite, npm | Private word/limit, defensive arrays, computed state | Fixed `PIRATE`, keyboard and text form, CSS gallows | Trims guesses, returns `game-over` after terminal state, constructor validates integer limit |
| Sol | TypeScript, React, Vite, npm | Readonly public identity, private sets/arrays, explicit current state and snapshot | Randomized word rotation, SVG figure, keyboard and text form | Defensive incorrect list, terminal controls disabled, punctuation in secret words remains visible |

The common harness also confirmed lowercase normalization, state safety after invalid input, no duplicate charge, repeated-letter reveal, and exact loss transitions in all three snapshots.

## Screenshot evidence

All files below were produced from the actual pinned applications through Playwright and system Chrome. Each has a valid PNG signature, RGB color, and dimensions `1440 × 1000`. Visual inspection confirmed legible state changes.

| Path | SHA-256 |
| --- | --- |
| [`luna-xhigh/01-initial.png`](evidence/screenshots/luna-xhigh/01-initial.png) | `c88e221f597a32cdeb77e2180cbb028658f93b4693d84b6e535bba71cb99f1b7` |
| [`luna-xhigh/02-correct-repeated-letter.png`](evidence/screenshots/luna-xhigh/02-correct-repeated-letter.png) | `aa6fe4c869f985e8ac784f6183027147cb4c49ae47eba3fb87efa8d203b564cf` |
| [`luna-xhigh/03-incorrect-guess.png`](evidence/screenshots/luna-xhigh/03-incorrect-guess.png) | `c45e792030e53dde9273123881ed325dba8ab3d1ff2bf99d7be23e06f762bc5e` |
| [`luna-xhigh/04-invalid-guess.png`](evidence/screenshots/luna-xhigh/04-invalid-guess.png) | `1f713a1b6034a3a3ea412c83b26f86ac2584de5d14bb6f2f277d8034fedef141` |
| [`luna-xhigh/05-duplicate-guess.png`](evidence/screenshots/luna-xhigh/05-duplicate-guess.png) | `3dd1ed9be4621bfd6056dfffb533a05bed960e9157d843009fe3256b48d3519e` |
| [`luna-xhigh/06-won.png`](evidence/screenshots/luna-xhigh/06-won.png) | `f170bb3c581a0e662d908b091f60a3fe1016057e8b63b276003f326962106871` |
| [`luna-xhigh/07-lost.png`](evidence/screenshots/luna-xhigh/07-lost.png) | `608046ef78d010ae027f231b36c6ba335c05f1fbcd89101769e00321c72d8b04` |
| [`terra-xhigh/01-initial.png`](evidence/screenshots/terra-xhigh/01-initial.png) | `c58375c0da4de528449b051f38ae5e47ee14173030f3603cff57e50f3736b0de` |
| [`terra-xhigh/02-correct-repeated-letter.png`](evidence/screenshots/terra-xhigh/02-correct-repeated-letter.png) | `309a2c05809725605d064f5dd8f90a6d7316babea87b599edd9f37e6ea57554d` |
| [`terra-xhigh/03-incorrect-guess.png`](evidence/screenshots/terra-xhigh/03-incorrect-guess.png) | `34307cc458789481b2125e96206d6819a55fc93c57105ae9aba2db492cef40a6` |
| [`terra-xhigh/04-invalid-guess.png`](evidence/screenshots/terra-xhigh/04-invalid-guess.png) | `0b0be89955ca5e543bc9cd5ca47bfd181d2213401a359a683e3b38e1e023e593` |
| [`terra-xhigh/05-duplicate-guess.png`](evidence/screenshots/terra-xhigh/05-duplicate-guess.png) | `8497e2470fc7ebc80b96884c60f6b08eb6bd0cd760796d526c1e062e4a891e9d` |
| [`terra-xhigh/06-won.png`](evidence/screenshots/terra-xhigh/06-won.png) | `55bd7da1448b74c11d9b742f7a234789d1caebae3910bf218fc27290736979de` |
| [`terra-xhigh/07-lost.png`](evidence/screenshots/terra-xhigh/07-lost.png) | `d7b54bb45984239408cc91f3fb93a19800a5864d7451c1b2c09f55116052cf5f` |
| [`sol-xhigh/01-initial.png`](evidence/screenshots/sol-xhigh/01-initial.png) | `4c8afe184cd80e77208c8abcb3431d041bf3d3c2d67a72656b1ecb57e3369908` |
| [`sol-xhigh/02-correct-repeated-letter.png`](evidence/screenshots/sol-xhigh/02-correct-repeated-letter.png) | `d8a9e6935d86dd30f1e35e80067edd708bd70d1590bc1bd63323def3c1eff339` |
| [`sol-xhigh/03-incorrect-guess.png`](evidence/screenshots/sol-xhigh/03-incorrect-guess.png) | `ad29a37a7816a319f32b127ec41cd870045411eadda73d94460d435073c37194` |
| [`sol-xhigh/04-invalid-guess.png`](evidence/screenshots/sol-xhigh/04-invalid-guess.png) | `50a6920632246361247d03f70cd58657dbb097cccacc278f5aaf3184e97bec17` |
| [`sol-xhigh/05-duplicate-guess.png`](evidence/screenshots/sol-xhigh/05-duplicate-guess.png) | `a067a8d936680b3164b51a56b411481b9cc5b2890097d1a056b7e830a31f7eb3` |
| [`sol-xhigh/06-won.png`](evidence/screenshots/sol-xhigh/06-won.png) | `72ef269bf9b97cb42623d4fa5ef9c946757353604bd74f95abaaf1b75e230b77` |
| [`sol-xhigh/07-lost.png`](evidence/screenshots/sol-xhigh/07-lost.png) | `642321d0bc9deebf4318c2e5479fcb60d311428e7999574ef65e6a12d739a166` |

Screenshots are unweighted evidence. They were added to the evaluation branch under the user's explicit delivery-boundary override; no result branch was changed.

## Unweighted observations

The scoped line counts below include each model's game domain, primary UI source/style, and game-specific test files; they exclude generated framework support and binary assets.

| Alias | Production lines | Test lines | Native game tests | Transcript lines | Transcript bytes | Last ordinal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Luna | 932 | 92 | 7 | 6,020 | 426,951 | 507 |
| Terra | 609 | 173 | 21 | 3,453 | 221,195 | 301 |
| Sol | 971 | 168 | 17 | 5,244 | 1,273,482 | 524 |

The transcript exports explicitly exclude lifecycle and usage metadata. Token counts and monetary cost are therefore unavailable, not zero. Validation timings above are warm, single observations and are not scored.

## Limitations

- Cache warming: runs were sequential and shared host-level Maven/npm caches; elapsed time is not an independent performance comparison.
- Sequential order: Luna ran first, Terra second, and Sol third. Later runs may have benefited from warmed dependencies or general host state.
- Host dependence: evaluation used Linux, Java `25.0.2`, Node.js `24.16.0`, npm `11.13.0`, Python Playwright, and system Chrome. Different platforms can change installation and rendering.
- Transcript schema/format: exports preserve visible messages and tool interactions but exclude private reasoning, system/developer context, lifecycle data, usage, and secrets. Their Markdown fence/serialization details and embedded-output sizes differ.
- Shared-remote discoverability: result branches share one public remote. A later task could discover earlier branch names or commits even though every run started from the same base and was not given earlier implementation content.
- Sample size: there is one run per model and one effort level. Scores describe these snapshots only.
- Terra screenshot constraint: the fixed production word has no repeated character, so the repeated-letter browser frame is not directly observable; public domain behavior and ordinary UI propagation were tested separately.
- Unavailable data: token usage, cost, and cold-cache timings were not present in the audit artifacts.

## Reproduction

An exact reproduction starts from the pinned base, preserves the local skill already there, and creates a new branch and Codex task. Do not add the skill to `main` and do not overwrite the frozen skill with a newer one.

```bash
git clone https://github.com/renanfranca/seed4j-cli-hangman-ui-kata.git
cd seed4j-cli-hangman-ui-kata
git fetch --no-tags origin \
  refs/heads/hangman-ui-kata-seed4j-base:refs/remotes/origin/hangman-ui-kata-seed4j-base
git switch --create <new-run-branch> origin/hangman-ui-kata-seed4j-base

test -f .agents/skills/seed4j-cli/SKILL.md
sha256sum SPEC.md
npm install -g seed4j-cli@0.0.4
seed4j --version
git status --short --branch
```

Expected frozen identities:

```text
SPEC.md SHA-256:
c41b697d7eaffc8c65f9c7662f37c24babb73a1e92886f1c5351db2e712c5416

Base commit:
a9679d07d66cca012784b4796a8e0505cb34f8a4

Seed4J CLI / runtime / mode:
0.0.4 / 2.2.0 / standard

Seed4J skill tree SHA-256:
93b17f5b4a53d747f2b33f815984c56b297f52859b1f1825f8cce44eadba078c
```

Start or restart Codex from the repository root so it activates `.agents/skills/seed4j-cli`. Select a new model and effort, create a new task, and send exactly:

```text
Implement the specification in SPEC.md. A functional user interface of your choice is a mandatory deliverable. Use the already-installed Seed4J CLI tool as support.
```

Do not expose prior implementation branches or transcripts to that task. When it completes, preserve the snapshot before evaluation. Run its native verification, inspect `git log` and `.seed4j/modules`, and optionally repeat the frozen public harness from this report in a disposable extraction.

For a new, deliberately unpinned experiment, install the latest CLI and then install its bundled local skill:

```bash
npm install -g seed4j-cli
seed4j skill install
```

A changed CLI/runtime, skill tree, base, prompt, model, or effort belongs to a new matrix entry and must not be presented as an exact replay.

Authoritative references: [Seed4J CLI](https://github.com/seed4j/seed4j-cli) and [official OpenAI documentation for building skills](https://learn.chatgpt.com/docs/build-skills).
