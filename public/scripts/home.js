"use strict";

const fileinput = document.getElementById("songupload");
const mapinput = document.getElementById("mapinput");
let songcount = 0; // How many songs have been completed
let songthreshold = 0; // How many songs total being processed

function clearsongs() {
  fileinput.value = null;
}

// createmaps is called when button in clicked
// If there are maps to create, it calls createmap, which calls handlebuffer,
//   which calls createmap with an incremented index
// The recursion continues until all maps are completed

function createmaps() {
  songcount = 0;
  songthreshold = fileinput.files.length;

  if (songthreshold > 0) {
    mapinput.value = `Creating Maps... (0 of ${songthreshold} done)`;
    mapinput.disabled = true;
    const speed = document.querySelector('input[name="speed"]').value;
    const environment = document.querySelector('input[name="environment"]:checked').value;
    infojson["_environmentName"] = environment;
    infojson["_difficultyBeatmapSets"][0]["_difficultyBeatmaps"][0]["_noteJumpMovementSpeed"] = speed;
    createmap(0);
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

function handlebuffer(buffer, filename) {
  // Merge audio tracks before passing audio data to BeatSaber.js library
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
    // Set up zip file structure
    // Should contain the ogg audio file, an info.dat json file, and the map json file(s)
    const zip = new JSZip();
    const name = filename.replace(/\.[^\.]*$/, "").replace(/\./g, "");
    const randstring = Math.random().toString(36).substr(2);
    infojson["_songName"] = name;

    zip.file("info.dat", JSON.stringify(infojson));
    zip.file("Expert.dat", JSON.stringify(bmjson));
    zip.file("song.ogg", oggblob);

    zip.generateAsync({type: "blob"}).then(function(content) {
      saveas(content, `${randstring}_${name}.zip`, "application/zip"); // Download zipped map
      songcount++;
      if (songcount === songthreshold) { // If all songs completed, set button back to normal
        mapinput.value = "Create Maps";
        mapinput.disabled = false;
      } else { // Else, increment counter and call next map creation
        mapinput.value = `Creating Maps... (${songcount} of ${songthreshold} done)`;
        createmap(songcount);
      }
    });
  });
}
