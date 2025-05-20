// -------- Wallet Connection (Simulated for demo) --------
const connectBtn = document.getElementById('connect-wallet-btn');
const walletAddressDiv = document.getElementById('wallet-address');
let walletAddress = null;

connectBtn.onclick = async () => {
  // Simulate wallet connection (replace with real Pera Wallet integration)
  walletAddress = "ALGO-TEST-ADDRESS-XYZ123";
  walletAddressDiv.textContent = `Connected: ${walletAddress}`;
  connectBtn.disabled = true;
  connectBtn.textContent = "Wallet Connected";
};


// -------- BLACKJACK --------
const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnNewGame = document.getElementById('btn-new-game');
const bjResultDiv = document.getElementById('bj-result');

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

function createDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let d = [];
  for (let suit of suits) {
    for (let val of values) {
      d.push({suit, val});
    }
  }
  return d;
}

function shuffleDeck(d) {
  for (let i = d.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
}

function cardValue(card) {
  if (['J','Q','K'].includes(card.val)) return 10;
  if (card.val === 'A') return 11;
  return Number(card.val);
}

function handValue(hand) {
  let value = 0;
  let aceCount = 0;
  for (let card of hand) {
    value += cardValue(card);
    if (card.val === 'A') aceCount++;
  }
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
}

function displayCards() {
  playerCardsDiv.innerHTML = playerHand.map(c => `<div class="card">${c.val}${c.suit}</div>`).join('');
  dealerCardsDiv.innerHTML = dealerHand.map(c => `<div class="card">${c.val}${c.suit}</div>`).join('');
}

function checkOutcome() {
  const playerVal = handValue(playerHand);
  const dealerVal = handValue(dealerHand);
  if (playerVal > 21) {
    bjResultDiv.textContent = "You busted! Dealer wins.";
    gameOver = true;
  } else if (dealerVal > 21) {
    bjResultDiv.textContent = "Dealer busted! You win!";
    gameOver = true;
  } else if (gameOver) {
    if (playerVal > dealerVal) bjResultDiv.textContent = "You win!";
    else if (playerVal < dealerVal) bjResultDiv.textContent = "Dealer wins.";
    else bjResultDiv.textContent = "Push (tie).";
  }
}

function dealerPlay() {
  while (handValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
    displayCards();
  }
  gameOver = true;
  checkOutcome();
  btnHit.disabled = true;
  btnStand.disabled = true;
}

function startNewGame() {
  deck = createDeck();
  shuffleDeck(deck);
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;
  bjResultDiv.textContent = "";
  btnHit.disabled = false;
  btnStand.disabled = false;
  displayCards();
}

btnHit.onclick = () => {
  if (gameOver) return;
  playerHand.push(deck.pop());
  displayCards();
  if (handValue(playerHand) > 21) {
    gameOver = true;
    bjResultDiv.textContent = "You busted! Dealer wins.";
    btnHit.disabled = true;
    btnStand.disabled = true;
  }
};

btnStand.onclick = () => {
  if (gameOver) return;
  dealerPlay();
};

btnNewGame.onclick = () => startNewGame();

startNewGame();


// -------- SLOT MACHINE --------
const slotSymbols = ['🍒', '🍋', '🍉', '⭐', '7️⃣', '🍇'];
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const slotSpinBtn = document.getElementById('slot-spin-btn');
const slotResultDiv = document.getElementById('slot-result');

function spinSlots() {
  let res = [];
  for (let i = 0; i < 3; i++) {
    res[i] = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
  }
  slot1.textContent = res[0];
  slot2.textContent = res[1];
  slot3.textContent = res[2];

  if (res[0] === res[1] && res[1] === res[2]) {
    slotResultDiv.textContent = `Jackpot! You hit three ${res[0]}s! 🎉`;
  } else if (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]) {
    slotResultDiv.textContent = "Nice! You got a pair!";
  } else {
    slotResultDiv.textContent = "Try again!";
  }
}

slotSpinBtn.onclick = () => {
  slotResultDiv.textContent = "Spinning...";
  setTimeout(spinSlots, 1000);
};


// -------- PLINKO --------
const canvas = document.getElementById('plinko-canvas');
const ctx = canvas.getContext('2d');
const plinkoResultDiv = document.getElementById('plinko-result');

const pegRadius = 5;
const cols = 9;
const rows = 10;
const pegSpacingX = canvas.width / cols;
const pegSpacingY = canvas.height / (rows + 2);

let chipY = 0;
let chipX = canvas.width / 2;
let chipDropping = false;

function drawPegs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffd700';
  for(let row=0; row<rows; row++) {
    for(let col=0; col<cols; col++) {
      let x = col * pegSpacingX + (row % 2) * (pegSpacingX/2) + pegSpacingX/2;
      let y = row * pegSpacingY + pegSpacingY;
      ctx.beginPath();
      ctx.arc(x, y, pegRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function drawChip(x,y) {
  ctx.beginPath();
  ctx.fillStyle = '#00ffff';
  ctx.arc(x, y, pegRadius*1.5, 0, 2*Math.PI);
  ctx.fill();
}

function plinkoDrop() {
  if (chipDropping) {
    chipY += 5;
    let col = Math.floor(chipX / pegSpacingX);
    if (chipY > canvas.height - pegSpacingY) {
      chipDropping = false;
      // Determine prize slot by final col
      const prizes = ['🎁 10 Amina', '🎉 5 Amina', '💎 2 Amina', '✨ 1 Amina', '💰 0 Amina', '✨ 1 Amina', '💎 2 Amina', '🎉 5 Amina', '🎁 10 Amina'];
      let prize = prizes[Math.min(col, prizes.length-1)];
      plinkoResultDiv.textContent = `You won: ${prize}`;
    } else {
      // Random left/right movement on pegs
      if (chipY % pegSpacingY < 3) {
        chipX += (Math.random() < 0.5 ? -pegSpacingX/2 : pegSpacingX/2);
        if (chipX < pegSpacingX/2) chipX = pegSpacingX/2;
        if (chipX > canvas.width - pegSpacingX/2) chipX = canvas.width - pegSpacingX/2;
      }
      drawPegs();
      drawChip(chipX, chipY);
      requestAnimationFrame(plinkoDrop);
    }
  }
}

canvas.onclick = () => {
  if (!chipDropping) {
    chipX = canvas.width / 2;
    chipY = pegSpacingY / 2;
    chipDropping = true;
    plinkoResultDiv.textContent = "Dropping chip...";
    plinkoDrop();
  }
};

drawPegs();
