var HTMLbioname = '';
var HTMLbiotitle = '';
var HTMLbioschool = '';

var bio = "Nome/Titulo/School/TA/Gruvi/Supervisors/Lee Cooper http://vml.cs.sfu.ca/";

var HTMLprojectstart = '<div class="project-entry col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>';
var HTMLprojectimage = '<img class="imgprojects" src="%data%">';
var HTMLprojecttitle = '<h4 class="title">%data%</h4>';
var HTMLprojectdescription = '<p class="description">%data%</p>';
var HTMLprojectlink = '<p><a href="#" target="_blank">Link to project</a></p>';

var HTMLclearfixlarge =  '<div class="clearfix visible-lg-block visible-md-block"></div>';
var HTMLclearfixsmall =  '<div class="clearfix visible-sm-block"></div>';

var HTMLpubstart = '<div class="pub-entry col-lg-12 col-md-12 col-sm-6 col-xs-12"></div>';
var HTMLpubimage = '<img class="divpubimg col-lg-4 col-md-4 col-sm-12 col-xs-12" src="%data%">';
var HTMLpubtitle = '<h4 class="title col-lg-8 col-md-8 col-sm-12 col-xs-12">%data%</h4>';
var HTMLpubdescription = '<p class="description col-lg-8 col-md-8 col-sm-12 col-xs-12">%data%</p>';
var HTMLpublink = '<p><a class="col-lg-12 col-md-12 col-sm-12 col-xs-12" href="#" target="_blank">Link to publication</a></p>';
var HTMLpubauthors = '<p class="authors col-lg-12 col-md-12 col-sm-12 col-xs-12">Authors: %data%</p>';

var HTMLmiscstart = '<div class="misc-entry col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>';
var HTMLmiscimage = '<img class="imgprojects" src="%data%">';
var HTMLmisctitle = '<h4 class="title">%data%</h4>';
var HTMLmiscdescription = '<p class="description">%data%</p>';
var HTMLmisclink = '<p><a href="#" target="_blank">Link</a></p>';


