// ... Keep all previous functions (Sidebar, Toast, Form, Countdown) ...

// --- Intro Video Splash Screen Logic ---
function startExperience() {
    const introVideo = document.getElementById('intro-video');
    const splashScreen = document.getElementById('splash-screen');
    const gateContent = document.getElementById('gate-content');

    if (introVideo && splashScreen) {
        // 1. Hide the Button/Logo instantly
        gateContent.style.display = 'none';
        
        // 2. Show the video, unmute it, and play
        introVideo.style.display = 'block';
        introVideo.muted = false; 
        introVideo.play();

        // 3. Listen for the exact moment the video finishes
        introVideo.addEventListener('ended', () => {
            // Trigger the transition
            splashScreen.classList.add('splash-fade-zoom');
            
            // Completely remove from view
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 1000);
        });
    }
}

// Ensure the rest of the scripts (like countdown) load normally
document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
});
