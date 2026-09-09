import './HomePage.css';

import { type FormEvent, useMemo, useState } from 'react';

import { GameState, GuessResult, Hangman, type HangmanSnapshot } from '@/game/domain/Hangman';

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const WORDS = ['JAVASCRIPT', 'HEXAGON', 'KEYBOARD', 'REFACTOR', 'WORKFLOW', 'BLUEPRINT'];
const MAX_INCORRECT_GUESSES = 6;

type HomePageProps = Readonly<{
  initialSecretWord?: string;
}>;

type Round = Readonly<{
  game: Hangman;
  revision: number;
}>;

const createRound = (secretWord: string): Round => {
  const game = new Hangman(secretWord, MAX_INCORRECT_GUESSES);
  return { game, revision: 0 };
};

const pickWord = (previousWord?: string): string => {
  const availableWords = WORDS.filter(word => word !== previousWord);
  return availableWords[Math.floor(Math.random() * availableWords.length)];
};

const resultMessage = (result: GuessResult, letter: string): string => {
  const messages: Record<GuessResult, string> = {
    [GuessResult.Correct]: `Yes — ${letter} belongs in the word.`,
    [GuessResult.Incorrect]: `No ${letter}. Keep reading the clues.`,
    [GuessResult.Duplicate]: `You already tried ${letter}.`,
    [GuessResult.Invalid]: 'Enter one letter from A to Z.',
    [GuessResult.GameOver]: 'This round is already complete.',
  };

  return messages[result];
};

const roundMessage = (snapshot: HangmanSnapshot, feedback: string): string => {
  if (snapshot.gameState === GameState.Won) {
    return 'You cracked it. Beautiful work!';
  }

  if (snapshot.gameState === GameState.Lost) {
    return 'The word got away this time.';
  }

  return feedback;
};

type HangmanFigureProps = Readonly<{
  incorrectCount: number;
  maximumIncorrect: number;
}>;

function HangmanFigure({ incorrectCount, maximumIncorrect }: HangmanFigureProps) {
  const visibleParts = Math.ceil((incorrectCount / maximumIncorrect) * 6);
  const partClass = (partNumber: number) => `person-part ${partNumber <= visibleParts ? 'is-visible' : ''}`;

  return (
    <svg className="hangman-figure" viewBox="0 0 320 300" role="img" aria-label={`${incorrectCount} incorrect guesses`}>
      <path className="gallows" d="M42 270H278M92 270V32H224M92 76L136 32M224 32V66" />
      <circle className={partClass(1)} cx="224" cy="94" r="28" />
      <path className={partClass(2)} d="M224 122V198" />
      <path className={partClass(3)} d="M224 146L181 172" />
      <path className={partClass(4)} d="M224 146L267 172" />
      <path className={partClass(5)} d="M224 198L187 244" />
      <path className={partClass(6)} d="M224 198L261 244" />
    </svg>
  );
}

