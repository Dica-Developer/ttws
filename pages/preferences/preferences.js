let bus = riot.observable();
riot.mount('stravaauthbutton', { bus: bus });
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

bus.on('ttws.connect.strava', () => {
  let stravaRequestAccessUrl = 'https://www.strava.com/oauth/authorize?client_id=13692&redirect_uri=http://localhost:' + server.address().port + '/handle/code&response_type=code&scope=write&state=upload';
  electron.shell.openExternal(stravaRequestAccessUrl);
});
