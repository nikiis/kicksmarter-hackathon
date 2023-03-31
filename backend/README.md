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

Python scripts are used for dealing with the raw information given to us by the Second Spectrum and StatBomb providers. These are store inside `python-scripts` folder. You will firstly want to combine the meta data from the two providers into a single file (make sure that the files passed represent the same game from the two providers!):

`python parse_meta_data.py xxxxx_secondSpectrum_meta.json ManCity_xxxxx_lineup.json --downsample 2`

TODO: do we need to downsample anymore?

The second script parses the frame data by basically removing some unwanted fields such as playerId, z player coordinate, wall clock, this really reduces the file size! One can also downsample the fps to reduce this further down:

`python parse_frames.py xxxxx_secondSpectrum_tracking-produced.jsonl --downsample 2`

### Populate Database

Then the parsed data needs to be pushed onto the database. An example json that can be pushed is given in [dropbox](https://www.dropbox.com/s/2zms3o6fd4ky1oe/2312213_min_complete.json?dl=0). Then one can run the script to store both the meta data and the frames onto the database by passing two files (have to run from `backend` folder):

`node -r tsconfig-paths/register -r ts-node/register ./src/utils/pushGameDataToDb.ts ./python-scripts/2312135_meta_data.json ./python-scripts/2312135_frames.json`
