// Basic globals
let balance = 0;
let mode = "HC"; // or "Amina"
let houseRake = 0.05;
let audio = new Audio("https://upload.wikimedia.org/wikipedia/commons/3/3f/Popcorn_song.ogg");

// Play money system
function getDailyCoins() {
  if (localStorage.getItem("lastClaim") !== new Date().toDateString()) {
    balance += 1000;
    localStorage.setItem("lastClaim", new Date().toDateString());
    updateBalance();
    alert("You received 1000 House Coins!");
  } else {
    alert("Come back tomorrow!");
  }
}

// Toggle between Amina and HC
function toggleMode() {
  mode = mode === "HC" ? "Amina" : "HC";
  document.getElementById("modeDisplay").textContent = mode;
  updateBalance();
}

// Wallet connect (mocked)
function connectWallet() {
  alert("Connecting to Pera Wallet...");
  document.getElementById("walletStatus").textContent = "Wallet Connected";
}

// Update balance
function updateBalance() {
  document.getElementById("balanceDisplay").textContent = `${balance.toFixed(2)} ${mode}`;
}

// Donation button
function donate() {
  window.open("https://www.perawallet.app", "_blank");
}

// Music controls
function toggleMusic(play) {
  if (play) {
    audio.loop = true;
    audio.play();
  } else {
    audio.pause();
  }
}

// BETTING
function getBet() {
  return Math.min(1, parseFloat(document.getElementById("betSlider").value));
}

function canPlay(bet) {
  if (mode === "HC") return balance >= bet;
  else {
    alert("Live Amina transactions not enabled yet.");
    return false;
  }
}

function deductBet(bet) {
  balance -= bet;
  let rake = bet * houseRake;
  balance -= rake;
}

// Slot Machine
function playSlot() {
  let bet = getBet();
  if (!canPlay(bet)) return;

  const reels = ["🍒", "🍋", "🔔", "⭐", "💎"];
  let slot = [];
  for (let i = 0; i < 3; i++) {
    slot.push(reels[Math.floor(Math.random() * reels.length)]);
  }

  document.getElementById("slotResult").textContent = slot.join(" ");
  deductBet(bet);
  if (slot[0] === slot[1] && slot[1] === slot[2]) {
    balance += bet * 5;
    alert("Jackpot! You win!");
  }

  updateBalance();
}

// Blackjack
function playBlackjack() {
  let bet = getBet();
  if (!canPlay(bet)) return;

  const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  const draw = () => cards[Math.floor(Math.random() * cards.length)];

  let player = draw() + draw();
  let dealer = draw() + draw();

  document.getElementById("blackjackResult").textContent = `Player: ${player} | Dealer: ${dealer}`;

  deductBet(bet);
  if (player > dealer || dealer > 21) {
    balance += bet * 2;
    alert("You win!");
  } else if (player === dealer) {
    balance += bet;
    alert("Push.");
  } else {
    alert("You lose.");
  }

  updateBalance();
}

// Plinko (simple logic)
function playPlinko() {
  let bet = getBet();
  if (!canPlay(bet)) return;

  let pegs = 8;
  let position = 0;
  for (let i = 0; i < pegs; i++) {
    position += Math.random() < 0.5 ? -1 : 1;
  }

  let multiplier = 0;
  switch (position) {
    case -8: case 8: multiplier = 0.5; break;
    case -6: case 6: multiplier = 1; break;
    case -4: case 4: multiplier = 2; break;
    case 0: multiplier = 10; break;
    default: multiplier = 0.2; break;
  }

  let win = bet * multiplier;
  balance += win;

  document.getElementById("plinkoResult").textContent = `Ball landed: ${position} | Multiplier: ${multiplier}x | Winnings: ${win.toFixed(2)}`;
  deductBet(bet);
  updateBalance();
}

// Init
window.onload = () => {
  balance = 1000;
  updateBalance();
  document.getElementById("modeDisplay").textContent = mode;
};
