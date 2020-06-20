
let lat , lng, weather, air;

if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
     try{ 
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        document.getElementById('latitude').textContent=lat;
        document.getElementById('longitude').textContent=lng;
        const api_url=`weather/${lat},${lng}`
        const response= await fetch(api_url);
        const json = await response.json();
        console.log(json);

        weather= json.Weather.current;
        air= json.Air_Quality.results[0].measurements[0];

        document.getElementById('summary').textContent=weather.weather_descriptions;
        document.getElementById('temperature').textContent=weather.temperature;
        document.getElementById('aq_parameter').textContent=air.parameter;
        document.getElementById('aq_value').textContent=air.value;
        document.getElementById('aq_units').textContent=air.unit;
        document.getElementById('aq_date').textContent=air.lastUpdated;
    
     }catch(error){
        console.error(error);
        air = { value: -1 };
        document.getElementById('aq_value').textContent = 'NO READING'

     }
     
     const data = {lat, lng, weather, air};
     const options= {
         method: 'POST',
         headers: {
             "Content-Type": 'application/json'
         },
         body: JSON.stringify(data)
     };
     const db_response = await fetch('/api',options);
     const db_json = await db_response.json();
     console.log(db_json);

    });
}else{
    console.log('geolocation not  available');
}