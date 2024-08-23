# picframe-overlay

Cross-platform PictureFrame overlay with JavaScript, HTML, and CSS

## Prerequisites

### Electron

picframe-overlay uses [electron](https://www.electronjs.org). 

## Installation

````bash
# if not already installed, install nodejs and npm
$ sudo apt install nodejs
$ sudo apt install npm

# Clone the Quick Start repository
$ git clone https://github.com/helgeerbe/picframe-overlay

# Go into the repository
$ cd picframe-overlay

# create .env file
HOME={"home": "Our castle", "lat": 47.55776221979791, "lon": 10.750175907276837}
IMAGE={"file": "/dev/shm/overlay.png", "width": 1920, "height": 1200}
WEATHER={"city": "My City", "lat": 47.55776221979791, "lon": 10.7501759072768371, "key": "myOpenWeatherMapKey", "lang": "de", "units": "metric"}
MQTT={"host": "mymqttserver", "port": "1883", "clientId": "picframe_overlay", "username": "name", "password": "mypasswd"}

# when logged in via ssh
$ export DISPLAY=:0

# Install the dependencies and run
$ npm install && npm start
````

## How to use

Publish  on topic "picframe/overlay"
message:
- 0 empty overlay
- 1 digital clock
- 2 weather
- 3 image meta

## What's next
- 

### Impressions

![analog clock](https://user-images.githubusercontent.com/59169507/115714802-cf57b700-a377-11eb-9a00-3b44b1c9bad8.png)
![weather](https://user-images.githubusercontent.com/59169507/115715142-29f11300-a378-11eb-9358-f59a974b5a44.png)
![image meta](https://github.com/user-attachments/assets/e7d9bd4b-d908-4875-b07c-e9c0c72d998b)
