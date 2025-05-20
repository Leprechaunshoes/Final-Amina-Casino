let walletConnected = false;
let playMoneyMode = false;
let balance = 10; // Default real balance
let playBalance = 1000;
let currentCurrency = 'Amina';

// 🎵 Music controls
const bgMusic = document.getElementById("bgMusic");
document.getElementById("playMusic").onclick = () => bgMusic.play();
document.getElementById("stopMusic").onclick = () => bgMusic.pause();

// 🎮 Play Money Toggle
document.getElementById("toggleMode").onclick = () => {
  playMoneyMode = !playMoneyMode;
  document.getElementById("currency").innerText = playMoneyMode ? 'House Coin' : 'Amina';
  document.getElementById("balance").innerText = playMoneyMode ? playBalance.toFixed(2) : balance.toFixed(2);
  document.getElementById("toggleMode").innerText = playMoneyMode ? 'Switch to Real Money' : 'Switch to Play Money';
};

// 🎰 Slot Machine
const slotSymbols = ["🍒", "🍋", "🍊", "⭐", "🔔", "7️⃣"];
const spinBtn = document.getElementById("spinSlot");
const slotBetSlider = document.getElementById("slotBet");
slotBetSlider.oninput = () => document.getElementById("slotBetValue").innerText = slotBetSlider.value;

spinBtn.onclick = () => {
  const bet = parseFloat(slotBetSlider.value);
  if (!checkBalance(bet)) return;

  const reels = [randomSymbol(), randomSymbol(), randomSymbol()];
  document.getElementById("reel1").innerText = reels[0];
  document.getElementById("reel2").innerText = reels[1];
  document.getElementById("reel3").innerText = reels[2];

  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    updateBalance(bet * 5);
  } else {
    updateBalance(-bet);
  }
};

// 🃏 Blackjack
const deck = [];
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let playerHand = [], dealerHand = [], blackjackBet = 0;

const blackjackBetSlider = document.getElementById("blackjackBet");
blackjackBetSlider.oninput = () => document.getElementById("blackjackBetValue").innerText = blackjackBetSlider.value;

function getCardValue(card) {
  const val = card.slice(0, -1);
  if (['J', 'Q', 'K'].includes(val)) return 10;
  if (val === 'A') return 11;
  return parseInt(val);
}

function calculateTotal(hand) {
  let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter(c => c.startsWith('A')).length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function drawCard() {
  return deck.pop();
}

function dealInitialHands() {
  deck.length = 0;
  for (let suit of suits) {
    for (let val of values) {
      deck.push(val + suit);
    }
  }
  shuffle(deck);
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  renderHands();
}

function renderHands() {
  document.getElementById("playerCards").innerText = playerHand.join(" ");
  document.getElementById("dealerCards").innerText = dealerHand.join(" ");
}

document.getElementById("deal").onclick = () => {
  blackjackBet = parseFloat(blackjackBetSlider.value);
  if (!checkBalance(blackjackBet)) return;
  dealInitialHands();
  updateBalance(-blackjackBet);
};

document.getElementById("hit").onclick = () => {
  if (!playerHand.length) return;
  playerHand.push(drawCard());
  renderHands();
  if (calculateTotal(playerHand) > 21) endBlackjack();
};

document.getElementById("stand").onclick = () => {
  while (calculateTotal(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  renderHands();
  endBlackjack();
};

function endBlackjack() {
  const playerTotal = calculateTotal(playerHand);
  const dealerTotal = calculateTotal(dealerHand);
  let result = '';

  if (playerTotal > 21) {
    result = 'Bust! You lose.';
  } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
    result = 'You win!';
    updateBalance(blackjackBet * 2);
  } else if (playerTotal === dealerTotal) {
    result = 'Push. Bet returned.';
    updateBalance(blackjackBet);
  } else {
    result = 'Dealer wins.';
  }

  alert(result);
  playerHand = [];
  dealerHand = [];
  renderHands();
}

// 🔽 Plinko
document.getElementById("dropPlinko").onclick = () => {
  const bet = parseFloat(document.getElementById("plinkoBet").value);
  document.getElementById("plinkoBetValue").innerText = bet;
  if (!checkBalance(bet)) return;

  const slots = [0.2, 0.5, 1, 2, 5, 2, 1, 0.5, 0.2];
  const slot = Math.floor(Math.random() * slots.length);
  const multiplier = slots[slot];
  const win = bet * multiplier;

  updateBalance(win - bet);

  document.getElementById("plinkoResult").innerText =
    `Ball landed in slot ${slot + 1} (x${multiplier.toFixed(2)}). You won ${win.toFixed(2)}!`;
};

// 🔁 Helpers
function updateBalance(amount) {
  if (playMoneyMode) {
    playBalance += amount;
    document.getElementById("balance").innerText = playBalance.toFixed(2);
  } else {
    balance += amount;
    document.getElementById("balance").innerText = balance.toFixed(2);
  }
}

function checkBalance(amount) {
  const bal = playMoneyMode ? playBalance : balance;
  if (amount > bal) {
    alert("Insufficient funds!");
    return false;
  }
  return true;
}

function randomSymbol() {
  return slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)];
    [array[i], array[j]] = [array[j], array[i]];
  }
}
