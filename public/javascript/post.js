//Gets token from cookie
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

const token = getCookie('Token');


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

        const title = $('.js-title').val();
        const breakfast = $('.js-breakfast').val();
        const lunch = $('.js-lunch').val();
        const dinner = $('.js-dinner').val();
        const snacks = $('.js-snacks').val();
        const img = $('.js-img').val();

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
                    $('form').append('<p class="post-msg">You just made a post! <a href="/api/entries-list">Click here</a> to see previous posts.</p>');
                    $('.js-title').val('');
                    $('.js-breakfast').val('');
                    $('.js-lunch').val('');
                    $('.js-dinner').val('');
                    $('.js-snacks').val('');
                    $('.js-img').val('');
                }
            },
            error: (err) => {
                document.cookie = 'Token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
        });
    });
}

function logoutUser() {
    $('#logout a').click(function() {
        document.cookie = 'Token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/api/login-page';
    });
}

// If there are already posts in the database, change h1 to say "Make a new post"


//  on page load do this
$(function() {
    burgerNav();
    addMorePics();
    ajaxCall();
    logoutUser();
})