/**
 * TRIP GENIE - AI TRAVEL COPILOT (GENIE AI)
 * Handles Natural Conversational Queries, Predefined Intelligent Responses,
 * Itinerary Generation, Packing Suggestions, and Typing Indicators.
 */

// chatbot.js — Local AI chat powered by Ollama
// Wired to the ACTUAL elements used in genie-ai.html: #chatBody, #chatInput, #sendBtn
//
// Prereqs:
//   1. Make sure only ONE ollama serve is running (kill stray ones first):
//        pkill ollama
//        OLLAMA_ORIGINS="*" ollama serve
//   2. Pull a model:            ollama pull gemma2
//   3. Pick a model from the in-app "Model" dropdown (or use the default below)

const OLLAMA_URL = 'http://localhost:11434/api/chat';
// Selected Ollama model — persists across sessions, defaults to gemma2:2b
let currentModel = localStorage.getItem('trip_genie_model') || 'gemma2:2b';
const OLLAMA_TAGS_URL = 'http://localhost:11434/api/tags';

// --- Cloud A.I. (Google Gemini) — used automatically when the internet is available ---
const GEMINI_API_KEY =
  (typeof window !== 'undefined' && window.GEMINI_API_KEY) ||
  localStorage.getItem('trip_genie_gemini_key') ||
  localStorage.getItem('GEMINI_API_KEY') ||
  '';
const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_API_KEY;
// Lightweight endpoint used to probe REAL internet reachability (not just LAN).
// navigator.onLine alone can report "online" over ethernet/LAN while WiFi is off.
const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + GEMINI_API_KEY;

// Where the last AI reply came from: 'cloud' (Gemini) or 'local' (Ollama)
let lastAISource = 'local';

