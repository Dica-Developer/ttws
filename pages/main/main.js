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

function getAccessToken() {
  return new Promise((resolve, reject) => {
    storage.get('ttws.strava.access_token', (error, data) => {
      let accessToken = data.accessToken;
      if (null === accessToken || undefined === accessToken || null !== error) {
        if (null !== error) {
          reject(error);
          console.error(error);
        }
        reject('You need to connect ttws with your strava account first to be able to upload. Got to the preferences page to do that.');
      } else {
        resolve(accessToken);
      }
    });
  });
}

function getMakeUploadPublic() {
  return new Promise((resolve, reject) => {
    storage.get('ttws.strava.upload.public', (errorPublicUpload, isPublicUpload) => {
      if (null !== errorPublicUpload) {
        console.error(errorPublicUpload);
        reject('Error on reading public upload state preference.');
      }  else {
        resolve(isPublicUpload);
      }
    });
  });
}

function convertTtbin(item) {
  return new Promise((resolve, reject) => {
    exec('/usr/local/bin/ttbincnv', ['-t', item.path],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          reject(stderr);
        } else {
          resolve({name: item.name.replace('.ttbin', '.tcx'), type: 'tcx'});
        }
      }
    );
  });
}

function uploadToStrava(item, accessToken, isPublicUpload) {
  return new Promise((resolve, reject) => {
    let activityType = '';
    if (item.name.startsWith('Running')) {
      activityType = 'run';
    } else if (item.name.startsWith('Cycling')) {
      activityType = 'ride';
    } else {
      console.warn('ttws cannot automatically detect the activity type of the file "' + item.name + '", if you think it should. Please report this to ttws and include this message. Thanks.');
    }
    let uploadPayload = {
      'access_token': accessToken,
      'data_type': item.type,
      'file': item.name,
      'description': item.name,
      'commute': 0,
      'activity_type': activityType,
      'statusCallback': (err, payload) => {
        let isError = true;
        let message = 'ttws did not know if the upload succeeded. The reason could be that the Strava API changed. Please report this situation to ttws with as much details as possible. Thank you.';
        if (null !== err) {
          console.error(err);
          message = err.message;
        } else if (null !== payload) {
          if ((null !== payload.errors && undefined !== payload.errors) || (undefined !== payload.error && null !== payload.error && '' !== payload.error)) {
            message = 'Error on uploading your activitiy: "' + item.name + '". ';
            if ('' !== payload.error) {
              message = message + payload.error;
            } else if ('' !== payload.message) {
              message = message + payload.message;
            } else {
              message = message + payload.errors[0];
            }
          } else {
            isError = false;
            message = 'Successfully uploaded your activity: "' + item.name + '". ' + payload.status;
          }
        }
        if (isError) {
          reject(message);
        } else {
          resolve(message);
        }
      }
    };
    if (true !== isPublicUpload) {
      uploadPayload.private = 1;
    }
    strava.uploads.post(uploadPayload, function(err, payload) {
      if (null !== err) {
        reject(error);
      }
    });
  });
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

function unlinkActivity(activity) {
  fs.unlink(activity.path, (unlinkError) => {
    if (null !== unlinkError) {
      console.error(unlinkError);
    }
  });
}

bus.on('local.activities.convert', function(item) {
  bus.trigger('watch.activities.upload.progress.start', item);
  Promise.all([convertTtbin(item), getAccessToken(), getMakeUploadPublic()]).then(values => {
    uploadToStrava(values[0], values[1], values[2]).then(message => {
      bus.trigger('watch.activities.upload.progress.stop', { name: values[0].replace('.tcx', '.ttbin') });
      bus.trigger('watch.successdialog.message', message);
      unlinkActivity(value[0]);
    }, message => {
      bus.trigger('watch.activities.upload.progress.stop', { name: values[0].replace('.tcx', '.ttbin') });
      bus.trigger('watch.successdialog.message', message);
      unlinkActivity(value[0]);
    });
  }, message => {
    console.error(message);
    bus.trigger('watch.activities.upload.progress.stop', { name: values[0].replace('.tcx', '.ttbin') });
    bus.trigger('watch.successdialog.message', message);
    unlinkActivity(value[0]);
  });
});

