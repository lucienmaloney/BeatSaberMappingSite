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
  //encode(buffer, x => saveas(x, "newsong.ogg", "audio/ogg"));

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

  const wavfile = audioBufferToWav(buffer);
  const worker = new Worker('/scripts/worker/EmsWorkerProxy.js');

  worker.onmessage = function(e) {
    if (e.data && e.data.reply == "done") {
      const name = fileinput.files[0].name.replace(/\..*/, "");
      infojson["_songName"] = name;
      const zip = new JSZip();
      zip.file("info.dat", JSON.stringify(infojson));
      zip.file("ExpertPlus.dat", JSON.stringify(bmjson));
      zip.file("song.ogg", e.data.values["song.ogg"].blob);

      zip.generateAsync({type:"blob"}).then(function(content) {
        const randstring = Math.random().toString(36).substr(2);
        saveas(content, `${randstring}_${name}.zip`, "application/zip");
      });
    }
  }

  worker.postMessage({
    command: 'encode',
    args: ["song.wav", "song.ogg"],
    fileData: {"song.wav": new Uint8Array(wavfile)},
    outData: {
      'song.ogg': {
        'MIME': 'audio/ogg',
      },
    },
  });
}
