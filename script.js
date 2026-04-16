$(document).ready(function () {

    let page = 1;

    //Get those input values
    function getParams(pageNum) {
        let name = $('#search-name').val();
        let type = $('#search-type').val();
        let rarity = $('#search-rarity').val();
        sessionStorage.setItem('userLastSearch',name);
        let query = "";

        if (name) query += `name:"${name}*" `;
        if (type) query += `types:${type} `;
        if (rarity) query += `rarity:"${rarity}"`;

        return {
            q: query,
            page: pageNum,
            pageSize: 12
        };
    }

    //Fetch the cards from API
    function getCards(pageNum) {
        page = pageNum;

        $('#result-count').text("Searching...");

        if (pageNum === 1) {
            $('#card-results').empty();
            $('#pagination').empty();
        }
    
        $.ajax({
            url: "https://api.pokemontcg.io/v2/cards",
            method: "GET",
            data: getParams(pageNum),

            success: function (res) {
                let total = res.totalCount || 0;
                $('#result-count').text(total + " Cards Found");

                showCards(res.data);

                if (res.data && res.data.length === 12) {
                    showLoadMore();
                } else {
                    $('#pagination').empty();
                }
            },

            error: function () {
                $('#card-results').html(
                    "<p class='text-danger text-center w-100'>Error loading data</p>"
                );
            }
        });
    }

    //Display the cards 
    function showCards(cards) {
        let container = $('#card-results');

        if (!cards || cards.length === 0) {
            container.html("<p class='text-center w-100'>No results</p>");
            return;
        }

        cards.forEach(function (card) {
            container.append(`
                <div class="col-6 col-md-3 mb-3">
                    <div class="card h-100 shadow-sm bg-dark text-white">
                        <img src="${card.images.small}" class="card-img-top" alt="${card.name}">
                        <div class="card-body text-center p-2">
                            <h6 class="card-title text-truncate mb-1">${card.name}</h6>
                            <small class="text-white-50">${card.set.name}</small>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    //Load the More button 
    function showLoadMore() {
        $('#pagination').html(
            '<button id="more" class="btn btn-danger">Load More</button>'
        );

        $('#more').click(function () {
            $(this).text("Loading...").prop("disabled", true);
            getCards(page + 1);
        });
    }

   //the Types of action to trigger the func
    $('#search-btn').click(function () {
        getCards(1);
        $('#lastSearch').html(sessionStorage.getItem('userLastSearch'));
    });

    $('#search-type, #search-rarity').change(function () {
        getCards(1);
    });

    $('#search-name').keypress(function (e) {
        if (e.which === 13) {
            getCards(1);
            $('#lastSearch').html(sessionStorage.getItem('userLastSearch'));
        }
    });

    getCards(1);

});
