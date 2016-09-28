var work = {
	"jobs": [
	  {
		"employer": "NaUeb",
		"title": "Art Director",
		"location":"Canada",
		"dates": "2010, Present",
		"description": "NaUeb is my freelance company through which I have been able to work with clients from differents countries such as Canada, United States, Ireland and others. Additionally, the projects developed consists in visual identities, printed and web advertisements, catalogs, brochures and a number of other services."
	  },
	  {
	  	"employer": "MKT Brasil",
		"title": "Art Director",
		"location":"Campo Grande, MS, Brazil",
		"dates": "January 2013, June 2014",
		"description": "My job consisted of developing the overall visual aspects of advertising campaigns and I worked with the team to create a concept and design elements, such as colors and photographs. In addition, some other daily duties included short-run design projects such as stationery, business cards, brochures, email invitations. Also, I usually talked directly with the clients to receive their feedback and perform any tweaks for ensuring a high quality of the piece before sending it for printing."
	  },
	  {
	  	"employer": "Doze - Design Propaganda",
		"title": "Art Director",
		"location":"Campo Grande, MS, Brazil",
		"dates": "September 2012, November 2012",
		"description": "My duties included to set the concept for design projects such as stationery, business cards, brochures, email invitations and ensure the quality of the files for printing."
	  },
	  {
	  	"employer": "Midianova Estratégia em Comunicação",
		"title": "Junior Graphic Designer",
		"location":"Campo Grande, MS, Brazil",
		"dates": "January 2012, October 2012",
		"description": "In this position, I assisted Art Directors to print files in the correct format and resolution. After a while, I was given more interesting tasks as creating graphic elements where I could show my imagination. For example, I designed stationery, business cards, in-house brochures, email invitations and print ads."
	  },
	  {
	  	"employer": "8020 Marketeria Digital",
		"title": "Social Media Marketing Intern",
		"location":"Campo Grande, MS, Brazil",
		"dates": "June 2011, November 2011",
		"description": "In this position, I understood how an agency focused on the digital media thinks. I participated in brainstorm meetings to set how we lead a company on the web and designed social media posts, email marketings, and blog templates."
	  },
	  {
	  	"employer": "Remat Marketing & Propaganda",
		"title": "Junior Art Director",
		"location":"Campo Grande, MS, Brazil",
		"dates": "November 2010, June 2011",
		"description": "This was my second internship and I had responsibilities as pairing with the Copywriters to create endo marketing campaigns as invitations for parties, notifications about company issues and birthday cards. Plus, I was able to work for real clients creating advertisements for magazines and newspaper, brochures and posters."

	  },
	  {
	  	"employer": "Latina, Novo Engenho",
		"title": "Social Media Marketing Intern",
		"location":"Campo Grande, MS, Brazil",
		"dates": "March 2010, November 2010",
		"description": "This was my first internship and I worked closely with experienced Art Directors and Copywriters watching their performance allowing me to learn very quickly. Also, I had the chance to understand how an Advertising Agency works and feel how exciting the creative department was for me."
	  }
	]
};

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

var projects = {
	"projects": [
	  {
		"title":"Roote App" ,
		"dates":"2015" ,
		"description":"Roote is an Android app that helps you find relevant places" ,
		"images": ["https://s3.amazonaws.com/poly-screenshots.angel.co/enhanced_screenshots/644752-original.jpg", "https://s3.amazonaws.com/poly-screenshots.angel.co/enhanced_screenshots/644752-original.jpg"]
	  },
	  {
	  	"title":"Wurf App" ,
		"dates":"2015" ,
		"description":"App that makes easier to find people with similar interests" ,
		"images": ["https://s3.amazonaws.com/poly-screenshots.angel.co/enhanced_screenshots/644758-original.jpg", "https://s3.amazonaws.com/poly-screenshots.angel.co/enhanced_screenshots/644752-original.jpg"]
      },
      {
      	"title":"Gavea Garden App" ,
		"dates":"2016" ,
		"description":"Design for app and ad campaign for a Brazilian restaurant",
		"images": ["https://placekitten.com/306/231", "https://placekitten.com/306/231"]
      }
	]
};

projects.display = function() {

	if (projects.projects.length > 0) {
	
	$("#projects").append(HTMLprojectStart);

    projects.projects.forEach(function(p){
	    $(".project-entry:last").append(HTMLprojectTitle.replace("%data%", p.title));
	    $(".project-entry:last").append(HTMLprojectDates.replace("%data%", p.dates));
	    $(".project-entry:last").append(HTMLprojectDescription.replace("%data%", p.description));
	    p.images.forEach(function(img){
	    	$(".project-entry:last").append(HTMLprojectImage.replace("%data%", img));
	    });  
    });
  }
}

projects.display();

