// ------------------------------ Dependencies ----------------------------- //
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();

// --------------------------------- Configurations ------------------------------ //

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('dist'));

dotenv.config();

app.get('/test', async (req, res) => {
  res.json({message: 'OK'})
})

// ------------------------------ Setting up URLs ----------------------------- //

// Geonames API
const geoNamesUrlRoot = 'http://api.geonames.org/searchJSON?q=';
const geoNamesParams = `&maxRows=1&fuzzy=0.6&username=${process.env.GEONAMES_USERNAME}`;

// Weatherbit API
const weatherbitUrlRoot = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherApi = `&key=${process.env.WEATHERBIT_API_KEY}`;
const weatherLang = '&lang=en';

// Pixabay API
const pixabayUrlRoot = `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=`;
const pixabayParams = '&image_type=photo&order=popular';


// Include "+" between search strings, ex "buenos+aires"
const spaceToPlus = (stringSpace) => {
  let regex = new RegExp(' ', 'g')
  let stringPlus = stringSpace.replace(regex, '+');
  return stringPlus;
}

let appData = {};
let tripSaved = {};

// -------------------------------- Routing ---------------------------------- //

// Home
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// Calling external APIs and getting data
// Save data to appData object
app.post('/', (req, res) => {
  let newTrip = req.body;
  const now = new Date();
  const date = new Date(newTrip.return);
  const daysToGo = Math.ceil( (date - now)/(1000*60*60*24) ); // calculating countdown, rounded up

  let newEntry = {
    firstDay : newTrip.return,
    location : newTrip.location,
    countdown : daysToGo
  }

  appData = newEntry;

// -------------------------------- Fetch ---------------------------------- //

    const url = `${geoNamesUrlRoot}${spaceToPlus(appData.location)}${geoNamesParams}`;
    
    fetch(url).then(res => res.json()).then(response =>{
      try {
        appData['lat'] = response.geonames[0].lat;
        appData['lon'] = response.geonames[0].lng;
        appData['name'] = response.geonames[0].name;
        appData['countryName'] = response.geonames[0].countryName; //exemplo "buenos+aires+argentina"
        
        // After first fetch, we can grab the weatherbit data
        const url2 = `${weatherbitUrlRoot}lat=${appData.lat}&lon=${appData.lon}${weatherApi}${weatherLang}`;
        
        fetch(url2).then(response => response.json()).then(response =>{
          console.log(url2);
          
          let dayOfForecast = appData.countdown;
          const data = response.data[dayOfForecast]
          appData.maxTemp = data.max_temp; 
          appData.minTemp = data.min_temp; 
          console.log(dayOfForecast)
          // Finally, we are in condition to call the Pixabay API.
          // Everything saved to appData
          const url3 = `${pixabayUrlRoot}${spaceToPlus(appData.name)}+${spaceToPlus(appData.countryName)}${pixabayParams}`;
          
          fetch(url3).then(response => response.json()).then(response =>{
            
            appData.imageHolder = response.hits[0].webformatURL;
            
            // If everything is working, we return to the original get
            
            res.redirect('/');
          })
          .catch(error => {
            res.send(JSON.stringify({error: "Something has gone wrong"}));
          })

        })

      } catch (e) {
        console.log("Error: ", e);
      }
    })
})

// Send appData info
app.get('/getApp', (req, res) => {
    res.send(appData);
})

// Send tripSaved info
app.get('/getSaved', (req, res) => {
  res.send(tripSaved);
})

// Saves the trip
// Redirects back to home
app.post('/save', (req,res)=>{
  tripSaved = appData;
  res.redirect('/');
})

// -------------------------------- Server ------------------------- //
const server = app.listen(8000, () => {
    const ServerStart = new Date();
    console.log(`Running port: 8000`);
});