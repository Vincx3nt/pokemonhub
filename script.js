$(document).ready(function() {
    let currentSearchingPage = 1;

    // 1. Collect inputs and format for API
    function getSearchParams(page) {
        const name = $('#search-name').val();
        const type = $('#search-type').val();
        const rarity = $('#search-rarity').val();

        let queryParts = [];
        if (name) queryParts.push(`name:"${name}*"`);
        if (type) queryParts.push(`types:${type}`);
        if (rarity) queryParts.push(`rarity:"${rarity}"`);

        return {
            q: queryParts.join(' '),
            page: page,
            pageSize: 12, // Standard batch size
            orderBy: '-set.releaseDate'
        };
    }

    // 2. Fetch data from Pokemon TCG API
    function fetchCards(page) {
        currentSearchingPage = page;
        
        $('#result-count').text('Searching database...');
        
        if (page === 1) {
            $('#card-results').empty();
            $('#pagination').empty();
        }

        $.ajax({
            url: 'https://api.pokemontcg.io/v2/cards',
            method: 'GET',
            data: getSearchParams(page),
            success: function(response) {
                $('#poke-spinner').hide();
                const total = response.totalCount || 0;
                $('#result-count').text(`${total.toLocaleString()} Cards Found`);

                displayCards(response.data);

                // If we got a full page of 12, show the button for next page
                if (response.data && response.data.length === 12) {
                    renderLoadMore();
                } else {
                    $('#pagination').empty();
                }
            },
            error: function() {
                $('#card-results').html("<p class='text-danger'>Error: Could not connect to API.</p>");
            }
        });
    }

    // 3. Render cards to the grid
    function displayCards(cards) {
        const grid = $('#card-results');
        if (!cards || cards.length === 0) {
            if (currentSearchingPage === 1) grid.html("<p class='text-center w-100'>No results found.</p>");
            return;
        }

        cards.forEach(function(card) {
            grid.append(`
                <div class="col-6 col-md-3">
                    <div class="card h-100 shadow-sm p-2 bg-dark">
                        <img src="${card.images.small}" class="card-img-top" alt="${card.name}">
                        <div class="card-body text-center p-2">
                            <h6 class="card-title mb-1 text-truncate">${card.name}</h6>
                            <small class="text-white-50" style="font-size:1rem;">${card.set.name}</small>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // 4. Handle Pagination
    function renderLoadMore() {
        $('#pagination').html('<button id="load-more-btn" class="btn">Load More Cards</button>');
        
        $('#load-more-btn').on('click', function() {
            $(this).text('Loading...').prop('disabled', true);
            fetchCards(currentSearchingPage + 1);
        });
    }

    // --- Events ---
    $('#search-btn').on('click', () => fetchCards(1));
    
    $('#search-type, #search-rarity').on('change', () => fetchCards(1));

    $('#search-name').on('keypress', function(e) {
        if (e.which === 13) fetchCards(1);
    });

    // Start with default load
    fetchCards(1);
});