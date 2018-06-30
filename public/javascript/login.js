function onSignUp() {
    $('#signup-form').submit((e) => {
        e.preventDefault();

        const email = $('.js-email-field').val();
        const password = $('.js-password-field').val();
        const repeat = $('.js-repeat-password-field').val();
        console.log(email);


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
                    $('#thank-you-msg').append('<p>Thank you for signing up! Now you can login to access the rest of the website.</p>');
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
                window.location.href = '/entries-list';
            },
            error: (err) => {
                // renderError();
            }
        });
    });
}

function animateArrowIcon() {
    $("button").hover(function() {
        $(".fa-angle-double-right").stop().animate({
            left: '7px'
        });
    });

    $("button").mouseleave(function() {
        $(".fa-angle-double-right").stop().animate({
            left: '0px'
        });
    });
}

function clickRegister() {
    $('#register-link').click(function(e) {
        e.preventDefault();
        $('#login-section').slideUp();
        $('#signup-section').slideDown();
    })
}

function clickLogin() {
    $('#login-link').click(function(e) {
        e.preventDefault();
        $('#signup-section').slideUp();
        $('#login-section').slideDown();
    })
}

//  on page load do this
$(function() {
    animateArrowIcon();
    onLogin();
    onSignUp();
    clickLogin();
    clickRegister();
});