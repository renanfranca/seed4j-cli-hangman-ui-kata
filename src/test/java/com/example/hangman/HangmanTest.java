package com.example.hangman;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;

import org.junit.jupiter.api.Test;

@UnitTest
class HangmanTest {

  @Test
  void startsWithAnUppercaseMaskedWordAndAllGuessesAvailable() {
    Hangman game = new Hangman("bell", 3);

    assertThat(game.getSecretWord()).isEqualTo("BELL");
    assertThat(game.getMaskedWord()).isEqualTo("----");
    assertThat(game.getIncorrectGuesses()).isEmpty();
    assertThat(game.getGuessesLeft()).isEqualTo(3);
    assertThat(game.isGameInProgress()).isTrue();
    assertThat(game.toString()).isEqualTo("Status:GameIsOn;Word:----;Guesses:;Guesses left:3");
  }

  @Test
  void correctGuessRevealsEveryMatchingLetter() {
    Hangman game = new Hangman("BELL", 3);

    assertThat(game.guess("l")).isEqualTo(GuessResult.CorrectGuess);
    assertThat(game.getMaskedWord()).isEqualTo("--LL");
    assertThat(game.getIncorrectGuesses()).isEmpty();
    assertThat(game.getGuessedLetters()).containsExactly("L");
  }

  @Test
  void incorrectGuessConsumesOneMissAndIsListedOnce() {
    Hangman game = new Hangman("BELL", 3);

    assertThat(game.guess("x")).isEqualTo(GuessResult.IncorrectGuess);
    assertThat(game.getIncorrectGuesses()).containsExactly("X");
    assertThat(game.getGuessesLeft()).isEqualTo(2);
    assertThat(game.getMaskedWord()).isEqualTo("----");
  }

  @Test
  void invalidAndDuplicateGuessesDoNotChangeTheRound() {
    Hangman game = new Hangman("BELL", 3);

    assertThat(game.guess("#")).isEqualTo(GuessResult.InvalidGuess);
    assertThat(game.guess("BB")).isEqualTo(GuessResult.InvalidGuess);
    assertThat(game.guess("l")).isEqualTo(GuessResult.CorrectGuess);
    assertThat(game.guess("L")).isEqualTo(GuessResult.DuplicateGuess);
    assertThat(game.getGuessedLetters()).containsExactly("L");
    assertThat(game.getGuessesLeft()).isEqualTo(3);
  }

  @Test
  void losesAfterTheConfiguredNumberOfIncorrectGuesses() {
    Hangman game = new Hangman("BELL", 3);

    game.guess("X");
    game.guess("Y");
    assertThat(game.guess("Z")).isEqualTo(GuessResult.IncorrectGuess);

    assertThat(game.isLost()).isTrue();
    assertThat(game.isInProgress()).isFalse();
    assertThat(game.getGuessesLeft()).isZero();
    assertThat(game.toString()).isEqualTo("Status:GameLost;Word:----;Guesses:X Y Z;Guesses left:0");
    assertThatIllegalStateException().isThrownBy(() -> game.guess("B"));
  }

  @Test
  void winsWhenTheLastUnknownLetterIsFound() {
    Hangman game = new Hangman("BELL", 3);

    game.guess("X");
    game.guess("L");
    game.guess("B");
    assertThat(game.guess("E")).isEqualTo(GuessResult.CorrectGuess);

    assertThat(game.isWon()).isTrue();
    assertThat(game.getMaskedWord()).isEqualTo("BELL");
    assertThat(game.toString()).isEqualTo("Status:GameWon;Word:BELL;Guesses:X L B E;Guesses left:2");
    assertThatIllegalStateException().isThrownBy(() -> game.guess("B"));
  }

  @Test
  void rejectsInvalidGameConfiguration() {
    assertThatIllegalArgumentException().isThrownBy(() -> new Hangman(null, 3));
    assertThatIllegalArgumentException().isThrownBy(() -> new Hangman("BELL", 0));
    assertThatIllegalArgumentException().isThrownBy(() -> new Hangman("B-LL", 3));
  }
}
