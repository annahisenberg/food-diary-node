var MOCK_DIARY_ENTRIES = {
    "diaryEntries": [{
            "id": "1111111",
            "title": "Food diary 1",
            "Breakfast": "Oatmeal",
            "Lunch": "Peanut butter and jelly sandwich",
            "Dinner": "Chicken and potatoes",
            "Snacks": "Banana and peanut butter",
            "publishedAt": 1470016976609,
            "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
        },
        {
            "id": "2222222",
            "title": "Food diary 2",
            "Breakfast": "eggs and bacon",
            "Lunch": "Chicken salad sandwich",
            "Dinner": "Lasagna",
            "Snacks": "Apple",
            "publishedAt": 1470016976717,
            "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
        },
        {
            "id": "333333",
            "title": "Food diary 3",
            "Breakfast": "Pancakes",
            "Lunch": "Quesadilla",
            "Dinner": "Chicken tinga",
            "Snacks": "Trail mix",
            "publishedAt": 1470016976718,
            "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
        },
        {
            "id": "4444444",
            "title": "Food diary 4",
            "Breakfast": "Grits",
            "Lunch": "Salad",
            "Dinner": "Chili",
            "Snacks": "Potato chips",
            "publishedAt": 1470016976719,
            "image": "https://images.unsplash.com/photo-1466065478348-0b967011f8e0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=277e0050a115848d2984fd58c34c3598&auto=format&fit=crop&w=800&q=60"
        }
    ]
};

function getAndDisplayDiaryEntries() {
    setTimeout(function() {
        displayResults(MOCK_DIARY_ENTRIES)
    }, 1);
}

function displayResults(data) {
    for (index in data.diaryEntries) {
        $('main').append(`<div class="card"><p>${data.diaryEntries[index].title}</p><img src="${data.diaryEntries[index].image}"/></div>`);
    }
}

function burgerNav() {
    $('.toggle-nav').click(function() {
        $('nav ul').toggleClass("show-nav");
        $('nav ul li').addClass("nav-background");
    })
}

function lightbox() {
    $("main").on('click', '.card', function() {
        $("#lightbox, #lightbox-panel").fadeIn(300);
        $('#lightbox-panel').html(`<h2>${data.diaryEntries.title}</h2><p>${data.diaryEntries.Breakfast}</p><p>${data.diaryEntries.Lunch}</p><p>${data.diaryEntries.Dinner}</p><p>${data.diaryEntries.Snacks}</p>`);
    });

    $("a#close-panel").click(function() {
        $("#lightbox, #lightbox-panel").fadeOut(300);
    });
}

function redirectToPostPage() {
    $('button').click(function() {
        window.location = '../post.html';
    });
}

//  on page load do this
$(function() {
    getAndDisplayDiaryEntries();
    burgerNav();
    redirectToPostPage();
    lightbox();
})