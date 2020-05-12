"use strict";

const fileinput = document.getElementById("songupload");
const mapinput = document.getElementById("mapinput");
let songcount = 0;
let songthreshold = 100000;

function createmap(i) {
  const reader = new FileReader();
  const audioctx = new AudioContext();
  const file = fileinput.files[i];
  reader.addEventListener("loadend", function(event) {
    let data = audioctx.decodeAudioData(event.target.result, buf => handlebuffer(buf, file.name));
  });
  reader.readAsArrayBuffer(file);
}

function createmaps() {
  songcount = 0;
  songthreshold = fileinput.files.length;

  if (songthreshold > 0) {
    mapinput.value = `Creating Maps... (0 of ${songthreshold} done)`;
    mapinput.disabled = true;
    createmap(0);
  }
}

function clearsongs() {
  fileinput.value = null;
}

function handlebuffer(buffer, filename) {
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

  buftoogg(buffer, function(oggblob) {
    const zip = new JSZip();
    const name = filename.replace(/\..*/, "");
    const randstring = Math.random().toString(36).substr(2);
    infojson["_songName"] = name;

    zip.file("info.dat", JSON.stringify(infojson));
    zip.file("Expert.dat", JSON.stringify(bmjson));
    zip.file("song.ogg", oggblob);

    zip.generateAsync({type: "blob"}).then(function(content) {
      saveas(content, `${randstring}_${name}.zip`, "application/zip");
      songcount++;
      if (songcount === songthreshold) {
        mapinput.value = "Create Maps";
        mapinput.disabled = false;
      } else {
        mapinput.value = `Creating Maps... (${songcount} of ${songthreshold} done)`;
        createmap(songcount);
      }
    });
  });
}
