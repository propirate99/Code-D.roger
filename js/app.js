/**
 * TRIP GENIE - CORE APPLICATION CONTROLLER
 * Handles Themes, Global Search, Notifications, TRIP PAY Digital Wallet, Modals, and Toasts.
 */

// Global State
const AppState = {
  theme: localStorage.getItem('trip_genie_theme') || 'light',
  walletBalance: parseFloat(localStorage.getItem('trip_genie_wallet')) || 12450,
  notifications: JSON.parse(localStorage.getItem('trip_genie_notifications')) || [
    { id: 1, title: 'Flight Departs Tomorrow', text: 'IndiGo 6E-2044 to Goa at 06:30 AM (T3 Gate 14).', time: '10m ago', unread: true, icon: '✈️' },
    { id: 2, title: 'Hotel Check-in Reminder', text: 'Ocean Pearl Resort is ready for your arrival at 02:00 PM.', time: '1h ago', unread: true, icon: '🏨' },
    { id: 3, title: 'Your Cab is Arriving', text: 'Driver Ramesh is 3 mins away in Maruti Dzire (GA-03-AB-4921).', time: '2h ago', unread: true, icon: '🚕' },
    { id: 4, title: 'Travel Insurance Active', text: 'TRIP GENIE Protect Gold policy is active (Coverage: ₹5,00,000).', time: '1d ago', unread: false, icon: '🛡️' }
  ],
  transactions: JSON.parse(localStorage.getItem('trip_genie_txns')) || (window.TRIP_GENIE_DATA ? window.TRIP_GENIE_DATA.initialTransactions : []),
  session: (function(){ try { return JSON.parse(localStorage.getItem('trip_genie_session')); } catch(e) { return null; } })()
};

// --- Auth / Session Gate ---
const AUTH_SESSION_KEY = 'trip_genie_session';
const _currentPath = window.location.pathname;
if (!/login\.html$/.test(_currentPath) && !AppState.session) {
  const prefix = _currentPath.includes('/pages/') ? '../' : '';
  window.location.replace(prefix + 'login.html');
}

function getSessionUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)); } catch(e) { return null; }
}

function logoutUser() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
  window.location.replace(prefix + 'login.html');
}

// --- 1. Theme Manager ---
function initTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  updateThemeIcon();
}

