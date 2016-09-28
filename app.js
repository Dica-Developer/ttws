// This file is required by the index.html file an will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const exec = require('child_process').execFile;

var bus = riot.observable();
riot.compile(function() {
  riot.mount('watchversion', { bus: bus })[0];
  riot.mount('updatebutton', { bus: bus })[0];
  riot.mount('icon', { bus: bus })[0];
  riot.mount('filelist', { bus: bus })[0];
  riot.mount('successdialog', { bus: bus })[0];

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
          bus.trigger('watch.successdialog.message', 'Successfully downloaded the latest activities from the watch.');
          bus.trigger('watch.activities.update');
        }
        bus.trigger('watch.progress.stop');
      }
    );
  });

  getVersion();
  setInterval(getVersion, 5000);
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

let accessToken = null;
let https = require('https');
function getToken(requestUrl, response) {
  let options = {
    hostname: 'ttws-auth-bridge.herokuapp.com',
    path: '/oauth/token?code=' + requestUrl.query.code + '&client_id=13692',
    method: 'POST',
  };
  let req = https.request(options, (res) => {
    let data = '';
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      data = data + chunk;
    });
    res.on('end', () => {
      accessToken = JSON.parse(data).access_token;
      bus.trigger('local.activities.convert.success',{/* take the item */});
      console.log('No more data in response.');
      response.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      response.end('The application is now authorized and you can close this tab and return to your application.');
    });
  });
  req.end();
  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
}

let http = require('http');
let strava = require('strava-v3');
let electron = require('electron');
let url = require('url');
let server = http.createServer(function (request, response) {
  let requestUrl = url.parse(request.url, true);
  if ('GET' === request.method) {
    if ('/handle/code' === requestUrl.pathname) {
      console.log(requestUrl.query);
      getToken(requestUrl, response);
    } else {
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      response.end(request.url + ' is not handled by ttws');
    }
  }
});
server.listen();
console.log('Internal server started on port "' + server.address().port + '"');

bus.on('local.activities.convert.success', function(item) {
  if (null === accessToken) {
    let stravaRequestAccessUrl = 'https://www.strava.com/oauth/authorize?client_id=13692&redirect_uri=http://localhost:' + server.address().port + '/handle/code&response_type=code&scope=write&state=upload';
    electron.shell.openExternal(stravaRequestAccessUrl);
  } else {
    strava.uploads.post({
      'access_token': accessToken,
      'data_type': item.type,
      'file': item.name,
      'statusCallback': function(err, payload) {
        console.log(err);
      }
    },function(err, payload) {
      console.log(err);
    });
  }
});

