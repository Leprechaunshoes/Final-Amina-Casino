// --- Casino House and Circulation Logic ---
let houseBalance = 475.0; // House starts with 475 Amina
const totalCoins = 1000.0;
let playerRealBalance = 10.0; // Real Amina balance
let playerPlayBalance = 1000.0; // Play money balance
let usePlayMoney = true; // Start in play money mode

// --- Utility Functions ---
function updateBalances() {
    const resultDiv = document.getElementById('result');
    let balanceHtml = `
        <div style="margin-bottom:12px;">
            <strong>House Balance:</strong> ${houseBalance.toFixed(2)} Amina<br>
            <strong>Your Balance:</strong> ${(usePlayMoney ? playerPlayBalance : playerRealBalance).toFixed(2)} ${usePlayMoney ? 'Play Money' : 'Amina'}<br>
            <strong>Total Coins in Circulation:</strong> ${totalCoins.toFixed(2)} Amina
        </div>
    `;
    resultDiv.innerHTML = balanceHtml;
}

// --- Toggle Between Real and Play Money ---
function toggleMoney() {
    usePlayMoney = !usePlayMoney;
    alert(`Switched to ${usePlayMoney ? 'Play Money' : 'Real Amina'} mode.`);
    updateBalances();
}

// --- Fractal Betting Prompt ---
function getBetAmount() {
    let balance = usePlayMoney ? playerPlayBalance : playerRealBalance;
    let bet = prompt(`How much would you like to bet? (You have ${balance.toFixed(2)} ${usePlayMoney ? 'Play Money' : 'Amina'})`);
    if (bet === null) return null;
    bet = parseFloat(bet);
    if (isNaN(bet) || bet <= 0) {
        alert("Please enter a valid positive number.");
        return null;
    }
    if (bet > balance) {
        alert("You don't have enough to make that bet.");
        return null;
    }
    return bet;
}

// --- Game Functions (Slot, Blackjack, Plinko) ---
function playGame(odds, multiplier, gameName) {
    updateBalances();
    let bet = getBetAmount();
    if (bet === null) return;

    let win = Math.random() < odds;
    let payout = win ? bet * multiplier : 0;

    if (win && payout > houseBalance) {
        alert("The house can't cover this payout. Try a smaller bet.");
        return;
    }

    let balance = usePlayMoney ? playerPlayBalance : playerRealBalance;
    let message = "";
    if (win) {
        balance += payout;
        houseBalance -= payout;
        message = `🎉 ${gameName} WIN! You WON ${payout.toFixed(2)}!`;
    } else {
        balance -= bet;
        houseBalance += bet;
        message = `😢 ${gameName} lost. You lost ${bet.toFixed(2)}.`;
    }

    if (usePlayMoney) {
        playerPlayBalance = balance;
    } else {
        playerRealBalance = balance;
    }

    updateBalances();
    document.getElementById('result').innerHTML += `<div style="margin-top:14px;">${message}</div>`;
}

function playSlot() {
    playGame(0.2, 4, "Slot");
}

function playBlackjack() {
    playGame(0.45, 2, "Blackjack");
}

function playPlinko() {
    playGame(0.1, 10, "Plinko");
}

// --- On Load ---
window.onload = updateBalances;