function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('trip_genie_theme', AppState.theme);
  document.documentElement.setAttribute('data-theme', AppState.theme);
  updateThemeIcon();
  showToast(`Switched to ${AppState.theme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info', AppState.theme === 'dark' ? '🌙' : '☀️');
}

function updateThemeIcon() {
  const themeBtns = document.querySelectorAll('.btn-theme-toggle');
  themeBtns.forEach(btn => {
    btn.innerHTML = AppState.theme === 'dark' ? '<i class="fas fa-sun"></i> ☀️' : '<i class="fas fa-moon"></i> 🌙';
  });
}

// --- 2. Toast Notification Engine ---
function showToast(message, type = 'info', icon = null) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const defaultIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icon || defaultIcons[type] || 'ℹ️'}</div>
    <div class="toast-content">
      <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- 3. Notification Center Dropdown ---
function initNotifications() {
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notificationList');
  const badge = document.getElementById('notificationBadge');
  if (!list) return;

  const unreadCount = AppState.notifications.filter(n => n.unread).length;
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }

  list.innerHTML = '';
  if (AppState.notifications.length === 0) {
    list.innerHTML = '<div style="padding:1.5rem; text-align:center; color:var(--text-muted);">No new notifications</div>';
    return;
  }

  AppState.notifications.forEach(item => {
    const div = document.createElement('div');
    div.className = `notification-item ${item.unread ? 'unread' : ''}`;
    div.style.cssText = `
      display: flex; gap: 0.85rem; padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-color);
      background: ${item.unread ? 'rgba(124, 58, 237, 0.05)' : 'transparent'}; cursor: pointer; transition: background 0.2s;
    `;
    div.innerHTML = `
      <div style="font-size:1.3rem; width:36px; height:36px; border-radius:50%; background:var(--bg-body); display:flex; align-items:center; justify-content:center;">${item.icon}</div>
      <div style="flex:1;">
        <div style="font-weight:700; font-size:0.88rem; color:var(--text-primary);">${item.title}</div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:2px;">${item.text}</div>
        <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px;">${item.time}</div>
      </div>
      ${item.unread ? '<div style="width:8px; height:8px; border-radius:50%; background:var(--primary-purple); align-self:center;"></div>' : ''}
    `;
    div.onclick = () => {
      item.unread = false;
      saveNotifications();
      renderNotifications();
    };
    list.appendChild(div);
  });
}

function markAllNotificationsRead() {
  AppState.notifications.forEach(n => n.unread = false);
  saveNotifications();
  renderNotifications();
  showToast('All notifications marked as read', 'success');
}

function saveNotifications() {
  localStorage.setItem('trip_genie_notifications', JSON.stringify(AppState.notifications));
}

// --- 4. TRIP PAY - Digital Payments Engine ---
function initTripPay() {
  updateWalletDisplay();
  renderTransactionsList();
}

function updateWalletDisplay() {
  const walletEls = document.querySelectorAll('.wallet-balance-val');
  walletEls.forEach(el => {
    el.textContent = `₹${AppState.walletBalance.toLocaleString('en-IN')}`;
  });
}

function openPayModal(action = 'send') {
  const modal = document.getElementById('tripPayModal');
  const title = document.getElementById('payModalTitle');
  const content = document.getElementById('payModalBody');
  if (!modal || !content) return;

  if (action === 'send') {
    title.textContent = 'TRIP PAY • Send Money (UPI / Contact)';
    content.innerHTML = `
      <form id="sendMoneyForm" onsubmit="handleSendMoney(event)">
        <div style="margin-bottom:1rem;">
          <label class="input-label">Enter UPI ID or Mobile Number</label>
          <div class="input-field-wrapper">
            <span>📱</span>
            <input type="text" id="payRecipient" placeholder="e.g. rahul@upi or 9876543210" required />
          </div>
        </div>
        <div style="margin-bottom:1.25rem;">
          <label class="input-label">Amount (₹)</label>
          <div class="input-field-wrapper">
            <span style="font-weight:800; color:var(--primary-purple);">₹</span>
            <input type="number" id="payAmount" placeholder="Enter amount (e.g. 500)" min="1" max="${AppState.walletBalance}" required />
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">Available Balance: ₹${AppState.walletBalance.toLocaleString('en-IN')}</div>
        </div>
        <div style="margin-bottom:1.5rem;">
          <label class="input-label">Remark / Purpose (Optional)</label>
          <div class="input-field-wrapper">
            <span>📝</span>
            <input type="text" id="payNote" placeholder="e.g. Travel split, Dinner, Cab fare" />
          </div>
        </div>
        <div style="background:rgba(239, 68, 68, 0.08); border:1px solid rgba(239, 68, 68, 0.2); border-radius:var(--radius-md); padding:0.75rem; margin-bottom:1.5rem; font-size:0.8rem; color:var(--sos-red);">
          ⚠️ <strong>Demo Simulation:</strong> No real money will be charged. This demonstrates instant UPI payment flow.
        </div>
        <button type="submit" class="btn btn-primary btn-full btn-lg">
          <span>Pay Securely with TRIP PAY</span> 🔒
        </button>
      </form>
    `;
  } else if (action === 'qr') {
    title.textContent = 'TRIP PAY • Scan & Pay QR';
    content.innerHTML = `
      <div style="text-align:center; padding:1rem 0;">
        <div style="width:200px; height:200px; margin:0 auto 1.5rem; background:#fff; padding:12px; border-radius:var(--radius-lg); box-shadow:0 8px 24px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=tripgenie@okhdfcbank&pn=TripGenieMerchant&am=250" alt="QR Code" style="width:100%; height:100%; border-radius:8px;" />
          <div style="position:absolute; top:0; left:0; right:0; height:3px; background:var(--primary-purple); box-shadow:0 0 10px var(--primary-purple); animation:shimmer 2s infinite linear;"></div>
        </div>
        <p style="font-weight:700; color:var(--text-primary); margin-bottom:0.25rem;">Merchant: Ocean Cafe & Bistro</p>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">UPI ID: oceancafe@tripgenie</p>
        <button class="btn btn-primary btn-full" onclick="simulateQRScanPayment()">
          <span>Simulate Quick Scan & Pay (₹250)</span> ✨
        </button>
      </div>
    `;
  } else if (action === 'recharge') {
    title.textContent = 'TRIP PAY • Mobile Recharge & Bills';
    content.innerHTML = `
      <form onsubmit="handleRecharge(event)">
        <div style="margin-bottom:1rem;">
          <label class="input-label">Mobile / Consumer Number</label>
          <div class="input-field-wrapper">
            <span>⚡</span>
            <input type="tel" id="recMobile" placeholder="Enter 10-digit number" required />
          </div>
        </div>
        <div style="margin-bottom:1rem;">
          <label class="input-label">Select Operator & Circle</label>
          <div class="input-field-wrapper">
            <span>📡</span>
            <select id="recOperator">
              <option>Jio Prepaid - National</option>
              <option>Airtel Prepaid - National</option>
              <option>Vi (Vodafone Idea) - National</option>
              <option>BSNL Prepaid - National</option>
            </select>
          </div>
        </div>
        <div style="margin-bottom:1.5rem;">
          <label class="input-label">Plan Amount (₹)</label>
          <div class="input-field-wrapper">
            <span style="font-weight:800; color:var(--primary-purple);">₹</span>
            <input type="number" id="recAmount" value="299" required />
          </div>
          <div style="font-size:0.75rem; color:var(--accent-green); margin-top:4px;">Includes 1.5GB/day + Unlimited Calls for 28 Days</div>
        </div>
        <button type="submit" class="btn btn-primary btn-full btn-lg">Recharge Now (₹299)</button>
      </form>
    `;
  }

  modal.classList.add('active');
}

function closePayModal() {
  const modal = document.getElementById('tripPayModal');
  if (modal) modal.classList.remove('active');
}

async function handleSendMoney(e) {
  e.preventDefault();
  const recipient = document.getElementById('payRecipient').value;
  const amount = parseFloat(document.getElementById('payAmount').value);
  const note = document.getElementById('payNote').value || 'Travel Payment';

  if (amount > AppState.walletBalance) {
    showToast('Insufficient wallet balance!', 'error');
    return;
  }

  let newTxn;
  try {
    const response = await fetch('http://' + (window.location.hostname || 'localhost') + ':8000/api/wallet/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, recipient, category: 'UPI Transfer', note })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || 'Payment could not be completed');
    AppState.walletBalance = result.new_balance;
    newTxn = {
      id: result.txn_id,
      title: `Sent to ${recipient}`,
      category: 'UPI Transfer',
      date: 'Just now',
      amount: -amount,
      status: 'Success',
      icon: '💸'
    };
  } catch (error) {
    showToast(error.message || 'Payment service unavailable', 'error');
    return;
  }

  AppState.transactions.unshift(newTxn);
  localStorage.setItem('trip_genie_wallet', AppState.walletBalance);
  localStorage.setItem('trip_genie_txns', JSON.stringify(AppState.transactions));

  closePayModal();
  updateWalletDisplay();
  renderTransactionsList();

  // Show Payment Confirmation Modal with scratch card
  showPaymentSuccessModal(amount, recipient, newTxn.id);
}

function simulateQRScanPayment() {
  const amount = 250;
  if (amount > AppState.walletBalance) {
    showToast('Insufficient wallet balance!', 'error');
    return;
  }

  AppState.walletBalance -= amount;
  localStorage.setItem('trip_genie_wallet', AppState.walletBalance);

  const newTxn = {
    id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    title: 'Ocean Cafe & Bistro (QR Pay)',
    category: 'Food & Dining',
    date: 'Just now',
    amount: -amount,
    status: 'Success',
    icon: '🍜'
  };

  AppState.transactions.unshift(newTxn);
  localStorage.setItem('trip_genie_txns', JSON.stringify(AppState.transactions));

  closePayModal();
  updateWalletDisplay();
  renderTransactionsList();

  showPaymentSuccessModal(amount, 'Ocean Cafe & Bistro', newTxn.id);
}

function handleRecharge(e) {
  e.preventDefault();
  const mobile = document.getElementById('recMobile').value;
  const amount = parseFloat(document.getElementById('recAmount').value);

  AppState.walletBalance -= amount;
  localStorage.setItem('trip_genie_wallet', AppState.walletBalance);

  const newTxn = {
    id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `Mobile Recharge (${mobile})`,
    category: 'Recharge',
    date: 'Just now',
    amount: -amount,
    status: 'Success',
    icon: '⚡'
  };

  AppState.transactions.unshift(newTxn);
  localStorage.setItem('trip_genie_txns', JSON.stringify(AppState.transactions));

  closePayModal();
  updateWalletDisplay();
  renderTransactionsList();

  showPaymentSuccessModal(amount, `Mobile Recharge (${mobile})`, newTxn.id);
}

function showPaymentSuccessModal(amount, recipient, txnId) {
  const modal = document.getElementById('paymentSuccessModal');
  const amountEl = document.getElementById('successPayAmount');
  const recipEl = document.getElementById('successPayRecipient');
  const txnEl = document.getElementById('successPayTxnId');
  const rewardEl = document.getElementById('successPayReward');

  if (!modal) return;

  if (amountEl) amountEl.textContent = `₹${amount.toLocaleString('en-IN')}`;
  if (recipEl) recipEl.textContent = recipient;
  if (txnEl) txnEl.textContent = txnId;

  // Random Cashback reward simulation
  const cashback = Math.floor(Math.random() * 45) + 5;
  if (rewardEl) {
    rewardEl.innerHTML = `
      <div style="background:linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%); color:#78350F; padding:0.85rem; border-radius:var(--radius-lg); font-weight:700; margin-top:1.25rem; display:flex; align-items:center; justify-content:center; gap:0.5rem;">
        <span>🎉 Scratch Card Reward:</span> <span>You won ₹${cashback} Genie Cashback!</span>
      </div>
    `;
    // Add cashback back to wallet
    AppState.walletBalance += cashback;
    localStorage.setItem('trip_genie_wallet', AppState.walletBalance);
    updateWalletDisplay();
  }

  modal.classList.add('active');
}

function closePaymentSuccessModal() {
  const modal = document.getElementById('paymentSuccessModal');
  if (modal) modal.classList.remove('active');
}

function renderTransactionsList() {
  const list = document.getElementById('transactionsHistoryList');
  if (!list) return;

  list.innerHTML = '';
  if (AppState.transactions.length === 0) {
    list.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--text-muted);">No transaction history</div>';
    return;
  }

  AppState.transactions.forEach(t => {
    const isNegative = t.amount < 0;
    const item = document.createElement('div');
    item.className = 'glass-card';
    item.style.cssText = 'padding:1rem 1.25rem; display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;';
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:1rem;">
        <div style="width:44px; height:44px; border-radius:var(--radius-md); background:var(--bg-body); display:flex; align-items:center; justify-content:center; font-size:1.3rem;">${t.icon || '💳'}</div>
        <div>
          <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">${t.title}</div>
          <div style="font-size:0.8rem; color:var(--text-muted);">${t.category} • ${t.date}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:800; font-size:1.05rem; color:${isNegative ? 'var(--text-primary)' : 'var(--accent-green)'};">
          ${isNegative ? '-' : '+'}₹${Math.abs(t.amount).toLocaleString('en-IN')}
        </div>
        <div style="font-size:0.75rem; color:var(--accent-green); font-weight:600;">● ${t.status}</div>
      </div>
    `;
    list.appendChild(item);
  });
}

