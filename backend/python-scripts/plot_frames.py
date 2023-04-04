import matplotlib.pyplot as plt
import numpy as np
import argparse
import json
import pprint


def plot_players(ax, position_pairs, color):
    x, y = zip(*position_pairs)
    ax.scatter(x, y, c=color, alpha=0.5)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('frames_file', help='xxxxx_frames.json file')
    args = parser.parse_args()

    with open(args.frames_file, 'r') as f:
        frames = json.load(f)

    pp = pprint.PrettyPrinter(indent=2)
    # pp.pprint(frames[0])

    home = [f['xy'] for f in frames[0]['homePlayers']]
    away = [f['xy'] for f in frames[0]['awayPlayers']]

    fig, ax = plt.subplots()

    plot_players(ax, home, 'blue')
    plot_players(ax, away, 'red')

    ax.set_xlim((0, 105.174))
    ax.set_ylim((0, 68.16))
    ax.invert_yaxis()

    plt.show()
