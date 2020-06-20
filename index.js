const express = require('express');
const datastore = require('nedb');
//const axios = require('axios');
const fetch= require('node-fetch');
require('dotenv').config();



const { time } = require('console');
const { request, response } = require('express');

const app = express();

const port= process.env.PORT || 3000;
app.listen(port, ()=>console.log(`listening at ${port}`));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const dataBase =  new datastore('database.db');
dataBase.loadDatabase();

app.get('/api', (request, response) => {
    dataBase.find({}, (err, data) =>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
    })
})

app.post('/api', (request, response) => {
    console.log('i got a request');
    const data = request.body;
    const timestamp= Date.now();
    data.timestamp= timestamp;
    dataBase.insert(data);
    response.json(data);
});

app.get('/weather/:latlng',async (request, response) => {
    console.log(request.params);
    const latlng = request.params.latlng.split(',');
    console.log(latlng);
    const lat = latlng[0];
    const lng = latlng[1];
    console.log(lat, lng)

const api_key=process.env.API_KEY;
const weather_url=`http://api.weatherstack.com/current?access_key=${api_key}&query=${lat},${lng}?unit=si`;
const weather_response= await fetch(weather_url);
const weather_data =await weather_response.json();

const aq_url=`https://api.openaq.org/v1/latest?coordinates=${lat},${lng}`;
const aq_response= await fetch(aq_url);
const aq_data= await aq_response.json();

const data= {
    Weather: weather_data,
    Air_Quality: aq_data
}
 response.json(data);
});