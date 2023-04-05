import matplotlib.pyplot as plt
import numpy as np
import argparse
import json
import pprint


def plot_ball(ax, ball, color):
    coords = ball['xyz']
    ax.scatter([coords[0]], [coords[1]], c=color)


def plot_players(ax, position_coords_pairs, color):
    x, y = zip(*position_coords_pairs)
    ax.scatter(x, y, c=color, alpha=0.7, s=70)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('frames_file', help='xxxxx_frames.json file')
    args = parser.parse_args()

    with open(args.frames_file, 'r') as f:
        frames = json.load(f)

    pp = pprint.PrettyPrinter(indent=2)
    # pp.pprint(frames[0])

    home_coords = [f['xy'] for f in frames[0]['homePlayers']]
    away_coords = [f['xy'] for f in frames[0]['awayPlayers']]
    ball = frames[0]['ball']

    fig, ax = plt.subplots()

    plot_players(ax, home_coords, 'blue')
    plot_players(ax, away_coords, 'red')
    plot_ball(ax, ball, 'black')

    ax.set_xlim((0, 105.174))
    ax.set_ylim((0, 68.16))
    ax.invert_yaxis()

    plt.show()
