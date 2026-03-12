import { gameState, updatePlayerRanks } from './gameState.js';
import { PLAYER_COLORS, RANDOM_NAMES, PLAYER_EMOJIS } from './config.js';

export function renderNameInputs() {
    const container = document.getElementById('nameInputsContainer');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    for (let i = 0; i < gameState.playerCount; i += 1) {
        const group = document.createElement('div');
        group.className = 'name-input-group';

        const color = PLAYER_COLORS[i].hex;
        const emoji = PLAYER_EMOJIS[i];

        group.innerHTML = `
            <div class="player-indicator" style="background: ${color}20; color: ${color}">${emoji}</div>
            <input type="text" class="name-input" id="playerName${i}" placeholder="玩家${i + 1}" value="玩家${i + 1}" maxlength="8">
            <div class="color-dot" style="background: ${color}; color: ${color}"></div>
        `;

        container.appendChild(group);
    }
}

export function getPlayerName(index) {
    const input = document.getElementById(`playerName${index}`);
    const name = input?.value.trim();
    return name || `玩家${index + 1}`;
}

export function generateRandomNames() {
    const usedNames = new Set();

    for (let i = 0; i < gameState.playerCount; i += 1) {
        let name = '';
        let attempts = 0;

        while (!name || usedNames.has(name)) {
            const prefix = RANDOM_NAMES.prefixes[Math.floor(Math.random() * RANDOM_NAMES.prefixes.length)];
            const suffix = RANDOM_NAMES.suffixes[Math.floor(Math.random() * RANDOM_NAMES.suffixes.length)];
            name = `${prefix}${suffix}`;
            attempts += 1;

            if (attempts > 50) {
                name = `玩家${i + 1}`;
                break;
            }
        }

        usedNames.add(name);
        const input = document.getElementById(`playerName${i}`);
        if (input) {
            input.value = name;
        }
    }
}

export function updatePlayerCountDisplay(count) {
    document.getElementById('playerCountDisplay').textContent = String(count);
    document.getElementById('playerCountInfo').textContent = String(count);
    document.getElementById('totalCities').textContent = String(count * 100);
}

export function addLog(message) {
    gameState.eventLogs.push(`<span class="log-time">[第${gameState.currentTurn}回合]</span> ${message}`);
    updateEventLog();
}

export function updateEventLog() {
    const content = document.getElementById('logContent');
    const logContainer = document.getElementById('eventLog');

    if (!content || !logContainer) {
        return;
    }

    content.innerHTML = gameState.eventLogs
        .slice(-10)
        .map((log) => `<div class="log-entry">${log}</div>`)
        .join('');

    logContainer.scrollTop = logContainer.scrollHeight;
}

export function updateTurnInfo() {
    const turnNumber = document.getElementById('turnNumber');
    const currentPlayerEl = document.getElementById('currentPlayer');
    const currentPlayer = gameState.players.find((player) => player.id === gameState.currentPlayerIndex);

    if (turnNumber) {
        turnNumber.textContent = String(gameState.currentTurn);
    }

    if (!currentPlayerEl) {
        return;
    }

    if (!currentPlayer || currentPlayer.eliminated) {
        currentPlayerEl.textContent = '等待结算';
        currentPlayerEl.style.color = '#666';
        return;
    }

    currentPlayerEl.textContent = currentPlayer.name;
    currentPlayerEl.style.color = currentPlayer.color;
}

