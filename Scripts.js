// Amina Casino - Full Logic JS File

// Global state
let isUsingHC = true;
let walletAddress = null;
let aminaBalance = 0;
let hcBalance = 100;
const aminaPerGame = 0.25;
const houseWallet = "6ZL5LU6ZOG5SQLYD2GLBGFZK7TKM2BB7WGFZCRILWPRRHLH3NYVU5BASYI";
const houseRake = 0.05;
const ASA_ID = 1107424865;

// Connect Wallet
async function connectWallet() {
  if (!window.algorand) {
    alert("Please install Pera Wallet or use a wallet-enabled browser.");
    return;
  }

  try {
    const accounts = await window.algorand.connect();
    walletAddress = accounts[0];
    document.getElementById("walletStatus").textContent = `Wallet: ${walletAddress}`;
    fetchAminaBalance();
  } catch (err) {
    console.error("Wallet connection failed:", err);
    alert("Failed to connect wallet.");
  }
}

// Fetch Amina balance
async function fetchAminaBalance() {
  try {
    const response = await fetch(`https://mainnet-idx.algonode.cloud/v2/accounts/${walletAddress}`);
    const data = await response.json();
    const assets = data.account.assets || [];
    const aminaAsset = assets.find(a => a['asset-id'] === ASA_ID);
    aminaBalance = aminaAsset ? aminaAsset.amount / 1e6 : 0;
    document.getElementById("walletBalance").textContent = `Amina Balance: ${aminaBalance.toFixed(2)}`;
  } catch (err) {
    console.error("Error fetching balance:", err);
    alert("Failed to fetch balance.");
  }
}

// Toggle HC / Amina
function toggleMode() {
  isUsingHC = !isUsingHC;
  document.getElementById("modeStatus").textContent = `Mode: ${isUsingHC ? "House Coin" : "Amina Coin"}`;
}

// Play Slot Machine
function playSlot() {
  if (!deductBet()) return;

  const symbols = ['🍒', '🍋', '🔔', '💎'];
  const reels = [randItem(symbols), randItem(symbols), randItem(symbols)];

  document.getElementById("slotResult").textContent = `🎰 ${reels.join(' | ')}`;

  const win = reels.every(s => s === reels[0]);
  if (win) {
    payOut(1.0);
    alert("Slot WIN! +1.0");
  } else {
    alert("Slot loss!");
  }
}

// Play Blackjack (Random win)
function playBlackjack() {
  if (!deductBet()) return;

  const win = Math.random() > 0.5;
  if (win) {
    payOut(0.5);
    alert("Blackjack WIN! +0.5");
  } else {
    alert("Blackjack loss!");
  }
}

// Play Plinko (Simple physics-less RNG)
function playPlinko() {
  if (!deductBet()) return;

  const prize = [0, 0.25, 0.5, 1];
  const result = randItem(prize);
  if (result > 0) {
    payOut(result);
    alert(`Plinko WIN! +${result}`);
  } else {
    alert("Plinko miss!");
  }
}

// Deduct Bet
function deductBet() {
  if (isUsingHC) {
    if (hcBalance < aminaPerGame) {
      alert("Not enough HC.");
      return false;
    }
    hcBalance -= aminaPerGame;
    updateHC();
    return true;
  } else {
    if (!walletAddress || aminaBalance < aminaPerGame) {
      alert("Not enough Amina or wallet not connected.");
      return false;
    }
    aminaBalance -= aminaPerGame;
    sendAmina(houseWallet, aminaPerGame * houseRake); // house rake
    updateWalletBalance();
    return true;
  }
}

// Payout
function payOut(amount) {
  if (isUsingHC) {
    hcBalance += amount;
    updateHC();
  } else {
    sendAmina(walletAddress, amount * (1 - houseRake));
    fetchAminaBalance(); // Refresh after transaction
  }
}

// Update UI
function updateHC() {
  document.getElementById("hcBalance").textContent = `HC: ${hcBalance.toFixed(2)}`;
}
function updateWalletBalance() {
  document.getElementById("walletBalance").textContent = `Amina Balance: ${aminaBalance.toFixed(2)}`;
}

// Random item helper
function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Simulated Amina sender (placeholder - integrate with Pera SDK or backend)
function sendAmina(to, amount) {
  console.log(`Simulated sending ${amount} Amina to ${to}`);
}

// Donation button
function donate() {
  if (!walletAddress) {
    alert("Connect wallet first.");
    return;
  }
  sendAmina(houseWallet, 1.0);
  alert("Thanks for your donation of 1 Amina!");
}
