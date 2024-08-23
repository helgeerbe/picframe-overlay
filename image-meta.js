
// get references to ui form elements
const aperture = document.getElementById('aperture')
const shutterSpeed = document.getElementById('shutter-speed')
const iso = document.getElementById('iso')
const focalLength = document.getElementById('focal-length')
const dateTime = document.getElementById('date-time')
const imgName = document.getElementById('name')
const caption = document.getElementById('caption')
const keywords = document.getElementById('keywords')
const manufacturer = document.getElementById('manufacturer')
const model = document.getElementById('model')

// initialize leaflet map
const config = JSON.parse(window.api.readConfig().HOME);
const map = L.map('map',{zoomControl: false}).setView([config.lat, config.lon], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const marker = L.marker([config.lat, config.lon]).addTo(map);
marker.bindPopup(config.home).openPopup();

/**
 * On window load, read config and fetch current weather data
 */
window.onload = function() {
    window.api.onUpdateImage((value) => {
      updateForm(value)
      updateMap(value['location'] || config.home, value['latitude'] || config.lat, value['longitude'] || config.lon)
    })
    window.api.triggerUpdateImage();
  }

/**
 * Update view in leaflet
 *
 * @param {string} loc - location description
 * @param {num} lat - latitude
 * @param {num} lon - longitude
 * @return {void} Nothing
 */
function updateMap(loc, lat, long) {
  map.setView([lat, long], 13);
  marker.setLatLng([lat, long]);
  marker.setPopupContent(loc)
}

/**
 * Update UI form elements
 *
 * @param {json} value - json object containing data
 * @return {void} Nothing
 */
function updateForm(value) {
  console.log(`${JSON.stringify(value)} from mqtt` );
  aperture.value = value['EXIF FNumber'];
  shutterSpeed.value = value['EXIF ExposureTime'];
  iso.value = value['EXIF ISOSpeedRatings'];
  focalLength.value = value['EXIF FocalLength'];
  dateTime.value = new Date(value['EXIF DateTimeOriginal'] * 1000).toLocaleString(); 
  imgName.value = value['IPTC Object Name'];
  caption.value = value['IPTC Caption/Abstract'];
  keywords.value = value['IPTC Keywords'];
  model.value = value['Image Model'];
  manufacturer.value = value['Image Make'];
}