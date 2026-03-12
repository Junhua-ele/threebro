import { gameState, checkEliminatedPlayers, checkGameOver } from './gameState.js';
import { addLog, renderPlayersGrid, updateTurnInfo, showModal, hideModal } from './ui.js';

let startNewTurnFn = null;

export function setStartNewTurnCallback(fn) {
    startNewTurnFn = fn;
}

export function startSettlementPhase() {
    gameState.phase = 'settlement';
    gameState.settlementIndex = 0;
    gameState.settlementComplete = false;

    document.getElementById('turnPhase').textContent = '结算阶段';
    document.getElementById('settlingList').innerHTML = '';
    document.getElementById('settleActions').style.display = 'none';
    document.getElementById('settlingAnim').textContent = '⚔️';
    document.getElementById('settlingAnim').classList.remove('done');
    document.getElementById('settlingTitle').textContent = '正在结算本回合行动...';

    addLog('所有玩家行动完毕，进入结算阶段。');
    showModal('settlingModal');

    setTimeout(processNextSettlement, 800);
}

function processNextSettlement() {
    if (gameState.settlementIndex >= gameState.pendingActions.length) {
        finishSettlementPhase();
        return;
    }

    const action = gameState.pendingActions[gameState.settlementIndex];
    const player = gameState.players.find((candidate) => candidate.id === action.playerId);
    const target = gameState.players.find((candidate) => candidate.id === action.targetId);
    const settlingList = document.getElementById('settlingList');

    if (action.type !== 'duel') {
        gameState.settlementIndex += 1;
        setTimeout(processNextSettlement, 300);
        return;
    }

    if (!player || !target || player.eliminated || target.eliminated) {
        const item = document.createElement('div');
        item.className = 'settle-item';
        item.innerHTML = `⚔️ <b>${player?.name ?? '?'}</b> 对 <b>${target?.name ?? '?'}</b> 的约战取消，一方已灭亡。`;
        settlingList.appendChild(item);
        settlingList.scrollTop = settlingList.scrollHeight;
        gameState.settlementIndex += 1;
        setTimeout(processNextSettlement, 600);
        return;
    }

    hideModal('settlingModal');
    showDuelResponse(action);
}

function showDuelResponse(action) {
    const inviter = gameState.players.find((player) => player.id === action.playerId);
    const responder = gameState.players.find((player) => player.id === action.targetId);

    if (!inviter || !responder) {
        return;
    }

    document.getElementById('inviterName').textContent = inviter.name;
    document.getElementById('inviterName').style.color = inviter.color;
    document.getElementById('responderName').textContent = responder.name;
    document.getElementById('responderName').style.color = responder.color;
    document.getElementById('invitationStake').textContent = String(action.stake);
    document.getElementById('tributeAmount').textContent = String(Math.ceil(action.stake / 2));

    gameState.currentSettlementAction = action;
    showModal('duelResponseModal');
}

export function respondDuel(accepted) {
    const action = gameState.currentSettlementAction;
    if (!action) {
        return;
    }

    const player = gameState.players.find((candidate) => candidate.id === action.playerId);
    const target = gameState.players.find((candidate) => candidate.id === action.targetId);
    if (!player || !target) {
        return;
    }

    hideModal('duelResponseModal');
    showModal('settlingModal');

    const settlingList = document.getElementById('settlingList');
    const item = document.createElement('div');
    item.className = 'settle-item';

    if (accepted) {
        const challengerPower = player.troops + Math.random() * 1000 + player.attackPower * 5;
        const defenderPower = target.troops + Math.random() * 1000 + target.defensePower * 5;
        const winner = challengerPower >= defenderPower ? player : target;
        const loser = winner.id === player.id ? target : player;
        const transfer = Math.min(action.stake, loser.cities);

        loser.cities -= transfer;
        winner.cities += transfer;

        item.innerHTML = `⚔️ <b>${player.name}</b> 与 <b>${target.name}</b> 决斗，<b style="color:${winner.color}">${winner.name}</b> 获胜，夺得 ${transfer} 城。`;

        if (loser.cities <= 0) {
            loser.cities = 0;
            loser.eliminated = true;
            loser.troops = 0;
            item.innerHTML += ` <b style="color:#e94560">${loser.name}</b> 已覆灭。`;
        }
    } else {
        const tribute = Math.min(Math.ceil(action.stake / 2), target.cities);
        target.cities -= tribute;
        player.cities += tribute;

        item.innerHTML = `🛡️ <b>${target.name}</b> 拒绝决斗，向 <b>${player.name}</b> 进贡 ${tribute} 城。`;

        if (target.cities <= 0) {
            target.cities = 0;
            target.eliminated = true;
            target.troops = 0;
            item.innerHTML += ` <b style="color:#e94560">${target.name}</b> 已覆灭。`;
        }
    }

    settlingList.appendChild(item);
    settlingList.scrollTop = settlingList.scrollHeight;

    gameState.currentSettlementAction = null;
    renderPlayersGrid();
    updateTurnInfo();

    gameState.settlementIndex += 1;
    setTimeout(processNextSettlement, 1200);
}

function finishSettlementPhase() {
    const settlingList = document.getElementById('settlingList');
    const finishItem = document.createElement('div');
    finishItem.className = 'settle-item';
    finishItem.innerHTML = '<span style="color:#10b981; font-weight:bold;">本回合结算完毕，准备进入下一回合。</span>';

    settlingList.appendChild(finishItem);
    settlingList.scrollTop = settlingList.scrollHeight;

    document.getElementById('settlingAnim').textContent = '✅';
    document.getElementById('settlingAnim').classList.add('done');
    document.getElementById('settlingTitle').textContent = '本回合结算完成';
    document.getElementById('settleActions').style.display = 'block';

    gameState.settlementComplete = true;
}

export function finishSettlementAndNextTurn() {
    hideModal('settlingModal');
    document.getElementById('settleActions').style.display = 'none';

    gameState.pendingActions = [];
    gameState.currentSettlementAction = null;
    gameState.settlementIndex = 0;
    gameState.settlementComplete = false;

    checkEliminatedPlayers();
    const gameOverResult = checkGameOver();

    if (gameOverResult.isOver) {
        if (gameOverResult.winner) {
            addLog(`${gameOverResult.winner.name} 统一天下，游戏结束。`);
            setTimeout(() => {
                alert(
                    `恭喜 ${gameOverResult.winner.name} 获得最终胜利。\n\n` +
                    `回合: 第${gameState.currentTurn}回合\n` +
                    `城池: ${gameOverResult.winner.cities}\n` +
                    `兵力: ${gameOverResult.winner.troops.toLocaleString()}\n` +
                    `资源: ${gameOverResult.winner.resources.toLocaleString()}`
                );
            }, 500);
        } else {
            addLog('所有势力都已灭亡，天下无主。');
        }
        return;
    }

    gameState.currentTurn += 1;
    startNewTurn();
}

export function endTurn() {
    if (gameState.phase === 'decision') {
        alert('请先完成本回合所有玩家的行动选择。');
        return;
    }

    if (!gameState.settlementComplete) {
        alert('结算尚未完成，请等待当前结算结束。');
        return;
    }

    finishSettlementAndNextTurn();
}

function startNewTurn() {
    if (typeof startNewTurnFn === 'function') {
        startNewTurnFn();
    }
}
