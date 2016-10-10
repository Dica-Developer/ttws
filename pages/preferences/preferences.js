const https = require('https');
const storage = require('electron-json-storage');

const bus = riot.observable();
riot.mount('stravaauthbutton', { bus: bus });
riot.mount('stravapublicuploadcheckbox', { bus: bus });
riot.mount('successdialog', { bus: bus });

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
      bus.trigger('ttws.connect.strava.success', {'accessToken': accessToken});
      console.log('No more data in response.');
      response.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      response.end('The application is now authorized and ready to upload your activities to Strava. You can close this tab and return to your application.');
    });
  });
  req.end();
  req.on('error', (e) => {
    bus.trigger('watch.successdialog.message', 'Error on requesting the strava access token: ' + error.message);
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

bus.on('ttws.connect.strava.success', (accessToken) => {
  storage.set('ttws.strava.access_token', accessToken, (error) => {
    if (null !== error) {
      bus.trigger('watch.successdialog.message', 'Cannot store the strava access token: ' + error.message);
    }
  });
});

bus.on('ttws.connect.strava', () => {
  let stravaRequestAccessUrl = 'https://www.strava.com/oauth/authorize?client_id=13692&redirect_uri=http://localhost:' + server.address().port + '/handle/code&response_type=code&scope=write&state=upload';
  electron.shell.openExternal(stravaRequestAccessUrl);
});

bus.on('ttws.disconnect.strava', () => {
  storage.remove('ttws.strava.access_token', (error) => {
    if (null !== error) {
      console.error(error);
    }
  });
});

storage.has('ttws.strava.access_token', function(error, hasKey) {
  if (null !== error) {
    console.error(error);
  } else {
    if (hasKey) {
      bus.trigger('ttws.connect.strava.already');
    }
  }
});

bus.on('ttws.strava.upload.private', () => {
  storage.set('ttws.strava.upload.public', false, (error) => {
    if (null !== error) {
      bus.trigger('watch.successdialog.message', 'Cannot store the strava public upload flag: ' + error.message);
    } else {
      bus.trigger('ttws.strava.upload.private.success');
    }
  });
});

bus.on('ttws.strava.upload.public', () => {
  storage.set('ttws.strava.upload.public', true, (error) => {
    if (null !== error) {
      bus.trigger('watch.successdialog.message', 'Cannot store the strava public upload flag: ' + error.message);
    } else {
      bus.trigger('ttws.strava.upload.public.success');
    }
  });
});

storage.has('ttws.strava.upload.public', (error, hasKey) => {
  if (null !== error) {
    console.error(error);
  } else {
    if (hasKey) {
      storage.get('ttws.strava.upload.public', (errorGet, value) => {
        if (null !== errorGet) {
          console.error(errorGet);
        } else {
          if (true === value) {
            bus.trigger('ttws.strava.upload.public.already');
          } else {
            bus.trigger('ttws.strava.upload.private.already');
          }
        }
      });
    }
  }
});

