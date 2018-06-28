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

//If user is logged in, "get started" button should redirect to "entries.html". Else, button should redirect to "login.html"



//  on page load do this
$(function() {
    animateArrowIcon();
    redirectToPostPage();
})