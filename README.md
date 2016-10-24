# ttws - TomTom Watch Synchronizer

TTWS is an application that builds a UI for the command line tool [ttwatch](https://github.com/ryanbinns/ttwatch).
Its mainly developed to download activities from a TomTom sports watch and
upload them to the [Strava](https://www.strava.com) website on a Linux system. It allows also to update
the firmware, GPSQuickFix and time of the watch. It shows also metadata like firmware version of the connected watch.

You need to have the [ttwatch](https://github.com/ryanbinns/ttwatch) utility pre-installed on your system.
Later versions of ttws may have them included.

## Installation

1. Download the latest release from the [releae page](https://github.com/Dica-Developer/ttws/releases)
2. Install it by double-click the deb file or type in a terminal `sudo dpkg -i <path to file>`
3. Now you can start it by typing `ttws` in a terminal or your application finder

## Start the application from the source code

1. Install [nodejs+npm](https://nodejs.org/) (I recommend to use [nvm](https://github.com/creationix/nvm) for that)
2. git clone https://github.com/Dica-Developer/ttws.git
3. cd ttws
1. npm install
2. npm start
