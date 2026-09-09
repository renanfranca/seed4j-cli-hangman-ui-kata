import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HomePage from '@/home/infrastructure/primary/HomePage';

const submitTypedGuess = (letter: string): void => {
  fireEvent.change(screen.getByLabelText('Your letter'), { target: { value: letter } });
  fireEvent.click(screen.getByRole('button', { name: 'Guess' }));
};

describe('Hangman game screen', () => {
  it('starts with a masked word and accepts correct and invalid typed guesses', () => {
    render(<HomePage initialSecretWord="EYE" />);

    expect(screen.getByRole('heading', { name: /read between.*lines/i })).toBeTruthy();
    expect(screen.getByLabelText('Word: ___')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByText('None yet')).toBeTruthy();

    submitTypedGuess('e');
    expect(screen.getByLabelText('Word: E_E')).toBeTruthy();
    expect(screen.getByText('Yes — E belongs in the word.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Guess E' }).getAttribute('disabled')).not.toBeNull();

    submitTypedGuess('1');
    expect(screen.getByText('Enter one letter from A to Z.')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
  });

  it('tracks misses and duplicate guesses without charging twice', () => {
    render(<HomePage initialSecretWord="CODE" />);

    fireEvent.click(screen.getByRole('button', { name: 'Guess X' }));
    expect(screen.getByText('No X. Keep reading the clues.')).toBeTruthy();
    expect(screen.getByLabelText('1 incorrect guesses')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();

    submitTypedGuess('x');
    expect(screen.getByText('You already tried X.')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('announces a win and can restart the round', () => {
    render(<HomePage initialSecretWord="A" />);

    fireEvent.click(screen.getByRole('button', { name: 'Guess A' }));
    expect(screen.getByText('You cracked it. Beautiful work!')).toBeTruthy();
    expect(screen.getByText('Won')).toBeTruthy();
    expect(screen.getByLabelText('Your letter').getAttribute('disabled')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Guess B' }).getAttribute('disabled')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /new word/i }));
    expect(screen.getByText('Fresh word. Take your first shot.')).toBeTruthy();
    expect(screen.getByText('In progress')).toBeTruthy();
    expect(screen.getByLabelText('Word: _')).toBeTruthy();
  });

  it('announces a loss, reveals the answer, and prevents more guesses', () => {
    render(<HomePage initialSecretWord="A" />);

    for (const letter of ['B', 'C', 'D', 'E', 'F', 'G']) {
      fireEvent.click(screen.getByRole('button', { name: `Guess ${letter}` }));
    }

    expect(screen.getByText('The word got away this time.')).toBeTruthy();
    expect(screen.getByText('Lost')).toBeTruthy();
    expect(screen.getByText('The word was', { exact: false }).textContent).toContain('A');
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByLabelText('6 incorrect guesses')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Guess' }).getAttribute('disabled')).not.toBeNull();
  });

  it('selects a different random word for an unconfigured new round', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<HomePage />);

    const firstWord = screen.getByLabelText(/^Word:/).getAttribute('aria-label');
    fireEvent.click(screen.getByRole('button', { name: /new word/i }));
    const nextWord = screen.getByLabelText(/^Word:/).getAttribute('aria-label');

    expect(nextWord).not.toBe(firstWord);
    vi.restoreAllMocks();
  });
});
