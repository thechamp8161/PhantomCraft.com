// Global Variables (use secure keys in production)
const userId = "demo-user";
const jwtToken = "YOUR_JWT_TOKEN_HERE";
let isPaidUser = false;
const apiBase = "PhantomCraft API URL HERE";

// Helper functions
function getAuthHeaders(withContentType = false) {
    const headers = {
        'Authorization': `Bearer ${jwtToken}`
    };
    if (withContentType) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
}

function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: getAuthHeaders(body ? true : false)
    };
    if (body) options.body = JSON.stringify(body);
    return fetch(`${apiBase}${endpoint}`, options).then(res => res.json());
}

// DOM Listeners & Initialization
document.getElementById('generate-btn').addEventListener('click', generateComment);
document.addEventListener('DOMContentLoaded', () => {
    generateComment();
    fetchPaymentStatus();
});
document.getElementById('submit-feedback-btn').addEventListener('click', sendFeedback);

// Comment Generation Functions
function getVerbPhrase(tone) {
    let baseVerbs;
    switch (tone) {
        case "funny":
            baseVerbs = ["cracks up", "juggles", "spins a laugh"];
            break;
        case "professional":
            baseVerbs = ["analyzes", "breaks down", "provides insights on"];
            break;
        case "sarcastic":
            baseVerbs = ["sneers at", "rolls its eyes at", "mockingly critiques"];
            break;
        case "friendly":
            baseVerbs = ["greets", "smiles at", "warmly embraces"];
            break;
        case "excited":
            baseVerbs = ["bursts out over", "buzzes about", "celebrates"];
            break;
        case "inspirational":
            baseVerbs = ["inspires", "motivates", "sparks passion for"];
            break;
        case "melancholic":
            baseVerbs = ["mourns", "reflects upon", "saddens over"];
            break;
        case "optimistic":
            baseVerbs = ["brightens", "promises hope to", "envisions"];
            break;
        case "pessimistic":
            baseVerbs = ["questions", "casts doubt on", "grimly views"];
            break;
        case "motivational":
            baseVerbs = ["drives", "propels", "encourages"];
            break;
        case "romantic":
            baseVerbs = ["whispers to", "caresses", "embraces"];
            break;
        case "witty":
            baseVerbs = ["winks at", "quipfully juggles", "playfully teases"];
            break;
        default:
            baseVerbs = ["comments on"];
    }
    const adverbs = ["remarkably", "unexpectedly", "simply", "notably", "incredibly"];
    return (Math.random() > 0.5 ? adverbs[Math.floor(Math.random() * adverbs.length)] + " " : "") +
           baseVerbs[Math.floor(Math.random() * baseVerbs.length)];
}

function getTopic(platform) {
    let seed;
    if (platform === "x") {
        seed = ["global headlines", "market trends", "tech breakthroughs", "viral controversies"];
    } else if (platform === "facebook") {
        seed = ["community events", "social initiatives", "local gatherings", "cultural shifts"];
    } else if (platform === "linkedin") {
        seed = ["industry insights", "economic forecasts", "business strategies", "professional milestones"];
    } else {
        seed = ["current events", "latest developments"];
    }
    return seed[Math.floor(Math.random() * seed.length)];
}

function generateRandomComment(tone, platform) {
    const intros = ["Today", "Right now", "At this moment", "Currently"];
    const intro = intros[Math.floor(Math.random() * intros.length)];
    const platformName = platform.toUpperCase();
    return `${intro}, ${platformName} ${getVerbPhrase(tone)} ${getTopic(platform)}.`;
}

function generateExtraPhrase() {
    const extras = [
        "Embrace life’s endless adventures.",
        "Forge ahead with boundless curiosity.",
        "Let your journey inspire every step.",
        "Celebrate the beauty of unexpected moments.",
        "Harness your dreams to shape a brighter future."
    ];
    return extras[Math.floor(Math.random() * extras.length)];
}

function generateComment() {
    const platformSelect = document.getElementById('platform');
    const toneSelect = document.getElementById('tone');
    let platform = platformSelect.value;
    let tone = toneSelect.value;
    const commentOutput = document.getElementById('generated-comment');

    if (platform === 'linkedin' && tone !== 'professional') {
        tone = 'professional';
        console.log("LinkedIn selected, forcing professional tone.");
    }
    let randomComment = generateRandomComment(tone, platform);
    randomComment = randomComment.replace(/CommentCraft/gi, "PhantomCraft").trim();
    let words = randomComment.split(/\s+/);
    if (words.length < 12) {
        randomComment += " " + generateExtraPhrase();
    }
    words = randomComment.split(/\s+/);
    if (!isPaidUser && words.length > 30) {
        randomComment = words.slice(0, 30).join(" ") + "...";
    }
    commentOutput.textContent = randomComment;
    return randomComment;
}

function redirectTo(url) {
    window.open(url, "_blank");
}

