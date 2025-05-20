// scripts.js

let walletConnected = false;
let balance = 0;
let isPlayMode = true;
let houseCoins = 1000;

// Load Popcorn song
const popcorn = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
popcorn.loop = true;

document.getElementById("togglePlayMode").addEventListener("click", () => {
    isPlayMode = !isPlayMode;
    document.getElementById("modeStatus").innerText = isPlayMode ? "PLAY MODE (HC)" : "REAL MODE (Amina)";
});

document.getElementById("connectWallet").addEventListener("click", () => {
    // Mock wallet connection (replace with Pera integration)
    walletConnected = true;
    balance = 10; // Replace with actual balance from Pera
    document.getElementById("walletStatus").innerText = "Wallet Connected: 10 Amina";
});

document.getElementById("popcornToggle").addEventListener("click", () => {
    if (popcorn.paused) {
        popcorn.play();
        document.getElementById("popcornToggle").innerText = "Stop Popcorn";
    } else {
        popcorn.pause();
        document.getElementById("popcornToggle").innerText = "Play Popcorn";
    }
});

// Slot Machine Logic
document.getElementById("slotSpin").addEventListener("click", () => {
    const reels = ["🍒", "🍋", "🔔", "⭐", "💎"];
    const slot1 = reels[Math.floor(Math.random() * reels.length)];
    const slot2 = reels[Math.floor(Math.random() * reels.length)];
    const slot3 = reels[Math.floor(Math.random() * reels.length)];

    document.getElementById("slotResult").innerText = `${slot1} ${slot2} ${slot3}`;

    if (slot1 === slot2 && slot2 === slot3) {
        alert("🎉 You win!");
    } else {
        alert("Try again!");
    }
});

// Blackjack Logic (Basic Example)
document.getElementById("dealCards").addEventListener("click", () => {
    const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const playerCard1 = cards[Math.floor(Math.random() * cards.length)];
    const playerCard2 = cards[Math.floor(Math.random() * cards.length)];
    document.getElementById("blackjackCards").innerText = `Player: ${playerCard1}, ${playerCard2}`;
});

// Plinko Logic
document.getElementById("dropPlinko").addEventListener("click", () => {
    const outcomes = [0.2, 0.5, 1, 2, 5, 10];
    const chosen = outcomes[Math.floor(Math.random() * outcomes.length)];
    document.getElementById("plinkoResult").innerText = `🏆 Multiplier: x${chosen}`;
});

// Donate Button
document.getElementById("donate").addEventListener("click", () => {
    window.open("https://app.perawallet.com/transfer?asset=1107424865&amount=1&to=6ZL5LU6ZOG5SQLYD2GLBGFZK7TKM2BB7WGFZCRILWPRRHLH3NYVU5BASYI", "_blank");
});