// Fetch the Ollama models that are actually pulled/downloaded on this machine
async function getOllamaModels() {
  try {
    const res = await fetch(OLLAMA_TAGS_URL, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('status ' + res.status);
    const data = await res.json();
    return (data.models || []).map((m) => m.name);
  } catch (err) {
    console.error('Could not fetch Ollama models:', err);
    return [];
  }
}

// Switch the active model and remember the choice
function setModel(name) {
  if (!name) return;
  currentModel = name;
  localStorage.setItem('trip_genie_model', name);
}

// Renders a Model: <dropdown> into a chat header so users can switch models in-app
function renderModelSelector(container) {
  const header = container || document.querySelector('.chat-header');
  if (!header) return;

  // Idempotent: don't double-add if already rendered
  if (header.querySelector('#genieModelSelect')) return;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex; align-items:center; gap:8px; margin-left:auto;';

  // Source badge — shows whether the last reply came from cloud (Gemini) or local (Ollama)
  const badge = document.createElement('span');
  badge.id = 'genieAIStatus';
  badge.style.cssText = 'font-size:0.7rem; padding:3px 8px; border-radius:999px; white-space:nowrap;';
  wrap.appendChild(badge);

  const label = document.createElement('span');
  label.textContent = '🛠 Local model:';
  label.title = 'Used when offline; Gemini (cloud) is used automatically when online';
  label.style.cssText = 'font-size:0.72rem; color:var(--text-muted,#cbd5e1); white-space:nowrap;';

  const sel = document.createElement('select');
  sel.id = 'genieModelSelect';
  sel.title = 'Switch local Ollama model (offline fallback)';
  sel.setAttribute('aria-label', 'AI model');
  sel.style.cssText =
    'font-size:0.75rem; padding:4px 8px; border-radius:8px; border:1px solid #ffffff33;' +
    'background:#ffffff14; color:#fff; outline:none; cursor:pointer; max-width:150px;';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'loading…';
  sel.appendChild(placeholder);

  getOllamaModels().then((models) => {
    // Fallback to the known local models if the API call failed
    if (!models.length) models = ['gemma2:2b', 'llama3.2:1b'];
    if (!models.includes(currentModel)) models.unshift(currentModel);
    sel.innerHTML = '';
    models.forEach((m) => {
      const o = document.createElement('option');
      o.value = m;
      o.textContent = m;
      if (m === currentModel) o.selected = true;
      sel.appendChild(o);
    });
    // Keep current model selected even if the list is async-empty edge case
    if (!sel.value) sel.value = currentModel;
  });

  sel.addEventListener('change', () => {
    if (sel.value) setModel(sel.value);
  });

  wrap.appendChild(label);
  wrap.appendChild(sel);

  // Insert into the header, before any close button if present
  const closeBtn = header.querySelector('.chat-close-btn');
  if (closeBtn) header.insertBefore(wrap, closeBtn);
  else header.appendChild(wrap);

  refreshAIStatus();
}

// System prompt — keeps Genie AI in character as the TripGenie India travel guide.
// Applies to BOTH chat surfaces (page chat + floating widget) because they all
// call askGenieAI(), which uses this shared conversationHistory.
let conversationHistory = [
  {
    role: 'system',
    content:
      'You are Genie AI, a warm, friendly local India travel guide for the TripGenie app. Follow these rules strictly.\n\n' +
      '1. INDIA ONLY — You plan trips within India only. If the user asks for an international destination, politely explain that your expertise is dedicated to Indian travel and offer a suitable Indian alternative.\n' +
      '2. SCOPE — Help with travel, logistics, and itinerary planning in India. Politely decline any query unrelated to travel.\n' +
      '3. FEASIBILITY FIRST — Never invent impossible or unrealistic plans (unrealistic transit times, closed routes, extreme budget mismatches). If a plan is not feasible, explain why and propose a realistic alternative with an estimated budget in rupees (₹).\n' +
      '4. ECO-FRIENDLY TRANSIT — Prioritize sustainable local transport: walking for distances under 2 km, cycling or e-rickshaws for 2-5 km, and electric vehicles, public buses or trains for longer legs.\n' +
      '5. DE-CONGESTION — Briefly acknowledge popular hotspots (e.g. Taj Mahal, Pangong Lake, Ooty town centre), then proactively suggest lesser-known, equally stunning hidden gems nearby to help spread out visitor traffic.\n' +
      '6. PERSONALIZE — When the user profile, past bookings, chat history or preferences are available, tailor pace, activity level, budget, cuisine and destinations to the user (age, dietary needs, budget tier).\n' +
      '7. BOOKING SAFETY — If the user decides on a plan, first present a clear booking draft (dates, operator or hotel, cost, route), then ask for explicit confirmation before triggering any booking. After confirmation, present a clean summary ready for payment.\n' +
      '8. TONE & FORMAT — Speak like an encouraging local friend. Be honest and direct about travel times, crowds, weather and realistic costs. Use short paragraphs, bullet points and markdown tables for budgets and itineraries so they are easy to read on mobile.\n\n' +
      'Keep replies concise (2-4 sentences) unless the user asks for a detailed itinerary.'
  }
];

// Keywords that should still trigger the mock "Smart Booking Flow" UI panel
// (this stays separate from the AI chat reply — it's a UI demo, not something Ollama controls)
const BOOKING_TRIGGER_KEYS = ['mysuru', '3-day', '15000', '₹15,000'];

function initChat() {
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  if (!chatBody || !chatInput || !sendBtn) {
    console.warn(
      'chatbot.js: could not find #chatBody / #chatInput / #sendBtn on this page.'
    );
    return;
  }

  // Suggestion chips (e.g. "Plan a 3-day Goa trip") just fill the input and send
  document.querySelectorAll('.suggestion').forEach((btn) => {
    btn.addEventListener('click', () => {
      chatInput.value = btn.textContent;
      handleSend();
    });
  });

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  function addBubble(text, who) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${who}`;
    bubble.textContent = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    return bubble;
  }

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addBubble(text, 'user');
    chatInput.value = '';
    sendBtn.disabled = true;

    // Keep the mock booking panel demo working, unrelated to the AI call
    const lower = text.toLowerCase();
    if (BOOKING_TRIGGER_KEYS.some((k) => lower.includes(k))) {
      setTimeout(() => {
        if (typeof renderMysuruBookingFlow === 'function') renderMysuruBookingFlow();
      }, 450);
    }

    const replyBubble = addBubble('Thinking…', 'bot');

    try {
      const reply = await askGenieAI(text);
      replyBubble.textContent = reply;
    } catch (err) {
      console.error('Ollama request failed:', err);
      replyBubble.textContent =
        "Couldn't reach the local AI. Make sure `ollama serve` is running " +
        "(with OLLAMA_ORIGINS=\"*\"), only one instance is running, and the " +
        "model name in chatbot.js matches `ollama list`.";
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }
}

// Low-level Ollama call: sends the given messages and returns the reply (no history changes)
async function callOllama(messages) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: currentModel,
      messages,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama returned status ${response.status}`);
  }

  const data = await response.json();
  return data.message.content;
}