function shareComment(selectedPlatform) {
    const currentComment = document.getElementById('generated-comment').textContent;
    const currentUrl = window.location.href;
    let url = "";
    switch (selectedPlatform) {
        case 'x':
            url = `https://x.com/intent/tweet?text=${encodeURIComponent(currentComment)}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(currentComment)}`;
            break;
        case 'linkedin':
            url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
            break;
        case 'instagram':
            alert("Sharing to Instagram is not supported via web.");
            break;
        case 'tiktok':
            alert("Sharing to TikTok is not supported via web.");
            break;
        case 'reddit':
            url = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(currentComment)}`;
            break;
        case 'pinterest':
            url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(currentComment)}`;
            break;
        default:
            url = "";
    }
    if (url) redirectTo(url);
}

function copyComment() {
    const comment = document.getElementById('generated-comment').textContent;
    navigator.clipboard.writeText(comment)
        .then(() => {
            alert("Comment copied to clipboard!");
        })
        .catch(() => {
            alert("Failed to copy comment.");
        });
}

// Payment & Feedback Functions
function showPayment(tier) {
    document.getElementById('payment-modal').style.display = 'block';
    const paymentText = document.getElementById('payment-text');
    const paymentLink = document.getElementById('payment-link');
    if (tier === 'pro') {
        paymentText.textContent = "Pro Tier Subscription: €8/month";
        paymentLink.href = "https://buy.stripe.com/bIYaG70YAf3IgCIfZ0";
    } else if (tier === 'gold') {
        paymentText.textContent = "Gold Tier Subscription: €13/month";
        paymentLink.href = "https://buy.stripe.com/00geWn36IbRwaekaEH";
    }
}

function closePayment() {
    document.getElementById('payment-modal').style.display = 'none';
}

function showFeedback() {
    document.getElementById('feedback-modal').style.display = 'block';
}

function closeFeedback() {
    document.getElementById('feedback-modal').style.display = 'none';
}

function sendFeedback() {
    const feedback = document.getElementById('feedback-textarea').value;
    if (feedback.trim() !== "") {
        alert("Thank you for your feedback!");
        document.getElementById('feedback-textarea').value = "";
        closeFeedback();
    } else {
        alert("Please enter your feedback before sending.");
    }
}

function checkPaymentStatus() {
    apiRequest(`/payment-status/${userId}`, 'GET')
        .then(data => {
            if (data.paid) {
                isPaidUser = true;
                const modal = document.getElementById('payment-modal');
                modal.innerHTML = '<h2>Payment Verified!</h2><p>Premium features are now unlocked.</p><button class="close-btn" onclick="closePayment()">Close</button>';
            } else {
                alert("Payment not yet verified. Please complete payment and try again.");
            }
        })
        .catch(err => {
            console.error("Error checking payment status:", err);
            alert("Error checking payment status. Please try again later.");
        });
}

function fetchPaymentStatus() {
    console.log(`Fetching payment status for ${userId}...`);
    apiRequest(`/payment-status/${userId}`, 'GET')
        .then(data => {
            console.log('Payment status fetched:', data);
            isPaidUser = data.paid;
            updatePremiumUI();
        })
        .catch(err => {
            console.error("Error fetching payment status:", err);
        });
}

function updatePremiumUI() {
    const premiumContainer = document.getElementById('premium-status');
    premiumContainer.innerHTML = "";
    if (isPaidUser) {
        console.log("User is paid. Unlocking premium features.");
        premiumContainer.innerHTML = "<p style='color: green;'>Premium features unlocked! <button id='refund-payment-btn' onclick='refundPayment()'>Request Refund</button> <button id='cancel-subscription-btn' onclick='cancelSubscription()'>Cancel Subscription</button></p>";
    } else {
        console.log("User is not paid. Displaying upgrade prompt.");
        premiumContainer.innerHTML = "<p style='color: red;'>Upgrade to unlock premium features.</p>";
    }
}

function refundPayment() {
    if (!confirm("Are you sure you want to request a refund?")) {
        return;
    }
    apiRequest(`/refund-payment/${userId}`, 'POST', { userId: userId })
        .then(data => {
            if (data.refunded) {
                alert("Your refund has been processed.");
                isPaidUser = false;
                updatePremiumUI();
            } else {
                alert("Refund unsuccessful. Please contact support.");
            }
        })
        .catch(err => {
            console.error("Error processing refund:", err);
            alert("Error processing refund. Please try again later.");
        });
}

function cancelSubscription() {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
        return;
    }
    apiRequest(`/cancel-subscription/${userId}`, 'POST', { userId: userId })
        .then(data => {
            if (data.cancelled) {
                alert("Your subscription has been cancelled.");
                isPaidUser = false;
                updatePremiumUI();
            } else {
                alert("Subscription cancellation unsuccessful. Please contact support.");
            }
        })
        .catch(err => {
            console.error("Error cancelling subscription:", err);
            alert("Error cancelling subscription. Please try again later.");
        });
}