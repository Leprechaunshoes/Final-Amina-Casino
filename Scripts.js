// Toggle visibility between game sections
function showGame(gameId) {
  document.querySelectorAll('.game').forEach(game => {
    game.classList.add('hidden');
  });
  document.getElementById(gameId).classList.remove('hidden');
}

// Placeholder Pera Wallet Integration
function connectWallet() {
  const status = document.getElementById('walletStatus');
  // Simulated connection
  status.textContent = 'Connected to Pera Wallet ✅';
  status.style.color = 'lime';
}

// === BLACKJACK ===

let playerCards = [];
let dealerCards = [];
let deck = [];

function startBlackjack() {
  deck = createDeck();
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];
  updateBlackjackUI();
  checkBlackjack();
}

function createDeck() {
  const suits = ['♠️', '♥️', '♣️', '♦️'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }
  return newDeck.sort(() => Math.random() - 0.5);
}

function drawCard() {
  return deck.pop();
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  for (let card of hand) {
    if (['K', 'Q', 'J'].includes(card.value)) value += 10;
    else if (card.value === 'A') {
      value += 11;
      aces++;
    } else value += parseInt(card.value);
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

function updateBlackjackUI() {
  const playerDiv = document.getElementById('player-cards');
  const dealerDiv = document.getElementById('dealer-cards');
  playerDiv.innerHTML = '';
  dealerDiv.innerHTML = '';

  playerCards.forEach(card => {
    const div = document.createElement('div');
    div.textContent = `${card.value}${card.suit}`;
    div.className = 'card';
    playerDiv.appendChild(div);
  });

  dealerCards.forEach((card, index) => {
    const div = document.createElement('div');
    div.textContent = index === 0 ? `${card.value}${card.suit}` : '🂠';
    div.className = 'card';
    dealerDiv.appendChild(div);
  });

  document.getElementById('blackjack-result').textContent = '';
}

function hit() {
  playerCards.push(drawCard());
  updateBlackjackUI();
  const value = calculateHandValue(playerCards);
  if (value > 21) {
    document.getElementById('blackjack-result').textContent = 'You Busted! 💥';
  }
}

function stand() {
  revealDealer();
}

function revealDealer() {
  while (calculateHandValue(dealerCards) < 17) {
    dealerCards.push(drawCard());
  }
  updateBlackjackUI();
  const playerVal = calculateHandValue(playerCards);
  const dealerVal = calculateHandValue(dealerCards);
  let result = '';

  if (dealerVal > 21 || playerVal > dealerVal) result = 'You Win! 🎉';
  else if (dealerVal > playerVal) result = 'Dealer Wins! 😢';
  else result = 'Push! 🤝';

  document.getElementById('blackjack-result').textContent = result;
  showFullDealer();
}

function showFullDealer() {
  const dealerDiv = document.getElementById('dealer-cards');
  dealerDiv.innerHTML = '';
  dealerCards.forEach(card => {
    const div = document.createElement('div');
    div.textContent = `${card.value}${card.suit}`;
    div.className = 'card';
    dealerDiv.appendChild(div);
  });
}

// === SLOT MACHINE ===
function spinSlot() {
  const symbols = ['🍒', '🍋', '🔔', '💎', '🍇'];
  const result = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  document.getElementById('slot-reels').textContent = result.join(' ');
  const message = result[0] === result[1] && result[1] === result[2] ?
    'Jackpot! 🎉' : 'Try again!';
  document.getElementById('slot-result').textContent = message;
}

// === PLINKO ===
function dropPlinko() {
  const outcomes = ['10 HC', '5 HC', '0', '20 HC', '15 HC'];
  const landed = outcomes[Math.floor(Math.random() * outcomes.length)];
  document.getElementById('plinko-result').textContent = `You landed on: ${landed}!`;
}
