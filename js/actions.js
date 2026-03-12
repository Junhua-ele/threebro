import { gameState } from './gameState.js';
import { addLog, updateTurnInfo, renderPlayersGrid, updateActionOrderPanel, showModal, hideModal } from './ui.js';
import { startSettlementPhase } from './settlement.js';

let currentActionSetup = null;

function getCurrentPlayer() {
    return gameState.players.find((player) => player.id === gameState.currentPlayerIndex);
}

export function showActionModal() {
    if (!gameState.players.length || gameState.phase !== 'decision') {
        return;
    }

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer || currentPlayer.eliminated) {
        moveToNextPlayer();
        return;
    }

    const actionPlayerName = document.getElementById('actionPlayerName');
    if (actionPlayerName) {
        actionPlayerName.textContent = currentPlayer.name;
        actionPlayerName.style.color = currentPlayer.color;
    }

    showModal('actionModal');
}

export function selectAction(actionType) {
    currentActionSetup = {
        type: actionType,
        playerId: gameState.currentPlayerIndex
    };

    hideModal('actionModal');

    if (actionType === 'duel') {
        openDuelSetup();
    }
}

export function adjustStake(delta) {
    const input = document.getElementById('duelStake');
    const currentPlayer = getCurrentPlayer();
    if (!input || !currentPlayer) {
        return;
    }

    const maxStake = Math.min(30, currentPlayer.cities);
    let value = parseInt(input.value, 10) || 1;
    value = Math.max(1, Math.min(maxStake, value + delta));
    input.value = String(value);
}

export function validateStakeInput(input) {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) {
        return;
    }

    input.value = input.value.replace(/[^0-9]/g, '');
    const maxStake = Math.min(30, currentPlayer.cities);
    const value = parseInt(input.value, 10);

    if (Number.isNaN(value)) {
        return;
    }

    input.value = String(Math.max(1, Math.min(maxStake, value)));
}

export function finalizeStake(input) {
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) {
        return;
    }

    const maxStake = Math.min(30, currentPlayer.cities);
    const value = parseInt(input.value, 10);
    input.value = String(Number.isNaN(value) ? 1 : Math.max(1, Math.min(maxStake, value)));
}

export function openDuelSetup() {
    const select = document.getElementById('duelTarget');
    const stakeInput = document.getElementById('duelStake');
    const currentPlayer = getCurrentPlayer();

    if (!select || !stakeInput || !currentPlayer) {
        return;
    }

    select.innerHTML = '';

    const availableTargets = gameState.players.filter((player) => player.id !== currentPlayer.id && !player.eliminated);
    availableTargets.forEach((player) => {
        const option = document.createElement('option');
        option.value = String(player.id);
        option.textContent = `${player.name} (${player.cities}城)`;
        select.appendChild(option);
    });

    if (!availableTargets.length) {
        alert('没有可约战的目标。');
        moveToNextPlayer();
        return;
    }

    stakeInput.value = String(Math.min(10, Math.max(1, currentPlayer.cities)));
    showModal('duelModal');
}

export function closeDuelModal() {
    hideModal('duelModal');
    setTimeout(showActionModal, 100);
}

export function confirmDuel() {
    const targetId = parseInt(document.getElementById('duelTarget')?.value ?? '', 10);
    const stake = parseInt(document.getElementById('duelStake')?.value ?? '', 10);
    const currentPlayer = getCurrentPlayer();

    if (!currentPlayer) {
        return;
    }

    if (Number.isNaN(targetId)) {
        alert('请选择有效的对手。');
        return;
    }

    if (Number.isNaN(stake)) {
        alert('请输入有效的筹码数量。');
        return;
    }

    if (stake < 1 || stake > 30) {
        alert('筹码必须在 1 到 30 之间。');
        return;
    }

    if (stake > currentPlayer.cities) {
        alert(`筹码不能超过当前拥有的城池数。你目前有 ${currentPlayer.cities} 城。`);
        return;
    }

    currentActionSetup = {
        ...currentActionSetup,
        targetId,
        stake,
        status: 'pending'
    };

    hideModal('duelModal');
    submitAction();
}

