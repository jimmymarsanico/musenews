// Get the latitude and the longitude;
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
      $("#city").text(locName)
      $("#temperature").text('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + degF + '°F / ' + degC + 'C')
    }
  })
}

// If the location retrieval fails
function locationErrorFunction(){
  console.log("Geocoder failed");
}

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

$(document).ready(function() {

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
  $("#company-image-0").attr('src', todayCompanies[0].refs.f1_image);
  $("#company-name-0").text(todayCompanies[0].name);
  $("#company-excerpt-0").text(todayCompanies[0].description.substring(0,157)+'...')
  $("#company-jobs-0").click(function(){
    window.open(todayCompanies[0].refs.jobs_page+MUSENEWS_UTM_PARAMS, '_blank')
  });

  $("#company-image-1").attr('src', todayCompanies[1].refs.f1_image);
  $("#company-name-1").text(todayCompanies[1].name);
  $("#company-excerpt-1").text(todayCompanies[1].description.substring(0,157)+'...')
  $("#company-jobs-1").click(function(){
    window.open(todayCompanies[1].refs.jobs_page+MUSENEWS_UTM_PARAMS, '_blank')
  });

});
