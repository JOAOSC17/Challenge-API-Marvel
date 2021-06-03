const timeStamp = '1622574706';
const publicKey = 'a84ccf136a54436ed0babf6a4d8a5433';
const privateKey = '00fa707a16290895dbe94503f543454a755830a9';
const hash = '2e4f386b0fd325fcc7db20af85ed7759';
function character() {
let urlQueryParameters = new URLSearchParams(window.location.search),
    queryParameterName = urlQueryParameters.get("name"),
    name = document.getElementById("name").value;

  if (queryParameterName !== null && queryParameterName !== "") {
    document.getElementById("name").value = queryParameterName;
    connection();
  } else if (name !== null && name !== "") {
    document
      .getElementById("connectionForm")
      .addEventListener("submit", connection);
  } else {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle">Enter search term above...</h2>';
  }
}

function connection() {
  document.getElementById("characterSpinnerSection").innerHTML = "";
  document.getElementById("comicsSpinnerSection").innerHTML = "";
  var name = document.getElementById("name").value;
  var params = "name=" + name;
  fetch(`https://gateway.marvel.com:443/v1/public/characters?${params}&ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`).then(function(response) {
    if(response.ok) {
      response.json().then(function(jsonParsed) {
        //var objectURL = URL.createObjectURL(jsonParsed);
        //myImage.src = objectURL;
        const results = jsonParsed;
   console.log(results["data"]);

  if (results["data"].count === 0) {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle"><span style="font-weight:bold;">No results for... ' +
      name +
      "</span>" +
      ". Try again.</h2>";

    document.getElementById("characterSpinnerSection").innerHTML = "";

    document.getElementById("comicsSpinnerSection").innerHTML = "";
  } else if (results === undefined || results.length == 0) {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle">' +
      "An error might have occured on our end, Sorry. <br>In this case, try again later.</h2>";

    document.getElementById("characterSpinnerSection").innerHTML = "";

    document.getElementById("comicsSpinnerSection").innerHTML = "";
  } else {
    var characterAttributes = results["data"].results[0];
    var characterID = results["data"].results[0].id;
    var output = "";

    output +=
      '<h2 id="characterMainTitle">' +
      "Character" +
      "</h2>" +
      '<div class="card flex-md-row mb-4 box-shadow h-md-250" id="characterCard">' +
      '<div id="characterImage">' +
      '<img class="card-img-right flex-auto d-md-block img-fluid"' +
      ' alt="Picture of ' +
      characterAttributes.name +
      '" src="' +
      characterAttributes.thumbnail["path"] +
      "." +
      characterAttributes.thumbnail["extension"] +
      '">' +
      "</div>" +
      '<div class="card-body d-flex flex-column align-items-start">' +
      '<h3 class="mb-0 text-dark" id="characterName">' +
      characterAttributes.name +
      "</h3>" +
      '<p class="card-text mb-3" id="characterDescription">';
    if (characterAttributes.description !== "") {
      output += characterAttributes.description;
    }
    output +=
      "</p>" +
      '<p class="text-muted mb-3" id="comicsAvailable">' +
      "Comics: " +
      characterAttributes.comics.available +
      " | " +
      "Series: " +
      characterAttributes.series.available +
      " | " +
      "Stories: " +
      characterAttributes.stories.available +
      " | " +
      "Events: " +
      characterAttributes.events.available +
      "</p>" +
      '<p class="mb-1 text-muted" id="characterInfoAttribution">' +
      results["attributionText"] +
      "</p>" +
      "</div>" +
      "</div>";

    document.getElementById("characterSection").innerHTML = output;

    comics(characterID);
    console.log(jsonParsed);
  }
      });
    } else {
      console.log('Network response was not ok.');
    }
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });


   function comics(characterID) {
      // var id = document.getElementById('comicid');
      // var comicid = comic.id;
      // var characterID = "" + comicid;
   fetch(`https://gateway.marvel.com:443/v1/public/characters/${characterID}/comics?&ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`).then(function(response) {
    if (response.ok) {
      response.json().then(function(jsonParsed) {
      const results = jsonParsed;
      console.log(results["data"]);
       const comics = results["data"].results;
       const comicSection = document.getElementById("comicSection");

      console.log(results)
      console.log(comics)

       if (results["data"] == 0) {
         let output = "";
         comicSection.innerHTML = output;
         comicSection.innerHTML = "<h2>No comics Available</h2>";
       } else {
       //comics available
         let output = "";
         let creators = "";

           output +=
           '<h2 id="comicMainTitle">Comics</h2>' + '<div class="card-columns">';

           for (const i in comics) {
            if (comics.hasOwnProperty(i)) {
              const comic = comics[i];
              const comicID = comic.id;
              output +=
                '<div class="card">' +
                '<a href="./comic.html?comic-id=' +
                comicID + 
                '"><img src="' +
                comic.thumbnail["path"] +
                "." +
                comic.thumbnail["extension"] +
                '" class="card-img-top" alt="' +
                comic.title +
                '"></a>' +
                '<div class="card-body">' +
                '<h5 class="card-title">' +
      
                '<i class="fas fa-plus float-right" onclick="Favorite()" ></i>'+
                comic.title +
                "</h5>";
  
              if (comic.description != null) {
                output +=
                  '<p style="font-size: 12px;" class="card-text">' +
                  comic.description +
                  "</p>";
              }
  
              output +=
                '<p style="font-size: 12px;" class="card-text text-muted">Characters: ';
  
              for (const k in comic.characters.items) {
                if (comic.characters.items.hasOwnProperty(k)) {
                  const character = comic.characters.items[k];
                  output += character.name.concat(", ");
                }
              }
  
              output += "</p>";
              output +=
                '<p style="font-size: 12px;" class="card-text text-muted">Creators: ';
  
              for (const j in comic.creators.items) {
                if (comic.creators.items.hasOwnProperty(j)) {
                  const creator = comic.creators.items[j];
  
                  output += creator.name.concat(" (" + creator.role + "), ");
                }
              }
  
              output += "</p>";
              output +=
                "</div>" +
                '<div class="card-footer">' +
                '<small style="line-height: 1;" class="text-muted">' +
                results["attributionText"] +
                "</small>" +
                "</div>" +
                "</div>";
                singleComic(comicID);
              }
         }

         output += "</div>";

         comicSection.innerHTML = output;            
        }
     });
     } else {
       document.getElementById("characterSection").innerHTML =
         '<h2 id="characterMainTitle">Request not received</h2>';
       document.getElementById("comicSection").innerHTML =
         '<h2 id="characterMainTitle">Request not received</h2>';
     }
   })
   .catch(function(error) {
     console.log('There has been a problem with your fetch operation: ' + error.message);
   });

  }

}





