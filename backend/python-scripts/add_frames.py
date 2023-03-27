import json
import argparse


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('game_data',
                        help='xxxxx_match_data.json file')
    parser.add_argument('frames',
                        help='xxxxx_secondSpectrum_tracking-produced.jsonl file')
    args = parser.parse_args()

    with open(args.game_data, "r") as f:
        game_data = json.load(f)

    with open(args.frames, 'r') as f:
        frames = [json.loads(line) for line in f]

    game_data['frames'] = frames

    with open(game_data['gameId'] + '_complete.json', 'w') as f:
        json.dump(game_data, f)
