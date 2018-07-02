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
                    $('main').append(`<div class="card" id="${response[index]._id}"><a href="#"><i class="far fa-edit"></i></a><a href="#"><i class="far fa-trash-alt"></i></a><p>${response[index].title}</p><img src="${response[index].img}"/></div>`);
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
                    $('#lightbox-panel').html(`<a id="close-panel" href="#"><i class="fas fa-times"></i></a><img src="${response.img}" alt=""><p><span>Breakfast</span>: ${response.breakfast}</p><p><span>Lunch:</span> ${response.lunch}</p><p><span>Dinner:</span> ${response.dinner}</p><p><span>Snacks:</span> ${response.snacks}</p>`);

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

                    location.reload();
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
    $('main').on('click', '.fa-edit', function() {
        console.log('editing');
        const token = getCookie('Token');
        const postId = $(this).parent().parent().attr('id');

        // const title = $('.js-title').val();
        // const breakfast = $('.js-breakfast').val();
        // const lunch = $('.js-lunch').val();
        // const dinner = $('.js-dinner').val();
        // const snacks = $('.js-snacks').val();
        // const notes = $('.js-notes').val();
        // const img = $('.js-img').val();

        $.ajax({
            url: `/api/posts/${postId}`,
            method: 'PUT',
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: (response) => {
                if (response) {
                    console.log(response);

                    $("#lightbox, #lightbox-panel").fadeIn(300);
                    $('#lightbox-panel').html(`<input class="js-title" id="msg" name="title_input" type="text" value="${title}"><textarea class="js-breakfast" rows="3" cols="60" id="msg" name="breakfast_input">${breakfast}</textarea><textarea class="js-lunch" rows="3" cols="60" id="msg" name="lunch_input">${lunch}</textarea><textarea class="js-dinner" rows="3" cols="60" id="msg" name="dinner_input">${dinner}</textarea><textarea class="js-snacks" rows="3" cols="60" id="msg" name="snacks_input">${snacks}</textarea><input class="js-img" name="image_input" type="text" value="${img}">`);
                }

                closeLightbox();
                location.reload();
            },
            error: (err) => {
                logoutUserOnError();
                location.reload();
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