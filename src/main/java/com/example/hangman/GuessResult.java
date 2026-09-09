package com.example.hangman;

/** The outcome of one attempted letter. */
public enum GuessResult {
  InvalidGuess,
  IncorrectGuess,
  CorrectGuess,
  DuplicateGuess;
}
