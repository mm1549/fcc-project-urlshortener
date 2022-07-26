require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

//import urlShortener from 'modules/short.js'

var urls = {};

function urlShortener(urls, url) {
  let random = 0;
  let values = Object.values(urls)

  if (urls[url]) {
    return {"original_url": url, "short_url": urls[url]};
  }
  
  do {
    random = Math.floor(Math.random() * 100000);
  } while (values.includes(random))

  urls[url] = String(random);
  
  return {"original_url": url, "short_url": random};
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req,res) => {
  let lookupUrl = req.body.url.split('://').splice(-1)[0];
  lookupUrl = lookupUrl.split('/')[0];
  dns.lookup(lookupUrl, (err) => {
    if (err) return res.json({"error": "invalid url"});
    return res.json(urlShortener(urls, req.body.url));
  })
});

app.get('/api/shorturl/:shorthand', (req,res) => {
  let url = Object.keys(urls).find(key => urls[key] == req.params.shorthand);
  res.redirect(url);
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


