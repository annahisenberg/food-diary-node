function onSignUpClick() {
    $('.sign-up').click(function() {
        $('form').submit((e) => {
            e.preventDefault();
            const email = $('.js-email-field').val();
            const password = $('.js-password-field').val();

            console.log(email, password);


            $.ajax({
                url: '/api/users',
                method: 'POST',
                data: {
                    email: email,
                    password: password,
                },
                success: (response) => {
                    console.log(response);

                    sessionStorage.setItem('token', response.token);
                    location.href = '/entries.html';
                },
                error: (err) => {
                    // renderError();
                    console.log(err);
                }
            });
        });
    });
}

function onLoginClick() {
    $('.login-link').click(function() {
        $('form').submit((e) => {
            e.preventDefault();
            const email = $('.js-email-field').val();
            const password = $('.js-password-field').val();

            console.log(email, password);

            $.ajax({
                url: '/api/login',
                method: 'POST',
                data: {
                    email: email,
                    password: password,
                },
                success: (response) => {
                    console.log(response);

                    sessionStorage.setItem('token', response.token);
                    location.href = '/entries.html';
                },
                error: (err) => {
                    // renderError();
                    console.log(err);
                }
            });
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
    $('.sign-up').click(function() {
        $(this).addClass('selected');
        $('.login-link').removeClass('selected');
    });
}

function addSelectClassToLoginLink() {
    $('.login-link').click(function() {
        $(this).addClass('selected');
        $('.sign-up').removeClass('selected');
    });
}

function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

//  on page load do this
$(function() {
    animateArrowIcon();
    burgerNav();
    addSelectClassToLoginLink();
    addSelectClassToSignUp();
    onLoginClick();
})