import json
import argparse
import os
import math


def get_id(path: str):
    filename = os.path.basename(path)
    return filename.split('_')[0][1:]


def get_distance(p1, p2):
    return math.dist(p1['xy'], p2['xy'])


def add_openness(players, opponents):
    for player in players:
        tot = 0
        for opponent in opponents:
            tot += 1 / (get_distance(player, opponent) ** 2)
        player['openness'] = round(math.sqrt(1 / tot), 2)


def parse_ball(ball, half_pitch_length, half_pitch_width):
    coords = ball.pop('xyz')
    ball['xyz'] = [round(coords[0] + half_pitch_length, 2),
                   round(half_pitch_width - coords[1], 2),
                   coords[2]]


def parse_players(players, half_pitch_length, half_pitch_width):
    for player in players:
        player.pop('playerId')
        coords = player.pop('xyz')
        player['xy'] = [round(coords[0] + half_pitch_length, 2),
                        round(half_pitch_width - coords[1], 2)]


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('frames_file',
                        help='xxxxx_secondSpectrum_tracking-produced.jsonl file')
    parser.add_argument('meta_data', help='xxxxx_meta_data.json file')
    args = parser.parse_args()

    with open(args.meta_data, 'r', encoding='utf-8') as f:
        meta_data = json.load(f)

    half_pitch_length = meta_data['pitchLength'] / 2
    half_pitch_width = meta_data['pitchWidth'] / 2
    downsample = meta_data['downsample']

    with open(args.frames_file, 'r', encoding='utf-8') as f:
        raw_frames = [json.loads(line) for line in f]

    frames = []
    for idx, frame in enumerate(raw_frames[0::downsample]):
        if idx % 5000 == 0:
            print(f'Parsed {idx} frames..')
        frame.pop('wallClock')
        frame.pop('live')
        frame.pop('period')
        frame['frameIdx'] = idx
        parse_ball(frame['ball'], half_pitch_length, half_pitch_width)
        parse_players(frame['homePlayers'],
                      half_pitch_length, half_pitch_width)
        parse_players(frame['awayPlayers'],
                      half_pitch_length, half_pitch_width)

        add_openness(frame['homePlayers'], frame['awayPlayers'])
        add_openness(frame['awayPlayers'], frame['homePlayers'])

        frames.append(frame)

    export_filename = get_id(args.frames_file) + '_frames.json'

    with open(export_filename, 'w') as f:
        json.dump(frames, f)

    print(f'Exported to {export_filename}.')
