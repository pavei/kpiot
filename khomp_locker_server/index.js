//Setup
var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors())
var bodyParser = require('body-parser');
var delay = require('express-delay');

// configure app to use bodyParser()
// this will let us get response data from a POST

var json_body_parser = bodyParser.json();
var urlencoded_body_parser = bodyParser.urlencoded({extended: true});
app.use(json_body_parser);
app.use(urlencoded_body_parser);
app.use(delay(500, 2000));

var port = process.env.PORT || 5065;

var router = express.Router();
router.use(function (req, res, next) {
  // log each request to the console
  console.log(req.method, req.url);
  next();
});

router.route('/register')
  .post(function (req, res) {
    console.log(JSON.stringify(req.body));
    res.json({
      "response": "success",
      "code": "100",
      "data": 1234,
      "message": "Started a new user register. Waiting for confirmation code to complete the register. The code confirmation was sent by SMS to your number  999883456"
    });


  });


router.route('/register_confirmation_code')
  .post(function (req, res) {
    console.log(JSON.stringify(req.body));
    res.json({
        "response": "success",
        "code": "105",
        "data": null,
        "message": "New user registered successfully.  Please, login now."
      }
    );
  });

router.route('/get_access')
  .post(function (req, res) {


    res.json({
      "response": "success",
      "code": "100",
      "data": {
        "access_list": [{
          "name": "LIOT_Apto 202 - Imobiliaria XYZ",
          "mac": "AB:CD:EF:01:02",
          "start": "2017-02-01 10:00:00",
          "end": "2017-02-01 11:00:00",
          "info": "Rua X, Y, Apto 202 bloco A",
          "Token": "393c6ff030ad238a9066dfdffd6471f11353a0daad790a0cc40af15630f0a94b"
        }, {
          "name": "LIOT_Apto 203 - Imobiliaria XYZ",
          "mac": "AB:CD:EF:01:02",
          "start": "2017-02-01 10:00:00",
          "end": "2017-02-01 11:00:00",
          "info": "Rua X, Y, Apto 203 bloco A",
          "Token": "393c6ff030ad238a9066dfdffd6471f11353a0daad790a0cc40af15630f0a94b"
        }]
      },
      "message": null
    })
  })
;


router.route('/get_historic')
  .post(function (req, res) {


    res.json({
      "response": "success",
      "code": "100",
      "data": {
        "access_list": [{
          "name": "Apto 202 - Imobiliaria XYZ",
          "mac": "AB:CD:EF:01:02",
          "start": "2017-02-01 10:00:00",
          "end": "2017-02-01 11:00:00",
          "info": "Rua X, Y, Apto 202 bloco A"
        }, {
          "name": "Apto 203 - Imobiliaria XYZ",
          "mac": "AB:CD:EF:01:02",
          "start": "2017-02-01 10:00:00",
          "end": "2017-02-01 11:00:00",
          "info": "Rua X, Y, Apto 203 bloco A"
        }]
      },
      "message": null
    })
  })
;


app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
