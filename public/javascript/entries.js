function getAndDisplayAllPostsAjaxCall() {
    //get token
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/login-page';
    }

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
            window.location.href = '/login-page';
        }
    });
}


function clickCardDisplayLightboxPost() {
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
                    $('#lightbox-panel').html(`<p>${response.diaryposts.breakfast}</p><p>${response.diaryposts.lunch}</p><p>${response.diaryposts.dinner}</p><p>${response.diaryposts.snacks}</p>`);

                    $("a#close-panel").click(function() {
                        $("#lightbox, #lightbox-panel").fadeOut(300);
                    });
                }
            },
            error: (err) => {
                sessionStorage.removeItem('token');
                window.location.href = '/login-page';
            }
        });
    });

}

function logoutUser() {
    $('#logout a').click(function() {
        console.log("logging out");
        sessionStorage.removeItem('token');
        window.location.href = '/login-page';
    });
}


//nav bar
function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

//  on page load do this
$(function() {
    getAndDisplayAllPostsAjaxCall();
    clickCardDisplayLightboxPost();
    logoutUser();
    burgerNav();
})





// var MOCK_DIARY_ENTRIES = {
//     "diaryEntries": [{
//             "id": "1111111",
//             "title": "Food diary 1",
//             "Breakfast": "Oatmeal",
//             "Lunch": "Peanut butter and jelly sandwich",
//             "Dinner": "Chicken and potatoes",
//             "Snacks": "Banana and peanut butter",
//             "publishedAt": 1470016976609,
//             "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
//         },
//         {
//             "id": "2222222",
//             "title": "Food diary 2",
//             "Breakfast": "eggs and bacon",
//             "Lunch": "Chicken salad sandwich",
//             "Dinner": "Lasagna",
//             "Snacks": "Apple",
//             "publishedAt": 1470016976717,
//             "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
//         },
//         {
//             "id": "333333",
//             "title": "Food diary 3",
//             "Breakfast": "Pancakes",
//             "Lunch": "Quesadilla",
//             "Dinner": "Chicken tinga",
//             "Snacks": "Trail mix",
//             "publishedAt": 1470016976718,
//             "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
//         },
//         {
//             "id": "4444444",
//             "title": "Food diary 4",
//             "Breakfast": "Grits",
//             "Lunch": "Salad",
//             "Dinner": "Chili",
//             "Snacks": "Potato chips",
//             "publishedAt": 1470016976719,
//             "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
//         }
//     ]
// };



// function getAndDisplayDiaryEntries() {
//     setTimeout(function() {
//         displayResults(MOCK_DIARY_ENTRIES)
//     }, 1);
// }

// function displayResults(data) {
//     for (index in data.diaryEntries) {
//         $('main').append(`<div class="card"><a href="#"><i class="far fa-edit"></i></a><p>${data.diaryEntries[index].title}</p><img src="${data.diaryEntries[index].image}"/></div>`);
//     }
// }