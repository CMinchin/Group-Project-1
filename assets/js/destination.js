function addTile(title, desc, imgsrc) {
    $("#city-cards-div").append(
        $("<article>").append(
            $("<h2>").text(title)
        ).append(
            $("<p>").text(desc)
        ).append(
            $("<img>").attr({src: imgsrc})
        ).addClass("action-cards")
    );
}

// sample
addTile("Go Skiing","lorem ipsum","https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ski_Famille_-_Family_Ski_Holidays.jpg/330px-Ski_Famille_-_Family_Ski_Holidays.jpg")