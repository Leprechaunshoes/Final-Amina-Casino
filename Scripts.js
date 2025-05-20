let mode = "HC";
let balance = 1000;
let bet = 0.25;
let connectedWallet = null;
let audio = document.getElementById("popcornAudio");

const betSlider = document.getElementById("betSlider");
const betAmount = document.getElementById("betAmount");
const balanceDisplay = document.getElementById("balance");
const currencyDisplay = document.getElementById("currency");

document.getElementById("betSlider").addEventListener("input", (e) => {
  bet = parseFloat(e.target.value);
  betAmount.innerText = bet.toFixed(2);
});

function toggleMoneyMode() {
  mode = mode === "HC" ? "Amina" : "HC";
  currencyDisplay.textContent = mode;
  document.getElementById("moneyMode").textContent = mode;
  if (mode === "HC") {
    balance = 1000;
  }
  updateBalance();
}

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(2);
}

function toggleMusic() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function connectWallet() {
  // Placeholder: full integration to be implemented
  connectedWallet = "Your-Pera-Wallet-Address";
  document.getElementById("walletAddress").textContent = connectedWallet;
  alert("Pera Wallet connected!");
}

function donate() {
  window.open("https://www.algoscan.app/address/6ZL5LU6ZOG5SQLYD2GLBGFZK7TKM2BB7WGFZCRILWPRRHLH3NYVU5BASYI", "_blank");
}

// 🎰 SLOT MACHINE
function spinSlot() {
  if (balance < bet) return alert("Insufficient funds!");
  const symbols = ["🌕", "🪐", "🌟", "🚀", "👽"];
  const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
  const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
  const reel3 = symbols[Math.floor(Math.random() * symbols.length)];

  document.getElementById("reel1").textContent = reel1;
  document.getElementById("reel2").textContent = reel2;
  document.getElementById("reel3").textContent = reel3;

  if (reel1 === reel2 && reel2 === reel3) {
    balance += bet * 5;
  } else {
    balance -= bet;
  }
  updateBalance();
}

// 🃏 BLACKJACK
let deck = [], playerHand = [], dealerHand = [];

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function drawCard() {
  return deck.pop();
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    if (['J', 'Q', 'K'].includes(card.rank)) score += 10;
    else if (card.rank === 'A') {
      score += 11;
      aces += 1;
    } else score += parseInt(card.rank);
  }
  while (score > 21 && aces) {
    score -= 10;
    aces -= 1;
  }
  return score;
}

function renderHand(elementId, hand) {
  const el = document.getElementById(elementId);
  el.innerHTML = '';
  hand.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `${card.rank}${card.suit}`;
    el.appendChild(div);
  });
}

function startBlackjack() {
  if (balance < bet) return alert("Not enough to bet!");
  createDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  renderHand("playerHand", playerHand);
  renderHand("dealerHand", [dealerHand[0], { rank: "?", suit: "?" }]);
}

function hit() {
  playerHand.push(drawCard());
  renderHand("playerHand", playerHand);
  if (calculateScore(playerHand) > 21) {
    alert("Bust! Dealer wins.");
    balance -= bet;
    updateBalance();
  }
}

function stand() {
  renderHand("dealerHand", dealerHand);
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
    renderHand("dealerHand", dealerHand);
  }
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    alert("You win!");
    balance += bet;
  } else if (playerScore < dealerScore) {
    alert("Dealer wins!");
    balance -= bet;
  } else {
    alert("Push!");
  }
  updateBalance();
}

// 🔻 PLINKO
const canvas = document.getElementById("plinkoCanvas");
const ctx = canvas.getContext("2d");
let ball = null;

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let y = 50; y < 350; y += 50) {
    for (let x = y % 100 === 0 ? 25 : 50; x < 300; x += 50) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function dropPlinko() {
  if (balance < bet) return alert("Not enough!");
  ball = { x: 150, y: 0, vy: 2 };
  animateBall();
}

function animateBall() {
  if (!ball) return;
  drawBoard();
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ball.y += ball.vy;

  if (ball.y < 350) {
    requestAnimationFrame(animateBall);
  } else {
    let zone = Math.floor(ball.x / 50);
    const multipliers = [0, 0.5, 1, 2, 1, 0.5];
    const multiplier = multipliers[zone] || 0;
    const result = bet * multiplier;
    balance += result - bet;
    updateBalance();
    document.getElementById("plinkoResult").textContent = `Won ${result.toFixed(2)} ${mode}`;
    ball = null;
  }
}

drawBoard();
updateBalance();
