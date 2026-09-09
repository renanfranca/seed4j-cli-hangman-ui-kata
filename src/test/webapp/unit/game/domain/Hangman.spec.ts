import { describe, expect, it } from 'vitest';

import { GameState, GuessResult, Hangman } from '@/game/domain/Hangman';

describe('Hangman', () => {
  it('starts an uppercase, masked game in progress', () => {
    const game = new Hangman('  blue-bird  ', 6);

    expect(game.secretWord).toBe('BLUE-BIRD');
    expect(game.maxIncorrectGuesses).toBe(6);
    expect(game.gameState).toBe(GameState.InProgress);
    expect(game.isInProgress).toBe(true);
    expect(game.maskedWord).toBe('____-____');
    expect(game.incorrectGuesses).toEqual([]);
    expect(game.guessesLeft).toBe(6);
  });

  it.each(['', '123', '---'])('rejects an invalid secret word: %s', secret => {
    expect(() => new Hangman(secret, 6)).toThrow('The secret word must contain at least one letter.');
  });

  it.each([0, -1, 1.5])('rejects an invalid guess limit: %s', limit => {
    expect(() => new Hangman('WORD', limit)).toThrow('The incorrect guess limit must be a positive integer.');
  });

  it('rejects anything other than one ASCII letter', () => {
    const game = new Hangman('WORD', 3);

    expect(game.guess('')).toBe(GuessResult.Invalid);
    expect(game.guess('AB')).toBe(GuessResult.Invalid);
    expect(game.guess('1')).toBe(GuessResult.Invalid);
    expect(game.snapshot()).toEqual({
      gameState: GameState.InProgress,
      guessesLeft: 3,
      incorrectGuesses: [],
      maskedWord: '____',
    });
  });

  it('reveals every instance of a correct letter and rejects its duplicate', () => {
    const game = new Hangman('Letter', 4);

    expect(game.guess('t')).toBe(GuessResult.Correct);
    expect(game.maskedWord).toBe('__TT__');
    expect(game.guess('T')).toBe(GuessResult.Duplicate);
    expect(game.guessesLeft).toBe(4);
  });

  it('records incorrect letters once and returns a defensive list', () => {
    const game = new Hangman('WORD', 3);

    expect(game.guess('x')).toBe(GuessResult.Incorrect);
    expect(game.guess('X')).toBe(GuessResult.Duplicate);
    expect(game.incorrectGuesses).toEqual(['X']);
    expect(game.guessesLeft).toBe(2);

    const copy = game.incorrectGuesses as string[];
    copy.push('Z');
    expect(game.incorrectGuesses).toEqual(['X']);
  });

  it('wins when all unique letters have been revealed', () => {
    const game = new Hangman('EYE', 2);

    expect(game.guess('e')).toBe(GuessResult.Correct);
    expect(game.guess('Y')).toBe(GuessResult.Correct);
    expect(game.gameState).toBe(GameState.Won);
    expect(game.isInProgress).toBe(false);
    expect(game.maskedWord).toBe('EYE');
    expect(game.guess('X')).toBe(GuessResult.GameOver);
  });

  it('loses exactly when the incorrect guess limit is reached', () => {
    const game = new Hangman('A', 2);

    expect(game.guess('X')).toBe(GuessResult.Incorrect);
    expect(game.gameState).toBe(GameState.InProgress);
    expect(game.guessesLeft).toBe(1);
    expect(game.guess('Y')).toBe(GuessResult.Incorrect);
    expect(game.gameState).toBe(GameState.Lost);
    expect(game.isInProgress).toBe(false);
    expect(game.guessesLeft).toBe(0);
  });
});
