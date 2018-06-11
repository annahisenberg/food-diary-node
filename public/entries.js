var MOCK_DIARY_ENTRIES = {
    "diaryEntries": [{
            "id": "1111111",
            "title": "Food diary 1",
            "Breakfast": "Oatmeal",
            "Lunch": "Peanut butter and jelly sandwich",
            "Dinner": "Chicken and potatoes",
            "Snacks": "Banana and peanut butter",
            "publishedAt": 1470016976609
        },
        {
            "id": "2222222",
            "title": "Food diary 2",
            "Breakfast": "eggs and bacon",
            "Lunch": "Chicken salad sandwich",
            "Dinner": "Lasagna",
            "Snacks": "Apple",
            "publishedAt": 1470016976717
        },
        {
            "id": "333333",
            "title": "Food diary 3",
            "Breakfast": "Pancakes",
            "Lunch": "Quesadilla",
            "Dinner": "Chicken tinga",
            "Snacks": "Trail mix",
            "publishedAt": 1470016976718
        },
        {
            "id": "4444444",
            "title": "Food diary 4",
            "Breakfast": "Grits",
            "Lunch": "Salad",
            "Dinner": "Chili",
            "Snacks": "Potato chips",
            "publishedAt": 1470016976719
        }
    ]
};

function getAndDisplayDiaryEntries() {
    setTimeout(function () {
        displayResults(MOCK_DIARY_ENTRIES)
    }, 1);
}

function displayResults(data) {
    for (index in data.diaryEntries) {
        $('body').append(`<p>${data.diaryEntries[index].title}</p>`);
    }
}

//  on page load do this
$(function () {
    getAndDisplayDiaryEntries();
})