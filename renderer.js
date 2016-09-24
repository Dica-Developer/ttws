// This file is required by the index.html file an will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// todo: sending the events not directly on there tags instead use a neutral way

const exec = require('child_process').execFile;

var watchversion = {};
var updatebutton = {};
var icon = {};
var successdialog = {};
riot.compile(function() {
  watchversion = riot.mount('watchversion')[0];
  updatebutton = riot.mount('updatebutton')[0];
  icon = riot.mount('icon')[0];
  successdialog = riot.mount('successdialog')[0];

  function getVersion() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['-v'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          watchversion.trigger('watch.version.error', 'It seems your watch is not connected.');
        } else {
          watchversion.trigger('watch.version.success', stdout);
        }
        icon.trigger('watch.progress.stop');
      }
    );
  }

  updatebutton.on('watch.update.firmware', function() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--update-fw'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          successdialog.trigger('watch.successdialog.message', stderr);
        } else {
          let message = stdout;
          if (message === '') {
            // Thats a fallback because in case of up to date the output goes to stderr but the app is returning with successs
            message = stderr;
          }
          successdialog.trigger('watch.successdialog.message', message);
        }
        icon.trigger('watch.progress.stop');
      }
    );
  });

  updatebutton.on('watch.update.gps', function() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--update-gps'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          successdialog.trigger('watch.successdialog.message', stderr);
        } else {
          successdialog.trigger('watch.successdialog.message', stdout);
        }
        icon.trigger('watch.progress.stop');
      }
    );
  });

  updatebutton.on('watch.update.time', function() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--set-time'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          successdialog.trigger('watch.successdialog.message', stderr);
        } else {
          successdialog.trigger('watch.successdialog.message', 'Successfully updated the time on the watch.');
        }
        icon.trigger('watch.progress.stop');
      }
    );
  });

  updatebutton.on('watch.download.activities', function() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--activity-store=~/.ttws', '--get-activities'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          successdialog.trigger('watch.successdialog.message', stderr);
        } else {
          successdialog.trigger('watch.successdialog.message', 'Successfully downloaded the latest activities from the watch: ' + stdout);
        }
        icon.trigger('watch.progress.stop');
      }
    );
  });

  getVersion();
  setInterval(getVersion, 5000);
});


// ttbincnv -g mascha/2016-09-22/Cycling_16-44-30.ttbin to gpx file
// ttbincnv -t mascha/2016-09-22/Cycling_16-44-30.ttbin to tcx file
//
