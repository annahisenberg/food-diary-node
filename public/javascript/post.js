function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

function addMorePics() {
    $('.img-btn').click(function(e) {
        e.preventDefault();
        $('.addMorePics').append('<input type="file" name="pic" accept="image/*">');
    });
}

function ajaxCall() {
    $('form').submit((e) => {
        e.preventDefault();

        const title = $('.js-title').val();
        const breakfast = $('.js-breakfast').val();
        const lunch = $('.js-lunch').val();
        const dinner = $('.js-dinner').val();
        const snacks = $('.js-snacks').val();
        // const img = $('.js-img').val();
        // const date = $('.js-date').val();
        // const calories = $('.js-calories').val();

        console.log(title, breakfast, lunch, dinner, snacks);


        $.ajax({
            url: '/api/posts',
            method: 'POST',
            data: {
                title,
                breakfast,
                lunch,
                dinner,
                snacks
            },
            success: (response) => {
                if (response) {
                    $('form').append('<p>You just made a post!</p>');
                }
                // sessionStorage.setItem('token', response.token);
                // location.href = '/entries.html';
            },
            error: (err) => {
                // renderError();
            }
        });
    });
}

// If there are already posts in the database, change h1 to say "Make a new post"


//  on page load do this
$(function() {
    burgerNav();
    addMorePics();
    ajaxCall();
})