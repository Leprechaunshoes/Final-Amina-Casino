// Global state
let currentMode = "amina";
let wallet = null;

document.querySelectorAll('input[name="currency"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    currentMode = e.target.value;
    console.log("Currency switched to:", currentMode);
  });
});

document.getElementById("connectWallet").onclick = async () => {
  try {
    const accounts = await window.algorand?.connect(); // Pera Wallet API expected
    wallet = accounts[0];
    document.getElementById("walletAddress").innerText = `Connected: ${wallet}`;
  } catch {
    alert("Failed to connect Pera Wallet.");
  }
};

function takeBet() {
  const rake = 0.05;
  const bet = currentMode === "amina" ? 0.25 : 1;
  const houseCut = bet * rake;
  console.log(`Bet: ${bet} ${currentMode} (House takes ${houseCut})`);
  return bet - houseCut;
}

function playSlot() {
  const payout = takeBet();
  const result = Math.random();
  let message = "🎰 You lost!";
  if (result > 0.8) message = `🎉 Big Win! You won ${payout * 3}`;
  else if (result > 0.5) message = `⭐ You won ${payout}`;
  document.getElementById("slotResult").innerText = message;
}

function playBlackjack() {
  const payout = takeBet();
  const player = Math.floor(Math.random() * 21) + 1;
  const dealer = Math.floor(Math.random() * 21) + 1;
  let message = `You: ${player} vs Dealer: ${dealer} — `;
  if (player > dealer) message += `🎉 Win ${payout}`;
  else if (player === dealer) message += "🤝 Push!";
  else message += "💀 Lose!";
  document.getElementById("blackjackResult").innerText = message;
}

function playPlinko() {
  const payout = takeBet();
  const result = Math.random();
  let message = "🪙 You dropped the chip...";
  if (result > 0.9) message += ` Jackpot! 🎯 Won ${payout * 5}`;
  else if (result > 0.6) message += ` Nice! Won ${payout * 2}`;
  else message += " Missed! Try again.";
  document.getElementById("plinkoResult").innerText = message;
}

function toggleMusic() {
  const music = document.getElementById("bgMusic");
  if (music.paused) music.play();
  else music.pause();
}
