function closeLightbox() {
    $("a#close-panel").click(function() {
        $("#lightbox, #lightbox-panel").fadeOut(300);
    });

    $("#lightbox").click(function() {
        $("#lightbox, #lightbox-panel").fadeOut(300);
    });
}

function logoutUserOnError() {
    document.cookie = 'Token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getAndDisplayAllPostsAjaxCall() {
    //get token from cookie
    const token = getCookie('Token');

    $.ajax({
        url: '/api/posts',
        method: 'GET',
        dataType: 'json',
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: (response) => {
            if (response) {

                for (index in response) {
                    $('main').append(`<div class="card" id="${response[index]._id}"><a href="#"></a><a href="#"><i class="far fa-trash-alt"></i></a><button class="edit-btn">Edit Post</button><p>${response[index].title}</p><img src="${response[index].img}" alt="food-picture"/></div>`);
                }
            }
        },
        error: (err) => {
            logoutUserOnError();
        }
    });
}


function clickCardDisplayLightboxPost() {
    //get token from cookie
    const token = getCookie('Token');

    $("main").on('click', '.card', function() {
        const postId = $(this).attr('id');

        $.ajax({
            url: `/api/posts/${postId}`,
            method: 'GET',
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: (response) => {
                if (response) {
                    $("#lightbox, #lightbox-panel").fadeIn(300);
                    $('#lightbox-panel').html(`<a id="close-panel" href="#"><i class="fas fa-times"></i></a><div id="post-info"><img src="${response.img}" alt=""><p><span>Breakfast</span>: ${response.breakfast}</p><p><span>Lunch:</span> ${response.lunch}</p><p><span>Dinner:</span> ${response.dinner}</p><p><span>Snacks:</span> ${response.snacks}</p><p><span>Notes: </span>${response.notes}</p></div>`);

                    closeLightbox();
                }
            },
            error: (err) => {
                logoutUserOnError();
                location.reload();
            }
        });
    });

}

function logoutUser() {
    $('#logout a').click(function() {
        document.cookie = 'Token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/api/login-page';
    });
}


//nav bar
function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}


//Gets token from cookie
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}


function deletePost() {
    $('main').on('click', '.fa-trash-alt', function() {
        const token = getCookie('Token');
        const postId = $(this).parent().parent().attr('id');

        $.ajax({
            url: `/api/posts/${postId}`,
            method: 'DELETE',
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: (response) => {
                if (response) {
                    $("#lightbox, #lightbox-panel").fadeIn(300);
                    $('#lightbox-panel').html(`<p align="center"><a id="close-panel" href="#">Close this window</a></p><p>You have successfully deleted your post</p>`);

                    $("a#close-panel").click(function() {
                        $("#lightbox, #lightbox-panel").fadeOut(300);
                    });

                    // location.reload();
                }
            },
            error: (err) => {
                logoutUserOnError();
                location.reload();
            }
        });
    });
}

function editPost() {
    $('main').on('click', '.edit-btn', function(e) {
        e.stopPropagation();
        const token = getCookie('Token');
        const postId = $(this).parent().attr('id');

        //Make ajax call to display post by ID
        $.ajax({
            url: `/api/posts/${postId}`,
            method: 'GET',
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: (response) => {
                if (response) {
                    console.log(response);

                    $("#lightbox, #lightbox-panel").fadeIn(300);
                    $('#lightbox-panel').html(`<input class="js-img" name="image_input" type="text" placeholder="Enter link to image" value="${response.img}"><textarea class="js-breakfast" rows="3" cols="60" id="msg" name="breakfast_input">${response.breakfast}</textarea><textarea class="js-lunch" rows="3" cols="60" id="msg" name="lunch_input">${response.lunch}</textarea>`);

                    // closeLightbox();
                }
            },
            error: (err) => {
                // logoutUserOnError();
                // location.reload();
            }
        });
    });
}

//  on page load do this
$(function() {
    getAndDisplayAllPostsAjaxCall();
    clickCardDisplayLightboxPost();
    logoutUser();
    burgerNav();
    deletePost();
    editPost();
});