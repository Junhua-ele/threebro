import { gameState, initPlayers, calculateActionOrder } from './gameState.js';
import {
    renderNameInputs,
    getPlayerName,
    generateRandomNames,
    updatePlayerCountDisplay,
    addLog,
    updateTurnInfo,
    renderPlayersGrid,
    updateActionOrderPanel,
    updateEventLog,
    showRankings,
    showMenu,
    viewDetails
} from './ui.js';
import {
    showActionModal,
    selectAction,
    adjustStake,
    validateStakeInput,
    finalizeStake,
    closeDuelModal,
    confirmDuel,
    attackPlayer,
    diplomacy
} from './actions.js';
import {
    respondDuel,
    finishSettlementAndNextTurn,
    endTurn,
    setStartNewTurnCallback
} from './settlement.js';

setStartNewTurnCallback(startNewTurn);

function init() {
    renderNameInputs();
    updatePlayerCountDisplay(gameState.playerCount);

    const slider = document.getElementById('playerSlider');
    if (!slider) {
        return;
    }

    slider.addEventListener('input', (event) => {
        const count = parseInt(event.target.value, 10);
        gameState.playerCount = count;
        updatePlayerCountDisplay(count);
        renderNameInputs();
    });
}

function startGame() {
    initPlayers(gameState.playerCount, getPlayerName);
    gameState.currentTurn = 1;
    gameState.currentPlayerIndex = 0;
    gameState.pendingActions = [];
    gameState.currentActionIndex = 0;
    gameState.gameOver = false;
    gameState.eventLogs = [
        `<span class="log-time">[第1回合]</span> 游戏开始，共有 ${gameState.playerCount} 方势力加入争霸。`
    ];

    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';

    startNewTurn();
}

function startNewTurn() {
    gameState.phase = 'decision';
    gameState.settlementComplete = false;
    gameState.pendingActions = [];
    gameState.actionOrder = calculateActionOrder();
    gameState.currentActionIndex = 0;

    const turnPhase = document.getElementById('turnPhase');
    if (turnPhase) {
        turnPhase.textContent = '决策阶段';
    }

    if (gameState.actionOrder.length > 0) {
        gameState.currentPlayerIndex = gameState.actionOrder[0];
    }

    addLog(`第${gameState.currentTurn}回合开始，已根据城池数量决定行动顺序。`);

    const orderNames = gameState.actionOrder
        .map((id) => {
            const player = gameState.players.find((candidate) => candidate.id === id);
            return player ? `${player.name}(${player.cities}城)` : null;
        })
        .filter(Boolean)
        .join(' → ');

    addLog(`行动顺序：${orderNames}`);

    renderPlayersGrid();
    updateTurnInfo();
    updateActionOrderPanel();
    updateEventLog();

    setTimeout(showActionModal, 400);
}

window.startGame = startGame;
window.generateRandomNames = generateRandomNames;
window.selectAction = selectAction;
window.adjustStake = adjustStake;
window.validateStakeInput = validateStakeInput;
window.finalizeStake = finalizeStake;
window.closeDuelModal = closeDuelModal;
window.confirmDuel = confirmDuel;
window.respondDuel = respondDuel;
window.finishSettlementAndNextTurn = finishSettlementAndNextTurn;
window.endTurn = endTurn;
window.showRankings = showRankings;
window.showMenu = showMenu;
window.viewDetails = viewDetails;
window.attackPlayer = attackPlayer;
window.diplomacy = diplomacy;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
