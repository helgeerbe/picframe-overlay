# picframe-overlay

Cross-platform PictureFrame overlay with JavaScript, HTML, and CSS

## Prerequisites

### Electron

picframe-overlay uses [electron](https://www.electronjs.org). 
### Raspbery
On raspi you need to run a composite manager to get a transparent window. By default it's `xcompmgr`. Unfortuantely activation of `xcompmgr` over `raspi-config` is not working. Instead append `@xcompmgr` in file `/etc/xdg/lxsession/LXDE-pi/autostart`. This will start `xcompmgr`when user `pi`is logged in to the desktop.

You have to enable fake KMS GL driver in `raspi-config`

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
WEATHER={"city": "My City", "lat": 52.38, "lon": 13.21, "key": "myOpenWeatherMapKey", "lang": "de", "units": "metric"}
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

## What's next
- test video performance on pi3, if it is capable to play fullscreen mp4 files

### Impressions

![analog clock](https://user-images.githubusercontent.com/59169507/115714802-cf57b700-a377-11eb-9a00-3b44b1c9bad8.png)
![weahter](https://user-images.githubusercontent.com/59169507/115715142-29f11300-a378-11eb-9358-f59a974b5a44.png)
