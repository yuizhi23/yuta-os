/**
 * YuTa — Aero OS: Host's TikTok Host Tracker
 * Module for Daily Task Submissions & Reference VIP Spenders.
 * Built with Frutiger Aero aesthetic & maximum clarity for Host.
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_SPENDERS_KEY = 'yuta_host_spenders_v1';
  const STORAGE_TASKS_KEY = 'yuta_host_tasks_v1';

  // Module State
  let spendersData = [];
  let tasksData = [];
  let activeSubTab = 'tasks'; // 'tasks' (DEFAULT & PRIMARY) | 'spenders'
  let spenderFilter = 'all'; // 'all' | 'whale' | 'high' | 'supporter' | 'uncontacted' | 'contacted' | 'replied'
  let spenderSearch = '';
  let spenderSort = 'koin_desc'; // 'koin_desc' | 'hadiah_desc' | 'tier_desc' | 'name_asc' | 'uncontacted_first'
  let spenderPage = 1;
  const SPENDER_PAGE_SIZE = 25; // Lightweight pagination to prevent any lag
  let taskFilter = 'all'; // 'all' | 'pending' | 'completed'
  let taskSearch = '';
  let selectedSpenderForChat = null;

  // Pre-defined host chat templates (Personalized for Host)
  const CHAT_TEMPLATES = [
    {
      id: 'hey_texting',
      title: '💬 Main Greeting (Casual)',
      badge: 'Top Pick',
      text: (name) => `hii! hope you don't mind me saying hi. i'd love to get to know you, nice to meet you! 😊`
    },
    {
      id: 'thanks_gift',
      title: '🌸 Thank You for Last Night\'s Gifts',
      badge: 'Gift Appreciation',
      text: (name) => `Hi ${name}! 🥰 Thank you so much for stopping by and supporting my live room last night. Your appreciation and gifts truly brighten my day! Wishing you great health, happiness, and success always~ ✨`
    },
    {
      id: 'invite_live',
      title: '⏰ Live Stream Invitation for Today',
      badge: 'Live Reminder',
      text: (name) => `Hello ${name} ✨ I\'ll be going live again today! If you have some free time, feel free to drop in and chat. Looking forward to seeing you in the room! See you later ${name}~ 💖`
    },
    {
      id: 'whale_vip',
      title: '👑 Special VIP Whale Appreciation',
      badge: 'VIP Whale',
      text: (name) => `Hi ${name}! 🙏 I wanted to express my deepest gratitude for your incredible support in my live room. Your kindness means the world to me. Wishing you continued success in everything you do! Whenever you\'d like to unwind, please visit again ✨`
    },
    {
      id: 'casual_checkin',
      title: '☕ Casual Check-in & Catch Up',
      badge: 'Casual',
      text: (name) => `Hi ${name}, how are you doing today? Hope you\'re having a wonderful day! Just wanted to say hi and thank you for always being so kind and supportive. Have a fantastic day! 🌸`
    },
    {
      id: 'custom_thanks',
      title: '💌 Short & Sweet Thank You',
      badge: 'Short',
      text: (name) => `Hi ${name}~ Thank you so much for the gifts & support! So glad to have met you in the live stream. Wishing you endless blessings & joy 💖`
    }
  ];

  // Helper: Format Number with dots
  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString('id-ID');
  }

  // Load Initial Data
  function loadData() {
    const defaultData = window.DEFAULT_HOST_TRACKER_DATA || { spenders: [], tasks: [] };

    // Load Spenders
    try {
      const savedSpenders = localStorage.getItem(STORAGE_SPENDERS_KEY);
      if (savedSpenders) {
        spendersData = JSON.parse(savedSpenders);
      } else {
        spendersData = JSON.parse(JSON.stringify(defaultData.spenders || []));
        saveSpenders();
      }
    } catch (e) {
      console.error('Error loading spenders:', e);
      spendersData = JSON.parse(JSON.stringify(defaultData.spenders || []));
    }

    // Load Tasks
    try {
      const savedTasks = localStorage.getItem(STORAGE_TASKS_KEY);
      if (savedTasks) {
        tasksData = JSON.parse(savedTasks);

        // Auto-sync: Check if there are newly added default tasks not yet in localStorage
        const existingNames = new Set(tasksData.map(t => (t.name || '').trim().toLowerCase()));
        const missingDefaultTasks = (defaultData.tasks || []).filter(defTask =>
          defTask && defTask.name && !existingNames.has(defTask.name.trim().toLowerCase())
        );

        if (missingDefaultTasks.length > 0) {
          const defNames = new Set((defaultData.tasks || []).map(t => (t.name || '').trim().toLowerCase()));
          const customTasks = tasksData.filter(t => !defNames.has((t.name || '').trim().toLowerCase()));

          if (customTasks.length === 0) {
            // User had standard default list, preserve their completed status overrides if any, but adopt new default ordering & completions
            const statusMap = new Map();
            tasksData.forEach(t => {
              if (t && t.name) statusMap.set(t.name.trim().toLowerCase(), t.completed);
            });
            tasksData = defaultData.tasks.map(t => {
              const nameKey = t.name.trim().toLowerCase();
              return {
                ...t,
                completed: statusMap.has(nameKey) ? statusMap.get(nameKey) : t.completed
              };
            });
          } else {
            // Append missing default tasks with sequential IDs
            const maxId = tasksData.reduce((max, t) => Math.max(max, t.id || 0), 0);
            missingDefaultTasks.forEach((defTask, idx) => {
              tasksData.push({
                ...defTask,
                id: maxId + idx + 1
              });
            });
          }
          saveTasks();
        }
      } else {
        tasksData = JSON.parse(JSON.stringify(defaultData.tasks || []));
        saveTasks();
      }
    } catch (e) {
      console.error('Error loading tasks:', e);
      tasksData = JSON.parse(JSON.stringify(defaultData.tasks || []));
    }
  }

  function saveSpenders() {
    try {
      localStorage.setItem(STORAGE_SPENDERS_KEY, JSON.stringify(spendersData));
    } catch (e) {
      console.error('Failed to save spenders:', e);
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasksData));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  }

  // Play Sound helper safely
  function triggerSound(type) {
    if (typeof window.playSound === 'function') {
      window.playSound(type);
    }
  }

  // Show Toast safely
  function notify(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
    } else {
      alert(msg);
    }
  }

  // Helper to escape single quotes in JS strings
  function escapeJs(str) {
    if (!str) return '';
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  // Open TikTok profile or search account directly
  function openTikTokAccount(name, username) {
    const rawUser = (username || '').replace(/^@+/, '').trim();
    const cleanUser = rawUser.replace(/[^a-zA-Z0-9._]/g, '');
    triggerSound('bubble');

    if (cleanUser && cleanUser.length >= 2 && !rawUser.includes(' ')) {
      const url = `https://www.tiktok.com/@${encodeURIComponent(cleanUser)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      notify(`🎵 Opening TikTok profile: @${cleanUser}`);
    } else {
      const query = cleanUser || (name || '').trim();
      const url = `https://www.tiktok.com/search/user?q=${encodeURIComponent(query)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      notify(`🔍 Searching TikTok for: "${query}"`);
    }
  }

  // Helper to open TikTok directly using spender ID (100% immune to quote/special character errors)
  function openTikTokById(id) {
    const s = spendersData.find(item => Number(item.id) === Number(id));
    if (!s) return;
    openTikTokAccount(s.name, s.username);
  }

  // Helper to copy username using spender ID
  function copyUsernameById(id) {
    const s = spendersData.find(item => Number(item.id) === Number(id));
    if (!s) return;
    copyUsername(s.username || s.name);
  }

  // Switch Sub-Tab inside Host Tracker (Tasks vs Spenders)
  function switchHostSubTab(subTab) {
    if (subTab !== 'tasks' && subTab !== 'spenders') {
      subTab = 'tasks';
    }
    activeSubTab = subTab;
    triggerSound('bubble');

    const tabs = document.querySelectorAll('.host-subtab-btn');
    tabs.forEach(t => {
      const isTarget = t.getAttribute('data-subtab') === subTab;
      t.classList.toggle('active', isTarget);
    });

    const panels = document.querySelectorAll('.host-subtab-panel');
    panels.forEach(p => {
      const isTarget = p.id === `host-subpanel-${subTab}`;
      p.classList.toggle('active', isTarget);
      p.style.display = isTarget ? 'block' : 'none';
    });

    if (subTab === 'spenders') {
      renderSpendersTable();
    } else if (subTab === 'tasks') {
      renderTasksList();
    }
  }

  // Render Host Tracker Overview Bento (Fokus Utama: Tugas Harian Host)
  function renderOverviewStats() {
    const totalTasks = tasksData.length;
    const completedTasks = tasksData.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tasks summary elements
    const elTasksDone = document.getElementById('statTasksDone');
    if (elTasksDone) elTasksDone.textContent = completedTasks;

    const elTasksPending = document.getElementById('statTasksPending');
    if (elTasksPending) elTasksPending.textContent = pendingTasks;

    const elTasksTotal = document.getElementById('statTasksTotal');
    if (elTasksTotal) elTasksTotal.textContent = totalTasks;

    const elTaskProgressFill = document.getElementById('hostTaskProgressFill');
    if (elTaskProgressFill) elTaskProgressFill.style.width = `${taskPct}%`;

    const elTaskProgressText = document.getElementById('hostTaskProgressText');
    if (elTaskProgressText) elTaskProgressText.textContent = `${completedTasks} / ${totalTasks} Selesai (${taskPct}%)`;
  }

  // Filter & Sort Spenders
  function getFilteredSpenders() {
    let list = [...spendersData];

    // Filter by category / chat
    if (spenderFilter === 'whale') {
      list = list.filter(s => (s.labelUtama || '').toLowerCase().includes('whale'));
    } else if (spenderFilter === 'high') {
      list = list.filter(s => (s.labelUtama || '').toLowerCase().includes('high'));
    } else if (spenderFilter === 'supporter') {
      list = list.filter(s => (s.labelUtama || '').toLowerCase().includes('supporter'));
    } else if (spenderFilter === 'unfollowed') {
      list = list.filter(s => !s.sudahFollow);
    } else if (spenderFilter === 'followed') {
      list = list.filter(s => s.sudahFollow);
    } else if (spenderFilter === 'uncontacted') {
      list = list.filter(s => !s.sudahChat);
    } else if (spenderFilter === 'contacted') {
      list = list.filter(s => s.sudahChat);
    } else if (spenderFilter === 'replied') {
      list = list.filter(s => s.sudahDibalas);
    }

    // Search query
    if (spenderSearch.trim()) {
      const q = spenderSearch.toLowerCase().trim();
      list = list.filter(s =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.username || '').toLowerCase().includes(q) ||
        (s.labelUtama || '').toLowerCase().includes(q) ||
        (s.labelLain || '').toLowerCase().includes(q) ||
        (s.notes || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (spenderSort === 'koin_desc') {
        return (b.koin || 0) - (a.koin || 0);
      } else if (spenderSort === 'hadiah_desc') {
        return (b.hadiah || 0) - (a.hadiah || 0);
      } else if (spenderSort === 'tier_desc') {
        return (b.tier || 0) - (a.tier || 0);
      } else if (spenderSort === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (spenderSort === 'uncontacted_first') {
        if (a.sudahChat === b.sudahChat) {
          return (b.koin || 0) - (a.koin || 0);
        }
        return a.sudahChat ? 1 : -1;
      }
      return 0;
    });

    return list;
  }

  // Spender pagination functions (Lightweight, lag-free)
  function prevSpenderPage() {
    if (spenderPage > 1) {
      spenderPage--;
      triggerSound('bubble');
      renderSpendersTable();
      const wrap = document.querySelector('.host-table-responsive');
      if (wrap) wrap.scrollTop = 0;
    }
  }

  function nextSpenderPage() {
    const filtered = getFilteredSpenders();
    const totalPages = Math.ceil(filtered.length / SPENDER_PAGE_SIZE) || 1;
    if (spenderPage < totalPages) {
      spenderPage++;
      triggerSound('bubble');
      renderSpendersTable();
      const wrap = document.querySelector('.host-table-responsive');
      if (wrap) wrap.scrollTop = 0;
    }
  }

  // Render Spenders Table (Lightweight with Pagination)
  function renderSpendersTable() {
    renderOverviewStats();

    const tbody = document.getElementById('spendersTableBody');
    const cardsContainer = document.getElementById('spendersCardsMobile');
    const countBadge = document.getElementById('spendersCountBadge');
    const paginationBar = document.getElementById('spenderPaginationBar');

    const filtered = getFilteredSpenders();
    const totalPages = Math.ceil(filtered.length / SPENDER_PAGE_SIZE) || 1;
    if (spenderPage > totalPages) spenderPage = totalPages;
    if (spenderPage < 1) spenderPage = 1;

    const startIndex = (spenderPage - 1) * SPENDER_PAGE_SIZE;
    const paginatedList = filtered.slice(startIndex, startIndex + SPENDER_PAGE_SIZE);

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Spenders (Page ${spenderPage}/${totalPages} • Showing ${paginatedList.length} accounts)`;
    }

    // Render pagination bar
    if (paginationBar) {
      if (filtered.length <= SPENDER_PAGE_SIZE) {
        paginationBar.style.display = 'none';
      } else {
        paginationBar.style.display = 'flex';
        paginationBar.innerHTML = `
          <button type="button" class="pagination-btn" onclick="window.HostTracker.prevSpenderPage()" ${spenderPage <= 1 ? 'disabled' : ''}>
            ◀ Previous Page
          </button>
          <span class="pagination-info">Page <strong>${spenderPage}</strong> of <strong>${totalPages}</strong> (${filtered.length} total accounts)</span>
          <button type="button" class="pagination-btn" onclick="window.HostTracker.nextSpenderPage()" ${spenderPage >= totalPages ? 'disabled' : ''}>
            Next Page ▶
          </button>
        `;
      }
    }

    if (!tbody && !cardsContainer) return;

    if (filtered.length === 0) {
      const emptyHtml = `
        <div class="host-empty-state">
          <div class="empty-icon">🔍</div>
          <h4>No matching spenders found</h4>
          <p>Try changing your search keywords or category filters above.</p>
          <button class="bento-pill-btn" onclick="window.HostTracker.resetSpenderFilter()">Reset Filter</button>
        </div>
      `;
      if (tbody) tbody.innerHTML = `<tr><td colspan="9">${emptyHtml}</td></tr>`;
      if (cardsContainer) cardsContainer.innerHTML = emptyHtml;
      return;
    }

    const isMobileView = window.innerWidth <= 768;

    // Render Table Rows (for Desktop & Tablet) - Only 25 rows for instant 60fps rendering!
    if (tbody) {
      if (!isMobileView) {
        tbody.innerHTML = paginatedList.map((s, idx) => {
          const index = startIndex + idx;

          // Badge label
          let labelBadge = '';
          const lbl = (s.labelUtama || '').toLowerCase();
          if (lbl.includes('whale')) {
            labelBadge = `<span class="badge-spender badge-whale" title="Top Coin Spender">🐋 Whale</span>`;
          } else if (lbl.includes('high')) {
            labelBadge = `<span class="badge-spender badge-high" title="High Spender">⭐ High</span>`;
          } else if (lbl.includes('supporter')) {
            labelBadge = `<span class="badge-spender badge-supporter" title="Room Supporter">💖 Supporter</span>`;
          } else {
            labelBadge = `<span class="badge-spender badge-general">${s.labelUtama || 'Member'}</span>`;
          }

          // Tier badge
          const tierBadge = s.tier ? `<span class="badge-tier">Lv.${s.tier}</span>` : '';

          // Follow status button
          const followBtn = s.sudahFollow
            ? `<button class="host-status-btn status-follow-done" onclick="window.HostTracker.toggleFollow(${s.id})" title="Click to toggle status">✨ Followed</button>`
            : `<button class="host-status-btn status-follow-none" onclick="window.HostTracker.toggleFollow(${s.id})" title="Click to mark as followed">➕ Follow</button>`;

          // Chat status button
          const chatBtn = s.sudahChat
            ? `<button class="host-status-btn status-done" onclick="window.HostTracker.toggleChat(${s.id})" title="Click to toggle status">✅ Messaged</button>`
            : `<button class="host-status-btn status-pending" onclick="window.HostTracker.toggleChat(${s.id})" title="Click to mark as messaged">⏳ Not Messaged</button>`;

          // Replied status button
          const replyBtn = s.sudahDibalas
            ? `<button class="host-status-btn status-reply-done" onclick="window.HostTracker.toggleReply(${s.id})" title="Click to toggle status">💌 Replied</button>`
            : `<button class="host-status-btn status-reply-none" onclick="window.HostTracker.toggleReply(${s.id})" title="Click to mark as replied">⏳ Pending</button>`;

          return `
            <tr class="spender-row ${s.sudahChat ? 'is-contacted' : 'is-uncontacted'}" id="spender-row-${s.id}">
              <td class="col-num">${index + 1}</td>
              <td class="col-account">
                <div class="spender-account-info" onclick="window.HostTracker.openTikTokById(${s.id})" title="Click to open or search TikTok account">
                  <div class="spender-name-row">
                    <span class="spender-display-name link-tiktok">${escapeHtml(s.name)}</span>
                    <button type="button" class="tiktok-badge-pill" onclick="event.stopPropagation(); window.HostTracker.openTikTokById(${s.id})" title="Open TikTok Profile / Search">🎵 TikTok</button>
                  </div>
                  <div class="spender-username-row">
                    <span class="spender-uname" onclick="event.stopPropagation(); window.HostTracker.openTikTokById(${s.id})">${escapeHtml(s.username || '-')}</span>
                    <button type="button" class="mini-copy-btn" onclick="event.stopPropagation(); window.HostTracker.copyUsernameById(${s.id})" title="Copy @username">📋</button>
                  </div>
                </div>
              </td>
              <td class="col-badge">
                <div class="badge-wrap">
                  ${labelBadge}
                  ${tierBadge}
                </div>
              </td>
              <td class="col-koin">
                <div class="koin-info">
                  <span class="koin-val">🪙 ${formatNumber(s.koin)}</span>
                  <span class="hadiah-val">🎁 ${formatNumber(s.hadiah)} gift</span>
                </div>
              </td>
              <td class="col-notes">
                <div class="notes-text" title="${escapeHtml(s.notes || s.labelLain || '')}">
                  ${escapeHtml(s.notes || s.labelLain || '-')}
                </div>
              </td>
              <td class="col-follow">${followBtn}</td>
              <td class="col-chat">${chatBtn}</td>
              <td class="col-reply">${replyBtn}</td>
              <td class="col-actions">
                <div class="host-action-btns">
                  <button type="button" class="tiktok-launch-btn" onclick="window.HostTracker.openTikTokById(${s.id})" title="Directly Open / Search Account on TikTok">
                    🎵 Search TikTok
                  </button>
                  <button type="button" class="host-action-icon-btn chat-template-btn" onclick="window.HostTracker.openChatTemplateModal(${s.id})" title="Open Greeting Templates">
                    💬 Greet
                  </button>
                  <button type="button" class="host-action-icon-btn edit-note-btn" onclick="window.HostTracker.editNote(${s.id})" title="Edit Spender Note">
                    ✏️
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      } else {
        tbody.innerHTML = '';
      }
    }

    // Render Cards (for Mobile View) - Only rendered when on mobile!
    if (cardsContainer) {
      if (isMobileView) {
        cardsContainer.innerHTML = paginatedList.map((s, idx) => {
          const index = startIndex + idx;
          let labelBadge = '';
          const lbl = (s.labelUtama || '').toLowerCase();
          if (lbl.includes('whale')) {
            labelBadge = `<span class="badge-spender badge-whale">🐋 Whale</span>`;
          } else if (lbl.includes('high')) {
            labelBadge = `<span class="badge-spender badge-high">⭐ High</span>`;
          } else if (lbl.includes('supporter')) {
            labelBadge = `<span class="badge-spender badge-supporter">💖 Supporter</span>`;
          } else {
            labelBadge = `<span class="badge-spender badge-general">${s.labelUtama || 'Member'}</span>`;
          }

          return `
            <div class="spender-mobile-card ${s.sudahChat ? 'is-contacted' : ''}">
              <div class="sm-card-top">
                <div class="sm-num">#${index + 1}</div>
                <div class="sm-name-group" onclick="window.HostTracker.openTikTokById(${s.id})" style="cursor: pointer;" title="Click to open or search on TikTok">
                  <strong class="sm-name link-tiktok">${escapeHtml(s.name)} 🎵</strong>
                  <span class="sm-uname">${escapeHtml(s.username || '')}</span>
                </div>
                <div class="sm-badges">
                  ${labelBadge}
                  ${s.tier ? `<span class="badge-tier">Lv.${s.tier}</span>` : ''}
                </div>
              </div>
              
              <div class="sm-card-meta">
                <span class="sm-koin">🪙 ${formatNumber(s.koin)} coins</span>
                <span class="sm-hadiah">🎁 ${formatNumber(s.hadiah)} gifts</span>
              </div>

              ${(s.notes || s.labelLain) ? `
                <div class="sm-note">
                  ℹ️ ${escapeHtml(s.notes || s.labelLain)}
                </div>
              ` : ''}

              <div class="sm-card-actions">
                <button type="button" class="tiktok-launch-btn" onclick="window.HostTracker.openTikTokById(${s.id})">
                  🎵 Search TikTok
                </button>
                <button type="button" class="host-status-btn ${s.sudahFollow ? 'status-follow-done' : 'status-follow-none'}" onclick="window.HostTracker.toggleFollow(${s.id})">
                  ${s.sudahFollow ? '✨ Followed' : '➕ Follow'}
                </button>
                <button type="button" class="host-status-btn ${s.sudahChat ? 'status-done' : 'status-pending'}" onclick="window.HostTracker.toggleChat(${s.id})">
                  ${s.sudahChat ? '✅ Messaged' : '⏳ Not Messaged'}
                </button>
                <button type="button" class="host-status-btn ${s.sudahDibalas ? 'status-reply-done' : 'status-reply-none'}" onclick="window.HostTracker.toggleReply(${s.id})">
                  ${s.sudahDibalas ? '💌 Replied' : '⏳ Reply'}
                </button>
                <button type="button" class="host-action-icon-btn chat-template-btn" onclick="window.HostTracker.openChatTemplateModal(${s.id})">
                  💬 Greet
                </button>
                <button type="button" class="mini-copy-btn" onclick="window.HostTracker.copyUsernameById(${s.id})" title="Copy @username">📋</button>
              </div>
            </div>
          `;
        }).join('');
      } else {
        cardsContainer.innerHTML = '';
      }
    }
  }

  // Toggle Follow Status for Spender
  function toggleSpenderFollow(id) {
    const spender = spendersData.find(s => s.id === id);
    if (!spender) return;

    spender.sudahFollow = !spender.sudahFollow;
    saveSpenders();
    triggerSound(spender.sudahFollow ? 'check' : 'bubble');

    notify(spender.sudahFollow
      ? `✨ ${spender.name} (${spender.username || ''}) marked as FOLLOWED!`
      : `➕ ${spender.name} marked as UNFOLLOWED.`
    );

    renderSpendersTable();
  }

  // Toggle Chat Status for Spender
  function toggleSpenderChat(id) {
    const spender = spendersData.find(s => s.id === id);
    if (!spender) return;

    spender.sudahChat = !spender.sudahChat;
    saveSpenders();
    triggerSound(spender.sudahChat ? 'check' : 'bubble');

    notify(spender.sudahChat
      ? `✅ ${spender.name} marked as MESSAGED!`
      : `⏳ ${spender.name} marked as UNMESSAGED.`
    );

    renderSpendersTable();
  }

  // Toggle Reply Status for Spender
  function toggleSpenderReply(id) {
    const spender = spendersData.find(s => s.id === id);
    if (!spender) return;

    spender.sudahDibalas = !spender.sudahDibalas;
    if (spender.sudahDibalas && !spender.sudahChat) {
      spender.sudahChat = true; // Auto mark chat if replied
    }
    saveSpenders();
    triggerSound('bubble');

    notify(spender.sudahDibalas
      ? `💌 ${spender.name} marked as REPLIED!`
      : `⏳ Reply status for ${spender.name} marked as PENDING.`
    );

    renderSpendersTable();
  }

  // Copy Username to Clipboard
  function copyUsername(cleanUsername) {
    const textToCopy = cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      triggerSound('chime');
      notify(`📋 Copied to clipboard: ${textToCopy}`);
    }).catch(() => {
      notify(`Failed to copy: ${textToCopy}`);
    });
  }

  // Edit Note for Spender
  function editSpenderNote(id) {
    const spender = spendersData.find(s => s.id === id);
    if (!spender) return;

    const currentNote = spender.notes || '';
    const newNote = prompt(`Edit note for ${spender.name} (${spender.username}):`, currentNote);
    if (newNote !== null) {
      spender.notes = newNote.trim();
      saveSpenders();
      triggerSound('bubble');
      notify(`✏️ Note for ${spender.name} updated!`);
      renderSpendersTable();
    }
  }

  // ==================== DAILY TASKS SECTION ====================

  function getFilteredTasks() {
    let list = [...tasksData];

    if (taskFilter === 'pending') {
      list = list.filter(t => !t.completed);
    } else if (taskFilter === 'completed') {
      list = list.filter(t => t.completed);
    }

    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase().trim();
      list = list.filter(t => (t.name || '').toLowerCase().includes(q));
    }

    return list;
  }

  // Render Tasks List (Sheet 3)
  function renderTasksList() {
    renderOverviewStats();

    const container = document.getElementById('tasksListContainer');
    const badge = document.getElementById('tasksCountBadge');
    if (!container) return;

    const filtered = getFilteredTasks();
    const total = tasksData.length;
    const completed = tasksData.filter(t => t.completed).length;

    if (badge) {
      badge.textContent = `${completed} / ${total} Done`;
    }

    const allPill = document.querySelector('.task-filter-pill[data-filter="all"]');
    if (allPill) {
      allPill.textContent = `All (${total})`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="host-empty-state">
          <div class="empty-icon">📝</div>
          <h4>No matching tasks found</h4>
          <p>Semua tugas sudah disaring atau kata kunci tidak cocok.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      return `
        <div class="task-card-item ${t.completed ? 'is-completed' : ''}" id="task-card-${t.id}" onclick="window.HostTracker.toggleTask(${t.id})">
          <div class="task-checkbox-wrap">
            <input type="checkbox" class="task-real-checkbox" ${t.completed ? 'checked' : ''} onclick="event.stopPropagation(); window.HostTracker.toggleTask(${t.id});" />
            <div class="aero-custom-check ${t.completed ? 'checked' : ''}">
              ${t.completed ? '✓' : ''}
            </div>
          </div>
          
          <div class="task-card-content">
            <div class="task-card-header">
              <span class="task-id-badge">#${t.id}</span>
              <strong class="task-card-name">${escapeHtml(t.name)}</strong>
            </div>
          </div>

          <div class="task-card-status">
            <span class="task-status-pill ${t.completed ? 'pill-done' : 'pill-pending'}">
              ${t.completed ? '✅ Done' : '⏳ Pending'}
            </span>
            <button class="task-del-btn" onclick="event.stopPropagation(); window.HostTracker.deleteTask(${t.id});" title="Hapus Tugas">✕</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Toggle Task Completion
  function toggleTask(id) {
    const task = tasksData.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();

    if (task.completed) {
      triggerSound('check');
      notify(`✅ Task #${task.id} (${task.name}) marked as COMPLETED!`);

      // Check if all tasks finished
      const allDone = tasksData.every(t => t.completed);
      if (allDone && typeof window.confetti === 'function') {
        window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        notify('🎉 AMAZING! All daily task submissions are COMPLETED! ✨');
      }
    } else {
      triggerSound('bubble');
      notify(`⏳ Task #${task.id} (${task.name}) marked as PENDING.`);
    }

    renderTasksList();
  }

  // Reset All Daily Tasks (Fresh Start for Tomorrow)
  function resetDailyTasks() {
    if (!confirm('Apakah kamu yakin ingin mereset checklist tugas harian menjadi BELUM semua untuk memulai hari baru?')) {
      return;
    }
    tasksData.forEach(t => t.completed = false);
    saveTasks();
    triggerSound('bubble');
    notify('🔄 Daily task checklist reset for a new day!');
    renderTasksList();
  }

  // Mark All Tasks Completed
  function markAllTasksDone() {
    tasksData.forEach(t => t.completed = true);
    saveTasks();
    triggerSound('chime');
    if (typeof window.confetti === 'function') {
      window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
    notify('🎉 All daily tasks marked as COMPLETED!');
    renderTasksList();
  }

  // Add New Task Core Function
  function insertNewTask(name) {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    const maxId = tasksData.reduce((max, t) => Math.max(max, t.id || 0), 0);
    const newTask = {
      id: maxId + 1,
      name: cleanName,
      completed: false
    };

    tasksData.unshift(newTask); // Add to top of list for immediate visibility!
    saveTasks();
    triggerSound('chime');
    notify(`➕ Target task "${newTask.name}" added successfully!`);
    renderTasksList();
  }

  // Open Add Task Modal
  function openAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    if (modal) {
      modal.classList.add('open');
      const input = document.getElementById('modalNewTaskInput');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 80);
      }
      triggerSound('bubble');
    } else {
      // Fallback prompt
      const name = prompt('Enter new daily target task name:');
      if (name && name.trim()) insertNewTask(name);
    }
  }

  function closeAddTaskModal() {
    const modal = document.getElementById('addTaskModal');
    if (modal) modal.classList.remove('open');
    triggerSound('bubble');
  }

  function submitModalNewTask(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('modalNewTaskInput');
    if (!input || !input.value.trim()) {
      alert('Target task name is required!');
      return;
    }
    insertNewTask(input.value);
    input.value = '';
    closeAddTaskModal();
  }

  function submitInlineNewTask(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('inlineNewTaskInput');
    if (!input || !input.value.trim()) {
      alert('Please type a target task name first!');
      return;
    }
    insertNewTask(input.value);
    input.value = '';
  }

  function addNewTaskPrompt() {
    openAddTaskModal();
  }

  // Delete Task
  function deleteTask(id) {
    const task = tasksData.find(t => t.id === id);
    if (!task) return;
    if (!confirm(`Delete task "${task.name}" from list?`)) return;

    tasksData = tasksData.filter(t => t.id !== id);
    saveTasks();
    triggerSound('bubble');
    notify(`🗑️ Task "${task.name}" has been deleted.`);
    renderTasksList();
  }

  // Copy WhatsApp / Telegram Formatted Daily Report
  function copyDailyReport() {
    const total = tasksData.length;
    const completedList = tasksData.filter(t => t.completed);
    const pendingList = tasksData.filter(t => !t.completed);
    const pct = total > 0 ? Math.round((completedList.length / total) * 100) : 0;

    const todayStr = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    let report = `📋 *DAILY TASK SUBMISSION REPORT — LIVE HOST*\n`;
    report += `👤 *Host:* Host\n`;
    report += `📅 *Date:* ${todayStr}\n`;
    report += `📊 *Progress:* ${completedList.length}/${total} (${pct}% Done)\n`;
    report += `✅ *Completed:* ${completedList.length}\n`;
    report += `⏳ *Pending:* ${pendingList.length}\n\n`;

    if (pendingList.length > 0) {
      report += `⏳ *Pending Submissions (${pendingList.length}):*\n`;
      pendingList.forEach((t, i) => {
        report += `${i + 1}. ${t.name}\n`;
      });
      report += `\n`;
    }

    if (completedList.length > 0) {
      report += `✅ *Completed Submissions (${completedList.length}):*\n`;
      completedList.slice(0, 15).forEach((t, i) => {
        report += `${i + 1}. ${t.name}\n`;
      });
      if (completedList.length > 15) {
        report += `... and ${completedList.length - 15} others.\n`;
      }
    }

    navigator.clipboard.writeText(report).then(() => {
      triggerSound('chime');
      notify('📋 Formatted Daily Report copied! Ready to send to WA/Telegram.');
    }).catch(() => {
      notify('Failed to copy daily report.');
    });
  }

  // ==================== CHAT TEMPLATE MODAL ====================

  function openChatTemplateModal(spenderId) {
    const spender = spendersData.find(s => s.id === spenderId);
    if (!spender) return;

    selectedSpenderForChat = spender;
    const modal = document.getElementById('hostChatModal');
    if (!modal) return;

    // Fill spender details
    const elName = document.getElementById('chatModalSpenderName');
    const elUname = document.getElementById('chatModalSpenderUname');
    const elKoin = document.getElementById('chatModalSpenderKoin');
    const elBadge = document.getElementById('chatModalSpenderBadge');

    if (elName) elName.textContent = spender.name;
    if (elUname) elUname.textContent = spender.username || '@-';
    if (elKoin) elKoin.textContent = `🪙 ${formatNumber(spender.koin)} koin • 🎁 ${formatNumber(spender.hadiah)} gift`;
    if (elBadge) elBadge.textContent = spender.labelUtama || 'VIP Spender';

    // Render template choices
    const listContainer = document.getElementById('chatTemplatesList');
    if (listContainer) {
      listContainer.innerHTML = CHAT_TEMPLATES.map((tmpl, idx) => {
        const generated = tmpl.text(spender.name);
        return `
          <div class="chat-template-card ${idx === 0 ? 'selected' : ''}" onclick="window.HostTracker.selectChatTemplate('${tmpl.id}')" id="tmpl-card-${tmpl.id}">
            <div class="tmpl-header">
              <span class="tmpl-title">${tmpl.title}</span>
              <span class="tmpl-badge">${tmpl.badge}</span>
            </div>
            <div class="tmpl-body">${escapeHtml(generated)}</div>
            <div class="tmpl-btn-row" style="display: flex; gap: 8px; margin-top: 8px;">
              <button type="button" class="tmpl-copy-btn btn-tmpl-launch" onclick="event.stopPropagation(); window.HostTracker.copyTemplateAndOpen('${tmpl.id}')" title="Salin pesan ini & langsung buka TikTok">
                🚀 Copy &amp; Open TikTok
              </button>
              <button type="button" class="tmpl-copy-btn btn-tmpl-secondary" onclick="event.stopPropagation(); window.HostTracker.copyTemplateText('${tmpl.id}')" title="Hanya salin teks ke clipboard">
                📋 Copy
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    // Set first template in custom editor
    const editor = document.getElementById('chatCustomEditor');
    if (editor) {
      editor.value = CHAT_TEMPLATES[0].text(spender.name);
    }

    modal.classList.add('open');
    triggerSound('bubble');
  }

  function selectChatTemplate(templateId) {
    if (!selectedSpenderForChat) return;
    const tmpl = CHAT_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    document.querySelectorAll('.chat-template-card').forEach(c => c.classList.remove('selected'));
    const activeCard = document.getElementById(`tmpl-card-${templateId}`);
    if (activeCard) activeCard.classList.add('selected');

    const editor = document.getElementById('chatCustomEditor');
    if (editor) {
      editor.value = tmpl.text(selectedSpenderForChat.name);
    }
    triggerSound('bubble');
  }

  // Salin pesan & langsung buka profil / DM TikTok spender
  function copyAndOpenTikTokDM(customText = null) {
    if (!selectedSpenderForChat) return;
    const editor = document.getElementById('chatCustomEditor');
    const textToCopy = (customText || (editor ? editor.value : '') || CHAT_TEMPLATES[0].text(selectedSpenderForChat.name)).trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      triggerSound('chime');
      selectedSpenderForChat.sudahChat = true;
      saveSpenders();
      renderSpendersTable();

      notify(`🚀 Message copied! Opening TikTok ${selectedSpenderForChat.name}... ready to Paste & Send!`);

      // Buka TikTok akun spender
      openTikTokAccount(selectedSpenderForChat.name, selectedSpenderForChat.username);

      setTimeout(() => {
        closeChatModal();
      }, 700);
    }).catch(() => {
      openTikTokAccount(selectedSpenderForChat.name, selectedSpenderForChat.username);
    });
  }

  function copyTemplateAndOpen(templateId) {
    if (!selectedSpenderForChat) return;
    const tmpl = CHAT_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;
    const text = tmpl.text(selectedSpenderForChat.name);
    copyAndOpenTikTokDM(text);
  }

  function copyTemplateText(templateId) {
    if (!selectedSpenderForChat) return;
    const tmpl = CHAT_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    const text = tmpl.text(selectedSpenderForChat.name);
    navigator.clipboard.writeText(text).then(() => {
      triggerSound('chime');
      notify(`📋 Greeting message for ${selectedSpenderForChat.name} copied!`);
      // Auto mark as contacted prompt or automatic
      selectedSpenderForChat.sudahChat = true;
      saveSpenders();
      renderSpendersTable();
    });
  }

  function copyCustomEditorText() {
    const editor = document.getElementById('chatCustomEditor');
    if (!editor || !editor.value.trim()) return;

    navigator.clipboard.writeText(editor.value).then(() => {
      triggerSound('chime');
      notify('📋 Custom message copied to clipboard!');
      if (selectedSpenderForChat) {
        selectedSpenderForChat.sudahChat = true;
        saveSpenders();
        renderSpendersTable();
      }
    });
  }

  function closeChatModal() {
    const modal = document.getElementById('hostChatModal');
    if (modal) modal.classList.remove('open');
    triggerSound('bubble');
  }

  // ==================== ADD NEW SPENDER ====================

  function openAddSpenderModal() {
    const modal = document.getElementById('addSpenderModal');
    if (modal) {
      modal.classList.add('open');
      triggerSound('bubble');
    }
  }

  function closeAddSpenderModal() {
    const modal = document.getElementById('addSpenderModal');
    if (modal) modal.classList.remove('open');
    triggerSound('bubble');
  }

  function submitNewSpender(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById('newSpenderName');
    const unameInput = document.getElementById('newSpenderUname');
    const koinInput = document.getElementById('newSpenderKoin');
    const hadiahInput = document.getElementById('newSpenderHadiah');
    const tierInput = document.getElementById('newSpenderTier');
    const labelInput = document.getElementById('newSpenderLabel');
    const noteInput = document.getElementById('newSpenderNote');

    if (!nameInput || !nameInput.value.trim()) {
      alert('Account name is required!');
      return;
    }

    const maxId = spendersData.reduce((max, s) => Math.max(max, s.id || 0), 0);
    const newSpender = {
      id: maxId + 1,
      name: nameInput.value.trim(),
      username: unameInput ? unameInput.value.trim() : '',
      hadiah: hadiahInput ? parseInt(hadiahInput.value) || 0 : 0,
      tier: tierInput ? parseInt(tierInput.value) || 0 : 0,
      koin: koinInput ? parseInt(koinInput.value) || 0 : 0,
      labelUtama: labelInput ? labelInput.value : 'Supporter',
      labelLain: '',
      notes: noteInput ? noteInput.value.trim() : '',
      sudahChat: false,
      sudahDibalas: false
    };

    spendersData.unshift(newSpender); // add to top
    saveSpenders();
    triggerSound('chime');
    notify(`➕ Spender account "${newSpender.name}" added successfully!`);

    closeAddSpenderModal();
    renderSpendersTable();

    // Reset inputs
    nameInput.value = '';
    if (unameInput) unameInput.value = '';
    if (koinInput) koinInput.value = '';
    if (hadiahInput) hadiahInput.value = '';
    if (noteInput) noteInput.value = '';
  }

  // ==================== EXPORT DATA (CSV) ====================

  function exportSpendersCSV() {
    let csv = 'No,Account Name,Username,Gifts,Tier,Total Coins,Primary Tag,Notes,Followed,Messaged,Replied\n';
    spendersData.forEach((s, idx) => {
      const row = [
        idx + 1,
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.username || '').replace(/"/g, '""')}"`,
        s.hadiah || 0,
        s.tier || 0,
        s.koin || 0,
        `"${(s.labelUtama || '').replace(/"/g, '""')}"`,
        `"${(s.notes || s.labelLain || '').replace(/"/g, '""')}"`,
        s.sudahFollow ? 'Yes' : 'No',
        s.sudahChat ? 'Yes' : 'No',
        s.sudahDibalas ? 'Yes' : 'No'
      ];
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap_spender_host_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSound('chime');
    notify('📥 Spender CSV file downloaded successfully!');
  }

  function exportTasksCSV() {
    let csv = 'No,Target Task Name,Status\n';
    tasksData.forEach((t, idx) => {
      csv += `${idx + 1},"${(t.name || '').replace(/"/g, '""')}",${t.completed ? 'Completed' : 'Pending'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap_tugas_harian_host_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSound('chime');
    notify('📥 Daily Tasks CSV file downloaded successfully!');
  }

  // Reset to Original Excel Dataset
  function resetToDefaultDataset() {
    if (!confirm('Peringatan: Ini akan mengembalikan seluruh data spender & tugas harian ke data awal dari file Excel. Lanjutkan?')) {
      return;
    }
    const defaultData = window.DEFAULT_HOST_TRACKER_DATA || { spenders: [], tasks: [] };
    spendersData = JSON.parse(JSON.stringify(defaultData.spenders || []));
    tasksData = JSON.parse(JSON.stringify(defaultData.tasks || []));
    saveSpenders();
    saveTasks();
    triggerSound('bubble');
    notify('🔄 Successfully restored all data to original Excel dataset!');
    renderSpendersTable();
    renderTasksList();
  }

  // ==================== ANALYTICS SECTION ====================

  function renderAnalytics() {
    const container = document.getElementById('hostAnalyticsContainer');
    if (!container) return;

    const totalKoin = spendersData.reduce((sum, s) => sum + (s.koin || 0), 0);
    const totalHadiah = spendersData.reduce((sum, s) => sum + (s.hadiah || 0), 0);
    const whales = spendersData.filter(s => (s.labelUtama || '').toLowerCase().includes('whale'));
    const highs = spendersData.filter(s => (s.labelUtama || '').toLowerCase().includes('high'));
    const supporters = spendersData.filter(s => (s.labelUtama || '').toLowerCase().includes('supporter'));

    // Top 10 Spenders
    const top10 = [...spendersData].sort((a, b) => (b.koin || 0) - (a.koin || 0)).slice(0, 10);

    container.innerHTML = `
      <div class="analytics-bento-grid">
        <!-- Card 1: Total Hadiah & Koin -->
        <div class="analytics-card glass-card">
          <div class="ac-header">
            <span class="ac-icon">💎</span>
            <div class="ac-title-wrap">
              <span class="ac-title">Total Accumulated Coins</span>
              <span class="ac-sub">From 329 Logged Spender Accounts</span>
            </div>
          </div>
          <div class="ac-big-num">🪙 ${formatNumber(totalKoin)}</div>
          <div class="ac-meta-pills">
            <span class="ac-pill">🎁 ${formatNumber(totalHadiah)} Total Gifts</span>
            <span class="ac-pill">⚡ Average: ${formatNumber(Math.round(totalKoin / (spendersData.length || 1)))} coins/spender</span>
          </div>
        </div>

        <!-- Card 2: Komposisi Tier -->
        <div class="analytics-card glass-card">
          <div class="ac-header">
            <span class="ac-icon">📊</span>
            <div class="ac-title-wrap">
              <span class="ac-title">Spender Segmentation</span>
              <span class="ac-sub">Whale vs High vs Supporter</span>
            </div>
          </div>
          <div class="segment-bars">
            <div class="seg-item">
              <div class="seg-label"><span>🐋 Whale (Priority 1)</span> <strong>${whales.length} accounts (${Math.round((whales.length / spendersData.length) * 100)}%)</strong></div>
              <div class="seg-bar-track"><div class="seg-bar-fill fill-whale" style="width: ${(whales.length / spendersData.length) * 100}%"></div></div>
            </div>
            <div class="seg-item">
              <div class="seg-label"><span>⭐ High Spender</span> <strong>${highs.length} accounts (${Math.round((highs.length / spendersData.length) * 100)}%)</strong></div>
              <div class="seg-bar-track"><div class="seg-bar-fill fill-high" style="width: ${(highs.length / spendersData.length) * 100}%"></div></div>
            </div>
            <div class="seg-item">
              <div class="seg-label"><span>💖 Supporter</span> <strong>${supporters.length} accounts (${Math.round((supporters.length / spendersData.length) * 100)}%)</strong></div>
              <div class="seg-bar-track"><div class="seg-bar-fill fill-supporter" style="width: ${(supporters.length / spendersData.length) * 100}%"></div></div>
            </div>
          </div>
        </div>

        <!-- Card 3: Top 10 Spender Leaderboard -->
        <div class="analytics-card glass-card span-2">
          <div class="ac-header">
            <span class="ac-icon">🏆</span>
            <div class="ac-title-wrap">
              <span class="ac-title">Top 10 VIP Spender Leaderboard</span>
              <span class="ac-sub">Top supporter rankings in Black's room</span>
            </div>
          </div>
          <div class="leaderboard-list">
            ${top10.map((s, i) => {
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
              return `
                <div class="lb-row ${i < 3 ? 'top-rank' : ''}">
                  <span class="lb-rank">${medal}</span>
                  <div class="lb-user">
                    <strong>${escapeHtml(s.name)}</strong>
                    <small>${escapeHtml(s.username || '')}</small>
                  </div>
                  <span class="badge-spender badge-whale">Whale</span>
                  <span class="lb-koin">🪙 ${formatNumber(s.koin)}</span>
                  <span class="lb-hadiah">🎁 ${formatNumber(s.hadiah)}</span>
                  <span class="lb-status ${s.sudahChat ? 'text-green' : 'text-amber'}">${s.sudahChat ? '✅ Messaged' : '⏳ Pending'}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Card 4: Host Tips for Black -->
        <div class="analytics-card glass-card span-2 tips-card">
          <div class="ac-header">
            <span class="ac-icon">💡</span>
            <div class="ac-title-wrap">
              <span class="ac-title">Quick Guide & Golden Rules for Black</span>
              <span class="ac-sub">Practical tips for greeting spenders & submitting daily tasks</span>
            </div>
          </div>
          <div class="host-tips-grid">
            <div class="tip-box">
              <div class="tip-icon">⏰</div>
              <strong>Best Time to Message:</strong>
              <p>Message spenders within 12–24 hours after stream ends, or 1–2 hours before the next live starts so you stay fresh in their mind.</p>
            </div>
            <div class="tip-box">
              <div class="tip-icon">✨</div>
              <strong>Use Display Names:</strong>
              <p>Always address spenders by their name. Personal greetings feel warm, genuine, and make supporters feel valued.</p>
            </div>
            <div class="tip-box">
              <div class="tip-icon">🎯</div>
              <strong>Focus on Whales First:</strong>
              <p>Filter by "Whale" and greet them first. These 107 Whale accounts are the foundation of your room and agency rankings!</p>
            </div>
            <div class="tip-box">
              <div class="tip-icon">📝</div>
              <strong>Submit Tasks on Time:</strong>
              <p>Use the "Copy Report" button to send daily recaps directly to the agency group without manual typing.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Public Interface for window.HostTracker
  window.HostTracker = {
    init: function () {
      loadData();
      renderOverviewStats();
      renderSpendersTable();
      renderTasksList();
      switchHostSubTab(activeSubTab);

      // Direct click listeners on subtab buttons for instant switching
      document.querySelectorAll('.host-subtab-btn').forEach(btn => {
        btn.onclick = function (e) {
          e.preventDefault();
          const target = btn.getAttribute('data-subtab');
          if (target) switchHostSubTab(target);
        };
      });

      // Bind search & filter inputs (Debounced for silky-smooth typing)
      let spenderDebounce = null;
      const searchInput = document.getElementById('spenderSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(spenderDebounce);
          spenderDebounce = setTimeout(() => {
            spenderSearch = e.target.value;
            spenderPage = 1;
            renderSpendersTable();
          }, 120);
        });
      }

      const sortSelect = document.getElementById('spenderSortSelect');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          spenderSort = e.target.value;
          spenderPage = 1;
          renderSpendersTable();
        });
      }

      let taskDebounce = null;
      const taskSearchInput = document.getElementById('taskSearchInput');
      if (taskSearchInput) {
        taskSearchInput.addEventListener('input', (e) => {
          clearTimeout(taskDebounce);
          taskDebounce = setTimeout(() => {
            taskSearch = e.target.value;
            renderTasksList();
          }, 100);
        });
      }
    },
    switchSubTab: switchHostSubTab,
    openTikTokAccount: openTikTokAccount,
    openTikTokById: openTikTokById,
    copyUsernameById: copyUsernameById,
    prevSpenderPage: prevSpenderPage,
    nextSpenderPage: nextSpenderPage,
    setSpenderFilter: function (filter) {
      spenderFilter = filter;
      spenderPage = 1;
      document.querySelectorAll('.filter-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
      });
      triggerSound('bubble');
      renderSpendersTable();
    },
    resetSpenderFilter: function () {
      spenderFilter = 'all';
      spenderSearch = '';
      spenderPage = 1;
      const input = document.getElementById('spenderSearchInput');
      if (input) input.value = '';
      document.querySelectorAll('.filter-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
      });
      renderSpendersTable();
    },
    searchSpenderByName: function (name) {
      this.switchSubTab('spenders');
      spenderFilter = 'all';
      spenderSearch = name;
      spenderPage = 1;
      const input = document.getElementById('spenderSearchInput');
      if (input) input.value = name;
      document.querySelectorAll('.filter-pill-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
      });
      triggerSound('bubble');
      renderSpendersTable();
      const toolbar = document.querySelector('.host-toolbar-box');
      if (toolbar) toolbar.scrollIntoView({ behavior: 'smooth' });
    },
    setTaskFilter: function (filter) {
      taskFilter = filter;
      document.querySelectorAll('.task-filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
      });
      triggerSound('bubble');
      renderTasksList();
    },
    toggleFollow: toggleSpenderFollow,
    toggleChat: toggleSpenderChat,
    toggleReply: toggleSpenderReply,
    copyUsername: copyUsername,
    editNote: editSpenderNote,
    toggleTask: toggleTask,
    resetDailyTasks: resetDailyTasks,
    markAllTasksDone: markAllTasksDone,
    addNewTaskPrompt: addNewTaskPrompt,
    openAddTaskModal: openAddTaskModal,
    closeAddTaskModal: closeAddTaskModal,
    submitModalNewTask: submitModalNewTask,
    submitInlineNewTask: submitInlineNewTask,
    deleteTask: deleteTask,
    copyDailyReport: copyDailyReport,
    openChatTemplateModal: openChatTemplateModal,
    selectChatTemplate: selectChatTemplate,
    copyTemplateText: copyTemplateText,
    copyCustomEditorText: copyCustomEditorText,
    copyAndOpenTikTokDM: copyAndOpenTikTokDM,
    copyTemplateAndOpen: copyTemplateAndOpen,
    closeChatModal: closeChatModal,
    openAddSpenderModal: openAddSpenderModal,
    closeAddSpenderModal: closeAddSpenderModal,
    submitNewSpender: submitNewSpender,
    exportSpendersCSV: exportSpendersCSV,
    exportTasksCSV: exportTasksCSV,
    resetToDefaultDataset: resetToDefaultDataset,
    render: function () {
      renderOverviewStats();
      switchHostSubTab(activeSubTab);
    }
  };

  // Expose global render function
  window.renderHostTracker = function () {
    if (window.HostTracker) {
      window.HostTracker.render();
    }
  };

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.HostTracker.init());
  } else {
    window.HostTracker.init();
  }

})();
