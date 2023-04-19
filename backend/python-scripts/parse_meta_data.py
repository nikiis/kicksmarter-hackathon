import json
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


def from_time_to_game_clock(delta_time: str):
    time_obj = datetime.datetime.strptime(delta_time, "%H:%M:%S.%f")
    total_seconds = time_obj - datetime.datetime(1900, 1, 1)
    return round(total_seconds.total_seconds(), 2)


def from_unix_to_game_clock(start_time: int, end_time: int):
    start_datetime = datetime.datetime.fromtimestamp(start_time / 1000.0)
    end_datetime = datetime.datetime.fromtimestamp(end_time / 1000.0)
    return round(abs((end_datetime - start_datetime).total_seconds()), 2)


def parse_periods(periods, start_time, downsample):
    parsed_periods = []
    for period in periods:
        parsed_period = {}
        parsed_period['number'] = period['number']
        parsed_period['startGameClock'] = from_unix_to_game_clock(
            start_time, period['startFrameClock'])
        parsed_period['stopGameClock'] = from_unix_to_game_clock(
            start_time, period['endFrameClock'])
        parsed_period['startFrameIdx'] = period['startFrameIdx'] // downsample
        parsed_period['stopFrameIdx'] = period['endFrameIdx'] // downsample
        parsed_period['homeAttPositive'] = period['homeAttPositive']

        parsed_periods.append(parsed_period)
    return parsed_periods


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

    with open(args.meta_second_spectrum, 'r', encoding='utf-8') as f:
        game_data_spectrum = json.load(f)

    with open(args.meta_stat_bomb, 'r', encoding='utf-8') as f:
        game_data_stat_bomb = json.load(f)

    game_id = get_id(args.meta_second_spectrum)
    home_players = {}

    for player in game_data_spectrum['homePlayers']:
        home_players[player['number']] = from_second_spectrum(player)

    for player in game_data_stat_bomb[0]['lineup']:
        home_players[player['jersey_number']].update(from_stat_bomb(player))

    away_players = {}

    for player in game_data_spectrum['awayPlayers']:
        away_players[player['number']] = from_second_spectrum(player)

    for player in game_data_stat_bomb[1]['lineup']:
        away_players[player['jersey_number']].update(from_stat_bomb(player))

    game_data = {
        'gameId': game_id,
        'description': game_data_spectrum['description'],
        'league': 'ENTER_LEAGUE',
        'live': False,
        'startTime': game_data_spectrum['startTime'],
        'pitchLength': round(game_data_spectrum['pitchLength'], 3),
        'pitchWidth': round(game_data_spectrum['pitchWidth'], 3),
        'fps': round(game_data_spectrum['fps'] / args.downsample, 3),
        'downsample': args.downsample,
        'framesChunkSize': args.frameschunksize,
        'periods': parse_periods(game_data_spectrum['periods'], game_data_spectrum['startTime'], args.downsample),
        'home': {
            'jerseyColor': '#B3D7DF',
            'secondaryColor': '#444E50',
            'players': filter_players(home_players.values()),
            'name': game_data_stat_bomb[0]['team_name'],
            'score': game_data_spectrum['homeScore'],
        },
        'away': {
            'jerseyColor': '#1A3966',
            'secondaryColor': '#FFFFFF',
            'players': filter_players(away_players.values()),
            'score': game_data_spectrum['awayScore'],
            'name': game_data_stat_bomb[1]['team_name'],
        }
    }

    export_filename = game_id + '_meta_data.json'

    with open(export_filename, 'w') as f:
        json.dump(game_data, f)

    print(f'Exported to {export_filename}.')
