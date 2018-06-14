function animateArrowIcon() {
    $("button").hover(function () {
        $(".fa-angle-double-right").animate({
            left: '100px'
        });
    });
}

//  on page load do this
$(function () {
    animateArrowIcon();
})