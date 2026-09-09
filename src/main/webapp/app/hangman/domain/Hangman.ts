export type GameState = 'in-progress' | 'won' | 'lost';

export type GuessResult =
  | { kind: 'correct'; letter: string }
  | { kind: 'incorrect'; letter: string }
  | { kind: 'duplicate'; letter: string }
  | { kind: 'invalid'; letter: string }
  | { kind: 'game-over'; letter: string };

const LETTER = /^[A-Z]$/;

/**
 * The game rules and state for a single round of Hangman.
 *
 * A round accepts only one alphabetic letter per guess. Guesses are normalized
 * to upper case so that the UI can treat keyboard and button input alike.
 */
export class Hangman {
  private readonly word: string;
  private readonly incorrectGuessLimit: number;
  private readonly correctLetters = new Set<string>();
  private readonly wrongLetters: string[] = [];

  constructor(secretWord: string, incorrectGuessLimit: number) {
    const normalizedWord = secretWord.trim().toUpperCase();

    if (!/^[A-Z]+$/.test(normalizedWord)) {
      throw new Error('The secret word must contain at least one letter from A to Z.');
    }

    if (!Number.isInteger(incorrectGuessLimit) || incorrectGuessLimit < 1) {
      throw new Error('The incorrect guess limit must be a positive integer.');
    }

    this.word = normalizedWord;
    this.incorrectGuessLimit = incorrectGuessLimit;
  }

  get secretWord(): string {
    return this.word;
  }

  get state(): GameState {
    if (this.hasGuessedEveryLetter) {
      return 'won';
    }

    if (this.wrongLetters.length >= this.incorrectGuessLimit) {
      return 'lost';
    }

    return 'in-progress';
  }

  get inProgress(): boolean {
    return this.state === 'in-progress';
  }

  get incorrectGuesses(): readonly string[] {
    return [...this.wrongLetters];
  }

  get correctGuesses(): readonly string[] {
    return [...this.correctLetters];
  }

  get guessedLetters(): readonly string[] {
    return [...this.correctLetters, ...this.wrongLetters];
  }

  get incorrectGuessCount(): number {
    return this.wrongLetters.length;
  }

  get guessesLeft(): number {
    return Math.max(0, this.incorrectGuessLimit - this.wrongLetters.length);
  }

  get maskedWord(): string {
    return [...this.word].map(letter => (this.correctLetters.has(letter) ? letter : '—')).join(' ');
  }

  guess(rawLetter: string): GuessResult {
    const letter = rawLetter.trim().toUpperCase();

    if (!LETTER.test(letter)) {
      return { kind: 'invalid', letter };
    }

    if (!this.inProgress) {
      return { kind: 'game-over', letter };
    }

    if (this.correctLetters.has(letter) || this.wrongLetters.includes(letter)) {
      return { kind: 'duplicate', letter };
    }

    if (this.word.includes(letter)) {
      this.correctLetters.add(letter);
      return { kind: 'correct', letter };
    }

    this.wrongLetters.push(letter);
    return { kind: 'incorrect', letter };
  }

  private get hasGuessedEveryLetter(): boolean {
    return [...new Set(this.word)].every(letter => this.correctLetters.has(letter));
  }
}
