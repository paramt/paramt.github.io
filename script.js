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