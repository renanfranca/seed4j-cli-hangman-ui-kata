import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage, { resultMessage } from '@/home/infrastructure/primary/HomePage';

describe('HomePage', () => {
  it('displays a masked word and the available guesses at the start', () => {
    render(<HomePage />);

    expect(screen.getByLabelText('Masked word: — — — — — —')).toBeTruthy();
    expect(screen.getByText('6 guesses left')).toBeTruthy();
    expect(screen.getByLabelText('Incorrect guesses').textContent).toBe('None yet');
  });

  it('unmasks a correct letter from the on-screen keyboard', () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole('button', { name: 'P' }));

    expect(screen.getByLabelText('Masked word: P — — — — —')).toBeTruthy();
    expect(screen.getByText('Good eye — P is in the word.')).toBeTruthy();
  });

  it('shows an incorrect guess and decrements the number of guesses left', () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Z' }));

    expect(screen.getByLabelText('Incorrect guesses').textContent).toBe('Z');
    expect(screen.getByText('5 guesses left')).toBeTruthy();
  });

  it('accepts a letter from the text entry control', () => {
    render(<HomePage />);

    fireEvent.change(screen.getByLabelText('Letter guess'), { target: { value: 'i' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Guess letter' }).closest('form')!);

    expect(screen.getByLabelText('Masked word: — I — — — —')).toBeTruthy();
  });

  it('explains invalid and duplicate input from the text entry control', () => {
    render(<HomePage />);

    fireEvent.submit(screen.getByRole('button', { name: 'Guess letter' }).closest('form')!);
    expect(screen.getByText('Enter one letter from A to Z.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'P' }));
    fireEvent.change(screen.getByLabelText('Letter guess'), { target: { value: 'p' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Guess letter' }).closest('form')!);

    expect(screen.getByText('P has already been guessed.')).toBeTruthy();
  });

  it('announces a win after all of the unique letters are guessed', () => {
    render(<HomePage />);

    for (const letter of 'PIRATE') {
      fireEvent.click(screen.getByRole('button', { name: letter }));
    }

    expect(screen.getByText('You saved the day!')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'New game' })).toBeTruthy();
  });

  it('announces a loss and reveals the word when no guesses remain', () => {
    render(<HomePage />);

    for (const letter of 'BCDFGH') {
      fireEvent.click(screen.getByRole('button', { name: letter }));
    }

    expect(screen.getByText('The rope wins this round.')).toBeTruthy();
    expect(screen.getByText(/The word was PIRATE/)).toBeTruthy();
  });

  it('starts a fresh round after a completed game', () => {
    render(<HomePage />);

    for (const letter of 'PIRATE') {
      fireEvent.click(screen.getByRole('button', { name: letter }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'New game' }));

    expect(screen.getByLabelText('Masked word: — — — — — —')).toBeTruthy();
    expect(screen.getByText('A fresh word is ready. Choose a letter to begin.')).toBeTruthy();
  });

  it('has feedback for a guess submitted after a game is over', () => {
    expect(resultMessage({ kind: 'game-over', letter: 'P' })).toBe('This round has ended. Start a new game to play again.');
  });
});
