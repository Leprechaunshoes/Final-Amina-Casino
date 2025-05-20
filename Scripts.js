let balance = {
    amina: 10,
    house: 1000
};
let useHouseCoin = true;
let musicPlaying = false;
let audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Replace with Popcorn mp3 direct link

function toggleCurrency() {
    useHouseCoin = !useHouseCoin;
    updateBalance();
}

function updateBalance() {
    const bal = useHouseCoin ? balance.house : balance.amina;
    document.getElementById("balance").textContent = `${bal.toFixed(2)} ${useHouseCoin ? "HC" : "Amina"}`;
}

function claimDailyBonus() {
    if (useHouseCoin) {
        balance.house += 1000;
        updateBalance();
        alert("You claimed your 1000 HC daily bonus!");
    } else {
        alert("Switch to House Coin mode to claim bonus.");
    }
}

function playSlot() {
    const bet = parseFloat(document.getElementById("bet").value);
    if (!canBet(bet)) return;

    const symbols = ["🍒", "💎", "⭐", "🍋", "🔮"];
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    document.getElementById("slot-reels").textContent = results.join(" | ");

    if (results[0] === results[1] && results[1] === results[2]) {
        let reward = bet * 5;
        addWinnings(reward);
        alert("Jackpot! You won " + reward.toFixed(2));
    } else {
        alert("You lost " + bet.toFixed(2));
    }
    updateBalance();
}

function dealBlackjack() {
    const bet = parseFloat(document.getElementById("bet").value);
    if (!canBet(bet)) return;

    const playerCard = Math.floor(Math.random() * 11) + 1;
    const dealerCard = Math.floor(Math.random() * 11) + 1;

    let resultText = `You: ${playerCard} | Dealer: ${dealerCard} -> `;
    if (playerCard > dealerCard) {
        let reward = bet * 2;
        addWinnings(reward);
        resultText += "You Win!";
    } else if (playerCard === dealerCard) {
        addWinnings(bet);
        resultText += "Draw!";
    } else {
        resultText += "You Lose.";
    }

    document.getElementById("blackjack-result").textContent = resultText;
    updateBalance();
}

function playPlinko() {
    const bet = parseFloat(document.getElementById("bet").value);
    if (!canBet(bet)) return;

    const multipliers = [0, 0.5, 1, 1.5, 3, 5];
    const chosen = multipliers[Math.floor(Math.random() * multipliers.length)];

    let reward = bet * chosen;
    if (reward > 0) {
        addWinnings(reward);
        alert(`Plinko Hit! Multiplier: ${chosen}x -> Won ${reward.toFixed(2)}`);
    } else {
        alert("Plinko missed. You lost.");
    }

    document.getElementById("plinko-result").textContent = `You got ${chosen}x`;
    updateBalance();
}

function canBet(bet) {
    if (isNaN(bet) || bet <= 0 || bet > 1) {
        alert("Enter a valid bet (max 1)");
        return false;
    }

    if (useHouseCoin && balance.house < bet) {
        alert("Not enough House Coins");
        return false;
    }

    if (!useHouseCoin && balance.amina < bet) {
        alert("Not enough Amina");
        return false;
    }

    // Deduct bet with house rake
    const rake = bet * 0.05;
    const finalBet = bet;

    if (useHouseCoin) {
        balance.house -= finalBet;
    } else {
        balance.amina -= finalBet;
        // Send rake to your wallet (mock only)
        console.log(`Sent ${rake.toFixed(2)} Amina as rake`);
    }

    return true;
}

function addWinnings(amount) {
    const rake = amount * 0.05;
    const net = amount - rake;

    if (useHouseCoin) {
        balance.house += net;
    } else {
        balance.amina += net;
        console.log(`House rake: ${rake.toFixed(2)} Amina`);
    }
}

function toggleMusic() {
    if (musicPlaying) {
        audio.pause();
        musicPlaying = false;
    } else {
        audio.loop = true;
        audio.play();
        musicPlaying = true;
    }
}

function connectWallet() {
    alert("Pera Wallet connection is currently mocked. Real integration coming soon.");
}

window.onload = () => {
    updateBalance();
};
