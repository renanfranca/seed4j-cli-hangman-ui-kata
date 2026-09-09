# Hangman UI Kata

## Prerequisites

### Node.js and NPM

Before you can build this project, you must install and configure the following dependencies on your machine:

[Node.js](https://nodejs.org/): We use Node to run a development web server and build the project.
Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

```
npm install
```

## Play locally

Start the Vite development server:

```bash
npm start
```

Then open [http://localhost:9000](http://localhost:9000). The game chooses a new word for each round and accepts guesses
from either the on-screen keyboard or the letter input.

## Quality checks

```bash
npm test
npm run lint
npm run prettier:check
npm run build
```

The game rules live in the framework-independent `Hangman` class under `src/main/webapp/app/game/domain`. The React UI
renders a masked word, incorrect guesses, remaining attempts, the progressive drawing, and explicit win/loss states.

<!-- seed4j-needle-localEnvironment -->
<!-- seed4j-needle-startupCommand -->
<!-- seed4j-needle-documentation -->