function submitAction() {
    if (!currentActionSetup) {
        return;
    }

    const player = gameState.players.find((candidate) => candidate.id === currentActionSetup.playerId);
    const target = gameState.players.find((candidate) => candidate.id === currentActionSetup.targetId);

    gameState.pendingActions.push(currentActionSetup);

    if (player && target && currentActionSetup.type === 'duel') {
        addLog(`${player.name} 向 ${target.name} 发起约战，筹码 ${currentActionSetup.stake} 城。`);
    }

    currentActionSetup = null;
    moveToNextPlayer();
}

function moveToNextPlayer() {
    gameState.currentActionIndex += 1;

    while (gameState.currentActionIndex < gameState.actionOrder.length) {
        const nextPlayerId = gameState.actionOrder[gameState.currentActionIndex];
        const nextPlayer = gameState.players.find((player) => player.id === nextPlayerId);

        if (nextPlayer && !nextPlayer.eliminated) {
            gameState.currentPlayerIndex = nextPlayerId;
            updateTurnInfo();
            renderPlayersGrid();
            updateActionOrderPanel();
            setTimeout(showActionModal, 300);
            return;
        }

        gameState.currentActionIndex += 1;
    }

    startSettlementPhase();
}

export function attackPlayer(targetId) {
    const attacker = getCurrentPlayer();
    const defender = gameState.players.find((player) => player.id === targetId);

    if (!attacker || !defender || attacker.id === defender.id || attacker.eliminated || defender.eliminated) {
        return;
    }

    if (attacker.troops < 500) {
        addLog(`${attacker.name} 兵力不足，无法发动进攻。`);
        return;
    }

    const attackForce = Math.floor(attacker.troops * 0.3) + Math.floor(Math.random() * 500);
    const defenseForce = Math.floor(defender.troops * 0.2) + defender.defensePower;
    const attackLoss = Math.floor(Math.random() * attackForce * 0.3);
    const defenseLoss = Math.floor(Math.random() * defenseForce * 0.4);

    attacker.troops = Math.max(0, attacker.troops - attackLoss);
    defender.troops = Math.max(0, defender.troops - defenseLoss);

    let result = '进攻受挫，未能破城。';
    if (attackForce > defenseForce) {
        const citiesConquered = Math.min(defender.cities, Math.floor(Math.random() * 5) + 1);
        defender.cities -= citiesConquered;
        attacker.cities += citiesConquered;
        attacker.resources += Math.floor(defender.resources * 0.1);
        defender.resources = Math.floor(defender.resources * 0.9);
        result = `大胜，夺取 ${citiesConquered} 城。`;

        if (defender.cities <= 0) {
            defender.cities = 0;
            defender.eliminated = true;
            defender.troops = 0;
            result += ` ${defender.name} 已覆灭。`;
        }
    }

    addLog(`${attacker.name} 进攻 ${defender.name}，己方损失 ${attackLoss}，敌方损失 ${defenseLoss}。${result}`);
    updateActionOrderPanel();
    renderPlayersGrid();
}

export function diplomacy(targetId) {
    const player = getCurrentPlayer();
    const target = gameState.players.find((candidate) => candidate.id === targetId);

    if (!player || !target || player.id === target.id || player.eliminated || target.eliminated) {
        return;
    }

    const actions = ['结盟', '进贡', '贸易', '议和'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    if (action === '进贡') {
        const amount = Math.floor(player.resources * 0.1);
        player.resources -= amount;
        target.resources += amount;
        addLog(`${player.name} 向 ${target.name} 进贡 ${amount} 资源。`);
    } else if (action === '贸易') {
        const gain = Math.floor(Math.random() * 500) + 200;
        player.resources += gain;
        target.resources += gain;
        addLog(`${player.name} 与 ${target.name} 进行贸易，双方各得 ${gain} 资源。`);
    } else {
        addLog(`${player.name} 向 ${target.name} 提出${action}请求。`);
    }

    renderPlayersGrid();
}