var bio = {
	"name": "Fernanda Nauata",
	"role": "Front-End Developer",
	"welcomeMessage": "Fernanda has a Bachelor's Degree in Advertising and Marketing and a solid knowledge in working with the latest versions of Mac OS, Photoshop, Illustrator and Corel Draw. Plus, she has special affection for UI/UX design and development of mobile applications.",
	"biopic": "https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/6044_1265939183423252_8527263972209198437_n.jpg?oh=2aaa70c28d66d485019df56d990c05fb&oe=5855447B",
	"contacts": {
		"mobile": "778 891-4854",
		"email": "contact@alvesfernanda.com",
		"github": "FernandaNauata",
		"twitter": "@FernandaNauata",
		"location": "Burnaby, BC"
	},
	"skills": ["Adobe Photoshop", "HTML5 & CSS3", "Javascript", "Twitter Bootstrap", "Adobe Illustrator", "Adobe Indesign", "CorelDraw", "Mac OS X", "Microsoft Windows" , "Web Development", "Front-End Development"]
};

bio.display = function() {

	if (bio.skills.length > 0) {
		
		$("#header").append(HTMLheaderName.replace("%data%", bio.name));
	    $("#header").append(HTMLheaderRole.replace("%data%", bio.role));
	    $("#header").append(HTMLwelcomeMsg.replace("%data%", bio.welcomeMessage));
	    $("#header").append(HTMLbioPic.replace("%data%", bio.biopic));

	    $("#header").append(HTMLmobile.replace("%data%", bio.contacts.mobile));
	    $("#header").append(HTMLemail.replace("%data%", bio.contacts.email));
	    $("#header").append(HTMLgithub.replace("%data%", bio.contacts.github));
	    $("#header").append(HTMLlocation.replace("%data%", bio.contacts.location));

	    $("#footerContacts").append(HTMLmobile.replace("%data%", bio.contacts.mobile));
	    $("#footerContacts").append(HTMLemail.replace("%data%", bio.contacts.email));
	    $("#footerContacts").append(HTMLgithub.replace("%data%", bio.contacts.github));
	    $("#footerContacts").append(HTMLlocation.replace("%data%", bio.contacts.location));

	    $("#header").append(HTMLskillsStart);

	    bio.skills.forEach(function(skill){
	    	$("#skills").append(HTMLskills.replace("%data%", skill));
	    });
	}
}

bio.display();

var education = {
	"schools": [
	  {
		"name": "Universidade Estacio de Sa",
		"location": "Campo Grande, MS, Brazil",
		"degree": "Bachelor's Degree ",
		"majors": ["Advertising and Marketing"],
		"dates": "2009, 2013",
		"url": "http://portal.estacio.br/"
	  },
	  {
		"name": "Universidade Estacio de Sa",
		"location": "Campo Grande, MS, Brazil",
		"degree": "Bachelor's Degree ",
		"majors": ["Advertising and Marketing"],
		"dates": "2009, 2013",
		"url": "http://portal.estacio.br/"
	  },
	],
	"onlineCourses": [
	  {
	  	"title": "HTML, CSS, and Javascript for Web Developers",
	  	"school": "Coursera",
	  	"dates": "2016",
	  	"url": "https://www.coursera.org/learn/html-css-javascript-for-web-developers"
	  },
	  {
	  	"title": "JavaScript Basics",
	  	"school": "Coursera",
	  	"dates": "2016",
	  	"url": "https://www.udacity.com/course/javascript-basics--ud804"
	  }
	]  
};

education.display = function(){

	education.schools.forEach(function(e){
		$("#education").append(HTMLschoolStart);
		$(".education-entry:last").append(HTMLschoolName.replace("%data%", e.name).replace("#", e.url));
		$(".education-entry:last").append(HTMLschoolDegree.replace("%data%", e.degree));
		$(".education-entry:last").append(HTMLschoolDates.replace("%data%", e.dates));
		$(".education-entry:last").append(HTMLschoolLocation.replace("%data%", e.location));
		$(".education-entry:last").append(HTMLschoolMajor.replace("%data%", e.majors));
	});
		$("#education").append(HTMLonlineClasses);

    education.onlineCourses.forEach(function(o){
    	$("#education").append(HTMLschoolStart);
		$(".education-entry:last").append(HTMLonlineTitle.replace("%data%", o.title).replace("#", o.url));
		$(".education-entry:last").append(HTMLonlineSchool.replace("%data%", o.school));
		$(".education-entry:last").append(HTMLonlineDates.replace("%data%", o.dates));
		$(".education-entry:last").append(HTMLonlineURL.replace("%data%", o.url).replace("#", o.url));
	});
}

education.display();


$(document).click(function(loc) {
  logClicks(loc.pageX, loc.pageY);
});


$("#mapDiv").append(googleMap);

