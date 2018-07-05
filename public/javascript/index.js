function animateArrowIcon() {
    $("#start-btn").hover(function() {
        $(".fa-angle-double-right").stop().animate({
            left: '7px'
        }, 250);
    });

    $("#start-btn").mouseleave(function() {
        $(".fa-angle-double-right").stop().animate({
            left: '0px'
        }, 250);
    });
}

//Gets token from cookie
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

//If user is logged in, "get started" button should redirect to "entries.html". Else, button should redirect to "login.html"
function clickBtnAndRedirect() {
    const token = getCookie('Token');

    $('#start-btn').click(function() {
        if (!token) {
            location.href = '/api/login-page'
        } else {
            location.href = '/api/entries-list'
        }
    });
}

//If user is logged in, there should be a "logout" button at top of screen 
function hideOrShowLogoutButton() {
    const token = getCookie('Token');

    if (token) {
        $('#logout-btn').show();
    }
}

function clickLogout() {
    $('#logout-btn').click(function() {
        document.cookie = 'Token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        location.href = '/api/login-page';
    });
}

//  on page load do this
$(function() {
    animateArrowIcon();
    clickBtnAndRedirect();
    hideOrShowLogoutButton();
    clickLogout();
});