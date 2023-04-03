import json
import pprint
import argparse
import datetime
import os


def from_second_spectrum(player):
    return {
        'number': player['number'],
        'position': player['position'],
        'optaId': player['optaId'],
        'ssiId': player['ssiId']
    }


def parse_stats(stats):
    if not stats:
        return []

    return {
        'ownGoals': stats['own_goals'],
        'goals': stats['goals'],
        'assists': stats['assists'],
        'penaltiesScored': stats['penalties_scored'],
        'penaltiesMissed': stats['penalties_missed'],
        'penaltiesSaved': stats['penalties_saved']
    }


def from_stat_bomb(player):
    return {
        'statBombId': player['player_id'],
        'name': player['player_name'],
        'birthDate': player['birth_date'],
        'gender': player['player_gender'],
        'height': player['player_height'],
        'weight': player['player_weight'],
        'country': player['country']['name'],
        'stats': parse_stats(player['stats'])
    }


def filter_players(players: list):
    return [p for p in players if p['stats'] and p['optaId']]


def to_game_clock(delta_time: str):
    time_obj = datetime.datetime.strptime(delta_time, "%H:%M:%S.%f")
    total_seconds = time_obj - datetime.datetime(1900, 1, 1)
    return round(total_seconds.total_seconds(), 2)


def parse_events(events):
    parsed_events = []
    for event in events:
        if not event.get('outcome', None):
            continue

        parsed_event = {}
        parsed_event['period'] = event['period']
        parsed_event['gameClock'] = to_game_clock(event['timestamp'])
        parsed_event['type'] = event['type']
        parsed_event['outcome'] = event['outcome']

        parsed_events.append(parsed_event)

    return parsed_events


def get_id(path: str):
    filename = os.path.basename(path)
    return filename.split('_')[0][1:]


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('meta_second_spectrum',
                        help='xxxxx_secondSpectrum_meta.json file')
    parser.add_argument(
        'meta_stat_bomb', help='ManCity_xxxxx_lineup.json file')
    parser.add_argument(
        '--downsample', type=int, default=1, help='Sampling rate reduction rate, this will only change the base frequency, but it must match parse_frames.py script parameter. I suggest values such as 2, 4, 5 or 8, that will provide nice division result.')
    parser.add_argument('--frameschunksize', type=int,
                        default=2000, help='Frames chunk size.')
    args = parser.parse_args()

    with open(args.meta_second_spectrum, "r") as f:
        game_data1 = json.load(f)

    with open(args.meta_stat_bomb, "r") as f:
        game_data2 = json.load(f)

    game_id = get_id(args.meta_second_spectrum)
    home_players = {}

    for player in game_data1['homePlayers']:
        home_players[player['number']] = from_second_spectrum(player)

    for player in game_data2[0]['lineup']:
        home_players[player['jersey_number']].update(from_stat_bomb(player))

    away_players = {}

    for player in game_data1['awayPlayers']:
        away_players[player['number']] = from_second_spectrum(player)

    for player in game_data2[1]['lineup']:
        away_players[player['jersey_number']].update(from_stat_bomb(player))

    game_data = {
        'gameId': game_id,
        'description': game_data1['description'],
        'startTime': game_data1['startTime'],
        'pitchLength': game_data1['pitchLength'],
        'pitchWidth': game_data1['pitchWidth'],
        'fps': round(game_data1['fps'] / args.downsample, 3),
        'framesChunkSize': args.frameschunksize,
        'periods': game_data1['periods'],
        'home': {
            'color': '#B3D7DF',
            'players': filter_players(home_players.values()),
            'name': game_data2[0]['team_name'],
            'score': game_data1['homeScore'],
            'events': parse_events(game_data2[0]['events'])
        },
        'away': {
            'color': '#C85B75',
            'players': filter_players(away_players.values()),
            'score': game_data1['awayScore'],
            'name': game_data2[1]['team_name'],
            'events': parse_events(game_data2[1]['events'])
        }
    }

    export_filename = game_id + '_meta_data.json'

    with open(export_filename, 'w') as f:
        json.dump(game_data, f)

    print(f'Exported to {export_filename}.')
