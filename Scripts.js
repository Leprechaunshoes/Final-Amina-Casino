// Global variables
let balance = 1000;
let betAmount = 1;
const houseRake = 0.05; // 5% rake

document.addEventListener("DOMContentLoaded", () => {
  updateBalance();

  // Slot game
  document.getElementById("spin-btn").addEventListener("click", () => {
    if (balance >= betAmount) {
      balance -= betAmount;
      updateBalance();

      const reels = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
      const results = [
        reels[Math.floor(Math.random() * reels.length)],
        reels[Math.floor(Math.random() * reels.length)],
        reels[Math.floor(Math.random() * reels.length)],
      ];

      const slotDisplay = document.getElementById("slot-display");
      slotDisplay.textContent = results.join(" ");

      if (results[0] === results[1] && results[1] === results[2]) {
        const winnings = betAmount * 5;
        balance += winnings * (1 - houseRake);
        alert(`Jackpot! You win ${winnings} Amina (after rake).`);
        updateBalance();
      } else {
        alert("Try again!");
      }
    } else {
      alert("Not enough balance.");
    }
  });

  // Blackjack game
  document.getElementById("blackjack-btn").addEventListener("click", () => {
    if (balance >= betAmount) {
      balance -= betAmount;
      updateBalance();

      const player = [drawCard(), drawCard()];
      const dealer = [drawCard(), drawCard()];

      const playerTotal = calculateTotal(player);
      const dealerTotal = calculateTotal(dealer);

      document.getElementById("blackjack-display").innerHTML = `
        <p>Player: ${player.join(", ")} (${playerTotal})</p>
        <p>Dealer: ${dealer.join(", ")} (${dealerTotal})</p>
      `;

      if (playerTotal > 21) {
        alert("Bust! Dealer wins.");
      } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        const winnings = betAmount * 2;
        balance += winnings * (1 - houseRake);
        alert(`You win ${winnings} Amina (after rake)!`);
        updateBalance();
      } else if (playerTotal === dealerTotal) {
        balance += betAmount;
        alert("Push! Bet returned.");
        updateBalance();
      } else {
        alert("Dealer wins.");
      }
    } else {
      alert("Not enough balance.");
    }
  });

  // Plinko game
  document.getElementById("plinko-btn").addEventListener("click", () => {
    if (balance >= betAmount) {
      balance -= betAmount;
      updateBalance();

      const multipliers = [0, 0.5, 1, 5, 1, 0.5, 0];
      const landing = Math.floor(Math.random() * multipliers.length);
      const multiplier = multipliers[landing];
      const winnings = betAmount * multiplier;

      if (winnings > 0) {
        balance += winnings * (1 - houseRake);
        alert(`Plinko landed on ${multiplier}x! You win ${winnings} Amina (after rake).`);
      } else {
        alert("Plinko missed. Better luck next time!");
      }

      document.getElementById("plinko-display").innerHTML = `
        <p>Ball landed in slot ${landing + 1} — Multiplier: ${multiplier}x</p>
      `;

      updateBalance();
    } else {
      alert("Not enough balance.");
    }
  });

  // Toggle Play Money
  document.getElementById("toggle-money").addEventListener("click", () => {
    balance = 1000;
    updateBalance();
    alert("Balance reset to 1000 House Coins.");
  });

  // Donation
  document.getElementById("donate-btn").addEventListener("click", () => {
    window.open("https://wallet.perawallet.app/send?amount=1&asset=1107424865&to=6ZL5LU6ZOG5SQLYD2GLBGFZK7TKM2BB7WGFZCRILWPRRHLH3NYVU5BASYI", "_blank");
  });

  // Popcorn music
  const popcorn = document.getElementById("popcorn");
  document.getElementById("stop-music").addEventListener("click", () => {
    popcorn.pause();
  });
});

// Functions
function updateBalance() {
  document.getElementById("balance").textContent = balance.toFixed(2);
}

function drawCard() {
  const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  return cards[Math.floor(Math.random() * cards.length)];
}

function calculateTotal(hand) {
  let total = hand.reduce((sum, card) => sum + card, 0);
  let aces = hand.filter(card => card === 11).length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}
