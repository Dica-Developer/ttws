const exec = require('child_process').execFile;
const storage = require('electron-json-storage');
const strava = require('strava-v3');
const fs = require('fs');

const bus = riot.observable();
riot.mount('watchversion', { bus: bus });
riot.mount('updatebutton', { bus: bus });
riot.mount('icon', { bus: bus });
riot.mount('filelist', { bus: bus });
riot.mount('successdialog', { bus: bus });

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

getVersion();
setInterval(getVersion, 5000);

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
        bus.trigger('watch.successdialog.message', 'Successfully downloaded the latest activities from the watch.');
        bus.trigger('watch.activities.update');
      }
      bus.trigger('watch.progress.stop');
    }
  );
});

bus.on('local.activities.convert', function(item) {
  bus.trigger('watch.progress.start');
  exec('/usr/local/bin/ttbincnv', ['-t', item.path],
    (error, stdout, stderr) => {
      if (error !== null) {
        console.error(error);
        bus.trigger('watch.successdialog.message', stderr);
      } else {
        bus.trigger('local.activities.convert.success', {name: item.name.replace('.ttbin', '.tcx'), type: 'tcx'});
      }
      bus.trigger('watch.progress.stop');
    }
  );
});

bus.on('local.activities.convert.success', function(item) {
  storage.get('ttws.strava.access_token', (error, data) => {
    // TODO: handle error
    let accessToken = data.accessToken;
    if (null === accessToken || undefined === accessToken) {
      // TODO: notify user about missing access token
    } else {
      // TODO move private public default in preferences page
      let activityType = '';
      if (item.name.startsWith('Running')) {
        activityType = 'run';
      } else if (item.name.startsWith('Cycling')) {
        activityType = 'ride';
      } else {
        console.warn('I cannot automatically detect the activity type of the file "' + item.name + '". Please report this to ttws and include this message. Thanks.');
      }
      strava.uploads.post({
        'access_token': accessToken,
        'data_type': item.type,
        'file': item.name,
        'private': 0,
        'description': item.name,
        'commute': 0,
        'activity_type': activityType,
        'statusCallback': function(err, payload) {
          // TODO notify user about maybe reconnecting to strava 
          let message = 'Something goes wrong and I do not know what.';
          if (null !== err) {
            console.log(err);
            message = err.message;
          }
          if (null !== payload) {
            if ('' !== payload.error) {
              message = 'Error on uploading your activitiy: "' + item.name + '". ' + payload.error;
            } else {
              message = 'Successfully uploaded your activity: "' + item.name + '".';
            }
            message = message + ' ' + payload.status;
          }
          bus.trigger('watch.successdialog.message', message);
        }
      }, function(err, payload) {
        if (null !== err) {
          console.log(err);
        }
        fs.unlink(item.name, (unlinkError) => {
          if (null !== unlinkError) {
            console.error(unlinkError);
            bus.trigger('watch.successdialog.message', unlinkError.message);
          }
        });
      });
    }
  });
});

