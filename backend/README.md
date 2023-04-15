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

Python scripts are used for dealing with the raw information given to us by the Second Spectrum and StatBomb providers. These are store inside `python-scripts` folder. You will firstly want to combine the game meta data from the two providers into a single file (make sure that the files passed represent the same game from the two providers!):

`python parse_meta_data.py xxxxx_secondSpectrum_meta.json ManCity_xxxxx_lineup.json --downsample 5 --frameschunksize 1000`

This will produce `xxxxx_meta_data.json` file, where `xxxxx` is the game id.

Where:

-   `downsample` reduces the base FPS (which is typically 25 Hz) e.g. downsample of 5 will make the new FPS to be 25 / 5 = 5 Hz. Recommend using nice values, so that the division would become nice e.g. 2, 4, 5, 10.
-   `frameschunksize` specifies the maximum chink size that the frames will be split into e.g. 2000 will split 5 _ 60 _ 90 = 27000 frames (assuming FPS of 5 Hz and 90 min game) into 27000 / 2000 = 13.5, thus 14 chunks.

The second script parses the frame data by basically removing some unwanted fields such as playerId, z player coordinate, wall clock, this helps to reduce the file size, which makes it quicker finding the data inside the database. You MUST specify the same downsample size as before:

`python parse_frames.py xxxxx_secondSpectrum_tracking-produced.jsonl xxxxx_meta_data.json`

This will produce `xxxxx_frames.json` file, where `xxxxx` is the game id.

### Populate Database

Then the parsed data needs to be pushed onto the database. The already parsed json files for one of the games are given in dropbox as [2312213_meta_data.json](https://www.dropbox.com/s/dnnsz8zp4y87ent/2312213_meta_data.json?dl=0), [2312213_frames.json](https://www.dropbox.com/s/70j23zpna6ypzsc/2312213_frames.json?dl=0), [2312213_events.json](https://www.dropbox.com/s/ga23ces88t4gjsh/2312213_events.json?dl=0). You can download these and store inside the `python-scripts` folder for simplicity.

Then one needs to run the scripts as given below to store all the data onto the database (run from `backend` folder):

```
node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushMetaDataToDb.ts ./python-scripts/2312213_meta_data.json

node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushFramesToDb.ts ./python-scripts/2312213_frames.json 1000

node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushEventsToDb.ts ./python-scripts/2312213_events.json
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

To test Grqphql queries when using the web service API in release mode one is required to go to [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer) and enter https://kicksmarter-api.onrender.com/ as the target address within the top-left box. Alternative

### Cloud image storage with BackBlaze

We needed to be able to store some game related images and serve these during the gameplay. For that a database isn't a good choice to keep it running fast thus we needed a Cloud based storage. Keeping it on the free size we chose [Backblaze](https://www.backblaze.com/).

Backblaze is accessed from the backend and frontend would perform queries to the backend to store and retrieve the required image information. In this case we are only serving images and not storing them, so in theory we don't even need to have the access to the database. The simplest way is to create a `bucket` called `kicksmarter` and then set it as public access. This will allow anyone to access any information within the bucket. Then one should structurise the images as required into folders based on gameId and some other index value. Then one could access each image using a friendly link, by creating the following URL:

```
<downloadUrl>/file/kicksmarter/<gameId>/<index>.png
e.g. https://f005.backblazeb2.com/file/kicksmarter/2312135/0.png
```

The downloadUrl can be retrieved from the backblaze API when authorizing it under `authRes.data.downloadUrl` once and then storing it as the baseUrl. Alternatively, it can be checked by uploading some image to the bucket and then clicking on it. Under details you will find `Friendly URL`, where the base is the downloadUrl. You should also be able to confirm there that you created a correct friendly URL.

Note, when creating (if needed) an Application Key, the Key ID (aka username) and the Key (aka password) will be shown once only, you won't be able to read it again, so note it down.
