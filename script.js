
// STARTER GIFTS
const starterGifts = [
    {
        name: "Gaming PC RAM",
        price: "$100",
        priority: "HIGH",
        image: "https://placehold.co/300x200?text=RAM",
        link: ""
    },
    {
        name: "New Gaming Headset",
        price: "$80",
        priority: "MEDIUM",
        image: "https://placehold.co/300x200?text=Headset",
        link: ""
    }
];

// LOAD SAVED GIFTS
let gifts = JSON.parse(localStorage.getItem("gifts")) || starterGifts;
let isLocked = localStorage.getItem("wishlistLocked") === "true";

// CONNECT HTML ELEMENTS
const giftList = document.getElementById("gift-list");
const form = document.getElementById("gift-form");
const lockButton = document.getElementById("lock-button");
const totalElement = document.getElementById("wishlist-total");
const totalGiftsElement = document.getElementById("total-gifts");
const statsCostElement = document.getElementById("stats-cost");
const averagePriceElement = document.getElementById("average-price");
const highPriorityElement = document.getElementById("high-priority");

// GET NUMERIC PRICE FROM A GIFT
function getGiftPrice(gift) {
    return parseFloat(
        String(gift.price).replace(/[^0-9.-]/g, "")
    ) || 0;
}

// DISPLAY GIFTS AND STATISTICS
function displayGifts() {
    giftList.innerHTML = "";

    const total = gifts.reduce((sum, gift) => {
        return sum + getGiftPrice(gift);
    }, 0);

    totalElement.textContent =
        "🎁 Total Wishlist Cost: $" + total.toFixed(2);

    // Update statistics
    totalGiftsElement.textContent = gifts.length;
    statsCostElement.textContent = "$" + total.toFixed(2);

    const average = gifts.length > 0 ? total / gifts.length : 0;

    averagePriceElement.textContent = "$" + average.toFixed(2);

    highPriorityElement.textContent = gifts.filter(
        gift => gift.priority === "HIGH"
    ).length;

    form.style.display = isLocked ? "none" : "flex";

    lockButton.textContent = isLocked
        ? "🔓 Unlock Wishlist"
        : "🔒 Finalize Wishlist";

    gifts.forEach(gift => {
        const card = document.createElement("div");
        card.className = "gift-card";

        const img = document.createElement("img");
        img.src = gift.image || "https://placehold.co/300x200?text=Gift";
        img.alt = gift.name;

        const name = document.createElement("h3");
        name.textContent = gift.name;

        const price = document.createElement("p");
        price.textContent = "Price: " + gift.price;

        const priority = document.createElement("p");
        priority.textContent = "Priority: " + gift.priority;

        card.append(img, name, price, priority);

        const actions = document.createElement("div");
        actions.className = "gift-actions";

        // Product link
        if (gift.link) {
            const productLink = document.createElement("a");
            productLink.href = gift.link;
            productLink.textContent = "🛒 View Product";
            productLink.target = "_blank";
            productLink.rel = "noopener noreferrer";
            actions.appendChild(productLink);
        }

        // Delete button
        if (!isLocked) {
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "🗑️ Remove Gift";

            deleteButton.addEventListener("click", function() {
                gifts = gifts.filter(item => item !== gift);

                localStorage.setItem("gifts", JSON.stringify(gifts));

                displayGifts();
                updateBudget();
            });

            actions.appendChild(deleteButton);
        }

        card.appendChild(actions);
        giftList.appendChild(card);
    });
}

// ADD NEW GIFTS
form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (isLocked) return;

    const newGift = {
        name: document.getElementById("gift-name").value,
        price: document.getElementById("gift-price").value,
        image: document.getElementById("gift-image").value,
        link: document.getElementById("gift-link").value,
        priority: document.getElementById("gift-priority").value
    };

    gifts.push(newGift);

    localStorage.setItem("gifts", JSON.stringify(gifts));

    displayGifts();
    updateBudget();
    form.reset();
});

// FINALIZE AND UNLOCK WISHLIST
lockButton.addEventListener("click", function() {
    if (!isLocked) {
        const confirmLock = confirm(
            "Are you sure you want to finalize your wishlist?"
        );

        if (confirmLock) {
            isLocked = true;
            localStorage.setItem("wishlistLocked", "true");
            displayGifts();
        }
    } else {
        const password = prompt("Enter the password to unlock:");

        if (password === "1021") {
            isLocked = false;
            localStorage.setItem("wishlistLocked", "false");
            displayGifts();
        } else if (password !== null) {
            alert("Incorrect password!");
        }
    }
});

// SHOW EVERYTHING
displayGifts();

// TAB SWITCHING
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
    button.addEventListener("click", function() {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(tab => tab.classList.remove("active"));

        button.classList.add("active");

        document.getElementById(
            button.dataset.tab + "-tab"
        ).classList.add("active");
    });
});

