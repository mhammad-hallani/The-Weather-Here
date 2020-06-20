const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl =
  'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  for (item of data){
      const marker= L.marker([item.lat, item.lng]).addTo(mymap);
      let txt = `The weather here at ${item.lat}&deg;,
      ${item.lng}&deg;, is ${item.weather.weather_descriptions} with
      a temperature of ${item.weather.temperature}&deg; C.`;

      if(item.air.value <0){
          txt= txt + "no air quality reading";
      }else{
          txt= txt + ` the concentration of particular matter${item.air.parameter} is ${item.air.value}
          ${item.air.unit} last road on ${item.air.lastUpdated}`;
      }

      marker.bindPopup(txt);


  }
  console.log(data);
}