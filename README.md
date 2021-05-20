# Media Tracker
*Track movies you watch, books you read, and more!*

Media Tracker is a website for tracking the media that you consume.
All information is kept on your computer only for your privacy.

## Features
 - Record media locally
 - Rate and rank media (in progress)
 - Visualize your recorded media (in progress)

## Requirements
 - `git`
 - `npm` + `node`
 - `make`

## Quick Start
```sh
$ git clone https://github.com/thomasebsmith/media-tracker.git
$ cd media-tracker/
$ npm install
$ make build/release
$ cd build/release/final
$ python3 -m http.server 8000
```

## Tech Stack
Media Tracker is written in TypeScript and uses Babel and Browserify
to compile its code to a static site.
