// Test log to confirm the script is loaded
console.log("scripts.js loaded successfully!");

// Main JavaScript for the Valentine Website

document.addEventListener("DOMContentLoaded", function() {

  // --- Section Transition Helper ---
  function transitionToSection(fromId, toId) {
    document.getElementById(fromId).classList.add("hidden");
    document.getElementById(toId).classList.remove("hidden");
  }

  // --- Floating Hearts in Background ---
  function createFloatingHearts() {
    const container = document.getElementById("floating-hearts");
    const numHearts = 20; // Adjust the number for desired density
    for (let i = 0; i < numHearts; i++) {
      const heart = document.createElement("div");
      heart.classList.add("floating-heart");
      // Randomize heart size between 1.5rem to 2.5rem
      heart.style.fontSize = 1.5 + Math.random() + "rem";
      heart.style.opacity = 0.5 + Math.random() * 0.5;
      heart.textContent = "❤️";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = Math.random() * 100 + "%";
      container.appendChild(heart);
      // Animate each heart to float upward continuously
      gsap.to(heart, {
        y: -window.innerHeight,
        repeat: -1,
        duration: 15 + Math.random() * 10,
        ease: "linear",
        delay: Math.random() * 5,
      });
    }
  }
  // Create floating hearts on page load
  createFloatingHearts();

  // --- Start Button: Go to Riddles ---
  document.getElementById("start-button").addEventListener("click", function() {
    transitionToSection("section-intro", "section-riddle");
    displayCurrentRiddle();
  });

  // --- Multi-Riddle Challenge ---
  const riddles = [
    {
      question:
        "I can be round, square, or heart-shaped, white or dark, big or small, and on Valentine's Day, I am loved by all. What am I?",
      answer: "chocolate",
    },
    {
      question:
        "I am a petal of passion, a token of affection carved from thorns; my fragrance whispers tales of desire. What am I?",
      answer: "rose",
    },
    {
      question:
        "I am the silent rhythm in every heartbeat, an invisible force that binds every smile. What am I?",
      answer: "love",
    },
  ];
  let currentRiddleIndex = 0;

  function displayCurrentRiddle() {
    const riddleQuestionEl = document.getElementById("riddle-question");
    riddleQuestionEl.textContent = riddles[currentRiddleIndex].question;
    document.getElementById("riddle-answer").value = "";
    document.getElementById("riddle-error").classList.add("hidden");
  }

  document.getElementById("riddle-submit").addEventListener("click", function() {
    const answerInput = document.getElementById("riddle-answer");
    const userAnswer = answerInput.value.trim().toLowerCase();
    const errorMsg = document.getElementById("riddle-error");
    if (userAnswer === riddles[currentRiddleIndex].answer) {
      // Correct: Move to next riddle or next section if done
      currentRiddleIndex++;
      if (currentRiddleIndex < riddles.length) {
        displayCurrentRiddle();
      } else {
        // After all riddles, proceed to Memory Match Game
        transitionToSection("section-riddle", "section-memory");
        initializeMemoryGame();
      }
    } else {
      errorMsg.classList.remove("hidden");
    }
  });

  // --- Memory Match Game Logic ---
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchesFound = 0;

  function initializeMemoryGame() {
    const symbols = ["❤️", "💖", "🌹", "😊"];
    let cardSymbols = symbols.concat(symbols); // 4 pairs
    cardSymbols.sort(() => 0.5 - Math.random());

    const grid = document.getElementById("memory-grid");
    grid.innerHTML = "";
    matchesFound = 0;

    cardSymbols.forEach((symbol) => {
      const card = document.createElement("div");
      card.classList.add(
        "card",
        "bg-red-100",
        "p-4",
        "flex",
        "items-center",
        "justify-center",
        "text-3xl",
        "cursor-pointer",
        "select-none"
      );
      card.setAttribute("data-symbol", symbol);
      card.textContent = "";
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
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      resetMemoryBoard();
      matchesFound++;
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

  document.getElementById("memory-continue").addEventListener("click", function() {
    transitionToSection("section-memory", "section-gallery");
    animateGallery();
  });

  // --- Gallery Animation ---
  function animateGallery() {
    gsap.to("#gallery img", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    });
  }

  document.getElementById("gallery-continue").addEventListener("click", function() {
    transitionToSection("section-gallery", "section-final");
    animateFinalQuestion();
  });

  // --- Final Dramatic Revelation ---
  function animateFinalQuestion() {
    gsap.fromTo(
      "#final-question",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
    );
  }

  document.getElementById("final-yes").addEventListener("click", function() {
    launchCelebration();
  });

  // --- Celebration Animation (Confetti) ---
  function launchCelebration() {
    const celebrationContainer = document.getElementById("celebration");
    celebrationContainer.style.height = "100vh";
    const confettiCount = 100;
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = Math.random() * -100 + "px";
      confetti.style.backgroundColor = getRandomColor();
      celebrationContainer.appendChild(confetti);
    }
    gsap.to(".confetti", {
      y: "110vh",
      rotation: 360,
      duration: 3,
      ease: "power4.out",
      stagger: {
        each: 0.005,
        from: "random",
      },
    });
  }

  function getRandomColor() {
    const colors = ["#FF5733", "#FFC300", "#DAF7A6", "#FF33F6", "#C70039", "#900C3F", "#581845"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}); 
