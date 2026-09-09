package com.example.hangman;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/** Web entry point for playing a round of hangman. */
@Controller
public class HangmanController {

  private static final String GAME_KEY = HangmanController.class.getName() + ".game";
  private static final String WORD_INDEX_KEY = HangmanController.class.getName() + ".wordIndex";
  private static final int INCORRECT_GUESS_LIMIT = 6;
  private static final List<String> WORDS = List.of("SPRING", "BROWSER", "THYMELEAF", "JAVACODE", "PUZZLE", "REFACTOR");

  @GetMapping({ "/", "/index" })
  public String index(HttpSession session, Model model) {
    Hangman game = gameFor(session);
    model.addAttribute("game", game);
    return "index";
  }

  @PostMapping("/guess")
  public String guess(
    @RequestParam(name = "letter", required = false, defaultValue = "") String letter,
    HttpSession session,
    RedirectAttributes redirectAttributes
  ) {
    Hangman game = gameFor(session);
    try {
      redirectAttributes.addFlashAttribute("lastResult", game.guess(letter));
    } catch (IllegalStateException exception) {
      redirectAttributes.addFlashAttribute("roundMessage", "This round is already complete. Start a new game to keep playing.");
    }
    return "redirect:/";
  }

  @PostMapping("/new-game")
  public String newGame(HttpSession session) {
    Object currentWordIndex = session.getAttribute(WORD_INDEX_KEY);
    int nextWordIndex = ((currentWordIndex instanceof Integer index ? index : 0) + 1) % WORDS.size();
    session.setAttribute(WORD_INDEX_KEY, nextWordIndex);
    session.setAttribute(GAME_KEY, new Hangman(WORDS.get(nextWordIndex), INCORRECT_GUESS_LIMIT));
    return "redirect:/";
  }

  private Hangman gameFor(HttpSession session) {
    Hangman game = (Hangman) session.getAttribute(GAME_KEY);
    if (game == null) {
      session.setAttribute(WORD_INDEX_KEY, 0);
      game = new Hangman(WORDS.get(0), INCORRECT_GUESS_LIMIT);
      session.setAttribute(GAME_KEY, game);
    }
    return game;
  }
}
