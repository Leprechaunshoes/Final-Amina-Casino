let balance = 1000;
let useHouseCoin = false;
let connectedWallet = null;

// --- DOM Elements ---
const walletBtn = document.getElementById('connectWallet');
const walletAddressDisplay = document.getElementById('walletAddress');
const toggleBtn = document.getElementById('toggleMoney');
const balanceDisplay = document.getElementById('balance');
const donateBtn = document.getElementById('donateBtn');

// Wallet Integration Placeholder
walletBtn.onclick = () => {
  connectedWallet = "6ZL5LU6ZOG5SQLYD2GLBGFZK7TKM2BB7WGFZCRILWPRRHLH3NYVU5BASYI"; // Dummy connection
  walletAddressDisplay.textContent = `Connected: ${connectedWallet}`;
};

// Toggle between Amina and House Coin
toggleBtn.onclick = () => {
  useHouseCoin = !useHouseCoin;
  balance = useHouseCoin ? 1000 : 0;
  toggleBtn.textContent = useHouseCoin ? 'Switch to Amina' : 'Switch to House Coin';
  updateBalance();
};

function updateBalance() {
  balanceDisplay.textContent = `Balance: ${balance} ${useHouseCoin ? 'HC' : 'Amina'}`;
}

// Donation
donateBtn.onclick = () => {
  alert(`Donate Amina to wallet: ${connectedWallet}`);
};

// Music Controls
document.getElementById("playMusic").onclick = () => {
  document.getElementById("popcornMusic").play();
};
document.getElementById("stopMusic").onclick = () => {
  document.getElementById("popcornMusic").pause();
};

// ------------------- SLOT MACHINE -------------------
const slotSymbols = ['🍒', '🍋', '🔔', '⭐', '💎'];
const spinSlotBtn = document.getElementById('spinSlot');
const slotBetSlider = document.getElementById('slotBet');
const slotBetDisplay = document.getElementById('slotBetDisplay');

slotBetSlider.oninput = () => {
  slotBetDisplay.textContent = `Bet: ${slotBetSlider.value}`;
};

spinSlotBtn.onclick = () => {
  const bet = parseFloat(slotBetSlider.value);
  if (bet > balance) return alert("Insufficient funds");

  const reel1 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
  const reel2 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
  const reel3 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];

  document.getElementById("reel1").textContent = reel1;
  document.getElementById("reel2").textContent = reel2;
  document.getElementById("reel3").textContent = reel3;

  if (reel1 === reel2 && reel2 === reel3) {
    balance += bet * 5;
    document.getElementById("slotResult").textContent = "🎉 JACKPOT!";
  } else {
    balance -= bet;
    document.getElementById("slotResult").textContent = "😢 Try again!";
  }
  updateBalance();
};

// ------------------- BLACKJACK -------------------
let playerHand = [];
let dealerHand = [];

const bjBetSlider = document.getElementById('bjBet');
const bjBetDisplay = document.getElementById('bjBetDisplay');
bjBetSlider.oninput = () => {
  bjBetDisplay.textContent = `Bet: ${bjBetSlider.value}`;
};

document.getElementById("dealBlackjack").onclick = () => {
  if (parseFloat(bjBetSlider.value) > balance) return alert("Not enough balance");

  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  updateBlackjackDisplay();

  document.getElementById("hit").disabled = false;
  document.getElementById("stand").disabled = false;
};

document.getElementById("hit").onclick = () => {
  playerHand.push(drawCard());
  updateBlackjackDisplay();
  if (handValue(playerHand) > 21) finishBlackjackGame();
};

document.getElementById("stand").onclick = () => {
  while (handValue(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  finishBlackjackGame();
};

function drawCard() {
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return values[Math.floor(Math.random() * values.length)];
}

function handValue(hand) {
  return hand.reduce((a, b) => a + b, 0);
}

function updateBlackjackDisplay() {
  document.getElementById("playerHand").innerHTML = `<strong>You:</strong> ${playerHand.join(", ")}`;
  document.getElementById("dealerHand").innerHTML = `<strong>Dealer:</strong> ${dealerHand.join(", ")}`;
}

function finishBlackjackGame() {
  const playerTotal = handValue(playerHand);
  const dealerTotal = handValue(dealerHand);
  const bet = parseFloat(bjBetSlider.value);

  let result = "";
  if (playerTotal > 21) {
    result = "You bust!";
    balance -= bet;
  } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
    result = "You win!";
    balance += bet;
  } else if (playerTotal < dealerTotal) {
    result = "Dealer wins!";
    balance -= bet;
  } else {
    result = "Push.";
  }

  document.getElementById("bjResult").textContent = result;
  document.getElementById("hit").disabled = true;
  document.getElementById("stand").disabled = true;
  updateBalance();
}

// ------------------- PLINKO -------------------
const plinkoCanvas = document.getElementById("plinkoBoard");
const ctx = plinkoCanvas.getContext("2d");
const plinkoBetSlider = document.getElementById("plinkoBet");
const plinkoBetDisplay = document.getElementById("plinkoBetDisplay");
plinkoBetSlider.oninput = () => {
  plinkoBetDisplay.textContent = `Bet: ${plinkoBetSlider.value}`;
};

document.getElementById("dropPlinko").onclick = () => {
  if (parseFloat(plinkoBetSlider.value) > balance) return alert("Not enough balance");

  let x = 150;
  let y = 0;
  let interval = setInterval(() => {
    ctx.clearRect(0, 0, plinkoCanvas.width, plinkoCanvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "gold";
    ctx.fill();
    y += 5;
    if (y >= 380) {
      clearInterval(interval);
      const multiplier = [0.5, 1, 2, 5][Math.floor(Math.random() * 4)];
      const win = parseFloat(plinkoBetSlider.value) * multiplier;
      balance += win - parseFloat(plinkoBetSlider.value);
      document.getElementById("plinkoResult").textContent = `You won ${win.toFixed(2)} (${multiplier}x)!`;
      updateBalance();
    }
  }, 30);
};

updateBalance();
