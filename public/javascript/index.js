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

function redirectToPostPage() {
    $('button').click(function() {
        console.log("clicked");
        window.location = '../login.html';
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
    redirectToPostPage();
})