// CHRISTMAS COUNTDOWN
function updateCountdown() {
    const christmas = new Date(2026, 11, 25, 0, 0, 0);
    const now = new Date();

    const difference = christmas - now;

    const timer = document.getElementById("countdown-timer");

    if (difference <= 0) {
        timer.textContent = "🎄 Merry Christmas!";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    timer.textContent =
        `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// CHRISTMAS BUDGET TRACKER

const budgetInput = document.getElementById("budget-input");
const saveBudgetButton = document.getElementById("save-budget");

const budgetTotal = document.getElementById("budget-total");
const budgetSpent = document.getElementById("budget-spent");
const budgetLeft = document.getElementById("budget-left");
const budgetProgress = document.getElementById("budget-progress");
const budgetMessage = document.getElementById("budget-message");

// LOAD SAVED BUDGET
let budget = Number(localStorage.getItem("christmasBudget")) || 0;

budgetInput.value = budget || "";

// UPDATE BUDGET INFORMATION
function updateBudget() {
    const totalSpent = gifts.reduce((sum, gift) => {
        return sum + getGiftPrice(gift);
    }, 0);

    const remaining = budget - totalSpent;

    budgetTotal.textContent = "$" + budget.toFixed(2);
    budgetSpent.textContent = "$" + totalSpent.toFixed(2);
    budgetLeft.textContent = "$" + remaining.toFixed(2);

    const percentage = budget > 0
        ? (totalSpent / budget) * 100
        : 0;

    budgetProgress.style.width = Math.min(percentage, 100) + "%";

    if (budget === 0) {
        budgetMessage.textContent = "Set your budget to get started!";
        budgetProgress.style.background = "#2dc653";
    } else if (remaining < 0) {
        budgetMessage.textContent = "⚠️ You're over budget!";
        budgetProgress.style.background = "#e63946";
    } else {
        budgetMessage.textContent = "🎄 You have money left to spend!";
        budgetProgress.style.background = "#2dc653";
    }

    // Refresh gift suggestions whenever the budget changes
    showBudgetSuggestions();
}

// SAVE BUDGET
// UPDATE SUGGESTIONS WHILE TYPING
budgetInput.addEventListener("input", function() {
    const newBudget = Number(budgetInput.value);

    if (budgetInput.value.trim() === "" || newBudget < 0) return;

    budget = newBudget;
    showBudgetSuggestions();
});

// SAVE BUDGET
saveBudgetButton.addEventListener("click", function() {
    const newBudget = Number(budgetInput.value);

    if (
        budgetInput.value.trim() === "" ||
        !Number.isFinite(newBudget) ||
        newBudget < 0
    ) {
        alert("Please enter a valid budget!");
        return;
    }

    budget = newBudget;
    localStorage.setItem("christmasBudget", budget);
    updateBudget();
});

// GIFT SUGGESTIONS FROM YOUR ACTUAL WISHLIST

function showBudgetSuggestions() {
    const suggestionList = document.getElementById("suggestion-list");

    if (!suggestionList) return;

    suggestionList.innerHTML = "";

    if (budget <= 0) {
        suggestionList.textContent = "Set a budget first!";
        return;
    }

    const priorityPoints = {
        HIGH: 100,
        MEDIUM: 10,
        LOW: 1
    };

    const validGifts = gifts
        .map(gift => ({
            ...gift,
            numericPrice: getGiftPrice(gift),
            priorityScore: priorityPoints[gift.priority] || 1
        }))
        .filter(gift => gift.numericPrice > 0)
        .slice(0, 20);

    let bestCombination = [];
    let bestScore = -1;
    let bestTotal = 0;

    const totalCombinations = 1 << validGifts.length;

    for (let mask = 1; mask < totalCombinations; mask++) {
        let combination = [];
        let total = 0;
        let score = 0;

        for (let i = 0; i < validGifts.length; i++) {
            if (mask & (1 << i)) {
                const gift = validGifts[i];

                combination.push(gift);
                total += gift.numericPrice;
                score += gift.priorityScore;
            }
        }

        if (total <= budget) {
            if (
                score > bestScore ||
                (score === bestScore && total > bestTotal)
            ) {
                bestScore = score;
                bestTotal = total;
                bestCombination = combination;
            }
        }
    }

    if (bestCombination.length === 0) {
        suggestionList.textContent =
            "No combination of wishlist gifts fits your budget.";
        return;
    }

    const heading = document.createElement("h3");
    heading.textContent = "🎄 Best combination for your budget!";
    suggestionList.appendChild(heading);

    bestCombination.forEach(gift => {
        const card = document.createElement("div");
        card.className = "suggestion-card";

        const name = document.createElement("h3");
        name.textContent = "🎁 " + gift.name;

        const price = document.createElement("p");
        price.className = "suggestion-price";
        price.textContent = "$" + gift.numericPrice.toFixed(2);

        const priority = document.createElement("p");
        priority.textContent = "Priority: " + gift.priority;

        card.append(name, price, priority);
        suggestionList.appendChild(card);
    });

    const totalDisplay = document.createElement("h3");
    totalDisplay.textContent = "Total: $" + bestTotal.toFixed(2);

    const leftover = document.createElement("p");
    leftover.textContent =
        "💰 Money left: $" + (budget - bestTotal).toFixed(2);

    suggestionList.append(totalDisplay, leftover);
}

