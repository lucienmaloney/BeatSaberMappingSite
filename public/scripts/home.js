"use strict";

const fileinput = document.getElementById("songupload");
const mapinput = document.getElementById("mapinput");
let zip = null;
let songcount = 0;
let songthreshold = 100000;

function downloadmaps() {
  songcount++;
  if (songcount == songthreshold) {
    mapinput.value = `Preparing Download... (May take a bit)`;
    zip.generateAsync({type:"blob"}).then(function(content) {
      saveas(content, `maps_${Date.now()}.zip`, "application/zip");
      mapinput.value = "Create Maps";
      mapinput.disabled = false;
    });
  } else {
    mapinput.value = `Creating Maps... (${songcount} of ${songthreshold} done)`;
    createmap(songcount);
  }
}

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
  zip = new JSZip();
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
    const name = filename.replace(/\..*/, "");
    infojson["_songName"] = name;

    const randstring = Math.random().toString(36).substr(2);
    const dir = zip.folder(`${randstring}_${name}`);
    dir.file("info.dat", JSON.stringify(infojson));
    dir.file("ExpertPlus.dat", JSON.stringify(bmjson));
    dir.file("song.ogg", oggblob);

    downloadmaps();
  });
}
