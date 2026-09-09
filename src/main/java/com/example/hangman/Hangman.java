package com.example.hangman;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * The domain model for one hangman round.
 *
 * <p>The model keeps the order in which letters were attempted. That makes the state easy to
 * inspect in a console or web client while keeping repeated guesses unambiguous.
 */
public final class Hangman {

  private final String secretWord;
  private final int incorrectGuessLimit;
  private final Set<Character> guessedLetters = new LinkedHashSet<>();
  private final Set<Character> incorrectGuesses = new LinkedHashSet<>();

  public Hangman(String secretWord, int incorrectGuessLimit) {
    if (secretWord == null || secretWord.isBlank()) {
      throw new IllegalArgumentException("The secret word must not be blank");
    }

    String normalizedWord = secretWord.strip().toUpperCase(Locale.ROOT);
    if (!normalizedWord.matches("[A-Z]+")) {
      throw new IllegalArgumentException("The secret word must contain only letters A-Z");
    }
    if (incorrectGuessLimit <= 0) {
      throw new IllegalArgumentException("The incorrect guess limit must be positive");
    }

    this.secretWord = normalizedWord;
    this.incorrectGuessLimit = incorrectGuessLimit;
  }

  /** Attempts one letter, returning an outcome without changing state for invalid or duplicate input. */
  public GuessResult guess(String letter) {
    ensureRoundIsInProgress();

    if (letter == null || letter.length() != 1 || !isAsciiLetter(letter.charAt(0))) {
      return GuessResult.InvalidGuess;
    }

    char normalizedLetter = Character.toUpperCase(letter.charAt(0));
    if (guessedLetters.contains(normalizedLetter)) {
      return GuessResult.DuplicateGuess;
    }

    guessedLetters.add(normalizedLetter);
    if (!secretWord.contains(String.valueOf(normalizedLetter))) {
      incorrectGuesses.add(normalizedLetter);
      return GuessResult.IncorrectGuess;
    }

    return GuessResult.CorrectGuess;
  }

  /** Compatibility with the kata's original C#-style method name. */
  public GuessResult Guess(String letter) {
    return guess(letter);
  }

  public String getSecretWord() {
    return secretWord;
  }

  public int getIncorrectGuessLimit() {
    return incorrectGuessLimit;
  }

  public int getGuessesLeft() {
    return incorrectGuessLimit - incorrectGuesses.size();
  }

  public List<String> getIncorrectGuesses() {
    return asStrings(incorrectGuesses);
  }

  public List<String> getGuessedLetters() {
    return asStrings(guessedLetters);
  }

  public String getMaskedWord() {
    StringBuilder maskedWord = new StringBuilder(secretWord.length());
    for (int index = 0; index < secretWord.length(); index++) {
      char letter = secretWord.charAt(index);
      maskedWord.append(guessedLetters.contains(letter) ? letter : '-');
    }
    return maskedWord.toString();
  }

  public GameStatus getStatus() {
    if (isWordRevealed()) {
      return GameStatus.GameWon;
    }
    if (incorrectGuesses.size() >= incorrectGuessLimit) {
      return GameStatus.GameLost;
    }
    return GameStatus.GameIsOn;
  }

  public boolean isInProgress() {
    return getStatus() == GameStatus.GameIsOn;
  }

  public boolean isGameInProgress() {
    return isInProgress();
  }

  public boolean isWon() {
    return getStatus() == GameStatus.GameWon;
  }

  public boolean isLost() {
    return getStatus() == GameStatus.GameLost;
  }

  @Override
  public String toString() {
    return "Status:%s;Word:%s;Guesses:%s;Guesses left:%d".formatted(
      getStatus(),
      getMaskedWord(),
      String.join(" ", getGuessedLetters()),
      getGuessesLeft()
    );
  }

  private void ensureRoundIsInProgress() {
    if (!isInProgress()) {
      throw new IllegalStateException("The hangman round is already over");
    }
  }

  private boolean isWordRevealed() {
    for (int index = 0; index < secretWord.length(); index++) {
      if (!guessedLetters.contains(secretWord.charAt(index))) {
        return false;
      }
    }
    return true;
  }

  private static boolean isAsciiLetter(char letter) {
    return letter >= 'A' && letter <= 'Z' || letter >= 'a' && letter <= 'z';
  }

  private static List<String> asStrings(Set<Character> letters) {
    return letters.stream().map(String::valueOf).toList();
  }
}
