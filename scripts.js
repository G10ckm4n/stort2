/*
 * Gets array of videos and array of categories from json.
 * Resizes elements when window is resized.
 */
window.onload = function(){
  $.getJSON("videos.json", function(result){			// Use jquery to get json file.
    var storeName = crappend("div",document.body);		// Set main title in page.
    storeName.className = "storeName";					// Set title class.
    var name = document.createTextNode('Myndbandaleiga');
    storeName.append(name);
    build(result.videos,result.categories);				// Build the rest of the site.
    var windowWidth = window.innerWidth;				// Get window size.
    if(windowWidth < 1000){
      document.body.setAttribute("style","width: 500px");
    }
    window.onresize = resize;							// Resize elements when window is resized.
  });
}
/*
 * Resize page elements.
 */
function resize(){
  var windowWidth = window.innerWidth;					// Get window size.
  var elements = document.getElementsByClassName('videoBox');
  if(windowWidth < 1000){
    document.body.setAttribute("style","width: 500px");
    for (var i = 0; i < elements.length;i++) {
      elements[i].setAttribute("style","width: 100%");
    }
  }else{
    document.body.setAttribute("style","width: 1000px");
    for (i = 0; i < elements.length;i++) {
      elements[i].setAttribute("style","width: 48%");
    }
  }
}
/*
 * Builds DOM objets for each categorie of videos.
 * input: Videos array, Categories array.
 * output: creates DOM elements to hold video info for each category.
 */
function build(videos,categories){
  for(var i=0;i<categories.length;i++){					// Iterate through all the categories.
    var box = crappend("div",document.body);			// Create a div element for the category.
    box.className = "box";								// Set the element to it's class.
    var titleBox = crappend("div",box);					// Create a div for the category title.
    titleBox.className = "titleBox";					// Set div class.
    // Create text element for the category title.
    var t = document.createTextNode(categories[i].title);
    titleBox.appendChild(t);							// Append text to title div.
    createPoster(categories,videos,box,i);				// Create video poster and information box.
    var underLine = crappend("div",box);				// Create div for an underline.
    underLine.className = "underLine";					// Set underline class.
  }
}
/*
 * Run through videos and compare to id.
 * input: Videos array, integer id.
 * output: Video array item.
 */
function findID(videos, id){
  for(var k = 0; k < videos.length;k++){				// Iterate through videos.
    if(videos[k].id == id) return videos[k];			// Return if it matches given id.
  }
}
/*
 * Creates a box with the videos poster.
 * input: Categories array, Videos array, DOM object box, int i
 * output: creates various DOM elements to hold video information.
 */
function createPoster(categories,videos,box,i){
  for(var j=0;j<categories[i].videos.length;j++){
    (function(){										// Close function inside loop.
      var vidBox = crappend("div",box);					// Box for video poster and info.
      vidBox.className = "videoBox";					// Set class name for vidBox.
      if(window.innerWidth >= 1000){					// Check display size.
        vidBox.setAttribute("style","width: 48%");		// Set vidBox size accordingly.
      }else{
        vidBox.setAttribute("style","width: 100%");
      }
      var posterBox = crappend("div",vidBox);			// Box for poster.
      posterBox.className = "posterBox";				// Set class for the box.

      var poster = crappend("img",posterBox);			// The atual image object for the poster.
      var vid = findID(videos,categories[i].videos[j]);	// Find the right video object.
      poster.src = vid.poster;							// Image source for the poster.
      poster.className = "poster";						// Set class for poster.
      var enc = btoa(JSON.stringify(vid));				// Encode json object.
      var linkString = "video.html?"+ enc;				// Create link string for video.
      vidBox.addEventListener('click', function() {		// Create event listener.
        location.href = linkString;						// Link to the video.
      }, false);

      var videoInfo = crappend("div",vidBox);			// Inforamtion box for the video.
      videoInfo.className = "infobox";
      var vidTitleBox = crappend("div",videoInfo);		// The title of the video.
      vidTitleBox.className = "vidTitle";				// Set class for title.
      var title = document.createTextNode(vid.title);	// Get the title text.
      vidTitleBox.appendChild(title);					// Append text to dom object.
	
      var creation = crappend("div",videoInfo);			// Create dom object for creation time.
      var creaTime = calcTime(vid.created);				// Get creation time and run it through method.
      var created = document.createTextNode(creaTime);	// Make text node with the result.
      creation.append(created);							// Append text to dom object.	
	
      var durBox = crappend("div",posterBox);			// Create dom object for duration.
      durBox.className = "durationBox";					// Set class for duration.
      var dur = calcDuration(vid.duration);				// Get the  videos duration and run through method.
      var duration = document.createTextNode(dur);		// Create text node for duration.
      durBox.appendChild(duration);						// Append text node to dom objecct.
    }());
  }
}
/*
 * input:  integer value of time at creation in milliseconds.
 * output: String value of days or weeks since creation.
 */
function calcTime(created){
  var d = new Date();									// Current date in milliseconds.
  var difference = d.getTime()-created;					// Creation date - current date.
  var toDays = Math.trunc(difference/(1000*60*60*24));	// From ms to s / 1000 from s to m *60 from m to h *60 from h to d *24
  var weeks  = Math.trunc(toDays/7);					// From days to weeks
  if(weeks >= 1) return "Fyrir "+weeks+" vikum síðan";	// Return text string representing weeks since creation.
  else return "Fyrir "+toDays+" dögum síðan";			// Return text string representing days since creation.
}
/*
 * input: duration in seconds.
 * output: String with "minutes : seconds".
 */
function calcDuration(duration){
  var toMins = duration / 60;							// Divide duration to minutes.
  var toSecs = ('0' + (duration % 60)).slice(-2);		// Modulo minutes away and put a zero in front.	
  var time = Math.trunc(toMins)+":"+toSecs;				// Truncate toMins to get integer length.
  return time;
}
/*
 * Creates given type and appends to parent.
 * input: String type, DOM object par.
 */
function crappend(type,par){
  var child = document.createElement(type);				// Create element of given type.
  par.appendChild(child);								// Append it to given parent.
  return child;
}