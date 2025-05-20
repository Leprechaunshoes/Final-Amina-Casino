// === Global State ===
let isPlayMode = true;
let balance = 1000;
let peraWalletAddress = null;

// === Utility ===
function updateBalanceDisplay() {
  document.getElementById('currency-symbol').textContent = isPlayMode ? 'HC' : 'Amina';
  document.getElementById('balance-amount').textContent = balance.toFixed(2);
  document.getElementById('wallet-display').textContent = isPlayMode ? '' : (peraWalletAddress || 'Connect Pera Wallet');
}

// === Toggle Between Modes ===
document.getElementById('toggle-money').addEventListener('change', () => {
  isPlayMode = document.getElementById('toggle-money').checked;
  if (isPlayMode) {
    balance = 1000;
  }
  updateBalanceDisplay();
});

// === Music Controls ===
const music = document.getElementById('bg-music');
document.getElementById('btn-music-toggle').addEventListener('click', () => {
  if (music.paused) {
    music.play();
    document.getElementById('btn-music-toggle').textContent = '🔊 Stop Music';
  } else {
    music.pause();
    document.getElementById('btn-music-toggle').textContent = '🎵 Play Music';
  }
});

// === Donate Button ===
document.getElementById('btn-donate').addEventListener('click', () => {
  const wallet = '6ZL5LU6ZOG5SQLYD2GLBGFZK7TKM2BB7WGFZCRILWPRRHLH3NYVU5BASYI';
  alert(`Send donations to:\n${wallet}`);
});

// === Blackjack ===
let bjDeck, playerCards, dealerCards;

function newDeck() {
  const suits = ['♠', '♥', '♣', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => 0.5 - Math.random());
}

function cardValue(card) {
  if (['K', 'Q', 'J'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function handValue(hand) {
  let val = hand.reduce((sum, c) => sum + cardValue(c), 0);
  let aces = hand.filter(c => c.value === 'A').length;
  while (val > 21 && aces--) val -= 10;
  return val;
}

function displayCards(elem, cards) {
  elem.innerHTML = cards.map(c => `<span class="card">${c.value}${c.suit}</span>`).join('');
}

function updateBJButtons(inGame) {
  document.getElementById('btn-bj-hit').disabled = !inGame;
  document.getElementById('btn-bj-stand').disabled = !inGame;
}

document.getElementById('btn-bj-new').addEventListener('click', () => {
  const bet = parseFloat(document.getElementById('bj-bet').value);
  if (bet > balance || bet <= 0) return alert("Invalid bet.");
  balance -= bet;
  updateBalanceDisplay();
  document.getElementById('bj-result').textContent = '';

  bjDeck = newDeck();
  playerCards = [bjDeck.pop(), bjDeck.pop()];
  dealerCards = [bjDeck.pop(), bjDeck.pop()];

  displayCards(document.getElementById('player-cards'), playerCards);
  displayCards(document.getElementById('dealer-cards'), [dealerCards[0], { value: '?', suit: '' }]);
  updateBJButtons(true);
});

document.getElementById('btn-bj-hit').addEventListener('click', () => {
  playerCards.push(bjDeck.pop());
  displayCards(document.getElementById('player-cards'), playerCards);
  if (handValue(playerCards) > 21) {
    document.getElementById('bj-result').textContent = 'Bust! Dealer wins.';
    updateBJButtons(false);
  }
});

document.getElementById('btn-bj-stand').addEventListener('click', () => {
  const bet = parseFloat(document.getElementById('bj-bet').value);
  updateBJButtons(false);
  displayCards(document.getElementById('dealer-cards'), dealerCards);
  while (handValue(dealerCards) < 17) dealerCards.push(bjDeck.pop());
  const playerVal = handValue(playerCards);
  const dealerVal = handValue(dealerCards);
  let result = '';
  if (dealerVal > 21 || playerVal > dealerVal) {
    result = 'You win!';
    balance += bet * 2;
  } else if (playerVal === dealerVal) {
    result = 'Push.';
    balance += bet;
  } else {
    result = 'Dealer wins.';
  }
  document.getElementById('bj-result').textContent = result;
  updateBalanceDisplay();
});

// === Slot Machine ===
const symbols = ['🍒', '🍋', '🔔', '⭐', '💎'];

document.getElementById('btn-slot-spin').addEventListener('click', () => {
  const bet = parseFloat(document.getElementById('slot-bet').value);
  if (bet > balance || bet <= 0) return alert("Invalid bet.");
  balance -= bet;
  const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot3 = symbols[Math.floor(Math.random() * symbols.length)];
  document.getElementById('slot1').textContent = slot1;
  document.getElementById('slot2').textContent = slot2;
  document.getElementById('slot3').textContent = slot3;
  let winnings = 0;
  if (slot1 === slot2 && slot2 === slot3) winnings = bet * 5;
  else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) winnings = bet * 2;
  balance += winnings;
  updateBalanceDisplay();
  document.getElementById('slot-result').textContent = winnings > 0 ? `You won ${winnings.toFixed(2)}!` : 'Try again!';
});

// === Plinko ===
document.getElementById('btn-plinko-drop').addEventListener('click', () => {
  const bet = parseFloat(document.getElementById('plinko-bet').value);
  if (bet > balance || bet <= 0) return alert("Invalid bet.");
  balance -= bet;
  updateBalanceDisplay();
  const outcome = Math.random();
  let multiplier = 0;
  if (outcome < 0.1) multiplier = 10;
  else if (outcome < 0.3) multiplier = 3;
  else if (outcome < 0.6) multiplier = 1;
  const winnings = bet * multiplier;
  balance += winnings;
  updateBalanceDisplay();
  document.getElementById('plinko-result').textContent = `You won ${winnings.toFixed(2)} (${multiplier}x)`;
});
