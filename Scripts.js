let useHC = false;

function toggleCurrency() {
  useHC = document.getElementById('hcToggle').checked;
  alert("Currency: " + (useHC ? "House Coin (HC)" : "Amina Coin"));
}

function connectWallet() {
  document.getElementById('walletStatus').innerText = "Pera Wallet connected (simulated)";
}

function playSlot() {
  const symbols = ['🍒', '🔔', '💎', '7️⃣'];
  const reels = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];
  document.getElementById('slotReels').innerText = `[ ${reels[0]} ] [ ${reels[1]} ] [ ${reels[2]} ]`;
  const win = reels[0] === reels[1] && reels[1] === reels[2];
  document.getElementById('slotResult').innerText = win ? "🎉 You win!" : "Try again!";
}

// Blackjack
let player = [];
let dealer = [];

function drawCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function resetBlackjack() {
  player = [drawCard(), drawCard()];
  dealer = [drawCard()];
  updateBlackjackUI();
}

function updateBlackjackUI() {
  document.getElementById('playerHand').innerText = player.join(', ') + " = " + getTotal(player);
  document.getElementById('dealerHand').innerText = dealer.join(', ') + " = " + getTotal(dealer);
}

function getTotal(hand) {
  return hand.reduce((a, b) => a + b, 0);
}

function hit() {
  player.push(drawCard());
  updateBlackjackUI();
  if (getTotal(player) > 21) {
    document.getElementById('blackjackResult').innerText = "💥 Bust! Dealer wins.";
  }
}

function stand() {
  while (getTotal(dealer) < 17) {
    dealer.push(drawCard());
  }
  updateBlackjackUI();
  const playerTotal = getTotal(player);
  const dealerTotal = getTotal(dealer);

  let result = "";
  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    result = "🎉 You win!";
  } else if (dealerTotal === playerTotal) {
    result = "🤝 It's a tie.";
  } else {
    result = "❌ Dealer wins.";
  }
  document.getElementById('blackjackResult').innerText = result;
}

resetBlackjack();

// Plinko
function dropPlinko() {
  const outcomes = ["0.1 Amina", "0.25 Amina", "0.5 Amina", "1 Amina", "0"];
  const result = outcomes[Math.floor(Math.random() * outcomes.length)];
  document.getElementById('plinkoResult').innerText = "🎯 You won: " + result;
}

// Donate
function donate() {
  const address = "6ZL5LU6ZOG5SQLYD2GLBGFZK7TKM2BB7WGFZCRILWPRRHLH3NYVU5BASYI";
  prompt("Send Amina donations to this wallet:", address);
}
