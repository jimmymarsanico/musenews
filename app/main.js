/*

LOGIC FOR SCRIPT

set GLOBAL vars for
• NUM_POSTS = 1
• NUM_COMPANIES = 2
• NUM_JOBS = 4



def get_companies()
def get_jobs()

on load...
grab the todayKey
  then check for existing storage
  if there's a value use the id's to ping the API to get the exact posts, companies, jobs
if it doesnt exist yet
  ping the API to get 1 rand article, 4 rand jobs, and 2 rand companies
  store the values


*/

var GLOBAL_NUM_POSTS      = 1;
var GLOBAL_NUM_COMPANIES  = 2;
var GLOBAL_NUM_JOBS       = 4;

$(document).ready(function() {

  var todayKey        = getTodayDate();
  var todayDate       = getPrettyDate(todayKey);
  var todayPosts      = [];
  var todayCompanies  = [];
  var todayJobs       = []

  var loadData = function(todayKey){
    if(v = retrieve(todayKey)){
      console.log(true)
      todayPosts = getMuse('posts', v)
    } else {
      console.log(false)
    };
  };

  var getMuse = function(api, id){
    var d=undefined;
    var data=[];
    if(id) {
      d = $.ajax({
        url: 'https://api-v2.themuse.com/' + api + '/' + String(id),
        async: false
      })
       data.push(d.responseJSON);
      return data;
    } else {
      d = $.ajax({
        url: 'https://api-v2.themuse.com/' + api + '?page=0&descending=false',
        async: false
      })
      data = d.responseJSON.results;
      return data;
    }
  };

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


    // get the existing words for the user
    chrome.storage.sync.get([todayKey], function(result) {
        var array = result[todayKey]?result[todayKey]:[];
        // array.push(wordData.word);
        array.push('This string goes in the array.')

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

    today = yyyy + '-' + mm + '-' + dd;
    console.log('Todays Key : ' + today);
    return today;
  };



  var store = function(key, value){
    chrome.storage.sync.get([key], function(result) {
        var array = result[key]?result[key]:{};
        array.push('This string goes in the array.  #' + randBetween(0,5) + '   ' + value)

        var jsonObj = {};
        jsonObj[key] = array;
        chrome.storage.sync.set(jsonObj, function() {
            console.log("Saved a new array item");
        });
        console.log(jsonObj);
    });
  };

  var retrieve = function(key){
    chrome.storage.sync.get([key], function(result) {
      console.log(result);
    });
  };

  var reset = function(key){
    chrome.storage.sync.remove([key], function(result) {
      console.log(result);
    });
  };

  console.log(getTodayDate());
  console.log(getPrettyDate(getTodayDate()));
  console.log(randBetween(0,50));
});
