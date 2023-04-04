## Preinstallation

From the project root run `npm i -w backend`, then also from anywhere `npm install -g ts-node`.

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

Then the parsed data needs to be pushed onto the database. The two already parsed json files for one of the games are given in dropbox as [game_meta_data.json](https://www.dropbox.com/s/dnnsz8zp4y87ent/2312213_meta_data.json?dl=0) and [game_frames.json](https://www.dropbox.com/s/70j23zpna6ypzsc/2312213_frames.json?dl=0). Then one needs to run the two scripts as given below to store both the meta data and the frames onto the database by passing two generated json files (have to run from `backend` folder):

```
node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushMetaDataToDb.ts ./python-scripts/2312213_meta_data.json
node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushFramesToDb.ts ./python-scripts/2312213_frames.json 1000
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
      color
      name
      score
    }
    away {
      color
      name
      score
    }
  }
}
```

-   Getting a single frame (game clock in seconds):

```
query {
  frame(gameId: "2312213", gameClock: 10.4) {
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
  frames(gameId: "2312213", startGameClock: 0, stopGameClock: 10) {
    gameClock
    frameIdx
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

### MongoDB

Currently we are using MongoDB Atlas to provide us with an online based database with the access API. To setup this online database one is required to:

-   Create a new file `config/production.json` with only MONGODB_URI, which you should take from the MongoDB Atlas website after creating a database. Remember, this includes both username and password (special characters are url encoded).
-   Specify a production environmental variable: `export NODE_ENV=production`
-   Follow the procedures in section `Populate Database`, which requires running a couple of scripts to push the data to the database.
-   Go into `Network Access` within MongoDB Atlas and add an IP address of the `Render` web service API (next step) or `0.0.0.0/0` for the moment being to allow anyone have access to the database, but change the IP to only allow the `Render` later on.

### Render

We are currently using `Render` to create a web service API. When deploying the API one is required to add environmental variables:

-   NODE_CONFIG_DIR = /etc/secrets
-   NODE_ENV = production

And then also add `Secret Files`:

-   `default.json`, which has the same contents as `config/default.json`
-   `production.json`, which has the same contents as `config/production.json`

### Graphql

To test Grqphql queries when using the web service API one is required to go to [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer) and enter https://kicksmarter-api.onrender.com/ as the target address within the top-left box.
