// -------------------------
// Section Transition Helpers
// -------------------------
function transitionToSection(fromId, toId) {
  document.getElementById(fromId).classList.add("hidden");
  document.getElementById(toId).classList.remove("hidden");
}

// -------------------------
// Introduction → Riddle Section
// -------------------------
document.getElementById("start-button").addEventListener("click", function() {
  transitionToSection("section-intro", "section-riddle");
});

// -------------------------
// Riddle Challenge Logic
// -------------------------
document.getElementById("riddle-submit").addEventListener("click", function() {
  const answerInput = document.getElementById("riddle-answer");
  const answer = answerInput.value.trim().toLowerCase();
  const errorMsg = document.getElementById("riddle-error");
  // Expected answer is "love"
  if (answer === "love") {
    errorMsg.classList.add("hidden");
    transitionToSection("section-riddle", "section-memory");
    initializeMemoryGame();
  } else {
    errorMsg.classList.remove("hidden");
  }
});

// -------------------------
// Memory Match Game Logic
// -------------------------
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;

function initializeMemoryGame() {
  const symbols = ["❤️", "💖", "🌹", "😊"];
  let cardSymbols = symbols.concat(symbols); // Create pairs
  cardSymbols.sort(() => 0.5 - Math.random()); // Shuffle array

  const grid = document.getElementById("memory-grid");
  grid.innerHTML = ""; // Clear grid

  cardSymbols.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card", "bg-red-100");
    card.setAttribute("data-symbol", symbol);
    card.textContent = ""; // Face-down card
    card.addEventListener("click", handleCardClick);
    grid.appendChild(card);
  });
}

function handleCardClick(e) {
  if (lockBoard) return;
  const card = e.currentTarget;
  if (card.classList.contains("flipped")) return;

  flipCard(card);

  if (!firstCard) {
    firstCard = card;
    return;
  }
  secondCard = card;
  lockBoard = true;
  checkForMatch();
}

function flipCard(card) {
  card.classList.add("flipped");
  card.textContent = card.getAttribute("data-symbol");
  card.classList.remove("bg-red-100");
  card.classList.add("bg-white");
}

function unflipCard(card) {
  card.classList.remove("flipped");
  card.textContent = "";
  card.classList.remove("bg-white");
  card.classList.add("bg-red-100");
}

function checkForMatch() {
  const symbol1 = firstCard.getAttribute("data-symbol");
  const symbol2 = secondCard.getAttribute("data-symbol");

  if (symbol1 === symbol2) {
    // Match found: disable further clicks on these cards
    firstCard.removeEventListener("click", handleCardClick);
    secondCard.removeEventListener("click", handleCardClick);
    resetMemoryBoard();
    matchesFound++;
    // When all 4 pairs are found, reveal continue button
    if (matchesFound === 4) {
      setTimeout(() => {
        document.getElementById("memory-continue").classList.remove("hidden");
      }, 500);
    }
  } else {
    setTimeout(() => {
      unflipCard(firstCard);
      unflipCard(secondCard);
      resetMemoryBoard();
    }, 1000);
  }
}

function resetMemoryBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// Transition from Memory Game to Story Section
document.getElementById("memory-continue").addEventListener("click", function() {
  transitionToSection("section-memory", "section-story");
});

// -------------------------
// Interactive Story Logic
// -------------------------
const storyContent = document.getElementById("story-content");
const storyChoices = document.querySelectorAll(".story-choice");
const storyContinueButton = document.getElementById("story-continue");

storyChoices.forEach(button => {
  button.addEventListener("click", function() {
    const choice = this.getAttribute("data-choice");
    if (choice === "first") {
      storyContent.innerHTML = "<p>I remember the day we first met; your smile lit up the room and made my heart skip a beat.</p>";
    } else if (choice === "adventure") {
      storyContent.innerHTML = "<p>Every adventure we embarked on filled my soul with colors so vivid that time stood still.</p>";
    }
    // Prevent further choices and reveal the Continue button
    storyChoices.forEach(btn => btn.disabled = true);
    storyContinueButton.classList.remove("hidden");
  });
});

storyContinueButton.addEventListener("click", function() {
  transitionToSection("section-story", "section-final");
});

// -------------------------
// Final Revelation & Celebration Animation
// -------------------------
document.getElementById("final-yes").addEventListener("click", function() {
  launchCelebration();
});

// Function to create and animate confetti using GSAP
function launchCelebration() {
  const celebrationContainer = document.getElementById("celebration");
  celebrationContainer.style.height = "100vh"; // Expand container
  const confettiCount = 100;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    // Random starting position and color
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = Math.random() * -100 + "px";
    confetti.style.backgroundColor = getRandomColor();
    celebrationContainer.appendChild(confetti);
  }
  // Animate the confetti falling and spinning
  gsap.to(".confetti", {
    y: "110vh",
    rotation: 360,
    duration: 3,
    ease: "power4.out",
    stagger: {
      each: 0.005,
      from: "random"
    }
  });
}

function getRandomColor() {
  const colors = ["#FF5733", "#FFC300", "#DAF7A6", "#FF33F6", "#C70039", "#900C3F", "#581845"];
  return colors[Math.floor(Math.random() * colors.length)];
} 