function HomePage({ initialSecretWord }: HomePageProps) {
  const [round, setRound] = useState<Round>(() => createRound(initialSecretWord ?? pickWord()));
  const [letterInput, setLetterInput] = useState('');
  const [feedback, setFeedback] = useState('Choose a letter to begin.');
  const snapshot = round.game.snapshot();
  const triedLetters = useMemo(
    () =>
      new Set(
        round.game.secretWord
          .split('')
          .filter(letter => snapshot.maskedWord.includes(letter) || snapshot.incorrectGuesses.includes(letter)),
      ),
    [round],
  );

  const submitGuess = (rawGuess: string): void => {
    const letter = rawGuess.toUpperCase();
    const result = round.game.guess(letter);

    setRound({ game: round.game, revision: round.revision + 1 });
    setFeedback(resultMessage(result, letter));
    setLetterInput('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submitGuess(letterInput);
  };

  const startNewRound = (): void => {
    setRound(createRound(initialSecretWord ?? pickWord(round.game.secretWord)));
    setFeedback('Fresh word. Take your first shot.');
    setLetterInput('');
  };

  const incorrectCount = snapshot.incorrectGuesses.length;
  const gameComplete = !round.game.isInProgress;
  const message = roundMessage(snapshot, feedback);

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="#game" aria-label="Hangman home">
          <span className="brand-mark" aria-hidden="true">
            H
          </span>
          <span>Hangman</span>
        </a>
        <span className="edition">WORD GAME · 01</span>
      </header>

      <main id="game" className="game-layout">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">Six misses. One mystery.</p>
          <h1 id="page-title">
            Read between
            <br />
            the lines.
          </h1>
          <p className="intro-copy">Reveal the hidden word before the drawing is complete. Every letter matters.</p>
        </section>

        <section className={`game-card state-${snapshot.gameState.toLowerCase().replace(' ', '-')}`} aria-label="Hangman game">
          <div className="figure-panel">
            <div className="figure-heading">
              <span>THE GALLOWS</span>
              <span>
                {String(incorrectCount).padStart(2, '0')} / {String(MAX_INCORRECT_GUESSES).padStart(2, '0')}
              </span>
            </div>
            <HangmanFigure incorrectCount={incorrectCount} maximumIncorrect={MAX_INCORRECT_GUESSES} />
            <div className="remaining-block">
              <strong>{snapshot.guessesLeft}</strong>
              <span>
                guesses
                <br />
                remaining
              </span>
            </div>
          </div>

          <div className="play-panel">
            <div className="status-row">
              <span className="status-dot" aria-hidden="true" />
              <span>{snapshot.gameState}</span>
            </div>

            <div className="word-area" aria-label={`Word: ${snapshot.maskedWord}`}>
              {[...snapshot.maskedWord].map((character, index) => (
                <span className={`letter-tile ${character === '_' ? '' : 'is-revealed'}`} key={`${index}-${character}`}>
                  {character === '_' ? <span className="visually-hidden">hidden letter</span> : character}
                </span>
              ))}
            </div>

            <p className="feedback" aria-live="polite">
              {message}
            </p>
            {snapshot.gameState === GameState.Lost && (
              <p className="answer">
                The word was <strong>{round.game.secretWord}</strong>.
              </p>
            )}

            <div className="missed-section">
              <span className="section-label">Incorrect letters</span>
              <div className="missed-list" aria-label="Incorrect letters">
                {snapshot.incorrectGuesses.length === 0 ? (
                  <span className="empty-misses">None yet</span>
                ) : (
                  snapshot.incorrectGuesses.map(letter => <span key={letter}>{letter}</span>)
                )}
              </div>
            </div>

            <form className="guess-form" onSubmit={handleSubmit}>
              <label htmlFor="letter-guess">Your letter</label>
              <div className="input-row">
                <input
                  id="letter-guess"
                  value={letterInput}
                  onChange={event => setLetterInput(event.target.value)}
                  maxLength={1}
                  inputMode="text"
                  autoComplete="off"
                  disabled={gameComplete}
                  aria-describedby="guess-hint"
                />
                <button type="submit" disabled={gameComplete}>
                  Guess
                </button>
              </div>
              <span id="guess-hint" className="visually-hidden">
                Enter a single letter from A to Z.
              </span>
            </form>

            <div className="keyboard" aria-label="Letter keyboard">
              {ALPHABET.map(letter => (
                <button
                  type="button"
                  className="key"
                  key={letter}
                  onClick={() => submitGuess(letter)}
                  disabled={gameComplete || triedLetters.has(letter)}
                  aria-label={`Guess ${letter}`}
                >
                  {letter}
                </button>
              ))}
            </div>

            <button className="new-round" type="button" onClick={startNewRound}>
              <span aria-hidden="true">↻</span> New word
            </button>
          </div>
        </section>
      </main>

      <footer>
        <span>Built for curious minds</span>
        <span>Type. Guess. Repeat.</span>
      </footer>
    </div>
  );
}

export default HomePage;
