import json
import argparse
import os
import math


def get_id(path: str):
    filename = os.path.basename(path)
    return filename.split('_')[0][1:]


def get_distance(p1, p2):
    return math.dist(p1['xy'], p2['xy'])


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('frames_file',
                        help='xxxxx_secondSpectrum_tracking-produced.jsonl file')
    parser.add_argument(
        '--downsample', type=int, default=1, help='Sampling rate reduction rate, this will only change the base frequency, but it must match parse_frames.py script parameter.')
    args = parser.parse_args()

    with open(args.frames_file, 'r') as f:
        raw_frames = [json.loads(line) for line in f]

    frames = []
    for idx, frame in enumerate(raw_frames[0::args.downsample]):
        if idx % 5000 == 0:
            print(f'Parsed {idx} frames..')
        frame.pop('wallClock')
        frame['frameIdx'] = idx
        for player in frame['homePlayers']:
            player.pop('playerId')
            # player.pop('optaId')
            # player.pop('speed')
            coords = player.pop('xyz')
            player['xy'] = [coords[0], coords[1]]

        for player in frame['awayPlayers']:
            player.pop('playerId')
            # player.pop('optaId')
            # player.pop('speed')
            coords = player.pop('xyz')
            player['xy'] = [coords[0], coords[1]]

        for player in frame['homePlayers']:
            tot = 0
            for opponent in frame['awayPlayers']:
                tot += 1 / (get_distance(player, opponent) ** 2)
            player['openness'] = round(math.sqrt(1 / tot), 2)

        for player in frame['awayPlayers']:
            tot = 0
            for opponent in frame['homePlayers']:
                tot += 1 / (get_distance(player, opponent) ** 2)
            player['openness'] = round(math.sqrt(1 / tot), 2)

        frames.append(frame)

    export_filename = get_id(args.frames_file) + '_frames.json'

    with open(export_filename, 'w') as f:
        json.dump(frames, f)

    print(f'Exported to {export_filename}.')