var info = {
    "projects": [{
        "image": "http://lorempixel.com/350/300/",
        "title": "Multi-resolution Analysis of Pathology Data with Convolutional Neural Networks (CNNs) - Google Summer Of Code 2016",
        "description": "The ultimate goal of this project is exploring high and low-resolution images techniques for performing high-level inferences over complete tissue medical slides, which presents a few challenging aspects regarding storage and processing. The high-level inferences consist of learning patterns between summarized slides and target labels for solving a specific problem. For example, it could be interesting to calculate the abundance (by area) of regions like angiogenesis, necrosis, and infiltrating lymphocytes to infer patient-level characteristics. A tissue slide can easily reach around 20GB in-memory, which turns intractable many approaches of feeding those slides entirely to a classifier. One recent method for addressing this problem is sampling regions based on low-resolution features (i.e. texture, boundaries) for extracting information about the tissue. Moreover, this method can also help with speeding up the processing, since after cropping the proposed regions, the problem would be turned into a tractable learning problem.",
        "url": "https://github.com/cooperlab/RegionProposal"
    }, {
        "image": "img/proj02.jpg",
        "title": "Video Analysis of Deep Extracted Features and Temporal Cuts for Action Recognition",
        "description": "Abstract—In this project, we investigate the use of a new descriptor for Deep Learning, called Visual Rhythms (VR), for the task of action recognition. In addition, the Visual Rhythm descriptor is combined with the state-of-the-art descriptor, improved dense trajectories (iDT), and convolutional features extracted from a Deep Convolutional Neural Network named C3D. Moreover, we have tested our extracted features using Support Vector Machines (SVMs) on HMDB51, which is currently a challenging dataset. Our tests have shown the need for more complex feature in order to obtain significant improvement in terms of accuracy.",
        "url": ""
    }, {
        "image": "http://lorempixel.com/350/300/",
        "title": "Toronto Deep Learning Demos",
        "description": "Online Web Application and Mobile application demo using Convolutional Neural Networks for image classification.",
        "url": "http://deeplearning.cs.toronto.edu/"
    }, {
        "image": "http://lorempixel.com/350/300/",
        "title": "Decoding Tumor Microenvironments with TissueNet Deep Convolutional Learning",
        "description": "To provide scalable and accurate characterization of large pathology archives we have developed TissueNet, a software framework based on parallel deep convolutional learning. TissueNet does not require image segmentation and uses feature learning methods to learn optimal taskspecific features for classifying histologic entities in an unbiased manner. We demonstrate the capabilities of TissueNet using whole slide images from The Cancer Genome Atlas project, where we analyze the formation of blood vessels in brain tumors. We demonstrate that TissueNet’s feature learning methods provide better classification than feature engineering approaches based on image segmentation, and illustrate how the TissueNet software framework can scale to analyze realistic datasets that contain terabytes of image data and hundreds-of-millions of cells.",
        "url": "https://github.com/cooperlab/CellNet"
    }, {
        "image": "http://lorempixel.com/350/300/",
        "title": "Decoding Tumor Microenvironments with TissueNet Deep Convolutional Learning - Google Summer Of Code 2015",
        "description": "To provide scalable and accurate characterization of large pathology archives we have developed TissueNet, a software framework based on parallel deep convolutional learning. TissueNet does not require image segmentation and uses feature learning methods to learn optimal taskspecific features for classifying histologic entities in an unbiased manner. We demonstrate the capabilities of TissueNet using whole slide images from The Cancer Genome Atlas project, where we analyze the formation of blood vessels in brain tumors. We demonstrate that TissueNet’s feature learning methods provide better classification than feature engineering approaches based on image segmentation, and illustrate how the TissueNet software framework can scale to analyze realistic datasets that contain terabytes of image data and hundreds-of-millions of cells.",
        "url": "https://github.com/cooperlab/CellNet"
    }, {
        "image": "http://lorempixel.com/350/300/",
        "title": "Object Recognition on Images usingr-OSGi - Facebook Open Academy 2015",
        "description": "In this final year project for the degree of Bachelor of Science in Computer Engineering, we created a remote communication system using Remote Open Service Gateway Initiative (R-OSGi), a framework that supports the implementation of component-based and serviceoriented applications in Java. The client-side is able to send visual resources such as captured images to the server-side, which contains a machine learning algorithm, more precisely Convolutional Neural Network models implemented with the Caffe API, for performing classification and returning the top five tags of classes corresponding to the Object Recognition problem. By the end of the semester we were able to create a fully functional system, which communicates using the R-OSGi Technology and classify the provided data using the pretrained models of Convolutional Neural Networks.",
        "url": "https://github.com/nmizoguchi/pfg-r-osgi"
    }],

    "publications": [{
        "image": "http://placehold.it/350x300",
        "title": "Learning Genomic Representations to Predict Clinical Outcomes in Cancer in ICLR Workshop Track, Mar 2016.",
        "description": "Genomics are rapidly transforming medical practice and basic biomedical research, providing insights into disease mechanisms and improving therapeutic strategies, particularly in cancer. The ability to predict the future course of a patient's disease from high-dimensional genomic profiling will be essential in realizing the promise of genomic medicine, but presents significant challenges for state-of-the-art survival analysis methods. In this abstract we present an investigation in learning genomic representations with neural networks to predict patient survival in cancer. We demonstrate the advantages of this approach over existing survival analysis methods using brain tumor data.",
        "url": "http://beta.openreview.net/forum?id=xnrAg7jmLF1m7RyVi3vG",
        "authors": "Safoora Yousefi, Congzheng Song, Nelson Nauata, Lee Cooper"
    }, {
        "image": "http://placehold.it/350x300",
        "title": "Using Visual Analytics to Diagnose Productivity and Quality Issues on IT Service Pools” in Maximizing Management Performance and Quality with Service Analytics - Book Chapter 8, Aug 2015.",
        "description": "This chapter describes and validates the applicability of a visual analytics tool, named Workload Profile Analytics (WPA), in the context of incident management (IM) inside a large IT services provider. The WPA tool implements a method to evaluate the performance and quality of IM systems that uses temporal information from incident records (tickets). The method is based on a graphical representation, called Workload Profile Chart (WPC), which consists of a log-log chart obtained by computing and plotting the spreading of ticket data. Then, using the chart, a visual inspection is done to examine the concentration of tickets over the various areas of interest of the WPC and a diagnosis of potential issues is suggested. To illustrate how powerful WPA can be, two real world scenarios are depicted and used to validate the use of WPA in a large service delivery organization. Finally, some discussions about further improvements on the tool and research directions are done.",
        "url": "http://alvesfernanda.com",
        "authors": "Victor Cavalcante, Heloisa Candello, Claudio Pinhanez, Alan Braz, Franklin Amorim, Nelson Nauata"
    }, {
        "image": "http://placehold.it/350x300",
        "title": "Enhancing teamwork by optimizing collaboration in APMOD Conference, University of Warwick, Coventry, UK, Nov 2014.",
        "description": "Assembling an effective team to perform a particular set of collaborative tasks requires an approach that goes beyond the analysis of individual skills and capabilities. Team members' ability to work together and communicate with each other is paramount in collaborative tasks. Thus, social relationships play an important role when teaming up people and are essential elements to add to decision making processes. In order to investigate this, we started off by exploring collaboration aspects that can be extracted from the network (an undirected weighted graph) built from a particularly popular but unexpected dataset: we use the social relationship and historical data of Marvel comic books to examine the problem of team formation. In this context, the aspect we would like to assess is how important is the ability of working together for super heroes, considering their power grids amended by relationships extracted from comic books records The approaches we implemented automatically assemble a group of villains and a group of heroes, both considering the social links among every team member personal attributes. In our experimentation we examine the performance of three heuristic strategies and report computational results on them: a genetic algorithm, a GRASP and an optimization heuristic tailored specifically to tackle the problem. Our experimental results show that our algorithms produce meaningful and useful results, matching groups that occur in the Marvel world as well as interesting possibilities of new teams.",
        "url": "http://lorempixel.com/350/300/",
        "authors": "Victor Cavalcante, Ana Paula Appel, Marcos Vieira, Vagner Santana, Rogerio Paula and Nelson Nauata"
    }],

    "misc": [{
        "image": "img/misc01.jpg",
        "title": "3rd place - Smart Health Hackaton 2015",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        "url": "http://alvesfernanda.com"
    }, {
        "image": "img/misc02.jpg",
        "title": "1st place - SportsHack 2014",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        "url": "http://betakit.com/team-raisins-wins-sportshack-2014-torontos-first-sports-wearables-hackathon/"
    }, {
        "image": "img/misc03.jpg",
        "title": "Last Computer Built",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        "url": "http://betakit.com/team-raisins-wins-sportshack-2014-torontos-first-sports-wearables-hackathon/"
    }, {
        "image": "img/misc04.jpg",
        "title": "First Computer Built",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        "url": "http://betakit.com/team-raisins-wins-sportshack-2014-torontos-first-sports-wearables-hackathon/"
    }]
};


