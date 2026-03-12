import { PLAYER_COLORS, TITLES, PLAYER_EMOJIS } from './config.js';

export const gameState = {
    playerCount: 2,
    currentTurn: 1,
    currentPlayerIndex: 0,
    actionOrder: [],
    currentActionIndex: 0,
    phase: 'decision',
    settlementComplete: false,
    settlementIndex: 0,
    pendingActions: [],
    currentSettlementAction: null,
    players: [],
    eventLogs: [],
    gameOver: false
};

export function initPlayers(count, getPlayerNameFn) {
    gameState.players = [];

    for (let i = 0; i < count; i += 1) {
        const colorInfo = PLAYER_COLORS[i];
        gameState.players.push({
            id: i,
            name: getPlayerNameFn(i),
            title: TITLES[Math.min(i, TITLES.length - 1)],
            color: colorInfo.hex,
            colorRgb: colorInfo.rgb,
            emoji: PLAYER_EMOJIS[i],
            cities: 100,
            troops: 5000,
            maxTroops: 5000,
            resources: 5000,
            defensePower: 100,
            attackPower: 100,
            eliminated: false,
            rank: i + 1
        });
    }
}

export function checkEliminatedPlayers() {
    const eliminated = [];

    gameState.players.forEach((player) => {
        if (!player.eliminated && player.cities <= 0) {
            player.cities = 0;
            player.troops = 0;
            player.eliminated = true;
            eliminated.push(player);
        }
    });

    return eliminated;
}

export function calculateActionOrder() {
    const alivePlayers = gameState.players.filter((player) => !player.eliminated);

    return alivePlayers
        .map((player) => ({
            player,
            roll: Math.random()
        }))
        .sort((a, b) => {
            if (b.player.cities !== a.player.cities) {
                return b.player.cities - a.player.cities;
            }
            return a.roll - b.roll;
        })
        .map((entry) => entry.player.id);
}

export function checkGameOver() {
    checkEliminatedPlayers();

    const alivePlayers = gameState.players.filter((player) => !player.eliminated);
    if (alivePlayers.length === 1) {
        gameState.gameOver = true;
        return { isOver: true, winner: alivePlayers[0] };
    }

    if (alivePlayers.length === 0) {
        gameState.gameOver = true;
        return { isOver: true, winner: null };
    }

    return { isOver: false, winner: null };
}

export function updatePlayerRanks() {
    const sortedPlayers = [...gameState.players].sort((a, b) => b.cities - a.cities);
    sortedPlayers.forEach((player, index) => {
        const target = gameState.players.find((candidate) => candidate.id === player.id);
        if (target) {
            target.rank = index + 1;
        }
    });
}
