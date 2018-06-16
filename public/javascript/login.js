function animateArrowIcon() {
    $("button").hover(function () {
        $(".fa-sign-in-alt").animate({
            left: '5px'
        });
    });
}

//  on page load do this
$(function () {
    animateArrowIcon();
})