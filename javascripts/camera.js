'use strict';

var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');


navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  //console.log(sourceInfos);
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];

    if (sourceInfo.kind === 'video' && sourceInfo.facing === 'environment') {
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

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function successCallbackVideo(stream) {

  var videoElement = document.querySelector('video');
  videoElement.src = window.URL.createObjectURL(stream);
  
  //$('.vidframe video').get(0).play()
  //var track = stream.getTracks()[0];
  //stream.getTracks()[0].play();
  //videoElement.play();
}

var qr = new QCodeDecoder();

function resultHandler (err, result) {
      if (err)
        return console.log(err.message);
      alert(result);
    }

$(function(){
  $('.goPlay').on( 'click', 'button', function() {
    var camid=$( this ).val();

    $('.vidframe').empty();
    $('.vidframe').append('<video autoplay></video>');
    
    var videoSource = camid;
    var constraints = {
      video: {
        mandatory: {
          maxWidth: 640,
          minHeight: 640,
          minAspectRatio: 1.333,
          maxAspectRatio: 1.334
        },
        optional: [
          { sourceId: videoSource }
        ]
      }
    };
    
    navigator.getUserMedia(constraints, successCallbackVideo, errorCallback);
    var viddom= document.querySelector('video');

    qr.decodeFromVideo(viddom, function (err, result) {
      //if (err) throw err;
      if (err) alert(err);
      
      alert(result);
      document.getElementById("dataMe").innerHTML += result;
    }, false);
  });
});
