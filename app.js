const https = require('https');

https.get('https://coderbyte.com/api/challenges/json/age-counting', (resp) => {

  let data = '';

  // parse json data here...
  resp.setEncoding('utf8');
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on("end", () => {
    console.log(data);
  })

});