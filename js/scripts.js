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
    const numHearts = 20;
    for (let i = 0; i < numHearts; i++) {
      const heart = document.createElement("div");
      heart.classList.add("floating-heart");
      heart.style.fontSize = (1.5 + Math.random()) + "rem";
      heart.style.opacity = 0.5 + Math.random() * 0.5;
      heart.textContent = "❤️";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = Math.random() * 100 + "%";
      container.appendChild(heart);
      gsap.to(heart, {
        y: -window.innerHeight,
        repeat: -1,
        duration: 15 + Math.random() * 10,
        ease: "linear",
        delay: Math.random() * 5,
      });
    }
  }
  createFloatingHearts();

  // --- Start Button: Go to Riddles ---
  document.getElementById("start-button").addEventListener("click", function() {
    transitionToSection("section-intro", "section-riddle");
    displayCurrentRiddle();
  });

  // --- Multi-Riddle Challenge using a Card ---
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
    gsap.set("#riddle-card", { x: "0%", opacity: 1 });
  }

  document.getElementById("riddle-submit").addEventListener("click", function() {
    const answerInput = document.getElementById("riddle-answer");
    const userAnswer = answerInput.value.trim().toLowerCase();
    const errorMsg = document.getElementById("riddle-error");
    if (userAnswer === riddles[currentRiddleIndex].answer) {
      // Animate card sliding out to the left
      gsap.to("#riddle-card", {
        x: "-100%",
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: function () {
          currentRiddleIndex++;
          if (currentRiddleIndex < riddles.length) {
            displayCurrentRiddle();
            // Animate card sliding in from the right
            gsap.fromTo("#riddle-card", { x: "100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" });
          } else {
            // All riddles answered; move to Memory Match Game
            transitionToSection("section-riddle", "section-memory");
            initializeMemoryGame();
          }
        },
      });
    } else {
      errorMsg.classList.remove("hidden");
    }
  });

  // --- Memory Match Game Logic Using Gallery Images ---
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchesFound = 0;

  function initializeMemoryGame() {
    // Use 8 images from the gallery to create 8 pairs (16 cards total)
    const memoryImages = [
      "images/image1.jpg",
      "images/image2.jpg",
      "images/image3.jpg",
      "images/image4.jpg",
      "images/image5.heif",
      "images/image6.jpg",
      "images/image7.jpg",
      "images/image8.jpg",
    ];
    const cardImages = memoryImages.concat(memoryImages); // duplicate for pairs
    cardImages.sort(() => 0.5 - Math.random());
    const grid = document.getElementById("memory-grid");
    grid.innerHTML = "";
    matchesFound = 0;
    cardImages.forEach((imgSrc) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-img", imgSrc);
      const imgElement = document.createElement("img");
      imgElement.src = imgSrc;
      imgElement.alt = "Memory Card";
      // Start with the image hidden (back side is shown via CSS)
      imgElement.classList.add("hidden");
      card.appendChild(imgElement);
      card.addEventListener("click", handleCardClick);
      grid.appendChild(card);
    });
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function handleCardClick(e) {
    if (lockBoard) return;
    const card = e.currentTarget;
    if (card === firstCard) return;
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
    const img = card.querySelector("img");
    img.classList.remove("hidden");
    card.classList.add("flipped");
    gsap.fromTo(card, { rotationY: 0 }, { rotationY: 180, duration: 0.5, ease: "power2.out" });
  }

  function unflipCard(card) {
    const img = card.querySelector("img");
    card.classList.remove("flipped");
    gsap.to(card, {
      rotationY: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        img.classList.add("hidden");
      },
    });
  }

  function checkForMatch() {
    const img1 = firstCard.getAttribute("data-img");
    const img2 = secondCard.getAttribute("data-img");
    if (img1 === img2) {
      firstCard.removeEventListener("click", handleCardClick);
      secondCard.removeEventListener("click", handleCardClick);
      resetMemoryBoard();
      matchesFound++;
      if (matchesFound === 8) {
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

  // --- Gallery Animation for Masonry Grid ---
  function animateGallery() {
    gsap.to("#gallery img", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    });
  }

  // --- Final Dramatic Revelation Animation ---
  function animateFinalQuestion() {
    gsap.fromTo(
      "#final-question",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
    );
  }

  // Final Yes Button triggers celebration
  document.getElementById("final-yes").addEventListener("click", function() {
    launchCelebration();
  });

  // --- Final No Button Logic ---
  let finalNoTransformed = false;
  document.getElementById("final-no").addEventListener("click", function() {
    if (!finalNoTransformed) {
      finalNoTransformed = true;
      this.innerText = "Yes";
      let messageElem = document.createElement("p");
      messageElem.id = "final-no-message";
      messageElem.classList.add("text-xl", "mt-4", "text-yellow-300");
      messageElem.innerText = "You think you are funny? Try again now";
      document.getElementById("section-final").appendChild(messageElem);
    } else {
      launchCelebration();
    }
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

  // When the user completes the gallery, move to the final section.
  document.getElementById("gallery-continue").addEventListener("click", function() {
    transitionToSection("section-gallery", "section-final");
    animateFinalQuestion();
  });
}); 
