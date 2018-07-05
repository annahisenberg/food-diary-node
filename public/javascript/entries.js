const defaultImg = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c9443baefd581d4e532b6d4f1e7879be&auto=format&fit=crop&w=800&q=60';

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
                    $('main').append(`<div class="card" id="${response[index]._id}"><a href="#"></a><a href="#"><i class="far fa-trash-alt"></i></a><button class="edit-btn">Edit Post</button><p>${response[index].title}</p><img src="${response[index].img ? response[index].img : defaultImg}" alt="food-picture"/></div>`);
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
                $("#lightbox, #lightbox-panel").fadeIn(300);


                $('#lightbox-panel').html(`<a id="close-panel" href="#"><i class="fas fa-times"></i></a><div id="post-info"><h2>${response.title}</h2><img src="${response.img ? response.img : defaultImg}" alt=""><p><span>Breakfast:</span> ${response.breakfast}</p><p><span>Lunch:</span> ${response.lunch}</p><p><span>Dinner:</span> ${response.dinner}</p><p><span>Snacks:</span> ${response.snacks}</p><p><span>Notes: </span>${response.notes ? response.notes : ''}</p></div>`);

                closeLightbox();
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

function clickEditPostBtn() {
    $('main').on('click', '.edit-btn', function(e) {
        e.stopPropagation();
        const token = getCookie('Token');
        const postId = $(this).parent().attr('id');

        //Make ajax call to display post by ID with inputs that user can edit
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
                    $('#lightbox-panel').html(`<div id="${postId}"><a id="close-panel" href="#"><i class="fas fa-times"></i></a><br><label>Title: <input class="js-title" name="title_input" type="text" value="${response.title}"></label><br><label>Image: <input class="js-img" name="image_input" type="text" value="${response.img}"></label><br><label>Breakfast: <textarea class="js-breakfast" rows="3" cols="40" id="msg" name="breakfast_input">${response.breakfast}</textarea></label><br><label>Lunch: <textarea class="js-lunch" rows="3" cols="40" id="msg" name="lunch_input">${response.lunch}</textarea></label><br><label>Dinner: <textarea class="js-dinner" rows="3" cols="40" name="dinner_input">${response.dinner}</textarea></label><br><label>Snacks: <textarea class="js-snacks" rows="3" cols="40" name="snacks_input">${response.snacks}</textarea></label><br><label>Notes: <input class="js-notes" type="text" name="notes_input" value="${response.notes}"></label><button class="submit_btn" type="submit">Submit</button></div>`);

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

function clickSubmitBtnForEditedPost() {
    $('main').on('click', '.submit_btn', function(e) {
        e.preventDefault();

        const token = getCookie('Token');
        const postId = $(this).parent().attr('id');


        const title = $('.js-title').val();
        const breakfast = $('.js-breakfast').val();
        const lunch = $('.js-lunch').val();
        const dinner = $('.js-dinner').val();
        const snacks = $('.js-snacks').val();
        const img = $('.js-img').val();
        const notes = $('.js-notes').val();

        $.ajax({
            url: `/api/posts/${postId}`,
            method: 'PUT',
            data: {
                id: postId,
                title,
                breakfast,
                lunch,
                dinner,
                snacks,
                img,
                notes
            },
            dataType: 'json',
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: (response) => {
                if (response) {
                    console.log(response);

                    $('#lightbox-panel').html(`<p>Your post was successfully updated.</p>`);

                    closeLightbox();
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
    clickEditPostBtn();
    clickSubmitBtnForEditedPost();
});