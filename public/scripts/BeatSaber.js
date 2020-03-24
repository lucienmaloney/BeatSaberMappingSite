// JavaScript adaptation of https://github.com/lucienmaloney/BeatSaber.jl/blob/master/src/BeatSaber.jl

function getpeaksfromaudio(data, bps) {
  const audiorange = 1024;
  // const spec =
  // const len =
  // const times =

  // const flux =
  const difference = [];
  let rolling = 0;
  const win = 20;

  /*

  */
  const peaks = [[], [], [], [], []];
  const ranges = [10, 7, 5, 3, 2];
  for (let j = 0; j < 5; j++) {
    r = ranges[j];
  }

  return peaks;
}

function getnotedata(note, color = 0) {
  const x = note % 4;
  const y = Math.floor(note / 4) % 3;
  const direction = Math.floor(note / 12);

  if (color == 0) {
    return [x, y, direction];
  } else {
    const directions = [0, 1, 3, 2, 5, 4, 7, 6, 8];
    return [3 - x, y, directions[direction]]
  }
}

function createnote(x, y, direction, color, time) {
  return {
    "_time": time,
    "_cutDirection": direction,
    "_type": color,
    "_lineLayer": y,
    "_lineIndex": x,
  };
}

function createnotefromindex(note, color, time) {
  return createnote(...getnotedata(note, color), color, time);
}

function randbool() {
  return !Math.floor(Math.random() * 2)
}

function timestonotes(notes, threshold) {
  const notesb = [1, 1];
  const notesa = [13, 13];
  const notesequence = [];
  const prevcolor = randbool();

  function pushnote(color, t, deltat) {

  }

  let t = 0;
  let timediff = 0;

  for (let i = 0; i < notes.length; i++) {
    const newtime = notetimes[i];
    timediff = newtime - t;
    if (timediff < 0.2) {
      pushnote(!prevcolor, newtime, timediff);
    } else if (Math.random() < 0.2) {
      pushnote(randbool(), newtime, timediff);
      pushnote(!prevcolor, newtime, timediff);
    } else {
      pushnote(randbool(), newtime, timediff);
    }
    t = newtime;
  }

  return notesequence;
}

function createbeatmapJSON(notes) {
  return {
    "_version": "2.0.0",
    "_BPMChanges": [],
    "_events": [],
    "_notes": notes,
    "_obstacles": [],
    "_bookmarks": [],
  };
}

function createbeatmapJSONs(notetimes) {
  const difficulties = [2, 1, 0.5, 0.3, 0.2];
  return difficulties.map((d, i) => {
    return createbeatmapJSON(timestonotes(notetimes[i], d));
  });
}

function createmaps(data) {

}

function mapsong(data) {

}
