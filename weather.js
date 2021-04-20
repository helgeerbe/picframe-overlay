
/**
 * Fetch current weather data from openweathermap.org
 * Initiate page update
 *
 * @param {json} data - Querry data as json object {"city": "myCity", "lat": 52.38, "lon": 13.21, "key": "mykey", "lang": "de", "units": "metric"}
 * @return {void} Nothing
 */
function weatherBallon( data ) {
	fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly&appid=${data.key}&units=${data.units}&lang=${data.lang}`)
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(weather) {
        console.log(weather)
		drawWeather(data.city, weather);
	})
	.catch(function() {
		// catch any errors
	});
}

/**
 * Update page with the current weather data
 *
 * @param {string} city - city name
 * @param {json} d - json object containing weather data
 * @return {void} Nothing
 */
function drawWeather( city, d ) {
    let temp = Math.round(parseFloat(d.current.temp));
    let description = d.current.weather[0].description; 
    let icon = `https://openweathermap.org/img/wn/${d.current.weather[0]["icon"]}@2x.png`;
    var date = new Date(d.current.dt * 1000);

    document.getElementById('icon').src = icon
    document.getElementById('description').innerHTML = description;
    document.getElementById('temp').innerHTML = temp + '&deg;';
    document.getElementById('location').innerHTML = city;
    document.getElementById('pressure').innerHTML = d.current.pressure + " hPa";
    document.getElementById('humidity').innerHTML = d.current.humidity + "%";
    document.getElementById('date').innerHTML = `${date.toLocaleDateString('de-DE')} ${date.toLocaleTimeString('de-DE')}`;

    for (i = 0; i < 7; i++) {
      var date = new Date(d.daily[i].dt * 1000);
      document.getElementById('daily'+i).innerHTML = `${date.toLocaleDateString('de-DE')}`;
  }
}

/**
 * On window load, read config and fetch current weather data
 */
window.onload = function() {
  const config = JSON.parse(window.api.readConfig().WEATHER);
  console.log(`Read city  ${config.lat}/${config.lon} and key ${config.key} from .env file` )
  weatherBallon( config );
}