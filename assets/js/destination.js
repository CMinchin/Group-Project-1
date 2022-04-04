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



var queries = {_:null}

document.location.href.split("?")[1].split("&").forEach(e => {
    queries[e.split("=")[0]] = e.split("=")[1]
})

if (queries._==null) {
    delete queries._
}

fetch(
    "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=10000&explaintext&titles=" + queries.q + "&origin=*"
  )
    .then(function (res) {
      console.log(res);
        res.text().then(item => textDescUpdate(item));
    })
    .catch(function (e) {
      console.log(e);
    }
);

function textDescUpdate(text){
    $("#desc")[0].textContent = text.split("<span class=\"s2\">&quot;extract&quot;</span><span class=\"o\">:</span> <span class=\"s2\">&quot;")[1].split("...&quot;")[0].split("\\n")[0]
    // x = text //debug
}