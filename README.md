# kiosk_v4
The latest, greatest and somehow refactored revision of the mygthy shackspace kiosk terminal.



## development

* run development environment: ``python -m SimpleHTTPServer 8002``
* surf to ``http://localhost:8002``
* disable cors with this extension in Chrome/Chromium: ``https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en``

## update live kiosk:

login, pull, "press" F5


    ssh shack@lounge.kiosk.shack
    cd kiosk_v4
    git pull
    export DISPLAY=:0.0
    xdotool key F5

