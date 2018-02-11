var express = require('express')
var bodyParser = require("body-parser")
var cors = require('cors')
var proxy = require('http-proxy-middleware');

var options = {
  target: 'http://localhost:5000', // target host
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  pathRewrite: {
      '^/flask' : '/',     // rewrite path
  },
  router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      // 'dev.localhost:3000' : 'http://localhost:8000'
      
  },
  logLevel: "debug"
};

// create the proxy (without context)
var exampleProxy = proxy(options);

const app = express();
app.use('/flask', exampleProxy);
// app.use('/tinydb', proxy({target: 'http://localhost:5000', changeOrigin: false}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.listen(3000)

app.get("/", function (req, res) {
  res.send("Hello world")
})
// ============================================================================
// Ngrok
// ============================================================================
var ngrok = require('ngrok');

app.post("/ngrok", function (req, res) {
  ngrok.connect(req.body, function (err, url) {
    if (err) res.send({ error: { type: "api", msg: err } })
    else res.send({ url: url })
  })
})