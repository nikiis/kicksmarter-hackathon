## Preinstallation

From the project root run `npm i -w backend`, then also from anywhere `npm install -g nodemon`.

## Requirements

The backend runs on MongoDB database and uses node as the backend. It also uses python scripts to parse the data provided by the hackathon organisers into what will be stored onto the database.

### MongoDB

To install and start MongoDB you can read steps [here](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/), but in short:
Note, these are instructions for MacOS:

```
brew tap mongodb/brew
brew update
brew install mongodb-community
brew services start mongodb-community
```

Then it would be good to install a database viewer of some sort e.g. [MongoDB Compass](https://www.mongodb.com/products/compass).

### Parsing Data

Python scripts are used for dealing with the raw information given to us by the Second Spectrum and StatBomb providers. These are store inside `python-scripts` folder. 

#### Meta Data

You will firstly want to combine the game meta data from the two providers into a single file (make sure that the files passed represent the same game from the two providers!):

`python parse_meta_data.py gxxxxx_secondSpectrum_meta.json ManCity_xxxxx_lineup.json --downsample 2 --frameschunksize 1000`

Where:

-   `downsample` reduces the base FPS (which is typically 25 Hz) e.g. downsample of 5 will make the new FPS to be 25 / 5 = 5 Hz. Recommend using nice values, so that the division would become nice e.g. 2, 5, 10, the larger the number is the smaller the output file will become but at the expense of making the video feed choppier, I recommend value of 2.
-   `frameschunksize` specifies the maximum chunk size that the frames will be split into e.g. 1000 will split 5 * 60 * 90 = 27000 frames (assuming FPS of 5 Hz and 90 min game) into 27000 / 1000 = 27 chunks. This needs to be done since MongoDB document has a limited size of up to 16 MB, thus we cannot store the whole game of e.g. 150 MB inside a single document.

This will produce `xxxxx_meta_data.json` file, where `xxxxx` is the game id. Note that the `gxxxxx_secondSpectrum_meta.json` naming needs to include the game  id after letter `g`, which is then extracted and later used throughout.

#### Frames

The second script parses the frame data by basically removing some unwanted fields such as playerId, z player coordinate, wall clock, this helps to reduce the file size, which makes it quicker finding the data inside the database.

`python parse_frames.py xxxxx_secondSpectrum_tracking-produced.jsonl xxxxx_meta_data.json`

Where:
- `xxxxx_meta_data.json` is the previously produced file.

This will produce `xxxxx_frames.json` file, where `xxxxx` is the game id.

#### Events

Events are firstly preparsed using a script `add_columns.py` from another teammate repo on [github](https://github.com/craiged99/CodeCoHackathon) to add extra fields within each desired event. However then we need to filter to only select the desired events and values, and format everything correctly before sending into the database:

`python parse_events.py xxxxx_preparsed_events.json xxxxx_meta_data.json`

This will produce `xxxxx_events.json` file, where `xxxxx` is the game id.

#### Live Feed

Live feed is generated using various algorithms from the previously mentioned repo [github](https://github.com/craiged99/CodeCoHackathon). This no longer needs to do any post processing (well, sort of, some code changes were needed there to properly format the data, but were not implemented for now... So some manual things needed to be done like renaming keys, extracting player name, it's fairly easy doing that on a code editor). The output should be `xxxxx_live_feed.json`. 

In addition, the scripts will output graphs that will be later stored inside the cloud storage for easy access and referenced accordingly.

### Populate Database

Then the processed and parsed data needs to be pushed onto the database. The already parsed json files for two of the games (but only Arsenal is Live) are given in [dropbox](https://www.dropbox.com/sh/7zoq8ih5b2th4dz/AAC1SIPDkwleBVOAZt4IFgila?dl=0). You can download these and store inside the `python-scripts` folder for simplicity.

Then one needs to run the scripts as given below to store all the data onto the database (run from `backend` folder):

```
node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushMetaDataToDb.ts ./python-scripts/2312213_meta_data.json

node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushFramesToDb.ts ./python-scripts/2312213_frames.json 1000

node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushEventsToDb.ts ./python-scripts/2312213_events.json

node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushLiveFeedsToDb.ts ./python-scripts/2312135_live_feeds.json
```

Where 1000 is the frames chunk size, which must be the same as before.

## Running

To run the backend server one simply needs to do `npm run dev` or if running from the root `npm run dev -w backend`.

### Graphql

The data is retrieved using graphql queries. To test your queries go to `http://localhost:4000/graphql` after launching the server. Here are some of the examples on how the data can be queried:

-   Getting all stored games:

```
query {
  allGames {
    gameId
    description
    startTime
  }
}
```

-   Getting information about a specific game:

```
query {
  game(gameId: "2312213") {
    gameId
    description
    startTime
    home {
      jerseyColor
      secondaryColor
      name
      score
    }
    away {
      jerseyColor
      secondaryColor
      name
      score
    }
  }
}
```

-   Getting a single frame (game clock in seconds):

```
query {
  frame(gameId: "2312213", frameIdx: 10.4) {
    frameIdx
    gameClock
    live
    lastTouch
    homePlayers {
      number
      xy
      speed
      optaId
    }
    ball {
      xyz
      speed
    }
  }
}
```

-   Getting multiple frames in the given range:

```
query{
  frames(gameId: "2312213", startFrameIdx: 0, stopFrameIdx: 10) {
    frameIdx
    lastTouch
  }
}
```

-   Getting a single player information:

```
query {
  player (gameId: "2312213", optaId: "174349") {
    name
    position
    stats {
      goals
    }
  }
}
```

## Production Deployment

### MongoDB with Atlas

Currently we are using MongoDB Atlas to provide us with an online based database with the access API. To setup this online database one is required to:

-   Create a new file `config/production.json` with only MONGODB_URI, which you should take from the MongoDB Atlas website after creating a database. Remember, this includes both username and password (special characters are url encoded).
-   Specify a production environmental variable: `export NODE_ENV=production`
-   Follow the procedures in section `Populate Database`, which requires running a couple of scripts to push the data to the database.
-   Go into `Network Access` within MongoDB Atlas and add an IP address of the `Render` web service API (next step) or `0.0.0.0/0` for the moment being to allow anyone have access to the database, but change the IP to only allow the `Render` later on.

### Web API with Render

We are currently using `Render` to create a web service API. When deploying the API one is required to add environmental variables:

-   NODE_CONFIG_DIR = /etc/secrets
-   NODE_ENV = production

And then also add `Secret Files`:

-   `default.json`, which has the same contents as `config/default.json`
-   `production.json`, which has the same contents as `config/production.json` (or `deployment.json` when creating dev).

#### Repeated access with Cron-job.org

One problem with render free tier is that the API goes to sleep after 15 min of inactivity. After that it would take anywhere between 1 to 2 min for it to spin up again after it has been accessed, leading to timeouts on the frontend and in general massive loading times. To _fix_ that one can create a job with the purpose of repeatedly accessing the API let's say every 5 min.

[cron-job.org](cron-job.org) was used to create a repeated task accessing https://kicksmarter-api-dev.onrender.com/, which is the home page of the API. This simply returns `Hello from kickstarter!`, so it consumes barely any bandwidth. Most importantly, that fixes the issue, at least for now. Note that there is also a `Free Instance Hours` limit, but theoretically the given 750 hours is good enough for the whole month when running a single Web API.

### Graphql

To test Grqphql queries when using the web service API in `deployment` mode, go to https://kicksmarter-api-dev.onrender.com/graphql. In `release` mode one is required to go to [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer) and enter the release address e.g. https://kicksmarter-api.onrender.com/ (note, this currently isn't deployed!) as the target address within the top-left box.

### Cloud image storage with BackBlaze

#### Logic
To store the live feed images, which were generated by our automatic scripts, and serve these during the live feed preview we used cloud image storage, since a database isn't a good choice for storing images. Keeping it on the free size we chose [Backblaze](https://www.backblaze.com/).

Normally Backblaze is accessed from the backend and frontend would perform queries to the backend to store and retrieve the required image information. In this case we do not need to modify upload more, remove or edit the images, only to serve them. The simplest way is thus to create a `bucket` called `kicksmarter` and then set it to _public access_. This will allow anyone to access any information within the bucket for as long as they have the link to the contents. Then one should structurise the images as required into folders based on _gameId_ and name them based on gameClock in seconds. Then one could access each image using a friendly link, by creating the following URL:

```
<downloadUrl>/file/kicksmarter/<gameId>/<index>.png

e.g. https://f005.backblazeb2.com/file/kicksmarter/2312135/0.png
```

The downloadUrl can be retrieved from the backblaze API when authorizing it under `authRes.data.downloadUrl` once and then storing it as the baseUrl, which was done inside `pushLiveFeedsToDb.ts`, however we simply inserted this downloadUrl and created the corrent links to not require doing this on the frontend. Alternatively, it can also be retrieved by uploading an image to the bucket and then clicking on it. Under details you will find `Friendly URL`, where you can deduct the downloadUrl. You should also be able to confirm there that you created a correct friendly URL!

Note, when creating (if needed) an Application Key, the Key ID (aka username) and the Key (aka password) will be shown once only, you won't be able to read it again, so note it down.

#### Uploading the Live Feed images

Keeping all this in mind, to add the images for the live feed one is require to create a folder named `2312135` under bucked named `kicksmarter` and upload the contents of the folder `2312135_live_feeds/2312135` from [dropbox](https://www.dropbox.com/sh/7zoq8ih5b2th4dz/AAC1SIPDkwleBVOAZt4IFgila?dl=0).


