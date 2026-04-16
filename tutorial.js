document.addEventListener('DOMContentLoaded', () => {
    // Select all video cards
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log("Exploring tutorial library...");
        });
    });
});