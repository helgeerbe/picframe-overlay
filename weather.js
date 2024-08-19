var config;
var counter = 5;

/**
 * Fetch current weather data from openweathermap.org
 * Initiate page update
 *
 * @param {json} data - Querry data as json object {"city": "myCity", "lat": 52.38, "lon": 13.21, "key": "mykey", "lang": "de", "units": "metric"}
 * @return {void} Nothing
 */
function weatherBallon( data ) {
	fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely,hourly&appid=${data.key}&units=${data.units}&lang=${data.lang}`)
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(weather) {
        console.log(weather)
		drawWeather(data.city, weather);
	})
	.catch(function() {
		// catch any errors
	});
  
  setTimeout(function(){weatherBallon(config)},900000);
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
    let tempMin = Math.round(parseFloat(d.daily[0].temp.min));
    let tempMax = Math.round(parseFloat(d.daily[0].temp.max));
    let description = d.current.weather[0].description; 
    let icon = `https://openweathermap.org/img/wn/${d.current.weather[0]["icon"]}@2x.png`;
    var date = new Date(d.current.dt * 1000);
    var sunrise = new Date(d.current.sunrise *1000);
    var sunset = new Date(d.current.sunset *1000);

    document.getElementById('icon').src = icon
    document.getElementById('description').innerHTML = description;
    document.getElementById('temp').innerHTML = temp + '&deg;';
    document.getElementById('tempMinMax').innerHTML = `${tempMax}&deg; <i class="mdi mdi-thermometer-plus"></i>  ${tempMin}&deg;  <i class="mdi mdi-thermometer-minus"</i>`;
    document.getElementById('location').innerHTML = city;
    document.getElementById('pressure').innerHTML = `<i class="mdi mdi-gauge"></i> ${d.current.pressure}h/Pa`;
    document.getElementById('humidity').innerHTML = `<i class="mdi mdi-water-percent"></i> ${d.current.humidity}%`;
    document.getElementById('wind').innerHTML = `<i class="mdi mdi-weather-windy"></i> ${d.daily[0].wind_speed}(${d.daily[0].wind_gust})km/h`;
    document.getElementById('sunrise').innerHTML = `<i class="mdi mdi-weather-sunset-up"></i> ${sunrise.toLocaleTimeString('de-DE')}`;
    document.getElementById('sunset').innerHTML = `<i class="mdi mdi-weather-sunset-down"></i> ${sunset.toLocaleTimeString('de-DE')}`;
    document.getElementById('date').innerHTML = `${date.toLocaleDateString('de-DE')} ${date.toLocaleTimeString('de-DE')}`;

    var days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    let elementName = null;
    for (i = 1; i < 8; i++) {
      var date = new Date(d.daily[i].dt * 1000);
      let forecast = `<ul class="daily_list">`;
      forecast += `<li>${days[date.getDay()]}</li>`;
      forecast += `<li><img class="img_daily"; src="https://openweathermap.org/img/wn/${d.daily[i].weather[0]["icon"]}@2x.png"></li>`;
      forecast += `<li class="description">${d.daily[i].weather[0].description}</li>`;
      forecast += `<li>${Math.round(parseFloat(d.daily[i].temp.max))}&deg;</li>`;
      forecast += `<li id="dailyMin">${Math.round(parseFloat(d.daily[i].temp.min))}&deg;</li>`;
      forecast += "</ul>";
      elementName = 'daily'+i
      document.getElementById(elementName).innerHTML = forecast;
  }
}


/**
 * On window load, read config and fetch current weather data
 */
window.onload = function() {
  config = JSON.parse(window.api.readConfig().WEATHER);
  console.log(`Read city  ${config.lat}/${config.lon} and key ${config.key} from .env file` )
  weatherBallon( config );
}