$(document).ready(function() {
  var randBetween = function(start, end) {
    return Math.floor(Math.random() * end) + start;
  };

  var successCallback = function(data) {
    wordCount = data.length - 1;
    wordIndex = randBetween(0, wordCount);
    // wordData = data[wordIndex].back;
    wordData = data[wordIndex];
    var todayKey = getTodayDate();

    $(".loading").hide();

    // $("#word").text(wordData[0].content);
    // $(".page-title").html(wordData[0].content + " (" + stripTags(wordData[1].content) + ")");
    // $("#definition").html(wordData[1].content);
    // $("#sentence").html(wordData[2].content);
    $("#word").text(wordData.word);
    $(".page-title").html(wordData.word);
    $("#definition").html(wordData.front);
    $("#sentence").html(wordData.back);

    $("#word-link").attr("href", "http://vocabulary.com/dictionary/" + wordData.word);


    // get the existing words for the user
    chrome.storage.sync.get([todayKey], function(result) {
        var array = result[todayKey]?result[todayKey]:[];
        array.push(wordData.word);

        var jsonObj = {};
        jsonObj[todayKey] = array;
        chrome.storage.sync.set(jsonObj, function() {
            console.log("Saved a new array item");
        });
        console.log(jsonObj);
    });
  };

  var getPrettyDate = function(date_string){
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var date = new Date(date_string);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    replacements = {
      'month': monthNames[monthIndex],
      'day': String(day),
      'year': String(year)
    };

    pretty_date_string = replacements['month'] + ' ' + replacements['day'] + ', ' + replacements['year'];
    return pretty_date_string;
  };

  var getTodayDate = function(){

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    }

    if(mm<10) {
        mm='0'+mm;
    }

    today = mm + '-' + dd + '-' + yyyy;
    console.log('Todays Key : ' + today);
    return today;
  }

  $.getJSON('words.json', successCallback);
});
