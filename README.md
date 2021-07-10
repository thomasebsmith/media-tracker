# Media Tracker
*Track movies you watch, books you read, music you listen to, games you play,
and more!*

Media Tracker is a website for tracking the media that you consume.
All information is kept on your computer only for your privacy.

## Features
 - Record media locally
 - Rate and rank media
 - Backup your recorded media (in progress)
 - Visualize and view statistics about your recorded media (in progress)

## Requirements
To build this website, you will need:
 - `git`
 - `npm`
 - GNU `make`

## Quick Start
Run the following commands in a Posix-compatible shell:
```sh
$ git clone https://github.com/thomasebsmith/media-tracker.git
$ cd media-tracker/
$ npm install
$ make build/release
$ cd build/release/final
$ python3 -m http.server 8000
```

Then, navigate in a web browser to http://localhost:8000/.

## Tech Stack
Media Tracker is written in TypeScript and uses Babel, Browserify, and
UglifyJS to compile its code to a static site.

Your data is stored using localstorage.