var HTMLsocialmediastart = '<div class="sm-entry col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>';
var HTMLsmname = '<span class="smname">%data%</span>'
var HTMLemail = '<a href="#" class="zocial-email smicon"></a>';
var HTMLfacebook = '<a href="#" class="zocial-facebook smicon"></a>';
var HTMLlinkedin = '<a href="#" class="zocial-linkedin smicon"></a>';

var socialmedia = {
    "name": "Nelson Nauata",
    "email":"ennauata@gmail.com",
    "facebook":"https://www.facebook.com/nelson.nauata",
    "linkedin":"https://ca.linkedin.com/in/nelson-nauata-8085522a/en",
}

socialmedia.display = function(socialmedia) {

          $("#socialmedia").append(HTMLsocialmediastart);
          $(".sm-entry:last").append(HTMLsmname.replace("%data%", socialmedia.name));
          $(".sm-entry:last").append(HTMLemail.replace("#", socialmedia.email));
          $(".sm-entry:last").append(HTMLfacebook.replace("#", socialmedia.facebook));
          $(".sm-entry:last").append(HTMLlinkedin.replace("#", socialmedia.linkedin));
};

socialmedia.display(socialmedia);

projects.display = function() {
  if (info.projects.length > 0) {

    info.projects.forEach(function(projects){
          $("#projects").append(HTMLprojectstart);
          $(".project-entry:last").append(HTMLprojectimage.replace("%data%", projects.image));
          $(".project-entry:last").append(HTMLprojecttitle.replace("%data%", projects.title));
          $(".project-entry:last").append(HTMLprojectdescription.replace("%data%", projects.description));
          $(".project-entry:last").append(HTMLprojectlink.replace("#", projects.url));
    });
 }
};

projects.display();

publications.display = function() {
  if (info.publications.length > 0) {

    info.publications.forEach(function(pub){
          $("#publications").append(HTMLpubstart);
          $(".pub-entry:last").append(HTMLpubimage.replace("%data%", pub.image));
          $(".pub-entry:last").append(HTMLpubtitle.replace("%data%", pub.title));
          $(".pub-entry:last").append(HTMLpubdescription.replace("%data%", pub.description));
          $(".pub-entry:last").append(HTMLpublink.replace("#", pub.url));
          $(".pub-entry:last").append(HTMLpubauthors.replace("%data%", pub.authors));
    });
 }
};

publications.display();

misc.display = function() {
  if (info.misc.length > 0) {

    info.misc.forEach(function(misc){
          $("#misc").append(HTMLmiscstart);
          $(".misc-entry:last").append(HTMLmiscimage.replace("%data%", misc.image));
          $(".misc-entry:last").append(HTMLmisctitle.replace("%data%", misc.title));
          $(".misc-entry:last").append(HTMLmiscdescription.replace("%data%", misc.description));
          $(".misc-entry:last").append(HTMLmisclink.replace("#", misc.url));
    });
 }
};

misc.display();

function flexGrid(){
    if( window.innerWidth <= 991) {
        $('.clearfix').remove();
        var counter = 0;
        $('#projects').children('.project-entry').each(function(entry){
            
            if (counter === 1){
                $(HTMLclearfixsmall).insertAfter(this);
            }
            counter += 1;
            if (counter > 1){
                counter = 0;
            }
        });

        $('#misc').children('.misc-entry').each(function(entry){
            
            if (counter === 1){
                $(HTMLclearfixsmall).insertAfter(this);
            }
            counter += 1;
            if (counter > 1){
                counter = 0;
            }
        });
    }
    else if(window.innerWidth > 991){
        $('.clearfix').remove();
        var counter = 0;
        $('#projects').children('.project-entry').each(function(entry){

            if (counter === 2){
                $(HTMLclearfixlarge).insertAfter(this);
            }
            counter += 1;
            if (counter > 2){
                counter = 0;
            }
        });

        $('#misc').children('.misc-entry').each(function(entry){
            
            if (counter === 2){
                $(HTMLclearfixlarge).insertAfter(this);
            }
            counter += 1;
            if (counter > 2){
                counter = 0;
            }
        });
    }
}

$( window ).on('resize', flexGrid);
$(document).ready(flexGrid);
