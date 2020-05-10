"use strict";

const fileinput = document.getElementById("songupload");
const reader = new FileReader();
const audioctx = new AudioContext();

function createmaps() {
  const file = fileinput.files[0];
  reader.readAsArrayBuffer(file);
}

reader.addEventListener("loadend", function(event) {
  let data = audioctx.decodeAudioData(event.target.result, handlebuffer);
});

function handlebuffer(buffer) {
  console.log(buffer);

  const audio = buffer.getChannelData(0);
  const length = audio.length;
  for (let i = 1; i < buffer.numberOfChannels; i++) {
    const audio2 = buffer.getChannelData(i);
    for (let j = 0; j < length; j++) {
      audio[j] = audio[j] + audio2[j];
    }
  }
  const timestamps = gettimestamps(audio, buffer.sampleRate);
  const bmjson = createbeatmapJSON(timestamps);

  encode(buffer, function(oggblob) {
    const name = fileinput.files[0].name.replace(/\..*/, "");
    infojson["_songName"] = name;
    const zip = new JSZip();
    zip.file("info.dat", JSON.stringify(infojson));
    zip.file("ExpertPlus.dat", JSON.stringify(bmjson));
    zip.file("song.ogg", oggblob);

    zip.generateAsync({type:"blob"}).then(function(content) {
      const randstring = Math.random().toString(36).substr(2);
      saveas(content, `${randstring}_${name}.zip`, "application/zip");
    });
  });
}
