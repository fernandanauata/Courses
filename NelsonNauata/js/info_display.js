work.display = function() {
  if (work.jobs.length > 0) {

  	work.jobs.forEach(function(j){
  		  $("#workExperience").append(HTMLworkStart);
	      $(".work-entry:last").append(HTMLworkEmployer.replace("%data%", j.employer) + HTMLworkTitle.replace("%data%", j.title));
	      $(".work-entry:last").append(HTMLworkLocation.replace("%data%", j.location));
	      $(".work-entry:last").append(HTMLworkDates.replace("%data%", j.dates));
	      $(".work-entry:last").append(HTMLworkDescription.replace("%data%", j.description));
	});
 }
}

work.display();