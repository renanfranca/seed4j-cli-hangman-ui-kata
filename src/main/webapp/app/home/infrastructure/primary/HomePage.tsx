import { type FormEvent, useState } from 'react';

import { type GuessResult, Hangman } from '@/hangman/domain/Hangman';

import './HomePage.css';

const SECRET_WORD = 'PIRATE';
const INCORRECT_GUESS_LIMIT = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function resultMessage(result: GuessResult): string {
  switch (result.kind) {
    case 'correct':
      return `Good eye — ${result.letter} is in the word.`;
    case 'incorrect':
      return `Not this time — ${result.letter} is not in the word.`;
    case 'duplicate':
      return `${result.letter} has already been guessed.`;
    case 'invalid':
      return 'Enter one letter from A to Z.';
    case 'game-over':
      return 'This round has ended. Start a new game to play again.';
  }
}

function HomePage() {
  const [game, setGame] = useState(() => new Hangman(SECRET_WORD, INCORRECT_GUESS_LIMIT));
  const [entry, setEntry] = useState('');
  const [feedback, setFeedback] = useState('Choose a letter to begin your voyage.');
  const [, setRevision] = useState(0);

  const makeGuess = (letter: string) => {
    const result = game.guess(letter);
    setFeedback(resultMessage(result));
    setRevision(revision => revision + 1);
  };

  const submitGuess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    makeGuess(entry);
    setEntry('');
  };

  const startNewGame = () => {
    setGame(new Hangman(SECRET_WORD, INCORRECT_GUESS_LIMIT));
    setEntry('');
    setFeedback('A fresh word is ready. Choose a letter to begin.');
  };

  const gameComplete = !game.inProgress;

  return (
    <main className="game-shell">
      <section className="game-card" aria-labelledby="game-title">
        <header className="game-header">
          <p className="eyebrow">A small game of nerve</p>
          <h1 id="game-title">Hangman</h1>
          <p className="subtitle">Find the hidden word before the rope runs out.</p>
        </header>

        <div className="game-board">
          <section className="gallows-panel" aria-label={`${game.incorrectGuessCount} incorrect guesses`}>
            <div className="gallows" aria-hidden="true">
              <div className="gallows-base" />
              <div className="gallows-pole" />
              <div className="gallows-beam" />
              <div className="gallows-rope" />
              {game.incorrectGuessCount >= 1 && <div className="figure-head" />}
              {game.incorrectGuessCount >= 2 && <div className="figure-body" />}
              {game.incorrectGuessCount >= 3 && <div className="figure-arm figure-arm-left" />}
              {game.incorrectGuessCount >= 4 && <div className="figure-arm figure-arm-right" />}
              {game.incorrectGuessCount >= 5 && <div className="figure-leg figure-leg-left" />}
              {game.incorrectGuessCount >= 6 && <div className="figure-leg figure-leg-right" />}
            </div>
            <p className="gallows-caption">{game.guessesLeft} guesses left</p>
          </section>

          <section className="word-panel" aria-label="Game status">
            <p className="word-label">The hidden word</p>
            <output className="masked-word" aria-label={`Masked word: ${game.maskedWord}`}>
              {game.maskedWord}
            </output>

            <div className="wrong-guesses">
              <p>Missed letters</p>
              <output aria-label="Incorrect guesses">
                {game.incorrectGuesses.length > 0 ? game.incorrectGuesses.join(' · ') : 'None yet'}
              </output>
            </div>

            {game.state === 'won' && (
              <div className="outcome outcome-won" role="status">
                <strong>You saved the day!</strong> The word is complete.
              </div>
            )}
            {game.state === 'lost' && (
              <div className="outcome outcome-lost" role="status">
                <strong>The rope wins this round.</strong> The word was {game.secretWord}.
              </div>
            )}
          </section>
        </div>

        <p className="feedback" role="status">
          {feedback}
        </p>

        {!gameComplete && (
          <form className="guess-form" onSubmit={submitGuess}>
            <label htmlFor="letter-guess">Make a guess</label>
            <div className="guess-controls">
              <input
                id="letter-guess"
                aria-label="Letter guess"
                autoComplete="off"
                maxLength={1}
                onChange={event => setEntry(event.target.value.toUpperCase())}
                placeholder="A"
                value={entry}
              />
              <button type="submit">Guess letter</button>
            </div>
          </form>
        )}

        <div className="letter-grid" aria-label="Letter keyboard">
          {ALPHABET.map(letter => {
            const hasBeenGuessed = game.guessedLetters.includes(letter);
            return (
              <button
                className={hasBeenGuessed ? 'letter-button letter-button-used' : 'letter-button'}
                disabled={gameComplete || hasBeenGuessed}
                key={letter}
                onClick={() => makeGuess(letter)}
                type="button"
              >
                {letter}
              </button>
            );
          })}
        </div>

        {gameComplete && (
          <button className="new-game-button" onClick={startNewGame} type="button">
            New game
          </button>
        )}
      </section>
    </main>
  );
}

export default HomePage;
