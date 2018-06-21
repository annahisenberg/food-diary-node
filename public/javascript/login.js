$(function() {
    $('#form').submit((e) => {
        e.preventDefault();
        const email = $('.js-email-field').val();
        const password = $('.js-password-field').val();

        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: {
                email: email,
                password: password,
            },
            success: (response) => {
                sessionStorage.setItem('token', response.token);
                location.href = '/protected.html';
            },
            error: () => {
                renderError();
            }
        })
    })
})

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

function clickSignUp() {
    $('.sign-up').click(function() {
        $(this).addClass('selected');
        $('.login-link').removeClass('selected');
    });
}

function clickLogin() {
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
    clickSignUp();
    burgerNav();
    clickLogin();
})