// Backwards-compatible local-only helper
async function askOllama(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });
  return callOllama(conversationHistory);
}

// Google Gemini (cloud) call — converts the shared history to Gemini's format
async function askGemini(messages) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');
  const system = messages.find((m) => m.role === 'system');
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  const payload = { contents };
  if (system) payload.systemInstruction = { parts: [{ text: system.content }] };

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error('Gemini HTTP ' + res.status + ': ' + body.slice(0, 140));
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || '')
    .join('');
  if (!text) throw new Error('Empty Gemini reply');
  return text;
}

// Smart AI dispatcher: uses cloud Gemini when online, else the local Ollama model.
// Switches online <-> offline automatically in the same chat interface.
async function askGenieAI(userMessage) {
  conversationHistory.push({ role: 'user', content: userMessage });

  if (await isInternetOnline()) {
    try {
      const reply = await askGemini(conversationHistory);
      lastAISource = 'cloud';
      conversationHistory.push({ role: 'assistant', content: reply });
      refreshAIStatus();
      return reply;
    } catch (err) {
      console.warn('Gemini unavailable (' + (err && err.message ? err.message : err) + ') — switching to local Ollama.');
    }
  }

  // Offline (or Gemini failed): use the local Ollama model
  const reply = await callOllama(conversationHistory);
  lastAISource = 'local';
  conversationHistory.push({ role: 'assistant', content: reply });
  refreshAIStatus();
  return reply;
}

// Cache of the last known real connectivity state, kept in sync with the badge.
let aiOnline = navigator.onLine;

