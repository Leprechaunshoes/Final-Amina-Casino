// --- Global Variables & Setup ---
let walletAddress = null;

// Card deck for Blackjack
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

// Slot machine symbols
const slotSymbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🍀', '💎'];

// Plinko Setup
const plinkoCanvas = document.getElementById('plinko-canvas');
const plinkoCtx = plinkoCanvas.getContext('2d');
const plinkoWidth = plinkoCanvas.width;
const plinkoHeight = plinkoCanvas.height;
const pegRadius = 5;
const ballRadius = 7;
let ballX = plinkoWidth / 2;
let ballY = 0;
let ballFalling = false;
let plinkoInterval = null;

// --- Helper Functions ---

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({suit, value});
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function cardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return Number(card.value);
}

function handScore(hand) {
  let score = 0;
  let aceCount = 0;
  for (let card of hand) {
    score += cardValue(card);
    if (card.value === 'A') aceCount++;
  }
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
}

function renderCards(containerId, hand) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let card of hand) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.textContent = card.value + card.suit;
    container.appendChild(cardDiv);
  }
}

function updateScores() {
  document.getElementById('player-score').textContent = 'Score: ' + handScore(playerHand);
  document.getElementById('dealer-score').textContent = 'Score: ' + handScore(dealerHand);
}

// --- Blackjack Game Logic ---

function dealBlackjack() {
  if (gameOver === false) return; // Prevent redeal before game ends
  createDeck();
  shuffleDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;
  renderCards('player-cards', playerHand);
  renderCards('dealer-cards', dealerHand);
  updateScores();
  document.getElementById('bj-result').textContent = '';
}

function hit() {
  if (gameOver) return;
  playerHand.push(deck.pop());
  renderCards('player-cards', playerHand);
  updateScores();
  const playerScore = handScore(playerHand);
  if (playerScore > 21) {
    endBlackjack("Bust! You lose.");
  }
}

function stand() {
  if (gameOver) return;
  // Dealer draws until 17+
  while (handScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderCards('dealer-cards', dealerHand);
  updateScores();

  const dealerScore = handScore(dealerHand);
  const playerScore = handScore(playerHand);
  if (dealerScore > 21) {
    endBlackjack("Dealer busts! You win!");
  } else if (dealerScore === playerScore) {
    endBlackjack("Push! It's a tie.");
  } else if (dealerScore > playerScore) {
    endBlackjack("Dealer wins.");
  } else {
    endBlackjack("You win!");
  }
}

function endBlackjack(message) {
  gameOver = true;
  document.getElementById('bj-result').textContent = message;
}

// --- Slot Machine Logic ---

function spinSlot() {
  const reel1 = document.getElementById('reel1');
  const reel2 = document.getElementById('reel2');
  const reel3 = document.getElementById('reel3');
  let spins = 10;
  let spinCount = 0;

  const spinInterval = setInterval(() => {
    reel1.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
    reel2.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
    reel3.textContent = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
    spinCount++;
    if (spinCount >= spins) {
      clearInterval(spinInterval);
      checkSlotResult();
    }
  }, 150);
}

function checkSlotResult() {
  const reel1 = document.getElementById('reel1').textContent;
  const reel2 = document.getElementById('reel2').textContent;
  const reel3 = document.getElementById('reel3').textContent;
  const resultDisplay = document.getElementById('slot-result');

  if (reel1 === reel2 && reel2 === reel3) {
    resultDisplay.textContent = "Jackpot! 🎉 You won big!";
  } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
    resultDisplay.textContent = "Nice! Partial match!";
  } else {
    resultDisplay.textContent = "Try again!";
  }
}

// --- Plinko Logic ---

// Create pegs layout
const pegRows = 8;
const pegCols = 9;
const pegSpacingX = plinkoWidth / pegCols;
const pegSpacingY = 35;
let pegs = [];

function setupPegs() {
  pegs = [];
  for (let row = 0; row < pegRows; row++) {
    for (let col = 0; col < pegCols; col++) {
      let x = col * pegSpacingX + (row % 2) * (pegSpacingX / 2);
      let y = row * pegSpacingY + 50;
      pegs.push({x, y});
    }
  }
}

function drawPegs() {
  plinkoCtx.clearRect(0, 0, plinkoWidth, plinkoHeight);
  plinkoCtx.fillStyle = '#00f7ff';
  for (let peg of pegs) {
    plinkoCtx.beginPath();
    plinkoCtx.arc(peg.x, peg.y, pegRadius, 0, 2 * Math.PI);
    plinkoCtx.fill();
  }
}

function drawBall() {
  plinkoCtx.beginPath();
  plinkoCtx.fillStyle = '#ffcc00';
  plinkoCtx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  plinkoCtx.fill();
}

function dropBall() {
  if (ballFalling) return; // Prevent multiple drops
  ballX = plinkoWidth / 2;
  ballY = 0;
  ballFalling = true;
  document.getElementById('plinko-result').textContent = '';
  if(plinkoInterval) clearInterval(plinkoInterval);
  plinkoInterval = setInterval(plinkoStep, 20);
}

function plinkoStep() {
  if (ballY + ballRadius >= plinkoHeight) {
    ballFalling = false;
    clearInterval(plinkoInterval);
    // Determine result based on final ballX position
    const slot = Math.floor(ballX / (plinkoWidth / pegCols));
    const rewards = ["💎 Jackpot!", "🍀 Lucky Win!", "⭐ Nice!", "🍒 Try Again", "🍋 Try Again", "🍊 Try Again", "🍉 Try Again", "💎 Jackpot!", "🍀 Lucky Win!"];
    document.getElementById('plinko-result').textContent = rewards[slot] || "Try again!";
    drawPegs();
    drawBall();
    return;
  }

  // Simulate bouncing left/right randomly on pegs rows
  let row = Math.floor(ballY / pegSpacingY);
  if (row < pegRows) {
    let direction = Math.random() < 0.5 ? -1 : 1;
    ballX += direction * 2;
  }
  ballY += 5;

  drawPegs();
  drawBall();
}

// --- Wallet Integration Placeholder ---

const connectBtn = document.getElementById('connect-wallet');
const walletDisplay = document.getElementById('wallet-address');

connectBtn.addEventListener('click', async () => {
  try {
    // Placeholder for Pera Wallet connection logic
    // Replace this block with real Pera Wallet SDK calls
    // Example:
    // walletAddress = await peraWallet.connect();
    // walletDisplay.textContent = walletAddress;

    walletAddress = "ALGO1234...FAKE";
