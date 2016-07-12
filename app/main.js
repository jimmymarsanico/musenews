// Get current weather based on user's latitude and longitude
var getWeather = function(lat, lon){
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=371c14f020dced602ec9e316e451bf07',
    async: true,
    success: function(result) {
      var locName = result.name
      var degF = Math.round((result.main.temp*9/5)-459.67)
      var degC = Math.round(result.main.temp - 273.15)
      $("#city").text(locName)
      $("#temperature").text(degF + '°F / ' + degC + 'C')
    }
  })
};

// Get today's date for the footer
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


// Calls the Muse api by model-type
var getMuse = function(api){
  var data=[];
  var d = $.ajax({
    url: 'https://api-v2.themuse.com/' + api + '?page=0&descending=false',
    async: false
  })
  data = d.responseJSON.results;
  return data;
};


// Function for grabbing a random number between "start" and "end"
var randBetween = function(start, end) {
  return Math.floor(Math.random() * end) + start;
};


// Function to check if an object exists in a list
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


// Main
$(document).ready(function() {
  var todayDate           = getPrettyDate();
  var todayPostList       = getMuse('posts');
  var todayJobsList       = getMuse('jobs');
  var todayCompaniesList  = getMuse('companies');


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


  /* Populate the Article section */
  todayPost = todayPost[0];  // there's only one post per pageload
  $("#article-title").text(todayPost.name);
  $("#article-button").click(function() {
    window.open(todayPost.refs.landing_page+MUSENEWS_UTM_PARAMS, '_blank');
  });
  $("#hero-image").attr('src', todayPost.refs.primary_image);


  /* Populate the Jobs sections */
  for(i=0; i<todayJobs.length; i++){
    $("#job-title-{i}".replace("{i}",i)).text(todayJobs[i].name);
    $("#job-location-{i}".replace("{i}",i)).text(todayJobs[i].locations[0].name);
    $("#job-company-{i}".replace("{i}",i)).text(todayJobs[i].company.name);
    $("#job-apply-link-{i}".replace("{i}",i)).attr("href", todayJobs[i].refs.landing_page+MUSENEWS_UTM_PARAMS);
    $("#job-apply-link-{i}".replace("{i}",i)).attr("target", "_blank");
  };


  /* Populate the Companies sections */
  for(i=0; i<todayCompanies.length; i++){
    $("#company-image-{i}".replace("{i}",i)).attr('src', todayCompanies[i].refs.f1_image);
    $("#company-name-{i}".replace("{i}",i)).text(todayCompanies[i].name);
    $("#company-excerpt-{i}".replace("{i}",i)).text(todayCompanies[i].description.substring(0,157)+'...')
    $("#company-jobs-{i}".replace("{i}",i)).attr("href", todayCompanies[i].refs.jobs_page+MUSENEWS_UTM_PARAMS);
    $("#company-jobs-{i}".replace("{i}",i)).attr("target", "_blank");
  };

  chrome.runtime.sendMessage ( {command: "getGeo"}, function (response) {
      getWeather(response.geoLocation.lat, response.geoLocation.lon)
  } );

});
