
/**
 * Fetch current weather data from openweathermap.org
 * Initiate page update
 *
 * @param {json} data - Querry data as json object {"city": "myCity", "lat": 52.38, "long": 13.21, "key": "mykey", "lang": "de", "units": "metric"}
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

    document.getElementById('description').innerHTML = description;
    document.getElementById('temp').innerHTML = temp + '&deg;';
    document.getElementById('location').innerHTML = city;
}

/**
 * On window load, read config and fetch current weather data
 */
window.onload = function() {
  const config = JSON.parse(window.api.readConfig().WEATHER);
  console.log(`Read city  ${config.lat}/${config.lon} and key ${config.key} from .env file` )
  weatherBallon( config );
}