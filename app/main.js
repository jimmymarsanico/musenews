// CONSTANTS 
var MUSENEWS_UTM_PARAMS   = '?utm_campaign=musenews&utm_source=chrome_extension&utm_medium=referral'
var GLOBAL_NUM_POSTS      = 1;
var GLOBAL_NUM_COMPANIES  = 2;
var GLOBAL_NUM_JOBS       = 4;

// Call the Muse's location API
var getLocation = function(){
  $.ajax({
    url: 'https://www.themuse.com/api/location?api_key=03c6ca71e6ac95326013154b0a458fac937c82bd66aa9e48e86d708f06ef27af',
    success: function(result) {
      try {
        $("#city").text(result.closest_location);
      } catch(e) {
        console.log(e.message);  // log any exceptions
      };
    }
  });
}

// Get current weather based on user's latitude and longitude
var getWeather = function(lat, lon){
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat +
      '&lon=' + lon + '&appid=371c14f020dced602ec9e316e451bf07',
    success: function(result) {
      var degF = Math.round((result.main.temp*9/5)-459.67)
      var degC = Math.round(result.main.temp - 273.15)
      $("#temperature").text(degF + '°F / ' + degC + 'C')
      if($("#city").text() == '') {
          $("#city").text(result.name)
      };
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

  pretty_date_string = replacements['month'] + ' ' + replacements['day'] +
    ', ' + replacements['year'];
  $("#current-date").text(pretty_date_string)
  return pretty_date_string;
};


// Calls the Muse api by model-type
var getMuse = function(api, cb){
  $.ajax({
    url: 'https://api-v2.themuse.com/' + api + '?page=0&descending=false&api_key=03c6ca71e6ac95326013154b0a458fac937c82bd66aa9e48e86d708f06ef27af',
    async: true,
    success: function(d) {
      cb(d.results)
    }
  })
};


// Function for grabbing a random number between "start" and "end"
var randBetween = function(start, end) {
  return Math.floor(Math.random() * end) + start;
};


// Function to check if an object exists in a list
var containsObject = function(obj, list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === obj) {
        return true;
    }
  }
  return false;
}


// Adds HTML to the jobs section
function addJobRow(i) {
  var table = document.getElementById('jobs-table');
  var row = table.insertRow(-1);
  row.className = 'indiv-job';

  var jobTitle = row.insertCell(0);
  var jobLocation = row.insertCell(1);
  var jobCompany = row.insertCell(2);
  var jobApply = row.insertCell(3);

  jobTitle.className = 'job-title';
  jobTitle.innerHTML = '<h4 id="job-title-' + i + '"></h4>';

  jobLocation.id = 'job-location-' + i;
  jobLocation.className = 'job-location';

  jobCompany.class = 'job-company';
  jobCompany.innerHTML = '<h5 id="job-company-' + i + '"></h5>';

  jobApply.class = 'apply-job';
  jobApply.innerHTML = '<a id="job-apply-link-' + i +
    '" class="apply-button" href="">More Info \
    <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>';
};


// Adds HTML to the companies section
function addCompanyRow(i) {
  var list = document.getElementById('companies-table');
  var listItem = document.createElement('li');

  var companyDiv = document.createElement('div');
  companyDiv.className = 'clearfix';

  var companyImg = document.createElement('img');
  companyImg.id = 'company-image-' + i;

  var companyCopy = document.createElement('div');
  companyCopy.className = 'company-copy';

  var companyName = document.createElement('h3');
  companyName.id = 'company-name-' + i;
  companyName.className = 'company-name';

  var companyExp = document.createElement('p');
  companyExp.id = 'company-excerpt-' + i;

  // var companyLink = document.createElement('a');
  // companyLink.id = 'company-link-' + i;
  // companyLink.innerHTML = 'See Company Profile <i class="fa fa-long-arrow-right" aria-hidden="true"></i>'

  var companyJobs = document.createElement('a');
  companyJobs.id = 'company-jobs-' + i;
  companyJobs.innerHTML = 'See Available Jobs <i class="fa fa-long-arrow-right" aria-hidden="true"></i>'

  companyCopy.appendChild(companyName);
  companyCopy.appendChild(companyExp);
  // companyCopy.appendChild(companyLink);
  companyCopy.appendChild(document.createElement('br')); // remove after css fix
  companyCopy.appendChild(companyJobs);
  companyDiv.appendChild(companyImg);
  companyDiv.appendChild(companyCopy);
  listItem.appendChild(companyDiv);
  list.appendChild(listItem);
};


