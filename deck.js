    
document.addEventListener('DOMContentLoaded', () => {    
 
    // 1. DECK PAGE: VARIABLES & SETUP
    const filterBtns = document.querySelectorAll('.deck-filter-btn');
    if (filterBtns.length === 0) return; 

    const deckWrappers = document.querySelectorAll('.deck-card-wrapper');
    const favBtns = document.querySelectorAll('.fav-btn');
    const favCountSpan = document.getElementById('fav-count');

    // Load saved favorites from the browser's Local Storage, or start with an empty array
    let favorites = JSON.parse(localStorage.getItem('pokeDecksFavorites')) || [];

    
    // 2. FAVORITES LOGIC
    const updateFavCount = () => {
        if (favorites.length === 0) {
            favCountSpan.textContent = "No favorites saved yet";
        } else {
            favCountSpan.textContent = `${favorites.length} Favorite${favorites.length !== 1 ? 's' : ''} Saved`;
        }
    };

    // Initialize the favorite buttons based on what is in Local Storage
    favBtns.forEach(btn => {
        const deckId = btn.getAttribute('data-deck');
        if (favorites.includes(deckId)) {
            btn.classList.add('active');
            btn.textContent = 'Favorited';
        }
    });

    updateFavCount(); // Run once on load

    // Handle clicks on the favorite buttons
    favBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const deckId = btn.getAttribute('data-deck');
            const card = btn.closest('.deck-card');

            if (favorites.includes(deckId)) {
                // REMOVE from favorites
                favorites = favorites.filter(id => id !== deckId);
                btn.classList.remove('active');
                btn.textContent = 'Favorite';
                
                // If the user is currently viewing the "Favorites" filter, hide the card immediately
                const currentFilter = document.querySelector('.deck-filter-btn.active').getAttribute('data-filter');
                if (currentFilter === 'favorites') {
                    btn.closest('.deck-card-wrapper').style.display = 'none';
                }
            } else {
                // ADD to favorites
                favorites.push(deckId);
                btn.classList.add('active');
                btn.textContent = 'Favorited';

                // Trigger the CSS flash animation you set up
                card.classList.add('fav-flash');
                setTimeout(() => card.classList.remove('fav-flash'), 600);
            }

            // Save the updated array back to Local Storage
            localStorage.setItem('pokeDecksFavorites', JSON.stringify(favorites));
            updateFavCount();
        });
    });


    // 3. FILTERING LOGIC
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove 'active' class from all buttons, add to the clicked one
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Loop through all deck cards and show/hide based on the filter
            deckWrappers.forEach(wrapper => {
                if (filterValue === 'all') {
                    wrapper.style.display = 'block';
                } else if (filterValue === 'favorites') {
                    // Check if the specific card's ID is in our favorites array
                    const deckId = wrapper.querySelector('.fav-btn').getAttribute('data-deck');
                    if (favorites.includes(deckId)) {
                        wrapper.style.display = 'block';
                    } else {
                        wrapper.style.display = 'none';
                    }
                } else {
                    // Standard elemental type filter
                    if (wrapper.getAttribute('data-type') === filterValue) {
                        wrapper.style.display = 'block';
                    } else {
                        wrapper.style.display = 'none';
                    }
                }
            });
        });
    });
});
