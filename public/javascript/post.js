function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

function addMorePics() {
    $('.img-btn').click(function() {
        $('.addMorePics').append('<input type="file" name="pic" accept="image/*">');
    });
}


//  on page load do this
$(function() {
    burgerNav();
    addMorePics();
})