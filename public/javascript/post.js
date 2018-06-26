function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

function addMorePics() {
    $('.img-btn').click(function(e) {
        e.preventDefault();
        $('.addMorePics').append('<input type="file" name="pic" accept="image/*">');
    });
}

// If there are already posts in the database, change h1 to say "Make a new post"


//  on page load do this
$(function() {
    burgerNav();
    addMorePics();
})