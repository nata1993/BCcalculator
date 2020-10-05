// set up modules
const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const app = express();

app.use(express.static("public"));  // public folder for files to transmit over network
app.set('view engine', ejs);
app.use(express.urlencoded({ extended: true }));    // for parsing application/x-www-form-urlencoded

// start server on specified port
const port = 3000;
app.listen(process.env.PORT || 3000, function(){
    console.log("Server has started.");
});

// render initial page
app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html');
});

// render page after form has been submited
app.post('/', (req, res) =>{
    let url= 'https://api.coindesk.com/v1/bpi/currentprice/eur.json';
    let currency = req.body.currency;
    let _ammount = parseInt(req.body.ammount);

    axios.get(url)
    .then(function(response){
        var _rate;
        let _code;
        if(currency === 'EUR')
        {
            _rate = response.data.bpi.EUR.rate;
            _code = response.data.bpi.EUR.code;
        }
        else{
            _rate = response.data.bpi.USD.rate;
            _code = response.data.bpi.USD.code;
        }

        // format BTC price and calculate final worth
        _rate = parseFloat(_rate.replace(/,/g,'')) * _ammount;
        _rate = _rate.toFixed(2);

        let _worth = {
            rate: _rate, 
            code: _code,
            ammount: _ammount
        };

        res.render('index.ejs', {
            worth: _worth
        });
    })
    .catch(function(error){
        console.log(error)
    });
});