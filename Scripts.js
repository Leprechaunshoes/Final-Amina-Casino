// ===== GLOBAL SETTINGS =====
let walletBalance = 10.0;  // Starting Amina Coins
let houseCoinsBalance = 1000; // Play money for HC mode
let useHouseCoins = false; // Toggle between real and play money
const rakePercent = 0.05;  // 5% house rake

// Update wallet display
function updateWalletDisplay() {
  const balanceEl = document.getElementById("walletBalance");
  balanceEl.textContent = useHouseCoins
    ? `HC Balance: ${houseCoinsBalance.toFixed(2)}`
    : `Amina Balance: ${walletBalance.toFixed(2)}`;
}

// ===== SLOT MACHINE =====

const slotSymbols = [
  "🍒", "🍋", "🍊", "🔔", "⭐", "💎", "7️⃣"
];

const slotReels = [
  document.getElementById("slotReel1"),
  document.getElementById("slotReel2"),
  document.getElementById("slotReel3"),
];

let slotSpinning = false;

function spinSlot() {
  if (slotSpinning) return;
  const bet = parseFloat(document.getElementById("slotBet").value);
  if (!checkBet(bet)) return;

  slotSpinning = true;
  updateWalletBalanceAfterBet(bet);
  updateWalletDisplay();

  const spinDuration = 3000; // 3 seconds spin
  const startTime = performance.now();

  function animate() {
    const now = performance.now();
    if (now - startTime < spinDuration) {
      slotReels.forEach(reel => {
        const symbol = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
        reel.textContent = symbol;
      });
      requestAnimationFrame(animate);
    } else {
      // Stop reels with final symbols
      const finalSymbols = [
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      ];
      slotReels.forEach((reel, i) => reel.textContent = finalSymbols[i]);
      slotSpinning = false;
      const payout = evaluateSlotResult(finalSymbols, bet);
      handlePayout(payout, bet, "Slot Machine");
    }
  }

  animate();
}

function evaluateSlotResult(symbols, bet) {
  // Example payouts:
  if(symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    if(symbols[0] === "7️⃣") return bet * 50;
    if(symbols[0] === "💎") return bet * 20;
    return bet * 10;
  }
  if(symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
    return bet * 2;
  }
  return 0;
}

// ===== BLACKJACK =====

const deckSuits = ["♠", "♥", "♦", "♣"];
const deckRanks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let deck = [];
let playerHand = [];
let dealerHand = [];
let blackjackBet = 0;
let blackjackInProgress = false;

function createDeck() {
  deck = [];
  for(let suit of deckSuits) {
    for(let rank of deckRanks) {
      deck.push({rank, suit});
    }
  }
  deck = shuffle(deck);
}

function shuffle(array) {
  for(let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function cardValue(card) {
  if(["J", "Q", "K"].includes(card.rank)) return 10;
  if(card.rank === "A") return 11;
  return parseInt(card.rank);
}

function handValue(hand) {
  let total = 0;
  let aces = 0;
  for(let card of hand) {
    total += cardValue(card);
    if(card.rank === "A") aces++;
  }
  while(total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

function startBlackjack() {
  if(blackjackInProgress) return;
  const bet = parseFloat(document.getElementById("blackjackBet").value);
  if(!checkBet(bet)) return;

  blackjackBet = bet;
  blackjackInProgress = true;
  updateWalletBalanceAfterBet(bet);
  updateWalletDisplay();

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  renderBlackjackHands(true);
  updateBlackjackStatus("Your turn! Hit or Stand?");
  enableBlackjackControls(true);
}

function renderCard(card) {
  return `${card.rank}${card.suit}`;
}

function renderBlackjackHands(hideDealerSecond = false) {
  const playerDiv = document.getElementById("playerHand");
  const dealerDiv = document.getElementById("dealerHand");

  playerDiv.textContent = playerHand.map(renderCard).join(" ");
  if(hideDealerSecond) {
    dealerDiv.textContent = renderCard(dealerHand[0]) + " ??";
  } else {
    dealerDiv.textContent = dealerHand.map(renderCard).join(" ");
  }
}

function blackjackHit() {
  if(!blackjackInProgress) return;
  playerHand.push(deck.pop());
  renderBlackjackHands(true);

  if(handValue(playerHand) > 21) {
    endBlackjack(false);
  }
}

function blackjackStand() {
  if(!blackjackInProgress) return;
  // Dealer plays
  while(handValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderBlackjackHands(false);

  const playerTotal = handValue(playerHand);
  const dealerTotal = handValue(dealerHand);
  if(dealerTotal > 21 || playerTotal > dealerTotal) {
    endBlackjack(true);
  } else if(playerTotal === dealerTotal) {
    endBlackjack(null);
  } else {
    endBlackjack(false);
  }
}

function endBlackjack(playerWon) {
  let payout = 0;
  if(playerWon === true) {
    payout = blackjackBet * 2;
    updateBlackjackStatus("You won!");
  } else if(playerWon === null) {
    payout = blackjackBet;
    updateBlackjackStatus("Push! It's a tie.");
  } else {
    updateBlackjackStatus("You lost.");
  }
  if(payout > 0) {
    if(useHouseCoins){
      houseCoinsBalance += payout;
    } else {
      walletBalance += payout;
    }
  }
  blackjackInProgress = false;
  enableBlackjackControls(false);
  updateWalletDisplay();
}

function updateBlackjackStatus(text) {
  document.getElementById("blackjackStatus").textContent = text;
}

function enableBlackjackControls(enable) {
  document.getElementById("hitBtn").disabled = !enable;
  document.getElementById("standBtn").disabled = !enable;
  document.getElementById("startBlackjackBtn").disabled = enable;
}

// ===== PLINKO =====

const plinkoCanvas = document.getElementById("plinkoCanvas");
const ctx = plinkoCanvas.getContext("2d");

const plinkoWidth = plinkoCanvas.width;
const plinkoHeight = plinkoCanvas.height;

const pegRadius = 5;
const ballRadius = 8;
const rows = 10;
const pegsPerRow = 11;
const pegSpacingX = plinkoWidth / pegsPerRow;
const pegSpacingY = 40;

let pegs = [];
let ball = null;
let ballDropping = false;
let plinkoResultText = document.getElementById("plinkoResult");

// Initialize peg positions
function initPegs() {
  pegs = [];
  for(let row=0; row<rows; row++) {
    let offsetX = (row % 2) * (pegSpacingX / 2);
    for(let col=0; col<pegsPerRow; col++) {
      let x = col * pegSpacingX + offsetX + pegSpacingX/2;
      let y = row * pegSpacingY + 30;
      pegs.push({x, y});
    }
  }
}

// Draw pegs and ball
function drawPlinko() {
  ctx.clearRect(0, 0, plinkoWidth, plinkoHeight);

  // Draw pegs
  ctx.fillStyle = "#8B80F9"; // cosmic purple
  pegs.forEach(peg => {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw slots at bottom
  ctx.fillStyle = "#FFF";
  for(let i=0; i<=pegsPerRow; i++) {
    ctx.fillRect(i * pegSpacingX - 2, plinkoHeight - 30, 4, 30);
  }

 