// REAL internet reachability check. navigator.onLine is UNRELIABLE — it only
// reports whether a network interface exists (ethernet/LAN) and can stay true
// even while WiFi is off. So we probe Gemini with a short-timeout request.
async function isInternetOnline() {
  // Fast-fail only when the browser definitively reports offline
  if (!navigator.onLine) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(GEMINI_MODELS_URL, { method: 'GET', cache: 'no-store', signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Update the small source badge (Cloud / Local) in the chat header.
// Backed by a real reachability probe so it reflects true internet status.
async function refreshAIStatus() {
  const badge = document.getElementById('genieAIStatus');
  if (!badge) return;

  aiOnline = await isInternetOnline();
  if (aiOnline) {
    badge.textContent = '☁️ Cloud';
    badge.title = 'Internet available — automatic Gemini (cloud)';
    badge.style.background = 'rgba(0,216,200,.18)';
    badge.style.color = '#00d8c8';
  } else {
    badge.textContent = '💻 Local';
    badge.title = 'Offline — local Ollama model';
    badge.style.background = 'rgba(255,255,255,.14)';
    badge.style.color = '#cbd5e1';
  }
}

// Keep the badge in sync with real network state at all times:
//  (a) react to the browser's online/offline events, and
//  (b) re-probe periodically as a safety net (those events can be wrong/stale).
window.addEventListener('online', refreshAIStatus);
window.addEventListener('offline', refreshAIStatus);
setInterval(refreshAIStatus, 10000);

document.addEventListener('DOMContentLoaded', initChat);
// Auto-render the model switcher into whichever chat header exists on this page
document.addEventListener('DOMContentLoaded', () => renderModelSelector());
const GenieChatbot = {
  isOpen: false,
  isTyping: false,
  chatHistory: [],

  // Predefined Knowledge Base
  knowledgeBase: {
    'goa': {
      title: '✨ 3-Day Ultimate Goa Trip Plan',
      text: `Here is your curated 3-day beach & culture itinerary for Goa:

📍 **Day 1: North Beaches & Vibrant Nightlife**
• Morning: Arrive & check in at Calangute/Baga
• Afternoon: Relax at Baga Beach, water sports & beach shacks
• Evening: Sunset at Anjuna & Tito's Lane nightlife
• Dinner: Fresh seafood at Coastal Spice Shack

📍 **Day 2: Historic Portuguese Heritage & Forts**
• Morning: Explore Fort Aguada & historic lighthouse
• Afternoon: UNESCO Heritage Churches in Old Goa (Basilica of Bom Jesus)
• Evening: Mandovi River Sunset Cruise with Goan folk dance
• Dinner: Traditional Goan Fish Curry & Bebinca

📍 **Day 3: Serene South Goa & Spice Plantations**
• Morning: Visit Sahakari Spice Farm with traditional buffet lunch
• Afternoon: Peaceful vibes at Palolem & Colva Beach
• Evening: Souvenir shopping at Panjim Latin Quarter (Fontainhas)

💰 **Estimated Budget:** ₹10,000 – ₹15,000 per person (including stay & local travel).`,
      actions: [{ label: 'Book Goa Flight (₹4,299)', url: 'pages/services.html#travel' }, { label: 'Explore Stays in Goa', url: 'pages/services.html#stays' }]
    },

    'manali': {
      title: '🏔️ 4-Day Manali & Solang Valley Adventure',
      text: `Here is your thrilling Himalayan getaway itinerary:

📍 **Day 1: Arrival & Old Manali Cafes**
• Check in at Pine Cliff Villa, visit Hadimba Devi Temple & Mall Road shopping.

📍 **Day 2: Solang Valley Snow & Adventure**
• Paragliding, Zorbing, and scenic ATV rides in Solang Valley.

📍 **Day 3: Rohtang Pass / Atal Tunnel & Sissu**
• Drive through world-famous Atal Tunnel into snow-capped Lahaul Valley.

📍 **Day 4: Vashisht Hot Springs & Departure**
• Dip in natural sulfur hot springs & buy warm Kullu shawls.

💰 **Estimated Budget:** ₹12,000 – ₹18,000 per person.`,
      actions: [{ label: 'View Manali Villas', url: 'pages/services.html#stays' }]
    },

    'kerala': {
      title: '🌴 4-Day God\'s Own Country - Kerala Backwaters',
      text: `A peaceful rejuvenating journey through misty hills and backwaters:

📍 **Day 1-2: Munnar Tea Hills**
• Walk through sprawling tea plantations, visit Mattupetty Dam & Eravikulam National Park.

📍 **Day 3: Alleppey Luxury Houseboat Cruise**
• Cruise through serene palm-fringed canals with traditional Karimeen Pollichathu meal.

📍 **Day 4: Kochi Heritage & Chinese Fishing Nets**
• Explore Fort Kochi, spice markets, and Kathakali cultural performances.

💰 **Estimated Budget:** ₹14,000 – ₹20,000 per person.`,
      actions: [{ label: 'Explore Kerala Packages', url: 'pages/explore.html?dest=dest-kerala' }]
    },

    'mysore': {
      title: '🏰 3-Day Mysore Royal Karnataka Itinerary',
      text: `Here is a culture-rich Mysore plan with relaxed local travel:\n\n📍 **Day 1: Royal Mysore**\n• Check in near the city centre, explore Mysore Palace and the illuminated palace evening view.\n• Dinner: Mysore masala dosa and traditional Karnataka thali.\n\n📍 **Day 2: Hills, Markets & Heritage**\n• Sunrise at Chamundi Hills, then Devaraja Market and St. Philomena's Church.\n• Evening: Karanji Lake nature walk and local handicraft shopping.\n\n📍 **Day 3: Gardens & Srirangapatna**\n• Visit Brindavan Gardens and the historic Srirangapatna island.\n• Keep a flexible evening for sandalwood, silk, and coffee souvenirs.\n\n💰 **Estimated Budget:** ₹7,000 – ₹12,000 per person for 3 days.\n🛡️ **Safety tip:** Use registered autos or app cabs and keep valuables secure in busy markets.`,
      actions: [{ label: 'Explore Mysore', url: 'pages/explore.html?dest=dest-mysore' }, { label: 'Find Karnataka Stays', url: 'pages/services.html#stays' }]
    },

    'pack': {
      title: '🎒 Genie Smart Travel Packing Checklist',
      text: `Based on standard Indian travel destinations:

✅ **Documents & Essentials:**
• Government ID (Aadhaar / Passport / Driving License)
• Digital Boarding Passes & Hotel Confirmations on TRIP GENIE
• Portable Power Bank (10,000mAh+) & Universal Multi-plug
• Offline Maps downloaded in TRIP GENIE

✅ **Clothing & Comfort:**
• 3-4 Breathable cotton outfits / Layered thermals (for hills)
• Comfortable walking shoes + waterproof sandals
• UV Protection Sunglasses & SPF 50+ Sunscreen

✅ **Health & Safety:**
• Personal first-aid kit (Paracetamol, ORS, band-aids, motion sickness pills)
• Sanitizer & Mosquito repellent cream`,
      actions: []
    },

    'budget': {
      title: '💡 Genie Travel Budget Estimator & Money Hacks',
      text: `Here is how to travel smart and maximize savings:

1. **Book Flights Mid-Week:** Tuesdays and Wednesdays offer up to 20% lower airfares.
2. **Use TRIP PAY Wallet:** Earn instant cashback rewards on every booking.
3. **Opt for Genie Homestays:** Save up to 40% compared to luxury hotels while enjoying home-cooked regional meals.
4. **Offline GPS Navigation:** Use TRIP MAP offline mode to save mobile data battery when roaming.`,
      actions: [{ label: 'Check TRIP PAY Cashback', url: 'pages/services.html#pay' }]
    },

    'emergency': {
      title: '🚨 Emergency Quick Assistance',
      text: `If you are in immediate danger or need urgent help:

🆘 **Instant Help:** Press the red **SOS** button in the top navigation bar to trigger emergency broadcast and location sharing.
📞 **National Emergency Helpline:** 112
👮 **Police:** 100 | 🚑 **Ambulance:** 108 | 🛡️ **Women Safety:** 1091
🏥 **Nearby Hospital Radar:** Available in TRIP MAP.`,
      actions: [{ label: 'Open Emergency SOS Hub', url: 'pages/emergency.html' }]
    },

    'default': {
      title: '🧞 Genie AI Assistant',
      text: `I'm your 24/7 AI Travel Assistant! I can help you:
• Plan custom itineraries for any Indian or global destination
• Recommend top hotels, homestays, and local food spots
• Suggest packing checklists tailored to your destination weather
• Provide emergency safety guidance and offline travel tips

What would you like to explore next?`,
      actions: []
    }
  },

  init() {
    this.bindEvents();
    // Render initial message if empty
    const container = document.getElementById('chatMessages');
    if (container && container.children.length === 0) {
      this.addBotMessage("✨ Namaste & Hello! I'm your **Genie AI** Travel Copilot. Where would you like to travel today? Or ask me to plan an itinerary!");
    }
  },

  bindEvents() {
    const toggleBtn = document.getElementById('floatingGenieBtn');
    const closeBtn = document.getElementById('chatCloseBtn');
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');

    if (toggleBtn) {
      toggleBtn.onclick = () => this.toggleChat();
    }
    if (closeBtn) {
      closeBtn.onclick = () => this.toggleChat(false);
    }
    if (sendBtn && input) {
      sendBtn.onclick = () => this.handleUserSend();
      input.onkeypress = (e) => {
        if (e.key === 'Enter') this.handleUserSend();
      };
    }
  },

  toggleChat(forceState = null) {
    const windowEl = document.getElementById('genieChatWindow');
    if (!windowEl) return;

    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    if (this.isOpen) {
      windowEl.classList.add('active');
      const input = document.getElementById('chatInput');
      if (input) setTimeout(() => input.focus(), 150);
    } else {
      windowEl.classList.remove('active');
    }
  },

  handleUserSend() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text || this.isTyping) return;

    // Add user message
    this.addUserMessage(text);
    input.value = '';

    // Simulate AI response
    this.processBotResponse(text);
  },

  sendQuickPrompt(promptText) {
    if (this.isTyping) return;
    this.addUserMessage(promptText);
    this.processBotResponse(promptText);
  },

  addUserMessage(text) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-user';
    div.textContent = text;
    container.appendChild(div);
    this.scrollToBottom();
  },

  addBotMessage(text, actions = []) {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-bot';
    
    // Convert basic markdown like **bold** and newlines
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    let actionsHtml = '';
    if (actions && actions.length > 0) {
      actionsHtml = `
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;">
          ${actions.map(a => `<a href="${a.url}" class="btn btn-sm btn-primary" style="font-size:0.75rem; padding:4px 10px;">${a.label}</a>`).join('')}
        </div>
      `;
    }

    div.innerHTML = formatted + actionsHtml;
    container.appendChild(div);
    this.scrollToBottom();
  },

  showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    if (!container) return;

    const div = document.createElement('div');
    div.id = 'chatTypingIndicator';
    div.className = 'chat-msg chat-msg-bot typing-indicator';
    div.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    container.appendChild(div);
    this.scrollToBottom();
    this.isTyping = true;
  },

  removeTypingIndicator() {
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) indicator.remove();
    this.isTyping = false;
  },

  async processBotResponse(query) {
    this.showTypingIndicator();
    const lower = query.toLowerCase();

    // Try the smart AI (cloud Gemini when online, else local Ollama) first
    let aiReply = null;
    try {
      const reply = await askGenieAI(query);
      if (typeof reply === 'string' && reply.trim()) {
        aiReply = reply;
      }
    } catch (err) {
      console.error('AI request failed, falling back to knowledge base:', err);
    }

    if (aiReply) {
      this.removeTypingIndicator();
      this.addBotMessage(aiReply);
      return;
    }

    // ---- Knowledge-base fallback (keeps the widget working offline) ----
    let responseObj = this.knowledgeBase.default;

    if (lower.includes('goa')) {
      responseObj = this.knowledgeBase.goa;
    } else if (lower.includes('manali') || lower.includes('snow') || lower.includes('mountain') || lower.includes('himachal')) {
      responseObj = this.knowledgeBase.manali;
    } else if (lower.includes('kerala') || lower.includes('backwater') || lower.includes('houseboat')) {
      responseObj = this.knowledgeBase.kerala;
    } else if (lower.includes('mysore') || lower.includes('mysuru') || lower.includes('karnataka') || lower.includes('chamundi')) {
      responseObj = this.knowledgeBase.mysore;
    } else if (lower.includes('pack') || lower.includes('luggage') || lower.includes('clothes') || lower.includes('what to bring')) {
      responseObj = this.knowledgeBase.pack;
    } else if (lower.includes('budget') || lower.includes('cost') || lower.includes('money') || lower.includes('save') || lower.includes('cheap')) {
      responseObj = this.knowledgeBase.budget;
    } else if (lower.includes('emergency') || lower.includes('help') || lower.includes('sos') || lower.includes('police') || lower.includes('doctor')) {
      responseObj = this.knowledgeBase.emergency;
    } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort')) {
      responseObj = {
        title: '🏨 Best Stays Recommended by Genie',
        text: `I've found top-rated stays matching your preferences:\n\n• **Ocean Pearl Beach Resort (Goa)** — ⭐ 4.8 | ₹3,499/night (Pool, Beach Access)\n• **Pine Cliff Luxury Villa (Manali)** — ⭐ 4.9 | ₹5,299/night (Mountain View)\n• **Emerald Palm Homestay (Kerala)** — ⭐ 4.9 | ₹2,499/night (Backwater canal)`,
        actions: [{ label: 'Explore Stays Hub', url: 'pages/services.html#stays' }]
      };
    } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('eat') || lower.includes('dinner')) {
      responseObj = {
        title: '🍜 Top Local Dining Recommendations',
        text: `Here are the highest rated food spots near popular destinations:\n\n• **Coastal Spice (Goa):** Goan Prawn Curry & Garlic Crab (⭐ 4.8)\n• **Royal Biryani Hub:** Hyderabadi Dum Biryani & Galouti Kebabs (⭐ 4.7)\n• **Green Oasis:** Authentic Filter Coffee & Ghee Masala Dosa (⭐ 4.9)`,
        actions: [{ label: 'Order Food with TRIP FOOD', url: 'pages/services.html#food' }]
      };
    }

    // Delay for realistic typing experience
    setTimeout(() => {
      this.removeTypingIndicator();
      this.addBotMessage(responseObj.text, responseObj.actions);
    }, 1100);
  },

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
};

window.GenieChatbot = GenieChatbot;

document.addEventListener('DOMContentLoaded', () => {
  GenieChatbot.init();
});
