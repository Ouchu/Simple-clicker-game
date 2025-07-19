// Game Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const startButton = document.getElementById('startButton');
const backgroundMusic = document.getElementById('backgroundMusic');

// Game Variables
let score = 0;
let timeLeft = 30; // seconds
let gameInterval;
let target = { x: 0, y: 0, radius: 30, color: 'red' };
let gameRunning = false;

// --- Music Control ---
// Important: Audio must be initiated by a user gesture.
// We'll play it when the game starts.

// Function to play background music
function playBackgroundMusic() {
    // Set the source of the music. Make sure 'background_music.mp3' exists in the 'music' folder.
    backgroundMusic.src = 'music/background_music.mp3';
    backgroundMusic.volume = 0.5; // Set volume (0.0 to 1.0)
    backgroundMusic.play().catch(error => {
        console.error("Error playing music:", error);
        // This error often means the browser prevented autoplay.
        // User interaction (like clicking Start) should fix it.
    });
}

// Function to stop background music
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Rewind to start
}

// --- Game Logic ---

// Function to set a new target position
function setNewTarget() {
    target.x = Math.random() * (canvas.width - target.radius * 2) + target.radius;
    target.y = Math.random() * (canvas.height - target.radius * 2) + target.radius;
}

// Function to draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw target
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = target.color;
    ctx.fill();
    ctx.closePath();
}

// Update game state
function updateGame() {
    if (!gameRunning) return;

    timeLeft--;
    timeElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        endGame();
    }
}

// Initialize and start the game
function startGame() {
    score = 0;
    timeLeft = 30;
    gameRunning = true;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    startButton.style.display = 'none'; // Hide start button

    setNewTarget(); // Place initial target
    draw(); // Draw initial state

    // Start game timer
    gameInterval = setInterval(updateGame, 1000); // Update every second

    playBackgroundMusic(); // Start playing music when game begins
}

// End the game
function endGame() {
    gameRunning = false;
    clearInterval(gameInterval); // Stop game timer
    startButton.textContent = 'Play Again';
    startButton.style.display = 'block'; // Show start button
    stopBackgroundMusic(); // Stop music when game ends
    alert(`Game Over! Your score: ${score}`);
}

// Handle clicks on the canvas
canvas.addEventListener('click', (event) => {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const distance = Math.sqrt(
        Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)
    );

    if (distance < target.radius) {
        score += 1;
        scoreElement.textContent = score;
        setNewTarget(); // Move target
        draw(); // Redraw target
    }
});

// Event listener for the start button
startButton.addEventListener('click', startGame);

// Initial draw to show the canvas before starting
draw();
