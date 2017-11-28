var videoObject;
var videoHeight;
window.onload = function(){
  videoObject = getSrc();
  build();									// Call function to build page.
}
/*
 * Builds the web page by creating and appending elements.
 * A container for the video.
 * The video whos source is resolved by getSrc().
 * A control hub, which is set by setControls().
 */
function build(){
  var titleContainer = crappend("div",document.body);
  var titleText = document.createTextNode(videoObject.title);
  titleContainer.append(titleText);
  titleContainer.className = "videoTitle";
  var container = crappend("div",document.body);
  container.className = "videoContainer";	// Set containers css class name.
  var video = crappend("video",container);	// Create and append video.
  video.src = videoObject.video;			// Get the videos source.
  video.addEventListener("error",function(){
    alert("Video source could not be loaded")
  });
  var overlay = crappend("div",container);	// Create and append video overlay.
  overlay.className = "vidOverlay";			// Set overlays css class.

  setControls(container, overlay, video);	// Create control hub.
}
/*
 * Check the height of video to set the height of overlay.
 */
function checkHeight(video,overlay,overPlay){
  for(var i = 0; i < 5; i++){				// Loop a timeout function that will resize the overlay.
    setTimeout(function() { 				// It loops 5 times with a timeout of 500 ms each time.
      overPlay.setAttribute("style","margin-top:"+((videoHeight/2)-(overPlay.clientHeight/2))+"px");
      videoHeight = video.clientHeight;
      overlay.setAttribute("style","height:"+videoHeight+"px");
    },500);
  }
}
/*
 * Get the video source from adress.
 */
function getSrc(){
  var url = window.location.search;			// Get the relevant part of adress string.
  url = url.replace("?", '');				// Make it more relevant.
  try{
    url = atob(url);					// Decrypt it.
  }catch(e){
    return alert(e);
  }
  
  var regex = new RegExp('%22','g');		// Create regex to replace %22.
  url = url.replace(regex,'"');				// with ".
  url = url.replace("%20",' ');				// and %20 with ' '(space).
  try{
    var video = JSON.parse(url);				// Make an object from json string.    
  }catch(e){
    alert(e);
  }
  return video;								// Return source of video.
}
/*
 * Creates and sets controler elements for the video.
 * Handles different page sizes.
 * Input: container, overlay, video DOM elements.
 */
function setControls(container, overlay, video){
  var controlHub = crappend("div",container);
  controlHub.className = "cHub";
  
  var back       = crappend("img",controlHub);
  back.src       = "img/back.svg";
  back.className = "controlItem";
  back.addEventListener('click', function(){
    nextButton(video,-1)
  }, false);
  
  var play       = crappend("img",controlHub);
  play.src 		 = "img/play.svg";
  play.className = "controlItem";
  play.addEventListener('click', function(){
    playButton(overlay, play, video)
  }, false);
  
  var overPlay = crappend("img",overlay);
  overPlay.src = "img/play.svg";
  overPlay.className = "overlayButton";
  checkHeight(video,overlay,overPlay);
  overlay.addEventListener('click', function(){
    playButton(overlay, play, video)
  }, false);
  
  var mute       = crappend("img",controlHub);
  mute.src       = "img/mute.svg";
  mute.className = "controlItem";
  mute.addEventListener('click', function(){
    muteButton(mute, video)
  }, false);
  
  var fullscreen = crappend("img",controlHub);
  fullscreen.src = "img/fullscreen.svg";
  fullscreen.className = "controlItem";
  fullscreen.addEventListener('click', function(){
    fullscreenButton(video)
  }, false);

  var next       = crappend("img",controlHub);
  next.src       = "img/next.svg";
  next.className = "controlItem";
  next.addEventListener('click', function(){
    nextButton(video,1)
  }, false);
  
  var windowWidth = window.innerWidth;
  if(windowWidth < 1000){
    document.body.setAttribute("style","width: 500px");
    controlHub.setAttribute("style","height: 1.5em");
  }
  
  var tilbaka = crappend("a", document.body);
  var tilbakaTexti = document.createTextNode("Til baka");
  tilbaka.append(tilbakaTexti);
  tilbaka.href = "index.html";
  tilbaka.className = "tilbaka";
  
  window.onresize = function(){
    windowWidth = window.innerWidth;
    checkHeight(video,overlay,overPlay);
    overlay.setAttribute("style","height:"+videoHeight+"px");
    if(windowWidth < 1000){
      document.body.setAttribute("style","width: 500px");
      controlHub.setAttribute("style","height: 1.5em");
    }else{
      document.body.setAttribute("style","width: 1000px");
      controlHub.setAttribute("style","height: 3em");
    }
  }
}
/*
 * Play button event handler and set image.
 * Input: overlay, play, video DOM elements.
 */
function playButton(overlay, play, video) {
  if(play.src.includes("play")){
    video.play();
    play.src = "img/pause.svg";
    overlay.style.opacity = 0;
  }else{
    video.pause();
    play.src = "img/play.svg";
    overlay.style.opacity = 1;
  }
}
/*
 * Next/Back button event handler.
 * Input: video, back DOM elements.
 */
function nextButton(video, back){
  var time = video.currentTime + 3*back;
  var length = video.duration;
  
  if(length){
    if(time < length && back > 0){
      video.currentTime = time;
    }else if(time > length && back > 0){
      video.currentTime = length;
    }else if(time > 0 && back < 0){
      video.currentTime = time;
    }else{
      video.currentTime = 0;
    }
  }
}
/*
 * Mute button event handler and set image.
 * Input: mute, video DOM elements.
 */
function muteButton(mute, video){
  if(video.muted){
    video.muted = false;
    mute.src = "img/mute.svg";
  }else{
    video.muted = true;
    mute.src = "img/unmute.svg";
  }
}
/*
 * Fullscreen button event handler.
 * Input: video DOM element.
 */
function fullscreenButton(video){
  video.webkitRequestFullscreen();
}
/*
 * Creates given type and appends to parent.
 * Input: String type, DOM object par.
 */
function crappend(type,par){
  var child = document.createElement(type);					// Create element of given type.
  par.appendChild(child);									// Append it to given parent.
  return child;
}