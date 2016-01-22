'use strict';

var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');


navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    var option = document.createElement('option');
    option.value = sourceInfo.id;
    if (sourceInfo.kind === 'video') {
      option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
      $('.goPlay').append('<button value="'+sourceInfo.id+'">'+sourceInfo.label+'</button>');
      document.getElementById("logSource").innerHTML += '<br/>Video: '+sourceInfo.id;
    }
  }
}

if (typeof MediaStreamTrack === 'undefined' ||
    typeof MediaStreamTrack.getSources === 'undefined') {
  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
} else {
  MediaStreamTrack.getSources(gotSources);
}

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  videoElement.src = window.URL.createObjectURL(stream);
  videoElement.play();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {
  if (!!window.stream) {
    videoElement.src = null;
    window.stream.stop();
  }
  //var audioSource = audioSelect.value;
  var videoSource = videoSelect.value;
  var constraints = {
    video: {
      mandatory: {
        maxWidth: 400,
        maxHeight: 400
      }
    },
    video: {
      optional: [{
        sourceId: videoSource
      }]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
  
  var videoX = document.querySelector('video');
  var once = true;
  
  QCodeDecoder()
    .decodeFromVideo(videoX, function (err, result) {
      if (err) throw err;
      alert(result);
      document.getElementById("dataMe").innerHTML = result;
    }, once);
}

function myFunction(){
  alert ('hello');
  var audioSource = audioSelect.value;
  document.getElementById("selectMe").innerHTML = audioSource;
}

$(function(){
  alert ('hello jquery');
});

//start();
