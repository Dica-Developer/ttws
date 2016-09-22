// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const exec = require('child_process').execFile;

var watchversion = {}; // riot.mount('watchversion', {});
riot.compile(function() {
  watchversion = riot.mount('watchversion')[0];
});
exec('/usr/local/bin/ttwatch', ['-v'],
  (error, stdout, stderr) => {
    if (error !== null) {
      console.error(error);
      watchversion.trigger('watch.version.error', error.message);
    } else {
      watchversion.trigger('watch.version.succes', stdout);
    }
  }
);

// ttwatch --get-activities --activity-store=./ goes under ./<watch name>/<date>/<file.ttbin>
// ttbincnv -g mascha/2016-09-22/Cycling_16-44-30.ttbin to gpx file
// ttbincnv -g mascha/2016-09-22/Cycling_16-44-30.ttbin to tcx file
//
