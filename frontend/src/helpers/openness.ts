import { Player } from '@/interfaces/global';

const getDistance = (p1: Player, p2: Player) => {
    return Math.sqrt(((p1.x ?? 0) - (p2.x ?? 0)) ** 2 + ((p1.y ?? 0) - (p2.y ?? 0)) ** 2);
};

const calculateOpenness = (player: Player, players: Array<Player>) => {
    // todo here should add team as "home" or "away"
    const opponents = players.filter((p) => player.jerseyColor !== p.jerseyColor);

    let total = 0;
    opponents.forEach((p) => {
        const distance = getDistance(player, p) ** 2;
        if (distance === 0) return 0;

        total += 1 / distance;
    });

    return Math.sqrt(1 / total);
};

export default calculateOpenness;