// --- 5. Global Search Modal (Ctrl + K) ---
function initGlobalSearch() {
  const input = document.getElementById('globalSearchInput');
  const modal = document.getElementById('globalSearchModal');
  const resultsContainer = document.getElementById('globalSearchResults');

  // Shortcut Listener
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openGlobalSearch();
    }
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeGlobalSearch();
    }
  });

  if (input) {
    input.addEventListener('input', (e) => {
      performGlobalSearch(e.target.value.trim().toLowerCase(), resultsContainer);
    });
  }
}

function openGlobalSearch() {
  const modal = document.getElementById('globalSearchModal');
  const input = document.getElementById('globalSearchInput');
  const resultsContainer = document.getElementById('globalSearchResults');
  if (!modal) return;
  modal.classList.add('active');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 100);
  }
  performGlobalSearch('', resultsContainer);
}

function closeGlobalSearch() {
  const modal = document.getElementById('globalSearchModal');
  if (modal) modal.classList.remove('active');
}

function performGlobalSearch(query, container) {
  if (!container || !window.TRIP_GENIE_DATA) return;
  container.innerHTML = '';

  const data = window.TRIP_GENIE_DATA;
  let matches = [];

  // Search Destinations
  data.destinations.forEach(d => {
    if (!query || d.name.toLowerCase().includes(query) || d.state.toLowerCase().includes(query) || d.category.toLowerCase().includes(query)) {
      matches.push({ title: d.name, subtitle: `${d.state} • ${d.category}`, type: 'Destination', icon: '🌴', url: 'pages/explore.html?dest=' + d.id });
    }
  });

  // Search Stays
  data.stays.forEach(s => {
    if (!query || s.name.toLowerCase().includes(query) || s.location.toLowerCase().includes(query)) {
      matches.push({ title: s.name, subtitle: `${s.location} • ₹${s.pricePerNight}/night`, type: 'Hotel / Stay', icon: '🏨', url: 'pages/services.html#stays' });
    }
  });

  // Search Food
  data.restaurants.forEach(r => {
    if (!query || r.name.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query)) {
      matches.push({ title: r.name, subtitle: `${r.cuisine} • Rating ⭐ ${r.rating}`, type: 'Food', icon: '🍜', url: 'pages/services.html#food' });
    }
  });

  // Search Movies
  data.entertainment.forEach(m => {
    if (!query || m.title.toLowerCase().includes(query) || m.genre.toLowerCase().includes(query)) {
      matches.push({ title: m.title, subtitle: `${m.genre} • ${m.language}`, type: 'Entertainment', icon: '🎬', url: 'pages/services.html#entertainment' });
    }
  });

  // Search Services
  const quickNav = [
    { title: 'TRIP PAY (Send Money & UPI)', subtitle: 'Digital Payments & Recharge', type: 'Service', icon: '💳', url: 'pages/services.html#pay' },
    { title: 'Flight Booking (IndiGo, Air India)', subtitle: 'Search & Book domestic flights', type: 'Service', icon: '✈️', url: 'pages/services.html#travel' },
    { title: 'Genie Cabs & Auto', subtitle: 'Book rides with live driver tracking', type: 'Service', icon: '🚕', url: 'pages/services.html#rides' },
    { title: 'TRIP MAP (GPS & Offline Maps)', subtitle: 'Navigation and offline maps', type: 'Service', icon: '🗺️', url: 'pages/maps.html' },
    { title: 'Emergency SOS Dashboard', subtitle: 'Instant 24x7 Safety Assistance', type: 'Safety', icon: '🆘', url: 'pages/emergency.html' },
    { title: 'Genie AI Travel Copilot', subtitle: 'Instant itinerary generator', type: 'AI Assistant', icon: '🧞', url: 'pages/genie-ai.html' }
  ];

  quickNav.forEach(q => {
    if (!query || q.title.toLowerCase().includes(query) || q.subtitle.toLowerCase().includes(query)) {
      matches.push(q);
    }
  });

  if (matches.length === 0) {
    container.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-muted);">No results found for "${query}"</div>`;
    return;
  }

  matches.slice(0, 8).forEach(item => {
    const div = document.createElement('a');
    div.href = item.url;
    div.className = 'search-result-item';
    div.innerHTML = `
      <div class="search-result-icon">${item.icon}</div>
      <div style="flex:1;">
        <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">${item.title}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${item.subtitle}</div>
      </div>
      <span class="badge badge-primary" style="font-size:0.7rem;">${item.type}</span>
    `;
    div.onclick = () => closeGlobalSearch();
    container.appendChild(div);
  });
}

// --- 6. Mobile Navigation Drawer ---
function toggleMobileDrawer() {
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (!drawer) return;

  drawer.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

// --- Initialize Core Controller on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNotifications();
  initTripPay();
  initGlobalSearch();

  // Scroll listener for sticky navbar blur
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.genie-navbar');
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
});

// Export globals
window.AppState = AppState;
window.showToast = showToast;
window.toggleTheme = toggleTheme;
window.openPayModal = openPayModal;
window.closePayModal = closePayModal;
window.handleSendMoney = handleSendMoney;
window.simulateQRScanPayment = simulateQRScanPayment;
window.handleRecharge = handleRecharge;
window.closePaymentSuccessModal = closePaymentSuccessModal;
window.openGlobalSearch = openGlobalSearch;
window.closeGlobalSearch = closeGlobalSearch;
window.toggleMobileDrawer = toggleMobileDrawer;
window.markAllNotificationsRead = markAllNotificationsRead;
