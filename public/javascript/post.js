function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

function addMorePics() {
    $('.img-btn').click(function(e) {
        e.preventDefault();
        $('.addMorePics').append('<input class="js-img" name="image_input" type="text" placeholder="Enter link to image">');
    });
}

function ajaxCall() {
    $('form').submit((e) => {
        e.preventDefault();

        const token = sessionStorage.getItem('token');

        if (!token) {
            window.location.href = '/login-page';
        }

        const title = $('.js-title').val();
        const breakfast = $('.js-breakfast').val();
        const lunch = $('.js-lunch').val();
        const dinner = $('.js-dinner').val();
        const snacks = $('.js-snacks').val();
        const img = $('.js-img').val();
        // const date = $('.js-date').val();
        const calories = $('.js-calories').val();

        $.ajax({
            url: '/api/posts',
            method: 'POST',
            data: {
                title,
                breakfast,
                lunch,
                dinner,
                snacks,
                img
            },
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: (response) => {
                if (response) {
                    $('form').append('<p class="post-msg">You just made a post! <a href="../entries.html">Click here</a> to see previous posts.</p>');
                    $('.js-title').val('');
                    $('.js-breakfast').val('');
                    $('.js-lunch').val('');
                    $('.js-dinner').val('');
                    $('.js-snacks').val('');
                    $('.js-img').val('');
                }
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