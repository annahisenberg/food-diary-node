function getAndDisplayAllPostsAjaxCall() {
    //get token
    const token = sessionStorage.getItem('token');

    console.log("TOKEN", token);


    $.ajax({
        url: '/api/posts',
        method: 'GET',
        dataType: 'json',
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: (response) => {
            console.log(response);

            if (response) {
                console.log(response);

                for (index in response) {
                    $('main').append(`<div class="card" id="${response[index]._id}"><a href="#"><i class="far fa-edit"></i></a><a href="#"><i class="far fa-trash-alt"></i></a><p>${response[index].title}</p><img src="${response[index].img}"/></div>`);
                }
            }
        },
        error: (err) => {
            sessionStorage.removeItem('token');
        }
    });
}


function clickCardDisplayLightboxPost() {
    const token = sessionStorage.getItem('token');

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

                    $("a#close-panel").click(function() {
                        $("#lightbox, #lightbox-panel").fadeOut(300);
                    });

                    $("#lightbox").click(function() {
                        $("#lightbox, #lightbox-panel").fadeOut(300);
                    });
                }
            },
            error: (err) => {
                sessionStorage.removeItem('token');
            }
        });
    });

}

function logoutUser() {
    $('#logout a').click(function() {
        document.cookie = 'Token' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    });
}


//nav bar
function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

function deletePost() {
    $('main').on('click', '.fa-trash-alt', function() {
        const token = sessionStorage.getItem('token');

        //Gets token cookie
        function getCookie(name) {

            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ))
            return matches ? decodeURIComponent(matches[1]) : undefined
        }
        console.log(getCookie("Token"));


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
                sessionStorage.removeItem('token');
            }
        });
    });
}

function editPost() {
    $('main').on('click', '.fa-edit', function() {
        const token = sessionStorage.getItem('token');

        const postId = $(this).parent().parent().attr('id');

        $.ajax({
            url: `/api/posts/${postId}`,
            method: 'PUT',
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: (response) => {
                if (response) {
                    $("#lightbox, #lightbox-panel").fadeIn(300);
                    $('#lightbox-panel').html(`<p align="center"><a id="close-panel" href="#">Close this window</a></p><p>You have successfully updated your post</p>`);

                    $("a#close-panel").click(function() {
                        $("#lightbox, #lightbox-panel").fadeOut(300);
                    });

                    $("#lightbox").click(function() {
                        $("#lightbox, #lightbox-panel").fadeOut(300);
                    });
                }
            },
            error: (err) => {
                sessionStorage.removeItem('token');
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