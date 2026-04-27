// Sidebar Toggle Logic
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('expanded');
}

// Ensure clicking a link doesn't instantly close before navigating
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop click from bubbling to the sidebar toggle
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('expanded');
        }
    });
});

// Navigation Logic
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    // Show target section
    document.getElementById(sectionId).classList.add('active');
}

// Form Logic - Add up to 4 players
let playerCount = 1;

function addPlayer() {
    if (playerCount >= 4) {
        alert("You can only register up to 4 players at a time.");
        return;
    }
    
    playerCount++;
    const container = document.getElementById('players-container');
    
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';
    playerCard.innerHTML = `
        <h3>Player ${playerCount} (Optional Email)</h3>
        <div class="form-group">
            <input type="text" id="p${playerCount}-first" placeholder="First Name *" required>
            <input type="text" id="p${playerCount}-last" placeholder="Last Name *" required>
        </div>
        <div class="form-group">
            <input type="email" id="p${playerCount}-email" placeholder="Email Address (Optional)">
        </div>
    `;
    container.appendChild(playerCard);

    if (playerCount === 4) {
        document.getElementById('add-player-btn').style.display = 'none';
    }
}

// Form Submission to Google Sheets
document.getElementById('golf-signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const messageEl = document.getElementById('form-message');
    messageEl.style.color = '#333';
    messageEl.innerText = "Submitting registration... please wait.";

    // Gather data
    let players = [];
    for (let i = 1; i <= playerCount; i++) {
        players.push({
            firstName: document.getElementById(`p${i}-first`).value,
            lastName: document.getElementById(`p${i}-last`).value,
            email: document.getElementById(`p${i}-email`).value || "N/A",
            isPrimary: i === 1
        });
    }

    const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwo-Ni83GNw5nrnpb9Cs79X4IXymmRjyRKxBbfGka73M1z2J7GgASccHLbK50znr-DA0A/exec';

    fetch(GOOGLE_APP_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ players: players })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === 'success') {
            messageEl.style.color = 'green';
            messageEl.innerText = "Registration successful! Thank you.";
            document.getElementById('golf-signup-form').reset();
            // Reset player count visually
            document.getElementById('players-container').innerHTML = `
                <div class="player-card">
                    <h3>Player 1 (Primary Contact)</h3>
                    <div class="form-group">
                        <input type="text" id="p1-first" placeholder="First Name *" required>
                        <input type="text" id="p1-last" placeholder="Last Name *" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="p1-email" placeholder="Email Address *" required>
                    </div>
                </div>
            `;
            playerCount = 1;
            document.getElementById('add-player-btn').style.display = 'block';
        } else {
            throw new Error('Script returned an error');
        }
    })
    .catch(error => {
        messageEl.style.color = 'red';
        messageEl.innerText = "There was an error submitting your form. Please try again.";
        console.error(error);
    });
});
