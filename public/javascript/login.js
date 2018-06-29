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
                sessionStorage.setItem('token', response.token);
                // location.href = '/entries.html';
            },
            error: (err) => {
                // renderError();
            }
        });
    });
}

function onLogin() {
    $('#login-form').submit((e) => {
        console.log("hi");

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
                location.href = '/entries.html';
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

function addSelectClassToSignUp() {
    $('.js-show-register-form').click(function() {
        $(this).addClass('selected');
        $('.js-show-login-form').removeClass('selected');
    });
}

function addSelectClassToLoginLink() {
    $('.js-show-login-form').click(function() {
        $(this).addClass('selected');
        $('.js-show-register-form').removeClass('selected');
    });
}

function slideDown() {
    $('.js-show-login-form').click(function(e) {
        e.preventDefault();
        $('#signup-form').slideUp();
        $('#login-form').slideDown();
    })
}

function slideUp() {
    $('.js-show-register-form').click(function(e) {
        e.preventDefault();
        $('#login-form').slideUp();
        $('#signup-form').slideDown();
    })
}

//  on page load do this
$(function() {
    animateArrowIcon();
    addSelectClassToLoginLink();
    addSelectClassToSignUp();
    onLogin();
    onSignUp();
    slideUp();
    slideDown();
})