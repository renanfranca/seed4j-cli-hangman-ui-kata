export const GameState = {
  InProgress: 'In progress',
  Won: 'Won',
  Lost: 'Lost',
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

export const GuessResult = {
  Correct: 'Correct',
  Incorrect: 'Incorrect',
  Duplicate: 'Duplicate',
  Invalid: 'Invalid',
  GameOver: 'Game over',
} as const;

export type GuessResult = (typeof GuessResult)[keyof typeof GuessResult];

export type HangmanSnapshot = Readonly<{
  gameState: GameState;
  guessesLeft: number;
  incorrectGuesses: readonly string[];
  maskedWord: string;
}>;

const isLetter = (character: string): boolean => /^[A-Z]$/.test(character);

export class Hangman {
  readonly secretWord: string;
  readonly maxIncorrectGuesses: number;

  private readonly correctGuesses = new Set<string>();
  private readonly missedLetters: string[] = [];
  private currentState: GameState = GameState.InProgress;

  constructor(secretWord: string, maxIncorrectGuesses: number) {
    const normalizedWord = secretWord.trim().toUpperCase();

    if (!normalizedWord || ![...normalizedWord].some(isLetter)) {
      throw new Error('The secret word must contain at least one letter.');
    }

    if (!Number.isInteger(maxIncorrectGuesses) || maxIncorrectGuesses < 1) {
      throw new Error('The incorrect guess limit must be a positive integer.');
    }

    this.secretWord = normalizedWord;
    this.maxIncorrectGuesses = maxIncorrectGuesses;
  }

  get gameState(): GameState {
    return this.currentState;
  }

  get isInProgress(): boolean {
    return this.currentState === GameState.InProgress;
  }

  get incorrectGuesses(): readonly string[] {
    return [...this.missedLetters];
  }

  get guessesLeft(): number {
    return this.maxIncorrectGuesses - this.missedLetters.length;
  }

  get maskedWord(): string {
    return [...this.secretWord].map(character => (!isLetter(character) || this.correctGuesses.has(character) ? character : '_')).join('');
  }

  guess(letter: string): GuessResult {
    const normalizedGuess = letter.toUpperCase();

    if (!isLetter(normalizedGuess)) {
      return GuessResult.Invalid;
    }

    if (!this.isInProgress) {
      return GuessResult.GameOver;
    }

    if (this.correctGuesses.has(normalizedGuess) || this.missedLetters.includes(normalizedGuess)) {
      return GuessResult.Duplicate;
    }

    const result = this.secretWord.includes(normalizedGuess) ? this.recordCorrectGuess(normalizedGuess) : this.recordMiss(normalizedGuess);
    this.updateGameState();

    return result;
  }

  snapshot(): HangmanSnapshot {
    return {
      gameState: this.gameState,
      guessesLeft: this.guessesLeft,
      incorrectGuesses: this.incorrectGuesses,
      maskedWord: this.maskedWord,
    };
  }

  private recordCorrectGuess(letter: string): GuessResult {
    this.correctGuesses.add(letter);
    return GuessResult.Correct;
  }

  private recordMiss(letter: string): GuessResult {
    this.missedLetters.push(letter);
    return GuessResult.Incorrect;
  }

  private updateGameState(): void {
    if (![...this.secretWord].some(character => isLetter(character) && !this.correctGuesses.has(character))) {
      this.currentState = GameState.Won;
    } else if (this.guessesLeft === 0) {
      this.currentState = GameState.Lost;
    }
  }
}
