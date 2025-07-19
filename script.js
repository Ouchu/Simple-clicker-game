document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('time');
    const backgroundMusic = document.getElementById('backgroundMusic');

    let score = 0;
    let timeLeft = 30; // seconds
    let gameInterval;
    let targetInterval;
    let target = { x: 0, y: 0, radius: 20 };
    let gameActive = false;

    // Function to set up a new random target
    function setNewTarget() {
        target.x = Math.random() * (gameCanvas.width - target.radius * 2) + target.radius;
        target.y = Math.random() * (gameCanvas.height - target.radius * 2) + target.radius;
    }

    // Function to draw the game elements
    function drawGame() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear canvas

        // Draw target
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }

    // Handle clicks on the canvas
    gameCanvas.addEventListener('click', (event) => {
        if (!gameActive) return;

        const rect = gameCanvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Check if click is inside the target
        const distance = Math.sqrt((clickX - target.x)**2 + (clickY - target.y)**2);
        if (distance < target.radius) {
            score++;
            scoreDisplay.textContent = score;
            setNewTarget(); // Move target to a new position
        }
    });

    // Game loop for drawing
    function gameLoop() {
        drawGame();
        if (gameActive && timeLeft > 0) {
            requestAnimationFrame(gameLoop);
        }
    }

    // Start the game
    function startGame() {
        if (gameActive) return; // Prevent multiple starts

        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
        gameActive = true;
        startButton.style.display = 'none'; // Hide the start button

        setNewTarget(); // Set initial target
        gameLoop(); // Start drawing

        // Start background music
        backgroundMusic.play().catch(error => {
            console.error("Error playing music:", error);
            // This error often happens if the user hasn't interacted with the page yet.
            // Modern browsers require user interaction before autoplaying media.
            // We can add a fallback or a play button.
        });

        gameInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        // Optional: Move target periodically (e.g., every 1 second)
        targetInterval = setInterval(() => {
            if (gameActive) {
                setNewTarget();
            }
        }, 1000); // Target moves every 1 second
    }

    // End the game
    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        clearInterval(targetInterval);
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Rewind music
        alert(`Game Over! Your score: ${score}`);
        startButton.style.display = 'block'; // Show the start button again
    }

    // Event listener for the start button
    startButton.addEventListener('click', startGame);

    // Initial setup (draw game elements once)
    drawGame();
});
