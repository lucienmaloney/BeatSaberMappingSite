### Brief Overview of Files

* BeatSaber.js: The library for converting audio data into Beat Saber maps
* data.js: Contains Beat Saber's info.json format as well as note matrix data used in map construction by BeatSaber.js
* DSP.js: Used for doing FFT's. Used by BeatSaber.js
* files.js: Contains helper function for downloading files with JavaScript and the zip library JSZip.js
* home.js: The entry point. Handles interface logic and calls other files as necessary
* libvorbis.min.js: Library for converting audiobuffer data to ogg files
