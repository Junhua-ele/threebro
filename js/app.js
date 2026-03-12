(function () {
    const PLAYER_COLORS = [
        { hex: '#b14d2f', rgb: '177, 77, 47' },
        { hex: '#2f5f8a', rgb: '47, 95, 138' },
        { hex: '#4f6f3d', rgb: '79, 111, 61' },
        { hex: '#9a6b2f', rgb: '154, 107, 47' },
        { hex: '#6d4c8f', rgb: '109, 76, 143' },
        { hex: '#8a3f5f', rgb: '138, 63, 95' },
        { hex: '#2d7b7b', rgb: '45, 123, 123' },
        { hex: '#7d6c2d', rgb: '125, 108, 45' },
        { hex: '#a2512b', rgb: '162, 81, 43' },
        { hex: '#445a9c', rgb: '68, 90, 156' }
    ];
    const TITLES = ['诸侯', '霸主', '帝王', '雄主', '英杰', '枭雄', '王者', '传奇', '神话', '至尊'];
    const PLAYER_EMOJIS = ['🦊', '⚔️', '🛡️', '🏹', '🐉', '♟️', '🔥', '🌊', '🦅', '👑'];
    const RANDOM_NAMES = {
        prefixes: ['苍', '烈', '玄', '白', '赤', '青', '寒', '龙', '天', '夜', '流', '星', '北', '南', '东', '西', '云', '霜', '雷', '风'],
        suffixes: ['羽', '川', '岳', '锋', '影', '辰', '岚', '歌', '霆', '泽', '珩', '昭', '烬', '陵', '策', '渊', '衡', '澜', '铠', '墨']
    };

    const CARD_DEFINITIONS = {
        scout: { name: '打草惊蛇', timing: 'action', description: '查看一名比你先行动且已提交行动的玩家。' },
        lure: { name: '调虎离山', timing: 'action', description: '结算结束时从目标处掠夺 10 座城池。' },
        feint: { name: '欲擒故纵', timing: 'action', description: '本回合若你约战失败，则不失城并额外获得与筹码相同的城池。' },
        exchange: { name: '抛砖引玉', timing: 'action', description: '弃掉另一张锦囊，立即获得 35 座城池。' },
        rescue: { name: '釜底抽薪', timing: 'passive', description: '一回合内损失至少 20 座城池时，自动获得 30 座城池。' },
        siphon: { name: '浑水摸鱼', timing: 'action', description: '截取本回合其他玩家首次成功获得收益的一半。' },
        porcelain_capture: { name: '瓮中捉鳖', timing: 'pending', description: '待实现' },
        switch_beams: { name: '偷梁换柱', timing: 'pending', description: '待实现' },
        hail_of_bullets: { name: '枪林弹雨', timing: 'pending', description: '待实现' },
        debt_inherit: { name: '父债子偿', timing: 'pending', description: '待实现' },
        divert_water: { name: '祸水东引', timing: 'pending', description: '待实现' },
        mutual_destruction: { name: '玉石俱焚', timing: 'pending', description: '待实现' },
        recuperate: { name: '休养生息', timing: 'pending', description: '待实现' },
        grass_troops: { name: '落草为寇', timing: 'pending', description: '待实现' },
        mutual_support: { name: '肝胆相照', timing: 'pending', description: '待实现' },
        perish_together: { name: '不共戴天', timing: 'pending', description: '待实现' },
        equality: { name: '众生平等', timing: 'pending', description: '待实现' },
        one_stone_two_birds: { name: '一石二鸟', timing: 'pending', description: '待实现' },
        cross_sea: { name: '瞒天过海', timing: 'pending', description: '待实现' },
        watch_fire: { name: '隔岸观火', timing: 'pending', description: '待实现' },
        borrow_knife: { name: '借刀杀人', timing: 'pending', description: '待实现' },
        wait_exhausted: { name: '以逸待劳', timing: 'pending', description: '待实现' },
        loot_fire: { name: '趁火打劫', timing: 'pending', description: '待实现' },
        hongmen_banquet: { name: '鸿门宴', timing: 'pending', description: '待实现' },
        cicada_escape: { name: '金蝉脱壳', timing: 'pending', description: '待实现' },
        persevere: { name: '再接再厉', timing: 'pending', description: '待实现' },
        something_from_nothing: { name: '无中生有', timing: 'pending', description: '待实现' },
        sneak_chencang: { name: '暗度陈仓', timing: 'pending', description: '待实现' },
        dagger_in_smile: { name: '笑里藏刀', timing: 'pending', description: '待实现' },
        dull_as_chicken: { name: '呆若木鸡', timing: 'pending', description: '待实现' },
        solid_defense: { name: '固若金汤', timing: 'pending', description: '待实现' },
        win_without_fight: { name: '不战而胜', timing: 'pending', description: '待实现' },
        disguise: { name: '张冠李戴', timing: 'pending', description: '待实现' },
        sow_discord: { name: '反间计', timing: 'pending', description: '待实现' },
        chain_scheme: { name: '连环计', timing: 'pending', description: '待实现' },
        self_injury: { name: '苦肉计', timing: 'pending', description: '待实现' },
        besiege_wei: { name: '走为上计', timing: 'pending', description: '待实现' },
        burn_camp: { name: '火烧连营', timing: 'pending', description: '待实现' },
        dog_jump_wall: { name: '狗急跳墙', timing: 'pending', description: '待实现' },
        miscommunication: { name: '话不投机', timing: 'pending', description: '待实现' },
        pursue_victory: { name: '乘胜追击', timing: 'pending', description: '待实现' },
        three_men_tiger: { name: '三人成虎', timing: 'pending', description: '待实现' },
        guest_to_host: { name: '反客为主', timing: 'pending', description: '待实现' },
        burn_bridge: { name: '过河拆桥', timing: 'pending', description: '待实现' },
        beauty_scheme: { name: '美人计', timing: 'pending', description: '待实现' },
        empty_city: { name: '空城计', timing: 'pending', description: '待实现' },
        mend_pen: { name: '亡羊补牢', timing: 'pending', description: '待实现' },
        draw_ground_prison: { name: '画地为牢', timing: 'pending', description: '待实现' },
        overreact: { name: '小题大做', timing: 'pending', description: '待实现' }
    };

    const gameState = {
        playerCount: 2,
        currentTurn: 1,
        currentPlayerIndex: 0,
        currentActionIndex: 0,
        actionOrder: [],
        phase: 'decision',
        settlementComplete: false,
        settlementIndex: 0,
        currentSettlementAction: null,
        pendingActions: [],
        players: [],
        eventLogs: [],
        gameOver: false
    };

    let currentActionSetup = null;
    let hostAdjustmentSnapshot = null;

    function byId(id) { return document.getElementById(id); }
    function showModal(id) { byId(id)?.classList.add('show'); }
    function hideModal(id) { byId(id)?.classList.remove('show'); }
    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    function parseNonNegativeInt(value, fallback = 0) {
        const parsed = Number.parseInt(String(value ?? '').trim(), 10);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
    }
    function formatNumber(value) { return Number(value || 0).toLocaleString(); }
    function getCurrentPlayer() { return gameState.players.find((player) => player.id === gameState.currentPlayerIndex) || null; }
    function getPlayerById(id) { return gameState.players.find((player) => player.id === id) || null; }
    function getCardName(cardId) { return CARD_DEFINITIONS[cardId]?.name || cardId; }

    function addLog(message) {
        gameState.eventLogs.push(`<span class="log-time">[第 ${gameState.currentTurn} 回合]</span> ${message}`);
        updateEventLog();
    }

    function initPlayers(count, getPlayerNameFn) {
        gameState.players = [];
        for (let i = 0; i < count; i += 1) {
            gameState.players.push({
                id: i,
                name: getPlayerNameFn(i),
                title: TITLES[Math.min(i, TITLES.length - 1)],
                color: PLAYER_COLORS[i].hex,
                colorRgb: PLAYER_COLORS[i].rgb,
                emoji: PLAYER_EMOJIS[i],
                cities: 100,
                troops: 5000,
                maxTroops: 5000,
                resources: 5000,
                defensePower: 100,
                attackPower: 100,
                eliminated: false,
                rank: i + 1,
                cards: [],
                effects: [],
                turnCityLoss: 0,
                turnDevelopRoll: null
            });
        }
    }

    function updatePlayerRanks() {
        [...gameState.players]
            .sort((a, b) => b.cities - a.cities || b.resources - a.resources || b.troops - a.troops)
            .forEach((player, index) => {
                const target = getPlayerById(player.id);
                if (target) target.rank = index + 1;
            });
    }

    function checkEliminatedPlayers() {
        gameState.players.forEach((player) => {
            if (player.cities <= 0) {
                player.cities = 0;
                player.troops = 0;
                player.eliminated = true;
            }
        });
    }

    function checkGameOver() {
        checkEliminatedPlayers();
        const alive = gameState.players.filter((player) => !player.eliminated);
        if (alive.length === 1) return { isOver: true, winner: alive[0] };
        if (alive.length === 0) return { isOver: true, winner: null };
        return { isOver: false, winner: null };
    }

    function calculateActionOrder() {
        return gameState.players
            .filter((player) => !player.eliminated)
            .map((player) => ({ player, tieBreaker: Math.random() }))
            .sort((a, b) => b.player.cities - a.player.cities || a.tieBreaker - b.tieBreaker)
            .map((entry) => entry.player.id);
    }

    function updateEventLog() {
        const content = byId('logContent');
        const container = byId('eventLog');
        if (!content || !container) return;
        content.innerHTML = gameState.eventLogs.slice(-12).map((log) => `<div class="log-entry">${log}</div>`).join('');
        container.scrollTop = container.scrollHeight;
    }

    function updateTurnInfo() {
        if (byId('turnNumber')) byId('turnNumber').textContent = String(gameState.currentTurn);
        const currentPlayerEl = byId('currentPlayer');
        const phaseEl = byId('turnPhase');
        if (!currentPlayerEl) return;

        if (gameState.phase === 'settlement') {
            currentPlayerEl.textContent = '结算中';
            currentPlayerEl.style.color = '#9f6d2c';
            if (phaseEl) phaseEl.textContent = gameState.settlementComplete ? '等待下一回合' : '结算阶段';
            return;
        }

        const player = getCurrentPlayer();
        if (!player) {
            currentPlayerEl.textContent = '等待行动';
            currentPlayerEl.style.color = '#6a5440';
        } else {
            currentPlayerEl.textContent = player.name;
            currentPlayerEl.style.color = player.color;
        }
        if (phaseEl) phaseEl.textContent = '行动阶段';
    }

    function updatePlayerCountDisplay(count) {
        if (byId('playerCountDisplay')) byId('playerCountDisplay').textContent = String(count);
        if (byId('playerCountInfo')) byId('playerCountInfo').textContent = String(count);
        if (byId('totalCities')) byId('totalCities').textContent = String(count * 100);
    }

    function renderNameInputs() {
        const container = byId('nameInputsContainer');
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < gameState.playerCount; i += 1) {
            const color = PLAYER_COLORS[i].hex;
            const group = document.createElement('div');
            group.className = 'name-input-group';
            group.innerHTML = `
                <div class="player-indicator" style="background:${color}20;color:${color}">${PLAYER_EMOJIS[i]}</div>
                <input type="text" class="name-input" id="playerName${i}" placeholder="玩家${i + 1}" value="玩家${i + 1}" maxlength="8">
                <div class="color-dot" style="background:${color};color:${color}"></div>
            `;
            container.appendChild(group);
        }
    }

    function getPlayerName(index) {
        const input = byId(`playerName${index}`);
        return input && input.value.trim() ? input.value.trim() : `玩家${index + 1}`;
    }

    function generateRandomNames() {
        const used = new Set();
        for (let i = 0; i < gameState.playerCount; i += 1) {
            let name = '';
            while (!name || used.has(name)) {
                name = `${RANDOM_NAMES.prefixes[randomInt(0, RANDOM_NAMES.prefixes.length - 1)]}${RANDOM_NAMES.suffixes[randomInt(0, RANDOM_NAMES.suffixes.length - 1)]}`;
            }
            used.add(name);
            if (byId(`playerName${i}`)) byId(`playerName${i}`).value = name;
        }
    }

    function renderPlayersGrid() {
        const container = byId('playersGrid');
        if (!container) return;
        updatePlayerRanks();
        container.innerHTML = '';

        gameState.players.forEach((player) => {
            const isActive = gameState.phase === 'decision' && player.id === gameState.currentPlayerIndex;
            const troopPercent = player.maxTroops > 0 ? Math.min((player.troops / player.maxTroops) * 100, 100) : 0;
            const cityPercent = Math.min((player.cities / (gameState.playerCount * 100)) * 100, 100);
            const resourcePercent = Math.min((player.resources / 10000) * 100, 100);
            const totalPower = player.cities * 10 + Math.floor(player.troops / 100) + Math.floor(player.resources / 100);
            const statusText = player.eliminated ? '已淘汰' : (isActive ? '行动中' : '待命');
            const cardsText = player.cards.length ? `锦囊 ${player.cards.length}` : '无锦囊';

            const card = document.createElement('div');
            card.className = `player-card ${isActive ? 'active' : ''} ${player.eliminated ? 'eliminated' : ''}`.trim();
            card.style.setProperty('--player-color', player.color);
            card.style.setProperty('--player-color-rgb', player.colorRgb);
            card.innerHTML = `
                <div class="card-header">
                    <div class="player-identity">
                        <div class="player-avatar">${player.emoji}</div>
                        <div class="player-title">
                            <h3>${escapeHtml(player.name)}</h3>
                            <span class="rank-badge">${escapeHtml(player.title)} · 第 ${player.rank} 名 · ${cardsText}</span>
                        </div>
                    </div>
                    <div class="player-status">
                        <div class="status-text" style="color:${player.color}">${statusText}</div>
                        <div class="power-rating">战力 ${formatNumber(totalPower)}</div>
                    </div>
                </div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-icon">🏯</div>
                        <div class="stat-value" style="color:${player.color}">${player.cities}</div>
                        <div class="stat-label">城池</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-icon">⚔️</div>
                        <div class="stat-value">${formatNumber(player.troops)}</div>
                        <div class="stat-label">兵力</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-icon">📦</div>
                        <div class="stat-value">${formatNumber(player.resources)}</div>
                        <div class="stat-label">资源</div>
                    </div>
                </div>
                <div class="detail-bars">
                    <div class="bar-item">
                        <span class="bar-label">兵力</span>
                        <div class="bar-track"><div class="bar-fill" style="width:${troopPercent}%; background: linear-gradient(90deg, ${player.color}, rgba(${player.colorRgb}, 0.45));"></div></div>
                        <span class="bar-value">${Math.round(troopPercent)}%</span>
                    </div>
                    <div class="bar-item">
                        <span class="bar-label">城池</span>
                        <div class="bar-track"><div class="bar-fill" style="width:${cityPercent}%; background: linear-gradient(90deg, ${player.color}, rgba(${player.colorRgb}, 0.45));"></div></div>
                        <span class="bar-value">${player.cities}</span>
                    </div>
                    <div class="bar-item">
                        <span class="bar-label">资源</span>
                        <div class="bar-track"><div class="bar-fill" style="width:${resourcePercent}%; background: linear-gradient(90deg, ${player.color}, rgba(${player.colorRgb}, 0.45));"></div></div>
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

    function updateActionOrderPanel() {
        const container = byId('orderList');
        if (!container) return;
        container.innerHTML = '';
        gameState.actionOrder.forEach((playerId, index) => {
            const player = getPlayerById(playerId);
            if (!player) return;
            const isActive = gameState.phase === 'decision' && index === gameState.currentActionIndex;
            const isCompleted = index < gameState.currentActionIndex || gameState.phase === 'settlement';
            const item = document.createElement('div');
            item.className = `order-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`.trim();
            item.innerHTML = `
                <div class="order-num">${index + 1}</div>
                <div class="order-name">${escapeHtml(player.name)}</div>
                <div class="order-cities">${player.cities} 城</div>
            `;
            container.appendChild(item);
        });
    }

    function refreshView() {
        renderPlayersGrid();
        updateTurnInfo();
        updateActionOrderPanel();
        updateEventLog();
        renderHostAdjustments();
    }

    function clonePlayersForHostAdjustments() {
        return gameState.players.map((player) => ({
            id: player.id,
            name: player.name,
            title: player.title,
            cities: player.cities,
            troops: player.troops,
            maxTroops: player.maxTroops,
            resources: player.resources,
            attackPower: player.attackPower,
            defensePower: player.defensePower,
            eliminated: player.eliminated,
            cards: [...player.cards]
        }));
    }

    function getCardIdByToken(token) {
        const normalized = String(token || '').trim();
        if (!normalized) return null;
        if (CARD_DEFINITIONS[normalized]) return normalized;
        return Object.keys(CARD_DEFINITIONS).find((cardId) => CARD_DEFINITIONS[cardId].name === normalized) || null;
    }

    function renderHostAdjustments() {
        const panel = byId('hostAdjustPanel');
        const grid = byId('hostAdjustGrid');
        if (!panel || !grid) return;

        if (gameState.phase !== 'settlement' || !gameState.settlementComplete) {
            panel.style.display = 'none';
            grid.innerHTML = '';
            return;
        }

        panel.style.display = 'block';
        grid.innerHTML = gameState.players.map((player) => `
            <div class="host-adjust-card">
                <h5 style="color:${player.color}">${escapeHtml(player.name)}</h5>
                <div class="host-adjust-fields">
                    <div class="host-field">
                        <label>名称</label>
                        <input id="host-name-${player.id}" type="text" value="${escapeHtml(player.name)}" maxlength="12">
                    </div>
                    <div class="host-field">
                        <label>称号</label>
                        <input id="host-title-${player.id}" type="text" value="${escapeHtml(player.title)}" maxlength="12">
                    </div>
                    <div class="host-field">
                        <label>城池</label>
                        <input id="host-cities-${player.id}" type="number" min="0" value="${player.cities}">
                    </div>
                    <div class="host-field">
                        <label>兵力</label>
                        <input id="host-troops-${player.id}" type="number" min="0" value="${player.troops}">
                    </div>
                    <div class="host-field">
                        <label>兵力上限</label>
                        <input id="host-maxTroops-${player.id}" type="number" min="0" value="${player.maxTroops}">
                    </div>
                    <div class="host-field">
                        <label>资源</label>
                        <input id="host-resources-${player.id}" type="number" min="0" value="${player.resources}">
                    </div>
                    <div class="host-field">
                        <label>攻击</label>
                        <input id="host-attack-${player.id}" type="number" min="0" value="${player.attackPower}">
                    </div>
                    <div class="host-field">
                        <label>防御</label>
                        <input id="host-defense-${player.id}" type="number" min="0" value="${player.defensePower}">
                    </div>
                    <div class="host-field span-2">
                        <label>锦囊（输入卡牌 id 或卡名，逗号分隔）</label>
                        <textarea id="host-cards-${player.id}">${escapeHtml(player.cards.join(', '))}</textarea>
                    </div>
                    <label class="host-field host-checkbox span-2">
                        <input id="host-eliminated-${player.id}" type="checkbox" ${player.eliminated ? 'checked' : ''}>
                        <span>标记为已淘汰</span>
                    </label>
                </div>
            </div>
        `).join('');
    }

    function applyHostAdjustments() {
        if (gameState.phase !== 'settlement' || !gameState.settlementComplete) return;
        const unknownCards = [];

        gameState.players.forEach((player) => {
            const nextName = byId(`host-name-${player.id}`)?.value.trim() || player.name;
            const nextTitle = byId(`host-title-${player.id}`)?.value.trim() || player.title;
            const nextCities = parseNonNegativeInt(byId(`host-cities-${player.id}`)?.value, player.cities);
            const nextTroops = parseNonNegativeInt(byId(`host-troops-${player.id}`)?.value, player.troops);
            const nextMaxTroops = parseNonNegativeInt(byId(`host-maxTroops-${player.id}`)?.value, player.maxTroops);
            const nextResources = parseNonNegativeInt(byId(`host-resources-${player.id}`)?.value, player.resources);
            const nextAttack = parseNonNegativeInt(byId(`host-attack-${player.id}`)?.value, player.attackPower);
            const nextDefense = parseNonNegativeInt(byId(`host-defense-${player.id}`)?.value, player.defensePower);
            const nextEliminated = Boolean(byId(`host-eliminated-${player.id}`)?.checked);
            const tokens = String(byId(`host-cards-${player.id}`)?.value || '')
                .split(/[\n,，、]+/)
                .map((token) => token.trim())
                .filter(Boolean);

            const cards = [];
            tokens.forEach((token) => {
                const cardId = getCardIdByToken(token);
                if (cardId) cards.push(cardId);
                else unknownCards.push(`${player.name}: ${token}`);
            });

            player.name = nextName;
            player.title = nextTitle;
            player.cities = nextCities;
            player.troops = nextTroops;
            player.maxTroops = Math.max(nextTroops, nextMaxTroops);
            player.resources = nextResources;
            player.attackPower = nextAttack;
            player.defensePower = nextDefense;
            player.cards = cards;
            player.eliminated = nextEliminated;
        });

        checkEliminatedPlayers();
        addLog('主持人在结算后手动修正了玩家数据。');
        refreshView();

        if (unknownCards.length) {
            alert(`以下锦囊未识别，已跳过：\n${unknownCards.join('\n')}`);
        } else {
            alert('主持人修改已保存。');
        }
    }

    function resetHostAdjustments() {
        if (!hostAdjustmentSnapshot) return;
        gameState.players = hostAdjustmentSnapshot.map((player, index) => ({
            ...gameState.players[index],
            ...player,
            cards: [...player.cards]
        }));
        refreshView();
    }

    function drawRandomCard() {
        const ids = Object.keys(CARD_DEFINITIONS);
        return ids[randomInt(0, ids.length - 1)];
    }

    function addCardToPlayer(player, cardId) {
        player.cards.push(cardId);
        addLog(`${player.name} 获得锦囊【${getCardName(cardId)}】。`);
    }

    function removeCardFromPlayer(player, cardId) {
        const index = player.cards.indexOf(cardId);
        if (index >= 0) player.cards.splice(index, 1);
    }

    function hasEffect(player, type) {
        return player.effects.find((effect) => effect.type === type);
    }

    function removeEffect(player, type) {
        player.effects = player.effects.filter((effect) => effect.type !== type);
    }

    function triggerSiphon(winner, gain) {
        if (!winner || gain <= 0) return;
        gameState.players.forEach((player) => {
            if (player.id === winner.id || player.eliminated) return;
            const effect = player.effects.find((item) => item.type === 'siphon_next_success');
            if (!effect) return;
            const siphonAmount = Math.floor(gain / 2);
            if (siphonAmount <= 0) return;
            winner.cities = Math.max(0, winner.cities - siphonAmount);
            player.cities += siphonAmount;
            addLog(`${player.name} 触发锦囊【浑水摸鱼】，从 ${winner.name} 截取 ${siphonAmount} 座城池收益。`);
            removeEffect(player, 'siphon_next_success');
        });
    }

    function checkPassiveCards(player) {
        if (player.turnCityLoss >= 20 && player.cards.includes('rescue')) {
            removeCardFromPlayer(player, 'rescue');
            player.turnCityLoss = 0;
            player.cities += 30;
            addLog(`${player.name} 触发锦囊【釜底抽薪】，额外获得 30 座城池。`);
        }
    }

    function grantCities(player, amount, reason) {
        if (!player || amount <= 0) return 0;
        player.cities += amount;
        if (reason) addLog(`${reason}，${player.name} 获得 ${amount} 座城池。`);
        triggerSiphon(player, amount);
        return amount;
    }

    function transferCities(fromPlayer, toPlayer, amount, reason) {
        if (!fromPlayer || !toPlayer || amount <= 0) return 0;
        const actual = Math.min(amount, fromPlayer.cities);
        fromPlayer.cities -= actual;
        toPlayer.cities += actual;
        fromPlayer.turnCityLoss += actual;
        checkPassiveCards(fromPlayer);
        if (reason) addLog(reason.replace('{amount}', String(actual)));
        triggerSiphon(toPlayer, actual);
        return actual;
    }

    function showRankings() {
        updatePlayerRanks();
        const message = [...gameState.players]
            .sort((a, b) => a.rank - b.rank)
            .map((player, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '▪';
                return `${medal} ${player.name} | ${player.eliminated ? '已淘汰' : '存活'} | ${player.cities} 城 | ${formatNumber(player.troops)} 兵`;
            })
            .join('\n');
        alert(`天下排行榜\n\n${message}`);
    }

    function showMenu() {
        if (confirm('确定要返回主菜单吗？当前进度会丢失。')) location.reload();
    }

    function viewDetails(playerId) {
        const player = getPlayerById(playerId);
        if (!player) return;
        const cards = player.cards.length ? player.cards.map(getCardName).join('、') : '无';
        alert(
            `${player.name} - ${player.title}\n\n` +
            `城池：${player.cities}\n` +
            `兵力：${formatNumber(player.troops)} / ${formatNumber(player.maxTroops)}\n` +
            `资源：${formatNumber(player.resources)}\n` +
            `攻击：${player.attackPower}\n` +
            `防御：${player.defensePower}\n` +
            `锦囊：${cards}\n` +
            `排名：第 ${player.rank} 名`
        );
    }

    function attackPlayer(targetId) {
        const attacker = getCurrentPlayer();
        const defender = getPlayerById(targetId);
        if (!attacker || !defender || attacker.id === defender.id || attacker.eliminated || defender.eliminated) return;
        if (attacker.troops < 500) {
            addLog(`${attacker.name} 兵力不足，无法发动进攻。`);
            return;
        }

        const attackForce = Math.floor(attacker.troops * 0.3) + randomInt(0, 500) + attacker.attackPower * 2;
        const defenseForce = Math.floor(defender.troops * 0.2) + defender.defensePower * 4;
        const attackLoss = Math.floor(Math.random() * attackForce * 0.3);
        const defenseLoss = Math.floor(Math.random() * defenseForce * 0.4);

        attacker.troops = Math.max(0, attacker.troops - attackLoss);
        defender.troops = Math.max(0, defender.troops - defenseLoss);

        let result = '进攻受挫，未能破城。';
        if (attackForce > defenseForce) {
            const transfer = Math.min(defender.cities, randomInt(1, 5));
            defender.cities -= transfer;
            attacker.cities += transfer;
            attacker.resources += Math.floor(defender.resources * 0.1);
            defender.resources = Math.floor(defender.resources * 0.9);
            result = `大胜，夺取 ${transfer} 座城池。`;
        }

        checkEliminatedPlayers();
        addLog(`${attacker.name} 进攻 ${defender.name}，己方损失 ${attackLoss}，敌方损失 ${defenseLoss}。${result}`);
        refreshView();
    }

    function diplomacy(targetId) {
        const player = getCurrentPlayer();
        const target = getPlayerById(targetId);
        if (!player || !target || player.id === target.id || player.eliminated || target.eliminated) return;

        const actions = ['结盟', '进贡', '贸易', '议和'];
        const action = actions[randomInt(0, actions.length - 1)];
        if (action === '进贡') {
            const amount = Math.floor(player.resources * 0.1);
            player.resources -= amount;
            target.resources += amount;
            addLog(`${player.name} 向 ${target.name} 进贡 ${amount} 资源。`);
        } else if (action === '贸易') {
            const gain = randomInt(200, 700);
            player.resources += gain;
            target.resources += gain;
            addLog(`${player.name} 与 ${target.name} 进行贸易，双方各获得 ${gain} 资源。`);
        } else {
            addLog(`${player.name} 向 ${target.name} 提出${action}请求。`);
        }
        refreshView();
    }

    function populateTargetSelect(selectId, currentPlayerId) {
        const select = byId(selectId);
        if (!select) return [];
        select.innerHTML = '';
        const targets = gameState.players.filter((player) => player.id !== currentPlayerId && !player.eliminated);
        targets.forEach((player) => {
            const option = document.createElement('option');
            option.value = String(player.id);
            option.textContent = `${player.name} (${player.cities} 城)`;
            select.appendChild(option);
        });
        return targets;
    }

    function describeAction(action) {
        const target = getPlayerById(action.targetId);
        if (action.type === 'duel') return `约战 ${target ? target.name : '未知目标'}（${action.stake} 城）`;
        if (action.type === 'raid') return `奇袭 ${target ? target.name : '未知目标'}`;
        if (action.type === 'defend') return `守城防备 ${target ? target.name : '未知目标'}`;
        if (action.type === 'develop') return '发育';
        return action.type;
    }

    function showActionModal() {
        if (gameState.phase !== 'decision') return;
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || currentPlayer.eliminated) {
            moveToNextPlayer();
            return;
        }
        const nameEl = byId('actionPlayerName');
        if (nameEl) {
            nameEl.textContent = `${currentPlayer.name} · 锦囊 ${currentPlayer.cards.length} 张`;
            nameEl.style.color = currentPlayer.color;
        }
        showModal('actionModal');
    }

    function chooseTargetPrompt(currentPlayer, promptTitle, predicate) {
        const targets = gameState.players.filter((player) => player.id !== currentPlayer.id && !player.eliminated && (!predicate || predicate(player)));
        if (!targets.length) {
            alert('没有可选择的目标。');
            return null;
        }
        const text = targets.map((player, index) => `${index + 1}. ${player.name} (${player.cities} 城)`).join('\n');
        const picked = Number.parseInt(prompt(`${promptTitle}\n${text}`, '1'), 10);
        if (Number.isNaN(picked) || picked < 1 || picked > targets.length) return null;
        return targets[picked - 1];
    }

    function revealEarlierAction(currentPlayer) {
        const earlierIds = gameState.actionOrder.slice(0, gameState.currentActionIndex);
        const available = gameState.pendingActions
            .filter((action) => earlierIds.includes(action.playerId))
            .map((action) => ({ action, player: getPlayerById(action.playerId) }))
            .filter((item) => item.player);

        if (!available.length) {
            alert('当前没有比你先行动且已提交行动的玩家。');
            return false;
        }

        const text = available.map((item, index) => `${index + 1}. ${item.player.name}`).join('\n');
        const picked = Number.parseInt(prompt(`选择要查看行动的玩家：\n${text}`, '1'), 10);
        if (Number.isNaN(picked) || picked < 1 || picked > available.length) return false;

        const chosen = available[picked - 1];
        alert(`【打草惊蛇】侦查结果：${chosen.player.name} 本回合选择了 ${describeAction(chosen.action)}。`);
        return true;
    }

    function useStrategyFromAction() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer || !currentPlayer.cards.length) {
            alert('当前没有可使用的锦囊。');
            return;
        }

        const options = currentPlayer.cards
            .map((cardId, index) => `${index + 1}. ${getCardName(cardId)} - ${CARD_DEFINITIONS[cardId].description}`)
            .join('\n');
        const picked = Number.parseInt(prompt(`选择要使用的锦囊：\n${options}`, '1'), 10);
        if (Number.isNaN(picked) || picked < 1 || picked > currentPlayer.cards.length) return;

        const cardId = currentPlayer.cards[picked - 1];
        let consumed = false;

        if (cardId === 'scout') {
            consumed = revealEarlierAction(currentPlayer);
        } else if (cardId === 'lure') {
            const target = chooseTargetPrompt(currentPlayer, '选择【调虎离山】的目标');
            if (target) {
                currentPlayer.effects.push({ type: 'lure_end_turn', targetId: target.id, amount: 10 });
                addLog(`${currentPlayer.name} 使用锦囊【调虎离山】，准备在回合结算后掠夺 ${target.name} 10 座城池。`);
                consumed = true;
            }
        } else if (cardId === 'feint') {
            currentPlayer.effects.push({ type: 'duel_fail_safe' });
            addLog(`${currentPlayer.name} 使用锦囊【欲擒故纵】，本回合约战失败时将转危为机。`);
            consumed = true;
        } else if (cardId === 'exchange') {
            const others = currentPlayer.cards.filter((_, index) => index !== picked - 1);
            if (!others.length) {
                alert('【抛砖引玉】需要你手里至少还有另一张锦囊。');
            } else {
                const text = others.map((otherId, index) => `${index + 1}. ${getCardName(otherId)}`).join('\n');
                const otherPicked = Number.parseInt(prompt(`选择要弃掉的另一张锦囊：\n${text}`, '1'), 10);
                if (!Number.isNaN(otherPicked) && otherPicked >= 1 && otherPicked <= others.length) {
                    removeCardFromPlayer(currentPlayer, others[otherPicked - 1]);
                    grantCities(currentPlayer, 35, `${currentPlayer.name} 发动锦囊【抛砖引玉】`);
                    consumed = true;
                }
            }
        } else if (cardId === 'siphon') {
            currentPlayer.effects.push({ type: 'siphon_next_success' });
            addLog(`${currentPlayer.name} 使用锦囊【浑水摸鱼】，准备截取其他玩家本回合的首次收益。`);
            consumed = true;
        } else if (cardId === 'rescue') {
            alert('【釜底抽薪】是被动锦囊，不需要主动使用。');
        } else {
            alert(`【${getCardName(cardId)}】功能暂未实现，目前仅支持抽取。`);
        }

        if (consumed) {
            removeCardFromPlayer(currentPlayer, cardId);
            refreshView();
            showActionModal();
        }
    }

    function selectAction(actionType) {
        currentActionSetup = { type: actionType, playerId: gameState.currentPlayerIndex };
        hideModal('actionModal');

        if (actionType === 'duel') return openDuelSetup();
        if (actionType === 'raid') return openRaidSetup();
        if (actionType === 'defend') return openDefendSetup();
        if (actionType === 'develop') return resolveDevelopImmediately();
    }

    function adjustStake(delta) {
        const input = byId('duelStake');
        const currentPlayer = getCurrentPlayer();
        if (!input || !currentPlayer) return;
        const maxStake = Math.min(30, currentPlayer.cities);
        const next = clamp((Number.parseInt(input.value, 10) || 1) + delta, 1, maxStake);
        input.value = String(next);
    }

    function validateStakeInput(input) {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        input.value = input.value.replace(/[^0-9]/g, '');
        const maxStake = Math.min(30, currentPlayer.cities);
        const value = Number.parseInt(input.value, 10);
        if (!Number.isNaN(value)) input.value = String(clamp(value, 1, maxStake));
    }

    function finalizeStake(input) {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        const maxStake = Math.min(30, currentPlayer.cities);
        const value = Number.parseInt(input.value, 10);
        input.value = String(Number.isNaN(value) ? 1 : clamp(value, 1, maxStake));
    }

    function openDuelSetup() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        const targets = populateTargetSelect('duelTarget', currentPlayer.id);
        if (!targets.length) {
            alert('没有可约战的目标。');
            moveToNextPlayer();
            return;
        }
        if (byId('duelStake')) byId('duelStake').value = String(Math.min(10, Math.max(1, currentPlayer.cities)));
        showModal('duelModal');
    }

    function closeDuelModal() {
        hideModal('duelModal');
        setTimeout(showActionModal, 100);
    }

    function confirmDuel() {
        const currentPlayer = getCurrentPlayer();
        const targetId = Number.parseInt(byId('duelTarget')?.value, 10);
        const stake = Number.parseInt(byId('duelStake')?.value, 10);
        if (!currentPlayer) return;
        if (Number.isNaN(targetId)) return alert('请选择有效的对手。');
        if (Number.isNaN(stake)) return alert('请输入有效的筹码数量。');
        if (stake < 1 || stake > 30) return alert('筹码必须在 1 到 30 之间。');
        if (stake > currentPlayer.cities) return alert(`筹码不能超过当前城池数，你目前只有 ${currentPlayer.cities} 座城池。`);

        currentActionSetup = { type: 'duel', playerId: currentPlayer.id, targetId, stake, resolved: false };
        hideModal('duelModal');
        submitAction();
    }

    function openRaidSetup() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        const targets = populateTargetSelect('raidTarget', currentPlayer.id);
        if (!targets.length) {
            alert('没有可奇袭的目标。');
            moveToNextPlayer();
            return;
        }
        showModal('raidModal');
    }

    function closeRaidModal() {
        hideModal('raidModal');
        setTimeout(showActionModal, 100);
    }

    function confirmRaid() {
        const currentPlayer = getCurrentPlayer();
        const targetId = Number.parseInt(byId('raidTarget')?.value, 10);
        if (!currentPlayer) return;
        if (Number.isNaN(targetId)) return alert('请选择有效的奇袭目标。');
        currentActionSetup = { type: 'raid', playerId: currentPlayer.id, targetId, resolved: false };
        hideModal('raidModal');
        submitAction();
    }

    function openDefendSetup() {
        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return;
        const targets = populateTargetSelect('defendTarget', currentPlayer.id);
        if (!targets.length) {
            alert('没有可指定的防守对象。');
            moveToNextPlayer();
            return;
        }
        showModal('defendModal');
    }

    function closeDefendModal() {
        hideModal('defendModal');
        setTimeout(showActionModal, 100);
    }

    function confirmDefend() {
        const currentPlayer = getCurrentPlayer();
        const targetId = Number.parseInt(byId('defendTarget')?.value, 10);
        if (!currentPlayer) return;
        if (Number.isNaN(targetId)) return alert('请选择有效的防守对象。');
        currentActionSetup = { type: 'defend', playerId: currentPlayer.id, targetId, resolved: false };
        hideModal('defendModal');
        submitAction();
    }

    function submitAction() {
        if (!currentActionSetup) return;
        const player = getPlayerById(currentActionSetup.playerId);
        const target = getPlayerById(currentActionSetup.targetId);
        gameState.pendingActions.push(currentActionSetup);

        if (currentActionSetup.type === 'duel' && player && target) {
            addLog(`${player.name} 向 ${target.name} 发起约战，筹码 ${currentActionSetup.stake} 座城池。`);
        } else if (currentActionSetup.type === 'raid' && player && target) {
            addLog(`${player.name} 准备奇袭 ${target.name}。`);
        } else if (currentActionSetup.type === 'defend' && player && target) {
            addLog(`${player.name} 本回合重点防守 ${target.name} 的奇袭。`);
        }

        currentActionSetup = null;
        moveToNextPlayer();
    }

    function resolveDevelopImmediately() {
        const player = getCurrentPlayer();
        if (!player) return;

        const roll = randomInt(1, 6);
        player.turnDevelopRoll = roll;
        if (roll % 2 === 1) {
            const cardId = drawRandomCard();
            addCardToPlayer(player, cardId);
            addLog(`${player.name} 选择发育，掷出 ${roll} 点，立即抽到锦囊【${getCardName(cardId)}】。`);
        } else {
            player.cities += 5;
            addLog(`${player.name} 选择发育，掷出 ${roll} 点，立即获得 5 座城池。`);
        }

        currentActionSetup = null;
        refreshView();
        moveToNextPlayer();
    }

    function moveToNextPlayer() {
        gameState.currentActionIndex += 1;
        while (gameState.currentActionIndex < gameState.actionOrder.length) {
            const nextPlayerId = gameState.actionOrder[gameState.currentActionIndex];
            const nextPlayer = getPlayerById(nextPlayerId);
            if (nextPlayer && !nextPlayer.eliminated) {
                gameState.currentPlayerIndex = nextPlayerId;
                refreshView();
                setTimeout(showActionModal, 300);
                return;
            }
            gameState.currentActionIndex += 1;
        }
        startSettlementPhase();
    }

    function appendSettlementText(html) {
        const list = byId('settlingList');
        if (!list) return;
        const item = document.createElement('div');
        item.className = 'settle-item';
        item.innerHTML = html;
        list.appendChild(item);
        list.scrollTop = list.scrollHeight;
    }

    function advanceSettlement(delay = 500) {
        gameState.settlementIndex += 1;
        setTimeout(processNextSettlement, delay);
    }

    function findCounterDefense(raidAction) {
        return gameState.pendingActions.find((action) => (
            action.type === 'defend' &&
            action.playerId === raidAction.targetId &&
            action.targetId === raidAction.playerId
        )) || null;
    }

    function startSettlementPhase() {
        gameState.phase = 'settlement';
        gameState.settlementIndex = 0;
        gameState.settlementComplete = false;
        gameState.currentSettlementAction = null;
        hostAdjustmentSnapshot = null;

        if (byId('turnPhase')) byId('turnPhase').textContent = '结算阶段';
        if (byId('settlingList')) byId('settlingList').innerHTML = '';
        if (byId('settleActions')) byId('settleActions').style.display = 'none';
        if (byId('hostAdjustPanel')) byId('hostAdjustPanel').style.display = 'none';
        if (byId('settlingAnim')) {
            byId('settlingAnim').textContent = '⚖️';
            byId('settlingAnim').classList.remove('done');
        }
        if (byId('settlingTitle')) byId('settlingTitle').textContent = '正在结算本回合行动...';

        addLog('所有玩家行动选择完毕，进入结算阶段。');
        refreshView();
        showModal('settlingModal');

        if (!gameState.pendingActions.length) {
            finishSettlementPhase();
            return;
        }
        setTimeout(processNextSettlement, 500);
    }

    function processNextSettlement() {
        if (gameState.phase !== 'settlement') return;
        if (gameState.settlementIndex >= gameState.pendingActions.length) {
            finishSettlementPhase();
            return;
        }

        const action = gameState.pendingActions[gameState.settlementIndex];
        if (!action) {
            advanceSettlement(0);
            return;
        }
        if (action.resolved) {
            advanceSettlement(0);
            return;
        }

        const player = getPlayerById(action.playerId);
        const target = action.targetId !== undefined ? getPlayerById(action.targetId) : null;

        if (!player || player.eliminated) {
            appendSettlementText('⏭️ 行动已跳过：发起方不存在或已淘汰。');
            action.resolved = true;
            advanceSettlement(300);
            return;
        }

        if (action.type === 'defend') {
            action.resolved = true;
            if (target && !target.eliminated) {
                appendSettlementText(`🛡️ <b>${player.name}</b> 本回合重点防守 <b>${target.name}</b> 的奇袭。`);
            } else {
                appendSettlementText(`🛡️ <b>${player.name}</b> 的守城目标已无效。`);
            }
            refreshView();
            advanceSettlement(350);
            return;
        }

        if ((action.type === 'duel' || action.type === 'raid') && (!target || target.eliminated)) {
            appendSettlementText(`⏭️ <b>${player.name}</b> 的${action.type === 'duel' ? '约战' : '奇袭'}目标已失效，本次行动取消。`);
            action.resolved = true;
            advanceSettlement(350);
            return;
        }

        if (action.type === 'raid') {
            const counterDefense = findCounterDefense(action);
            if (counterDefense) {
                action.resolved = true;
                transferCities(player, target, Math.min(20, player.cities), `🛡️ <b>${target.name}</b> 提前守城，${player.name} 的奇袭直接失败，<b>${target.name}</b> 反制夺取 {amount} 座城池。`);
                refreshView();
                advanceSettlement(800);
                return;
            }
            hideModal('settlingModal');
            showRaidJudge(action);
            return;
        }

        if (action.type === 'duel') {
            hideModal('settlingModal');
            showDuelResponse(action);
            return;
        }

        appendSettlementText(`⏭️ 未识别的行动类型：${escapeHtml(action.type)}。`);
        action.resolved = true;
        advanceSettlement(300);
    }

    function showDuelResponse(action) {
        const inviter = getPlayerById(action.playerId);
        const responder = getPlayerById(action.targetId);
        const inviterNameEl = byId('inviterName');
        const responderNameEl = byId('responderName');
        const invitationStakeEl = byId('invitationStake');
        const tributeAmountEl = byId('tributeAmount');

        if (!inviter || !responder || !inviterNameEl || !responderNameEl || !invitationStakeEl) {
            appendSettlementText('约战响应面板缺失，当前约战已跳过。');
            action.resolved = true;
            gameState.currentSettlementAction = null;
            showModal('settlingModal');
            advanceSettlement(0);
            return;
        }

        inviterNameEl.textContent = inviter.name;
        inviterNameEl.style.color = inviter.color;
        responderNameEl.textContent = responder.name;
        responderNameEl.style.color = responder.color;
        invitationStakeEl.textContent = String(action.stake);
        if (tributeAmountEl) tributeAmountEl.textContent = String(Math.ceil(action.stake / 2));

        gameState.currentSettlementAction = action;
        showModal('duelResponseModal');
    }

    function showDuelJudge(action) {
        const challenger = getPlayerById(action.playerId);
        const defender = getPlayerById(action.targetId);
        const challengerEl = byId('duelJudgeChallenger');
        const defenderEl = byId('duelJudgeDefender');
        const stakeEl = byId('duelJudgeStake');

        if (!challenger || !defender || !challengerEl || !defenderEl || !stakeEl) {
            appendSettlementText('约战胜负判定面板缺失，当前约战已跳过。');
            action.resolved = true;
            gameState.currentSettlementAction = null;
            showModal('settlingModal');
            advanceSettlement(0);
            return;
        }

        challengerEl.textContent = challenger.name;
        challengerEl.style.color = challenger.color;
        defenderEl.textContent = defender.name;
        defenderEl.style.color = defender.color;
        stakeEl.textContent = String(action.stake);
        gameState.currentSettlementAction = action;
        showModal('duelJudgeModal');
    }

    function respondDuel(accepted) {
        const action = gameState.currentSettlementAction;
        const challenger = action ? getPlayerById(action.playerId) : null;
        const defender = action ? getPlayerById(action.targetId) : null;

        hideModal('duelResponseModal');

        if (!action || !challenger || !defender) {
            showModal('settlingModal');
            appendSettlementText('约战结算缺少必要数据，已跳过。');
            gameState.currentSettlementAction = null;
            advanceSettlement(0);
            return;
        }

        if (accepted) {
            showDuelJudge(action);
            return;
        } else {
            showModal('settlingModal');
            const tribute = Math.min(Math.ceil(action.stake / 2), defender.cities);
            transferCities(defender, challenger, tribute, `🛡️ <b>${defender.name}</b> 拒绝约战，向 <b>${challenger.name}</b> 进贡 {amount} 座城池。`);
        }

        action.resolved = true;
        gameState.currentSettlementAction = null;
        checkEliminatedPlayers();
        refreshView();
        advanceSettlement(800);
    }

    function resolveDuelWinner(winnerRole) {
        const action = gameState.currentSettlementAction;
        const challenger = action ? getPlayerById(action.playerId) : null;
        const defender = action ? getPlayerById(action.targetId) : null;

        hideModal('duelJudgeModal');
        showModal('settlingModal');

        if (!action || !challenger || !defender) {
            appendSettlementText('约战胜负判定数据缺失，已跳过。');
            gameState.currentSettlementAction = null;
            advanceSettlement(0);
            return;
        }

        const challengerWins = winnerRole === 'challenger';
        const winner = challengerWins ? challenger : defender;
        const loser = challengerWins ? defender : challenger;
        const transfer = Math.min(action.stake, loser.cities);

        if (challengerWins) {
            transferCities(defender, challenger, transfer, `⚔️ 主持人判定 <b>${challenger.name}</b> 约战获胜，夺取 {amount} 座城池。`);
            removeEffect(challenger, 'duel_fail_safe');
        } else if (hasEffect(challenger, 'duel_fail_safe')) {
            challenger.cities += action.stake;
            appendSettlementText(`⚔️ 主持人判定 <b>${defender.name}</b> 获胜，但 ${challenger.name} 的【欲擒故纵】生效，未失城并反得 ${action.stake} 座城池。`);
            removeEffect(challenger, 'duel_fail_safe');
        } else {
            transferCities(challenger, defender, transfer, `⚔️ 主持人判定 <b>${defender.name}</b> 约战获胜，夺取 {amount} 座城池。`);
        }

        action.resolved = true;
        gameState.currentSettlementAction = null;
        checkEliminatedPlayers();
        refreshView();
        advanceSettlement(800);
    }

    function showRaidJudge(action) {
        const attacker = getPlayerById(action.playerId);
        const defender = getPlayerById(action.targetId);
        const attackerNameEl = byId('raidAttackerName');
        const defenderNameEl = byId('raidDefenderName');

        if (!attacker || !defender || !attackerNameEl || !defenderNameEl) {
            appendSettlementText('奇袭判定面板缺失，当前奇袭已跳过。');
            action.resolved = true;
            gameState.currentSettlementAction = null;
            showModal('settlingModal');
            advanceSettlement(0);
            return;
        }

        attackerNameEl.textContent = attacker.name;
        attackerNameEl.style.color = attacker.color;
        defenderNameEl.textContent = defender.name;
        defenderNameEl.style.color = defender.color;

        gameState.currentSettlementAction = action;
        showModal('raidJudgeModal');
    }

    function resolveRaid(success) {
        const action = gameState.currentSettlementAction;
        const attacker = action ? getPlayerById(action.playerId) : null;
        const defender = action ? getPlayerById(action.targetId) : null;

        hideModal('raidJudgeModal');
        showModal('settlingModal');

        if (!action || !attacker || !defender) {
            appendSettlementText('奇袭判定数据缺失，已跳过。');
            gameState.currentSettlementAction = null;
            advanceSettlement(0);
            return;
        }

        if (success) {
            transferCities(defender, attacker, Math.min(10, defender.cities), `🗡️ <b>${attacker.name}</b> 奇袭成功，从 <b>${defender.name}</b> 手中夺取 {amount} 座城池。`);
        } else {
            transferCities(attacker, defender, Math.min(5, attacker.cities), `🗡️ <b>${attacker.name}</b> 奇袭失败，<b>${defender.name}</b> 反夺 {amount} 座城池。`);
        }

        action.resolved = true;
        gameState.currentSettlementAction = null;
        checkEliminatedPlayers();
        refreshView();
        advanceSettlement(800);
    }

    function finishSettlementPhase() {
        gameState.players.forEach((player) => {
            player.effects
                .filter((effect) => effect.type === 'lure_end_turn')
                .forEach((effect) => {
                    const target = getPlayerById(effect.targetId);
                    if (target && !target.eliminated && !player.eliminated) {
                        transferCities(target, player, effect.amount, `🎴 <b>${player.name}</b> 的【调虎离山】生效，从 <b>${target.name}</b> 处掠夺 {amount} 座城池。`);
                    }
                });
            player.effects = player.effects.filter((effect) => effect.type !== 'lure_end_turn');
        });

        appendSettlementText('<span style="color:#4e6b3e; font-weight:bold;">本回合结算完毕，等待主持人开始下一回合。</span>');
        if (byId('settlingAnim')) {
            byId('settlingAnim').textContent = '✓';
            byId('settlingAnim').classList.add('done');
        }
        if (byId('settlingTitle')) byId('settlingTitle').textContent = '本回合结算完成';
        if (byId('settleActions')) byId('settleActions').style.display = 'block';

        gameState.settlementComplete = true;
        hostAdjustmentSnapshot = clonePlayersForHostAdjustments();
        refreshView();
    }

    function finishSettlementAndNextTurn() {
        hideModal('settlingModal');
        if (byId('settleActions')) byId('settleActions').style.display = 'none';
        if (byId('hostAdjustPanel')) byId('hostAdjustPanel').style.display = 'none';

        gameState.pendingActions = [];
        gameState.currentSettlementAction = null;
        gameState.settlementIndex = 0;
        gameState.settlementComplete = false;
        hostAdjustmentSnapshot = null;

        gameState.players.forEach((player) => {
            player.turnCityLoss = 0;
            player.turnDevelopRoll = null;
            player.effects = [];
        });

        checkEliminatedPlayers();
        const result = checkGameOver();
        if (result.isOver) {
            if (result.winner) {
                addLog(`${result.winner.name} 统一天下，游戏结束。`);
                setTimeout(() => {
                    alert(
                        `恭喜 ${result.winner.name} 获得最终胜利。\n\n` +
                        `回合：第 ${gameState.currentTurn} 回合\n` +
                        `城池：${result.winner.cities}\n` +
                        `兵力：${formatNumber(result.winner.troops)}\n` +
                        `资源：${formatNumber(result.winner.resources)}`
                    );
                }, 200);
            } else {
                addLog('所有势力都已覆灭，天下无主。');
            }
            return;
        }

        gameState.currentTurn += 1;
        startNewTurn();
    }

    function endTurn() {
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

    function startGame() {
        initPlayers(gameState.playerCount, getPlayerName);
        gameState.currentTurn = 1;
        gameState.currentPlayerIndex = 0;
        gameState.currentActionIndex = 0;
        gameState.phase = 'decision';
        gameState.pendingActions = [];
        gameState.settlementIndex = 0;
        gameState.currentSettlementAction = null;
        gameState.settlementComplete = false;
        gameState.gameOver = false;
        gameState.eventLogs = [`<span class="log-time">[第 1 回合]</span> 游戏开始，共有 ${gameState.playerCount} 方势力加入争霸。`];

        if (byId('startScreen')) byId('startScreen').style.display = 'none';
        if (byId('gameScreen')) byId('gameScreen').style.display = 'block';

        startNewTurn();
    }

    function startNewTurn() {
        gameState.phase = 'decision';
        gameState.settlementComplete = false;
        gameState.pendingActions = [];
        gameState.currentSettlementAction = null;
        gameState.actionOrder = calculateActionOrder();
        gameState.currentActionIndex = 0;
        if (byId('turnPhase')) byId('turnPhase').textContent = '行动阶段';
        if (gameState.actionOrder.length > 0) gameState.currentPlayerIndex = gameState.actionOrder[0];

        addLog(`第 ${gameState.currentTurn} 回合开始，行动顺序已根据城池数重新排序。`);
        const orderNames = gameState.actionOrder
            .map((id, index) => {
                const player = getPlayerById(id);
                return player ? `${index + 1}.${player.name}(${player.cities} 城)` : null;
            })
            .filter(Boolean)
            .join(' → ');
        addLog(`行动顺序：${orderNames}`);

        refreshView();
        setTimeout(showActionModal, 300);
    }

    function init() {
        renderNameInputs();
        updatePlayerCountDisplay(gameState.playerCount);

        const slider = byId('playerSlider');
        if (slider) {
            slider.addEventListener('input', (event) => {
                const count = Number.parseInt(event.target.value, 10);
                if (!Number.isNaN(count)) {
                    gameState.playerCount = count;
                    updatePlayerCountDisplay(count);
                    renderNameInputs();
                }
            });
        }
    }

    window.startGame = startGame;
    window.generateRandomNames = generateRandomNames;
    window.selectAction = selectAction;
    window.useStrategyFromAction = useStrategyFromAction;
    window.adjustStake = adjustStake;
    window.validateStakeInput = validateStakeInput;
    window.finalizeStake = finalizeStake;
    window.closeDuelModal = closeDuelModal;
    window.confirmDuel = confirmDuel;
    window.closeRaidModal = closeRaidModal;
    window.confirmRaid = confirmRaid;
    window.closeDefendModal = closeDefendModal;
    window.confirmDefend = confirmDefend;
    window.respondDuel = respondDuel;
    window.resolveDuelWinner = resolveDuelWinner;
    window.resolveRaid = resolveRaid;
    window.applyHostAdjustments = applyHostAdjustments;
    window.resetHostAdjustments = resetHostAdjustments;
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
}());
