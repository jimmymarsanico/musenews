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



/* FROM STACK OVERFLOW */


//Get the latitude and the longitude;
function locationSuccessFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  // console.log(lat, lng)

  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=371c14f020dced602ec9e316e451bf07',
    async: true,
    success: function(result) {
      // console.log(result);
      var locName = result.name
      var degF = Math.round((result.main.temp*9/5)-459.67)
      var degC = Math.round(result.main.temp - 273.15)
      $("#city").text('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0(' + Math.round(lat) + ', ' + Math.round(lng) + ')  ' + locName)
      $("#temperature").text('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + degF + '°F / ' + degC + 'C')
    }
  })

}

function locationErrorFunction(){
  console.log("Geocoder failed");
}

// function initialize() {
//   geocoder = new google.maps.Geocoder();
//
// }

function codeLatLng(lat, lng) {

  var latlng = new google.maps.LatLng(lat, lng);

  var location = $.ajax({
    url:'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=false',
    async: false
  })

  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    console.log(results)
      if (results[1]) {
       //formatted address
       alert(results[0].formatted_address)
      //find country name
           for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {

          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  //this is the object you are looking for
                  city= results[0].address_components[i];
                  break;
              }
          }
      }
      //city data
      alert(city.short_name + " " + city.long_name)


      } else {
        alert("No results found");
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
  });
};
/* END */








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

  var date = new Date();
  if(date_string){
    date = new Date(date_string)
  }
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  replacements = {
    'month': monthNames[monthIndex],
    'day': String(day),
    'year': String(year)
  };

  pretty_date_string = replacements['month'] + ' ' + replacements['day'] + ', ' + replacements['year'];
  $("#current-date").text(pretty_date_string)
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
  // console.log('Todays Key : ' + today);
  return today;
};

var getAllStorage = function(){
  chrome.storage.sync.get(null, function(items) {
    var allKeys = Object.keys(items);
    console.log(allKeys);
    if (allKeys.length==0){
      storeKey('a', 1)
      setTimeout(function(){}, 1000)
      storeKey('b', 1)
      setTimeout(function(){}, 1000)
      retrieveKey('a')
      setTimeout(function(){}, 1000)
      retrieveKey('b')
      setTimeout(function(){}, 1000)
      resetKey('a')
      retrieveKey('a')
      retrieveKey('b')
      console.log("Clearing Chrome Storage Sync...")
      resetKey()
      console.log("Clear!")
    }
  });
};

var storeKey = function(key, value){
  chrome.storage.sync.get([key], function(result) {
      var array = result[key]?result[key]:[];
      array.push('This string goes in the array.  #' + randBetween(0,5) + '   ' + value)

      var jsonObj = {};
      jsonObj[key] = array;
      chrome.storage.sync.set(jsonObj, function() {
          console.log("Saved a new array item");
      });
      console.log(jsonObj);
  });
};

var retrieveKey = function(key){
  chrome.storage.sync.get([key], function(result) {
    console.log(result);
  });
};

var resetKey = function(key){
  if(key){
    chrome.storage.sync.remove([key], function(result) {
      // console.log(result);
    });
  } else {
    chrome.storage.sync.clear();
  }

};

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] === obj) {
        return true;
    }
  }
  return false;
}


var MUSENEWS_UTM_PARAMS = '?utm_campaign=musenews&utm_source=chrome_extension&utm_medium=referral'
var GLOBAL_NUM_POSTS      = 1;
var GLOBAL_NUM_COMPANIES  = 2;
var GLOBAL_NUM_JOBS       = 4;

$(document).ready(function() {

  // var todayKey            = getTodayDate();
  var todayDate           = getPrettyDate();
  var todayPostList       = getMuse('posts');
  var todayJobsList       = getMuse('jobs');
  var todayCompaniesList  = getMuse('companies');


  // Check the user location - and set the location & weather if possible
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccessFunction, locationErrorFunction);
  }


  // var todayPost = todayPostList[randBetween(0, todayPostList.length-1)];
  /* Decide which article(s) to display */
  var todayPost = [];
  var i;
  for(i=0; i<GLOBAL_NUM_POSTS; i++){
    tp = todayPostList[randBetween(0, todayPostList.length-1)];
    if(!containsObject(tp, todayPost)){
      todayPost.push(tp)
    } else {
      i--;
    }
  };
  console.log(todayPost);

  /* Decide which jobs to display */
  var todayJobs = [];
  var i;
  for(i=0; i<GLOBAL_NUM_JOBS; i++){
    tj = todayJobsList[randBetween(0, todayJobsList.length-1)];
    if(!containsObject(tj, todayJobs)){
      todayJobs.push(tj)
    } else {
      i--;
    }
  };
  console.log(todayJobs);

  /* Decide which companies to display */
  var todayCompanies = [];
  var i;
  for(i=0; i<GLOBAL_NUM_COMPANIES; i++){
    tc = todayCompaniesList[randBetween(0, todayCompaniesList.length-1)];
    if(!containsObject(tc, todayCompanies)){
      todayCompanies.push(tc)
    } else {
      i--;
    }
  };
  console.log(todayCompanies);





  /* Populate the Article section */
  todayPost = todayPost[0];
  $("#article-title").text(todayPost.name);
  $("#article-excerpt").text(todayPost.excerpt);
  $("#article-button").click(function() {
    window.open(todayPost.refs.landing_page+MUSENEWS_UTM_PARAMS, '_blank');
  });
  $("#hero-image").attr('src', todayPost.refs.primary_image);

  /* Populate the Jobs sections */
  $("#job-title-0").text(todayJobs[0].name);
  $("#job-location-0").text(todayJobs[0].locations[0].name);
  $("#job-apply-link-0").removeAttr("href");
  $("#job-apply-link-0").click(function() {
    window.open(todayJobs[0].refs.landing_page+MUSENEWS_UTM_PARAMS, '_blank')
  });
  $("#job-company-0").text(todayJobs[0].company.name);

  $("#job-title-1").text(todayJobs[1].name);
  $("#job-location-1").text(todayJobs[1].locations[0].name);
  $("#job-apply-link-1").removeAttr("href");
  $("#job-apply-link-1").click(function() {
    window.open(todayJobs[1].refs.landing_page+MUSENEWS_UTM_PARAMS, '_blank')
  });
  $("#job-company-1").text(todayJobs[1].company.name);

  $("#job-title-2").text(todayJobs[2].name);
  $("#job-location-2").text(todayJobs[2].locations[0].name);
  $("#job-apply-link-2").removeAttr("href");
  $("#job-apply-link-2").click(function() {
    window.open(todayJobs[2].refs.landing_page+MUSENEWS_UTM_PARAMS, '_blank')
  });
  $("#job-company-2").text(todayJobs[2].company.name);

  $("#job-title-3").text(todayJobs[3].name);
  $("#job-location-3").text(todayJobs[3].locations[0].name);
  $("#job-apply-link-3").removeAttr("href");
  $("#job-apply-link-3").click(function() {
    window.open(todayJobs[3].refs.landing_page+MUSENEWS_UTM_PARAMS, '_blank')
  });
  $("#job-company-3").text(todayJobs[3].company.name);

  /* Populate the Companies sections */

});
