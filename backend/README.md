## Preinstallation

From the project root run `npm i -w backend`, then also from anywhere `npm install -g ts-node`.

## Requirements

The backend runs on MongoDB database and uses node as the backend. It also uses python scripts to parse the data provided by the hackathon organisers into what will be stored onto the database.

### MongoDB

To install and start MongoDB you can read steps [here](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/), but in short:

```
brew tap mongodb/brew
brew update
brew install mongodb-community
brew services start mongodb-community
```

Then it would be good to install a database viewer of some sort e.g. [MongoDB Compass](https://www.mongodb.com/products/compass).

### Parsing Data

Python scripts are used for dealing with the raw information given to us by the Second Spectrum and StatBomb providers. These are store inside `python-scripts` folder. You will firstly want to combine the game meta data from the two providers into a single file (make sure that the files passed represent the same game from the two providers!):

`python parse_meta_data.py xxxxx_secondSpectrum_meta.json ManCity_xxxxx_lineup.json --downsample 5 --frameschunksize`

This will produce `xxxxx_meta_data.json` file, where `xxxxx` is the game id.

Where:

-   `downsample` reduces the base FPS (which is typically 25 Hz) e.g. downsample of 5 will make the new FPS to be 25 / 5 = 5 Hz. Recommend using nice values, so that the division would become nice e.g. 2, 4, 5, 10.
-   `frameschunksize` specifies the maximum chink size that the frames will be split into e.g. 2000 will split 5 _ 60 _ 90 = 27000 frames (assuming FPS of 5 Hz and 90 min game) into 27000 / 2000 = 13.5, thus 14 chunks.

The second script parses the frame data by basically removing some unwanted fields such as playerId, z player coordinate, wall clock, this helps to reduce the file size, which makes it quicker finding the data inside the database. You MUST specify the same downsample size as before:

`python parse_frames.py xxxxx_secondSpectrum_tracking-produced.jsonl --downsample 5`

This will produce `xxxxx_frames.json` file, where `xxxxx` is the game id.

### Populate Database

Then the parsed data needs to be pushed onto the database. The two already parsed json files for one of the games are given in dropbox as [game_meta_data.json](https://www.dropbox.com/s/dnnsz8zp4y87ent/2312213_meta_data.json?dl=0) and [game_frames.json](https://www.dropbox.com/s/70j23zpna6ypzsc/2312213_frames.json?dl=0). Then one needs to run the two scripts as given below to store both the meta data and the frames onto the database by passing two generated json files (have to run from `backend` folder):

```
node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushMetaDataToDb.ts ./python-scripts/2312213_meta_data.json
node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushFramesToDb.ts ./python-scripts/2312213_frames.json 2000
```

Where 2000 is the frames chunk size, which must be the same as before.

## Running

To run the backend server one simply needs to do `npm run dev` or if running from the root `npm run dev -w backend`.

### Graphql

The data is retrieved using graphql queries. To test your queries go to `http://localhost:4000/graphql` after launching the server.