export function renderPlayersGrid() {
    const container = document.getElementById('playersGrid');
    if (!container) {
        return;
    }

    container.innerHTML = '';
    updatePlayerRanks();

    gameState.players.forEach((player) => {
        const card = document.createElement('div');
        const isActive = player.id === gameState.currentPlayerIndex && gameState.phase === 'decision';

        card.className = `player-card ${isActive ? 'active' : ''} ${player.eliminated ? 'eliminated' : ''}`.trim();
        card.style.setProperty('--player-color', player.color);
        card.style.setProperty('--player-color-rgb', player.colorRgb);

        const troopPercent = Math.min((player.troops / player.maxTroops) * 100, 100);
        const cityPercent = Math.min((player.cities / (gameState.playerCount * 100)) * 100, 100);
        const resourcePercent = Math.min((player.resources / 10000) * 100, 100);
        const totalPower = player.cities * 10 + Math.floor(player.troops / 100) + Math.floor(player.resources / 100);
        const statusText = player.eliminated ? '已覆灭' : (isActive ? '行动中' : '待机');

        card.innerHTML = `
            <div class="card-header">
                <div class="player-identity">
                    <div class="player-avatar">${player.emoji}</div>
                    <div class="player-title">
                        <h3>${player.name}</h3>
                        <span class="rank-badge">${player.title} · 第${player.rank}名</span>
                    </div>
                </div>
                <div class="player-status">
                    <div class="status-text" style="color: ${player.color}">${statusText}</div>
                    <div class="power-rating">战力 ${totalPower.toLocaleString()}</div>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-icon">🏙️</div>
                    <div class="stat-value" style="color: ${player.color}">${player.cities}</div>
                    <div class="stat-label">城池</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">⚔️</div>
                    <div class="stat-value">${player.troops.toLocaleString()}</div>
                    <div class="stat-label">兵力</div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">${player.resources.toLocaleString()}</div>
                    <div class="stat-label">资源</div>
                </div>
            </div>
            <div class="detail-bars">
                <div class="bar-item">
                    <span class="bar-label">兵力</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: ${troopPercent}%; background: linear-gradient(90deg, ${player.color}, rgba(${player.colorRgb}, 0.5))"></div>
                    </div>
                    <span class="bar-value">${Math.round(troopPercent)}%</span>
                </div>
                <div class="bar-item">
                    <span class="bar-label">城池</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: ${cityPercent}%; background: linear-gradient(90deg, ${player.color}, rgba(${player.colorRgb}, 0.5))"></div>
                    </div>
                    <span class="bar-value">${player.cities}</span>
                </div>
                <div class="bar-item">
                    <span class="bar-label">资源</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: ${resourcePercent}%; background: linear-gradient(90deg, ${player.color}, rgba(${player.colorRgb}, 0.5))"></div>
                    </div>
                    <span class="bar-value">${Math.round(resourcePercent)}%</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="card-btn" onclick="viewDetails(${player.id})" ${player.eliminated ? 'disabled' : ''}>详情</button>
                <button class="card-btn" onclick="attackPlayer(${player.id})" ${player.eliminated || player.id === gameState.currentPlayerIndex ? 'disabled' : ''}>进攻</button>
                <button class="card-btn" onclick="diplomacy(${player.id})" ${player.eliminated || player.id === gameState.currentPlayerIndex ? 'disabled' : ''}>外交</button>
            </div>
        `;

        container.appendChild(card);
    });
}

export function updateActionOrderPanel() {
    const container = document.getElementById('orderList');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    gameState.actionOrder.forEach((playerId, index) => {
        const player = gameState.players.find((candidate) => candidate.id === playerId);
        if (!player) {
            return;
        }

        const isActive = index === gameState.currentActionIndex && gameState.phase === 'decision';
        const isCompleted = index < gameState.currentActionIndex;
        const item = document.createElement('div');
        item.className = `order-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`.trim();
        item.innerHTML = `
            <div class="order-num">${index + 1}</div>
            <div class="order-name">${player.name}</div>
            <div class="order-cities">${player.cities}城</div>
        `;
        container.appendChild(item);
    });
}

export function showModal(id) {
    document.getElementById(id)?.classList.add('show');
}

export function hideModal(id) {
    document.getElementById(id)?.classList.remove('show');
}

export function showRankings() {
    const sortedPlayers = [...gameState.players].sort((a, b) => b.cities - a.cities);
    const message = sortedPlayers
        .map((player, index) => {
            const medal = index === 0 ? '🥇' : (index === 1 ? '🥈' : (index === 2 ? '🥉' : '▫️'));
            const status = player.eliminated ? '已灭亡' : '存活';
            return `${medal} ${player.name} | ${status} | ${player.cities}城 | ${player.troops.toLocaleString()}兵`;
        })
        .join('\n');

    alert(`天下排行榜\n\n${message}`);
}

export function showMenu() {
    if (confirm('确定要返回主菜单吗？当前进度会丢失。')) {
        location.reload();
    }
}

export function viewDetails(playerId) {
    const player = gameState.players.find((candidate) => candidate.id === playerId);
    if (!player) {
        return;
    }

    alert(
        `${player.name} - ${player.title}\n\n` +
        `城池: ${player.cities}\n` +
        `兵力: ${player.troops.toLocaleString()} / ${player.maxTroops.toLocaleString()}\n` +
        `资源: ${player.resources.toLocaleString()}\n` +
        `防御: ${player.defensePower}\n` +
        `攻击: ${player.attackPower}\n` +
        `排名: 第${player.rank}名`
    );
}