function singleComic() {
    const urlQueryParameters = new URLSearchParams(window.location.search);
     const comicID = urlQueryParameters.get("comic-id");
    console.log(comicID)
  fetch(`https://gateway.marvel.com:443/v1/public/comics/${comicID}?&ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`).then(function(response) {
     if (response.ok) {
    response.json().then(function(jsonParsed) {
    const results = jsonParsed;
    console.log(results);
    const comicInfo = results["data"].results[0];
    const  comicImage =
        comicInfo.thumbnail["path"] + "." + comicInfo.thumbnail["extension"];
    const comicDescription = comicInfo.description;
    const  comicCharacters = comicInfo.characters.items;
    const comicCreators = comicInfo.creators.items;
    
    let output = "";
    
      output +=
        '<h1 class="header-main-title single-comic__main-title">' +
        comicInfo.title +
        "</h1>" +
        '<div class="card mb-3">' +
        '<div class="row no-gutters">' +
        '<div class="col-md-4">' +
        '<img src="' +
        comicImage +
        '" class="card-img" alt="...">' +
        "</div>" +
        '<div class="col-md-8">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' +
        comicInfo.title +
        "</h5>";

      if (comicDescription !== null && comicDescription !== "") {
        output += '<p class="card-text">' + comicDescription + "</p>";
      }

      output +=
        '<p class="card-text">' +
        '<small class="text-muted">' +
        " Characters: ";
      for (const i in comicCharacters) {
        if (comicCharacters.hasOwnProperty(i)) {
          const character = comicCharacters[i];
          output +=
            '<a href="./index.html?name=' +
            character.name +
            '">' +
            character.name +
            "</a>, ";
        }
      }

      output +=
        "</small>" +
        "</p>" +
        '<p class="card-text">' +
        '<small class="text-muted">' +
        "Creators: ";
      for (const i in comicCreators) {
        if (comicCreators.hasOwnProperty(i)) {
          const creator = comicCreators[i];
          var url = new URL(creator.resourceURI),
            creatorID = url.pathname.substring(
              url.pathname.lastIndexOf("/") + 1
            );
          output +=
            '<a href="./creator.html?creator-id=' +
            creatorID +
            '">' +
            creator.name.concat(" (" + creator.role + "), ") +
            "</a>, ";
        }
      }

      output +=
        "</small>" +
        "</p>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="card-footer text-muted text-right"> ' +
        results["attributionText"] +
        "</div>" +
        "</div>";

      singleComicContainerDiv.innerHTML = output;

    })
  } else {
    singleComicContainerDiv.innerHTML =
    '<h2 id="characterMainTitle">Request not received</h2>';
  }
})
 .catch(function(error) {
   console.log('There has been a problem with your fetch operation: ' + error.message);
})
}




