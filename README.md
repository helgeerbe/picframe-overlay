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
PICFRAME_URL=http://mypicframe:9000/?all

# when logged in via ssh
$ export DISPLAY=:0

# Install the dependencies and run
$ npm install && npm start
````

## How to use

set fade_time to
- 10 empty overlay
- 11 digital clock
- 12 weather 