// Success function for post call
var postSuccess = function(todayPostList) {
  // Decide which article(s) to display
  var todayPost = [];
  for(var i=0; i<GLOBAL_NUM_POSTS; i++){
    tp = todayPostList[randBetween(0, todayPostList.length-1)];
    if(!containsObject(tp, todayPost)){
      todayPost.push(tp)
    } else {
      i--;
    }
  };

  // Populate the Article section
  todayPost = todayPost[0];  // there's only one post per pageload
  $("#article-title").text(todayPost.name);
  $("#article-button").click(function() {
    window.open(todayPost.refs.landing_page+MUSENEWS_UTM_PARAMS, '_blank');
  });
  $("#hero-image").attr('src', todayPost.refs.primary_image);

};


// Success function for jobs call
var jobSuccess = function(todayJobsList) {
  // Decide which jobs to display
  var todayJobs = [];
  for(var i=0; i<GLOBAL_NUM_JOBS; i++){
    tj = todayJobsList[randBetween(0, todayJobsList.length-1)];
    if(!containsObject(tj, todayJobs)){
      todayJobs.push(tj)
    } else {
      i--;
    }
  };

  // Populate the Jobs sections
  for(var i=0; i<todayJobs.length; i++){
    // addJobRow(i);
    $("#job-title-" + i).text(todayJobs[i].name);
    $("#job-location-" + i).text(todayJobs[i].locations[0].name);
    $("#job-company-" + i).text(todayJobs[i].company.name);
    $("#job-apply-link-" + i).attr("href",
      todayJobs[i].refs.landing_page+MUSENEWS_UTM_PARAMS);
    $("#job-apply-link-" + i).attr("target", "_blank");
  };
};


// Success function for companies call
var companySuccess = function(todayCompaniesList) {
  // Decide which companies to display
  var todayCompanies = [];
  for(var i=0; i<GLOBAL_NUM_COMPANIES; i++){
    tc = todayCompaniesList[randBetween(0, todayCompaniesList.length-1)];
    if(!containsObject(tc, todayCompanies)){
      todayCompanies.push(tc)
    } else {
      i--;
    }
  };

  // Populate the Companies sections
  for(var i=0; i<todayCompanies.length; i++){
    // addCompanyRow(i);
    $("#company-image-" + i).attr('src', todayCompanies[i].refs.f1_image);
    $("#company-name-" + i).text(todayCompanies[i].name);
    var compDesc = todayCompanies[i].description;
    if(compDesc.length > 157) {
      compDesc = compDesc.substring(0,157)+'...'
    };
    $("#company-excerpt-" + i).text(compDesc);
    $("#company-jobs-" + i).attr("href", todayCompanies[i].refs.jobs_page+MUSENEWS_UTM_PARAMS);
    $("#company-jobs-" + i).attr("target", "_blank");
    $("#company-link-" + i).attr("href", todayCompanies[i].refs.landing_page+MUSENEWS_UTM_PARAMS);
    $("#company-link-" + i).attr("target", "_blank");
  };
};

// Main
$(document).ready(function() {
  getPrettyDate();
  getMuse('posts', postSuccess);
  getMuse('jobs', jobSuccess);
  getMuse('companies', companySuccess);
  getLocation();
  navigator.geolocation.getCurrentPosition (function (position) {
    getWeather(position.coords.latitude,position.coords.longitude)
  } );

} );
