/** smooth scroll */
    //contact
    $(function() {
      $('#contact-btn').click(function() {
        $('html,body').animate({
          scrollTop: $("#contact").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//contact 2
    $(function() {
      $('#contact-btn-2').click(function() {
        $('html,body').animate({
          scrollTop: $("#contact").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//contact 3
    $(function() {
      $('#contact-btn-3').click(function() {
        $('html,body').animate({
          scrollTop: $("#contact").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//about me
    $(function() {
      $('#about-btn').click(function() {
        $('html,body').animate({
          scrollTop: $("#aboutme").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//home
    $(function() {
      $('#home-btn').click(function() {
        $('html,body').animate({
          scrollTop: $("#home").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//timeline
    $(function() {
      $('#timeline-btn').click(function() {
        $('html,body').animate({
          scrollTop: $("#timeline").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//projects
    $(function() {
      $('#projects-btn').click(function() {
        $('html,body').animate({
          scrollTop: $("#projects").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//apps
    $(function() {
      $('#apps-btn').click(function() {
        $('html,body').animate({
          scrollTop: $("#apps").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

	//apps 2
    $(function() {
      $('#apps-btn-2').click(function() {
        $('html,body').animate({
          scrollTop: $("#apps").offset().top },
          1000 //time in milliseconds
        );
        return false;
      });
    });

    //apps 3
      $(function() {
        $('#apps-btn-3').click(function() {
          $('html,body').animate({
            scrollTop: $("#apps").offset().top },
            1000 //time in milliseconds
          );
          return false;
        });
      });

/** sidebar */
	function w3_open() {
		document.getElementById("mySidebar").style.display = "block";
		document.getElementById("myOverlay").style.display = "block";
	}

	function w3_close() {
		document.getElementById("mySidebar").style.display = "none";
		document.getElementById("myOverlay").style.display = "none";
	}

/** picture in ABOUT ME**/
	function onClick(element) {
	  document.getElementById("img01").src = element.src;
	  document.getElementById("modal01").style.display = "block";
	  var captionText = document.getElementById("caption");
	  captionText.innerHTML = element.alt;
	}

/** show all button in TIMELINE*/
	function showAll() {
		if (document.getElementById("one").checked == true){
			document.getElementById("timeline-highlight").style.display = "none";
			document.getElementById("timeline-all").style.display = "block";
		} else {
			document.getElementById("timeline-highlight").style.display = "block";
			document.getElementById("timeline-all").style.display = "none";
		}
	}

/** determine height of project images */

function resizeProjectDivs(){
  var project2 = document.getElementById('project-2');
  var project1 = document.getElementById('project-1');
  var project3 = document.getElementById('project-3');

  var biggest = Math.max(project1.offsetHeight, project2.offsetHeight, project3.offsetHeight);
  console.log("project1: " + project1.offsetHeight + "px > " + biggest + "px");
  console.log("project2: " + project2.offsetHeight + "px > " + biggest + "px");
  console.log("project3: " + project3.offsetHeight + "px > " + biggest + "px");

  document.getElementById('project-1').style.height = biggest + "px";
  document.getElementById('project-2').style.height = biggest + "px";
  document.getElementById('project-3').style.height = biggest + "px";
}

window.onload = function(){
  resizeProjectDivs();
  resizeAppDivs();
}

function resizeAppDivs(){
  var app1a = document.getElementById('app-1-a');
  var app1b = document.getElementById('app-1-b');
  var app1c = document.getElementById('app-1-c');

  var app2a = document.getElementById('app-2-a');
  var app2b = document.getElementById('app-2-b');
  var app2c = document.getElementById('app-2-c');

  var biggestA = Math.max(app1a.offsetHeight, app2a.offsetHeight);
  var biggestB = Math.max(app1b.offsetHeight, app2b.offsetHeight);
  var biggestC = Math.max(app1c.offsetHeight, app2c.offsetHeight);

  document.getElementById('app-1-a').style.height = biggestA + "px";
  document.getElementById('app-2-a').style.height = biggestA + "px";
  document.getElementById('app-1-b').style.height = biggestB + "px";
  document.getElementById('app-2-b').style.height = biggestB + "px";
  document.getElementById('app-1-c').style.height = biggestC + "px";
  document.getElementById('app-2-c').style.height = biggestC + "px";
}
