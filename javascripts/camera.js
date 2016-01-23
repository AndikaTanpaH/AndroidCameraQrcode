'use strict';

var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');


navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function gotSources(sourceInfos) {
  console.log(sourceInfos);
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
  /*if(window.stream) {
    var track = stream.getTracks()[0];
    track.stop();
  }
  window.stream = stream;*/ // make stream available to console
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
          maxHeight: 640,
          aspectRatio: 1.33333333333
        },
        optional: [
          { sourceId: videoSource }
          //{ aspectRatio: 1.33333333333 }
          //{ facingMode: { exact: 'environment' } }
          //{ facingMode: 'user' } //user (back) / environment (front)
        ]
      }
    };
    //{ sourceId: videoSource },
    navigator.getUserMedia(constraints, successCallbackVideo, errorCallback);
    var viddom= document.querySelector('video');
    //qr.decodeFromCamera(viddom, resultHandler);
    qr.decodeFromVideo(viddom, function (err, result) {
      //if (err) throw err;
      if (err) alert(err);
      
      alert(result);
      document.getElementById("dataMe").innerHTML += result;
    }, false);
  });
});
