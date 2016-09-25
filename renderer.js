// This file is required by the index.html file an will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const exec = require('child_process').execFile;

var bus = riot.observable();
var watchversion = {};
var updatebutton = {};
var icon = {};
var successdialog = {};
riot.compile(function() {
  watchversion = riot.mount('watchversion', { bus: bus })[0];
  updatebutton = riot.mount('updatebutton', { bus: bus })[0];
  icon = riot.mount('icon', { bus: bus })[0];
  filelist = riot.mount('filelist', { bus: bus })[0];
  successdialog = riot.mount('successdialog', { bus: bus })[0];

  function getVersion() {
    bus.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['-v'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          bus.trigger('watch.version.error', 'It seems your watch is not connected.');
        } else {
          bus.trigger('watch.version.success', stdout);
        }
          bus.trigger('watch.progress.stop');
      }
    );
  }

  bus.on('watch.update.firmware', function() {
    bus.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--update-fw'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
         bus.trigger('watch.successdialog.message', stderr);
        } else {
          let message = stdout;
          if (message === '') {
            // Thats a fallback because in case of up to date the output goes to stderr but the app is returning with successs
            message = stderr;
          }
          bus.trigger('watch.successdialog.message', message);
        }
        bus.trigger('watch.progress.stop');
      }
    );
  });

  bus.on('watch.update.gps', function() {
    bus.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--update-gps'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
         bus.trigger('watch.successdialog.message', stderr);
        } else {
          bus.trigger('watch.successdialog.message', stdout);
        }
       bus.trigger('watch.progress.stop');
      }
    );
  });

  bus.on('watch.update.time', function() {
    bus.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--set-time'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          bus.trigger('watch.successdialog.message', stderr);
        } else {
          bus.trigger('watch.successdialog.message', 'Successfully updated the time on the watch.');
        }
        bus.trigger('watch.progress.stop');
      }
    );
  });

  bus.on('watch.download.activities', function() {
    bus.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--activity-store=/home/ms/.ttws', '--get-activities'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          bus.trigger('watch.successdialog.message', stderr);
        } else {
          bus.trigger('watch.successdialog.message', 'Successfully downloaded the latest activities from the watch: ' + stdout);
          bus.trigger('watch.activities.update');
        }
        bus.trigger('watch.progress.stop');
      }
    );
  });

  getVersion();
  setInterval(getVersion, 5000);
});


// ttbincnv -g mascha/2016-09-22/Cycling_16-44-30.ttbin to gpx file
// ttbincnv -t mascha/2016-09-22/Cycling_16-44-30.ttbin to tcx file

