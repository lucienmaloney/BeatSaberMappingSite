"use strict";

const fileinput = document.getElementById("songupload");
const reader = new FileReader();
const audioctx = new AudioContext();

function handlebuffer(buffer) {
  const data = buffer.getChannelData(0);
  for (let i = 1; i < buffer.numberOfChannels; i++) {
    const newdata = buffer.getChannelData(i);
    for (let j = 0; j < buffer.length; j++) {
      data[j] += newdata[j];
    }
  }
  const peaks = getpeaksfromaudio(data, buffer.sampleRate);
}

reader.addEventListener("loadend", function(event) {
  let data = audioctx.decodeAudioData(event.target.result, handlebuffer);
});

function createmaps() {
  const files = fileinput.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    reader.readAsArrayBuffer(file);
  }
}