function comicCreator() {
    const urlQueryParameters = new URLSearchParams(window.location.search);
     const creatorID = urlQueryParameters.get("creator-id");
    console.log(creatorID)
  fetch(`https://gateway.marvel.com:443/v1/public/creators/${creatorID}?&ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`).then(function(response) {
     if (response.ok) {
    response.json().then(function(jsonParsed) {
    const results = jsonParsed;
    console.log(results);
    creatorInfo = results["data"].results[0],
          creatorFullName = creatorInfo.fullName,
          creatorImage =
            creatorInfo.thumbnail["path"] +
            "." +
            creatorInfo.thumbnail["extension"],
          comicCreatorContainerDiv = document.getElementById(
            "comicCreatorContainerDiv"
          ),
          creatorComics = creatorInfo.comics.items;
        let output = "";
  
        output +=
          '<h1 class="header-main-title single-comic__main-title">Creator</h1>' +
          '<div class="card mb-3">' +
          '<div class="row no-gutters">' +
          '<div class="col-md-4">' +
          '<img src="' +
          creatorImage +
          '" class="card-img" alt="' + creatorFullName + '">' +
          "</div>" + // end col-md-4
          '<div class="col-md-8">' +
          '<div class="card-body">' +
          '<h5 class="card-title">' +
          creatorFullName +
          "</h5>";
  
        output +=
          '<p class="text-muted mb-3">' +
          "Comics: " +
          creatorInfo.comics["available"] +
          " | " +
          "Series: " +
          creatorInfo.series["available"] +
          " | " +
          "Stories: " +
          creatorInfo.stories["available"] +
          " | " +
          "Events: " +
          creatorInfo.events["available"] +
          "</p>";
  
        output +=
          "</div>" + // Card Body
          "</div>" + // col-md-8
          "</div>" + // row
          '<div class="card-footer text-muted text-right"> ' +
          results["attributionText"] +
          "</div>" +
          "</div>"; // card
  
        output +=
          '<h1 class="header-main-title single-comic__main-title">Comics</h1>' +
          '<div class="row" id="comicColumns"></div>';
  
        comicCreatorContainerDiv.innerHTML = output;
  
        for (const i in creatorComics) {
          if (creatorComics.hasOwnProperty(i)) {
            const comic = creatorComics[i];
            creatorSingleComic(comic.resourceURI);
          }
        }
      });    
  } else { 
    comicCreatorContainerDiv.innerHTML =
    '<h2 id="header-main-title single-comic__main-title">An error has occured, check connection or bad request.</h2>';
  }
  })
  .catch(function(error) {
   console.log('There has been a problem with your fetch operation: ' + error.message);
  })
  }
  

  function creatorSingleComic(comicResourceURI) {
    const url = new URL(comicResourceURI);
    const comicID = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
    const comicColumns = document.getElementById("comicColumns");
    console.log(comicID);
    fetch(`https://gateway.marvel.com:443/v1/public/comics/${comicID}?&ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`).then(function(response) {
     if (response.ok) {
    response.json().then(function(jsonParsed) {
    const results = jsonParsed;
    console.log(results);
    comicInfo = results["data"].results[0],
    comicImage =
      comicInfo.thumbnail["path"] + "." + comicInfo.thumbnail["extension"],
    comicTitle = comicInfo.title;
  
  let output = "";
  
  output =
    '<div class="col-md-4" >' +
    '<div class="card mb-3">' +
    '<a href="./comic.html?comic-id=' +
    comicInfo.id +
    '">' +
    '<img src="' +
    comicImage +
    '" class="card-img-top" alt="' +
    comicTitle +
    '">' +
    "</a>" +
    '<div class="card-body">' +
    '<h5 class="card-title">' +
    comicTitle +
    "</h5>";
  
  if (comicInfo.description !== "" || comicInfo.description != null) {
    output +=
      '<p class="card-text"><small class="text-muted">' +
      comicInfo.description +
      "</small></p>";
  }
  output +=
    '<a href="./comic.html?comic-id=' +
    comicInfo.id +
    '">Check it out!</a>' +
    "</div>" +
    "</div>" +
    "</div>";
  
  comicColumns.innerHTML += output;
      });    
  } else { 
    comicColumns.innerHTML == '<h2>An error has occured. </h2>';
  }
  })
  .catch(function(error) {
   console.log('There has been a problem with your fetch operation: ' + error.message);
  })
  }