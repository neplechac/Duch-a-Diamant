let aboutButton = document.querySelector("#aboutButton");
let about = document.querySelector("#about");

let highScoresButton = document.querySelector("#highScoresButton");
let highScores = document.querySelector("#highScores");

aboutButton.addEventListener("click", aboutScreen);
highScoresButton.addEventListener("click", highScoresScreen);

function aboutScreen() {
    if (about.style.display === "block") {
        about.style.display = "none";
    } else {
        about.style.display = "block";
        highScores.style.display = "none";
    }
}

function highScoresScreen() {
    if (highScores.style.display === "table") {
        highScores.style.display = "none";
    } else {
        highScores.style.display = "table";
        about.style.display = "none";
    }
}
