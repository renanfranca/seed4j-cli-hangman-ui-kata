const guessInput = document.querySelector("[data-guess-input]");

if (guessInput) {
  guessInput.addEventListener("input", () => {
    guessInput.value = guessInput.value.replace(/[^a-z]/gi, "").slice(0, 1).toUpperCase();
  });
}
