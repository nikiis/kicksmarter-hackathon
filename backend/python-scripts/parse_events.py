import json
import argparse
import os
import math


def get_team(event):
    return 'home' if 'Manchester' in event['team']['name'] else 'away'


def get_player_opta_id(stat_bomb_id, players):
    gen = (p['optaId'] for p in players if p['statBombId'] == stat_bomb_id)
    return next(gen, None)


def parse_shot(event, players):
    data = {}
    shot = event['shot']
    data['gameClock'] = event['minute'] * 60 + event['second']
    data['optaId'] = get_player_opta_id(event['player']['id'], players)
    data['team'] = get_team(event)
    data['xG'] = round(shot['statsbomb_xg'], 2)
    return data


def parse_pass(event, players):
    data = {}
    data['gameClock'] = event['minute'] * 60 + event['second']
    data['optaId'] = get_player_opta_id(event['player']['id'], players)
    data['team'] = get_team(event)
    data['length'] = round(event['pass']['length'], 1)
    return data


def parse_carry(event, players):
    data = {}
    data['gameClock'] = event['minute'] * 60 + event['second']
    data['optaId'] = get_player_opta_id(event['player']['id'], players)
    data['team'] = get_team(event)
    data['length'] = round(math.dist(
        event['location'], event['carry']['end_location']), 1)
    return data


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('events_data', help='xxxxx_events_data.json file')
    parser.add_argument('meta_data', help='xxxxx_meta_data.json file')
    args = parser.parse_args()

    with open(args.events_data, 'r', encoding='utf-8') as f:
        events_data = json.load(f)

    with open(args.meta_data, 'r', encoding='utf-8') as f:
        meta_data = json.load(f)

    players = [*meta_data['home']['players'], *meta_data['away']['players']]

    events = {'keyPasses': [], 'progressivePasses': [],
              'progressiveCarries': [], 'shots': [], 'goals': []}

    for event in events_data:
        filter_types = [event['key_pass'], event['prog_pass'],
                        event['prog_carry'], event['shot']]
        if not any(filter_types):
            continue

        if event['key_pass']:
            events['keyPasses'].append(parse_pass(event, players))
        elif event['prog_pass']:
            events['progressivePasses'].append(parse_pass(event, players))
        elif event['prog_carry']:
            events['progressiveCarries'].append(parse_carry(event, players))
        elif event['shot'] and event['shot']['outcome']['name'] == 'Goal':
            events['goals'].append(parse_shot(event, players))
        elif event['shot']:
            events['shots'].append(parse_shot(event, players))

    # import pprint
    # p = pprint.PrettyPrinter(indent=2)
    # p.pprint(events['progressiveCarries'])
    # p.pprint(events['keyPasses'])

    export_filename = meta_data['gameId'] + '_events.json'

    with open(export_filename, 'w') as f:
        json.dump(events, f)

    print(f'Exported to {export_filename}.')
