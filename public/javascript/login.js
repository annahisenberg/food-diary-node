function onSignUp() {
    $('#signup-form').submit((e) => {
        e.preventDefault();

        const email = $('.js-email-field').val();
        const password = $('.js-password-field').val();
        const repeat = $('.js-repeat-password-field').val();

        if (repeat !== password) {
            return $('#thank-you-msg').html("<p>Your passwords don't match. Please try again.</p>");
        }


        $.ajax({
            url: '/api/users',
            method: 'POST',
            data: {
                email: email,
                password: password,
                passwordTwo: repeat
            },
            success: (response) => {
                if (response) {
                    $('#thank-you-msg').html('<p>Thank you for signing up! Now you can login to access the rest of the website.</p>');
                    $('.js-email-field').val('');
                    $('.js-password-field').val('');
                    $('.js-repeat-password-field').val('');
                }
            },
            error: (err) => {
                // renderError();
            }
        });
    });
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

function onLogin() {
    $('#login-form').submit((e) => {

        e.preventDefault();

        const username = $('.js-email-field2').val();
        const password = $('.js-password-field2').val();

        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: {
                username: username,
                password: password,
            },
            success: (response) => {
                console.log(response);

                sessionStorage.setItem('token', response.authToken);

                window.location.href = '/api/entries-list';
            },
            error: (err) => {
                if (err) {
                    $('#login-error').html('<p>You have entered a wrong username or password. Please try again.</p>');
                }
            }
        });
    });
}

function animateArrowIcon() {
    $("button").hover(function () {
        $(".fa-angle-double-right").stop().animate({
            left: '7px'
        });
    });

    $("button").mouseleave(function () {
        $(".fa-angle-double-right").stop().animate({
            left: '0px'
        });
    });
}

function clickRegister() {
    $('#register-link').click(function (e) {
        e.preventDefault();
        $('#login-section').slideUp();
        $('#signup-section').slideDown();
    })
}

function clickLogin() {
    $('#login-link').click(function (e) {
        e.preventDefault();
        $('#signup-section').slideUp();
        $('#login-section').slideDown();
    })
}

//  on page load do this
$(function () {
    animateArrowIcon();
    onLogin();
    onSignUp();
    clickLogin();
    clickRegister();
});