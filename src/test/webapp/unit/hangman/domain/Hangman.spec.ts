import { describe, expect, it } from 'vitest';

import { Hangman } from '@/hangman/domain/Hangman';

describe('Hangman', () => {
  it('normalizes the secret word and masks each unguessed letter', () => {
    const game = new Hangman('pirate', 6);

    expect(game.secretWord).toBe('PIRATE');
    expect(game.maskedWord).toBe('— — — — — —');
    expect(game.state).toBe('in-progress');
  });

  it('reveals every occurrence of a correctly guessed letter', () => {
    const game = new Hangman('banana', 6);

    expect(game.guess('a')).toEqual({ kind: 'correct', letter: 'A' });
    expect(game.maskedWord).toBe('— A — A — A');
    expect(game.correctGuesses).toEqual(['A']);
  });

  it('records an incorrect guess and reduces the remaining guesses', () => {
    const game = new Hangman('pirate', 3);

    expect(game.guess('z')).toEqual({ kind: 'incorrect', letter: 'Z' });
    expect(game.incorrectGuesses).toEqual(['Z']);
    expect(game.guessesLeft).toBe(2);
  });

  it('rejects invalid input without changing the game', () => {
    const game = new Hangman('pirate', 3);

    expect(game.guess('7')).toEqual({ kind: 'invalid', letter: '7' });
    expect(game.incorrectGuesses).toEqual([]);
    expect(game.guessedLetters).toEqual([]);
  });

  it('returns a duplicate result for a previously guessed letter', () => {
    const game = new Hangman('pirate', 3);

    game.guess('P');
    game.guess('Z');

    expect(game.guess('p')).toEqual({ kind: 'duplicate', letter: 'P' });
    expect(game.guess('z')).toEqual({ kind: 'duplicate', letter: 'Z' });
  });

  it('wins when every distinct letter has been guessed', () => {
    const game = new Hangman('noon', 3);

    game.guess('N');
    game.guess('O');

    expect(game.state).toBe('won');
    expect(game.inProgress).toBe(false);
    expect(game.guessesLeft).toBe(3);
  });

  it('loses when its incorrect guess limit is reached', () => {
    const game = new Hangman('pirate', 2);

    game.guess('Z');
    expect(game.state).toBe('in-progress');
    game.guess('X');

    expect(game.state).toBe('lost');
    expect(game.guessesLeft).toBe(0);
    expect(game.guess('P')).toEqual({ kind: 'game-over', letter: 'P' });
  });

  it.each([
    ['', 'The secret word must contain at least one letter from A to Z.'],
    ['two words', 'The secret word must contain at least one letter from A to Z.'],
  ])('rejects an invalid secret word', (word, message) => {
    expect(() => new Hangman(word, 6)).toThrow(message);
  });

  it.each([0, -1, 1.5])('rejects an invalid incorrect guess limit', limit => {
    expect(() => new Hangman('pirate', limit)).toThrow('The incorrect guess limit must be a positive integer.');
  });
});
