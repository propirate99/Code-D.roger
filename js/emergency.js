/**
 * TRIP GENIE - EMERGENCY SOS SYSTEM (TRIP SOS)
 * Handles SOS Confirmation Modal, 3-Second Abort Countdown, Web Audio Siren,
 * Live GPS Telemetry, One-Tap Emergency Helplines, and Contact Alert Broadcasts.
 */

const EmergencyEngine = {
  isActive: false,
  countdownTimer: null,
  audioCtx: null,
  oscillator: null,
  gainNode: null,
  isSirenPlaying: false,

  contacts: JSON.parse(localStorage.getItem('trip_genie_emergency_contacts')) || [
    { id: 'c1', name: 'Mom (Radha Sharma)', relation: 'Mother', phone: '+91 98765 11223', notify: true },
    { id: 'c2', name: 'Dad (Kailash Sharma)', relation: 'Father', phone: '+91 98765 44556', notify: true },
    { id: 'c3', name: 'Dr. Anand Mehta', relation: 'Family Physician', phone: '+91 98220 99887', notify: true },
    { id: 'c4', name: 'Arjun Das (Travel Partner)', relation: 'Friend', phone: '+91 98334 55667', notify: true }
  ],

  init() {
    this.renderContacts();
  },

  triggerSOSModal() {
    const modal = document.getElementById('sosConfirmModal');
    if (!modal) return;
    modal.classList.add('active');
  },

  closeSOSModal() {
    const modal = document.getElementById('sosConfirmModal');
    if (modal) modal.classList.remove('active');
  },

  startCountdown() {
    this.closeSOSModal();
    const countdownModal = document.getElementById('sosCountdownModal');
    const timerEl = document.getElementById('sosCountdownVal');
    if (!countdownModal) {
      this.activateEmergencyMode();
      return;
    }

    countdownModal.classList.add('active');
    let count = 3;
    if (timerEl) timerEl.textContent = count;

    // Beep sound
    this.playTone(800, 'sine', 0.15);

    this.countdownTimer = setInterval(() => {
      count--;
      if (timerEl) timerEl.textContent = count;
      this.playTone(800, 'sine', 0.15);

      if (count <= 0) {
        clearInterval(this.countdownTimer);
        countdownModal.classList.remove('active');
        this.activateEmergencyMode();
      }
    }, 1000);
  },

  cancelCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    const countdownModal = document.getElementById('sosCountdownModal');
    if (countdownModal) countdownModal.classList.remove('active');
    if (window.showToast) window.showToast('Emergency SOS Activation Cancelled', 'info');
  },

  activateEmergencyMode() {
    this.isActive = true;
    const dashboard = document.getElementById('emergencyActiveDashboard');
    if (dashboard) {
      dashboard.style.display = 'block';
      dashboard.scrollIntoView({ behavior: 'smooth' });
    }

    // Start Emergency Siren
    this.startSiren();

    // Trigger simulated broadcast
    this.broadcastEmergencyAlert();

    if (window.showToast) {
      window.showToast('🔴 EMERGENCY SOS ACTIVE: Alerting nearby services & emergency contacts', 'error', '🆘');
    }
  },

  deactivateEmergencyMode() {
    this.isActive = false;
    this.stopSiren();
    const dashboard = document.getElementById('emergencyActiveDashboard');
    if (dashboard) dashboard.style.display = 'none';
    if (window.showToast) window.showToast('Emergency SOS Deactivated', 'success', '🛡️');
  },

  // Web Audio API Siren Synthesizer
  startSiren() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      this.audioCtx = new AudioContext();
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

      // Modulate frequency for emergency siren (600Hz <-> 1200Hz)
      const now = this.audioCtx.currentTime;
      for (let i = 0; i < 30; i++) {
        this.oscillator.frequency.setValueAtTime(600, now + i * 0.8);
        this.oscillator.frequency.linearRampToValueAtTime(1200, now + i * 0.8 + 0.4);
      }

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
      this.oscillator.start();
      this.isSirenPlaying = true;
    } catch (e) {
      console.warn('Audio siren playback failed or autoplay blocked', e);
    }
  },

  stopSiren() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {}
      this.oscillator = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.isSirenPlaying = false;
  },

  toggleSiren() {
    if (this.isSirenPlaying) {
      this.stopSiren();
      if (window.showToast) window.showToast('Siren Muted', 'info', '🔇');
    } else {
      this.startSiren();
      if (window.showToast) window.showToast('Siren Resumed', 'error', '🔊');
    }
  },

  playTone(freq, type = 'sine', duration = 0.2) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  },

  apiBase() {
    const host = window.location.hostname || 'localhost';
    return 'http://' + host + ':8000';
  },

  _fallbackCoords() {
    if (window.TripMapEngine && window.TripMapEngine.currentCoords) {
      return {
        lat: window.TripMapEngine.currentCoords.lat,
        lng: window.TripMapEngine.currentCoords.lng
      };
    }
    return { lat: 15.5524, lng: 73.7516 };
  },

  // Fetch the freshest real GPS fix (short timeout); fall back to the live
  // engine's coordinates, then the Goa demo default.
  getCurrentLocation() {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        return resolve(this._fallbackCoords());
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(this._fallbackCoords()),
        { timeout: 5000, enableHighAccuracy: true }
      );
    });
  },

  // Broadcast the emergency with the REAL GPS coordinates and push telemetry
  // to the Trip Genie backend (/api/emergency/sos).
  async broadcastEmergencyAlert() {
    const coords = await this.getCurrentLocation();
    const lat = coords.lat.toFixed(6);
    const lng = coords.lng.toFixed(6);
    const mapLink = `https://maps.google.com/?q=${lat},${lng}`;

    console.log(`[SOS BROADCAST] Emergency signal sent with GPS: ${lat}, ${lng} to ${this.contacts.length} contacts and nearest police dispatch.`);

    // Update the live dashboard coordinates + map link.
    const coordsEl = document.getElementById('emergencyGpsCoords');
    if (coordsEl) coordsEl.textContent = `${lat}° N, ${lng}° E`;
    const mapLinkEl = document.getElementById('emergencyMapLink');
    if (mapLinkEl) mapLinkEl.href = mapLink;
    const dashboard = document.getElementById('emergencyActiveDashboard');
    if (dashboard && mapLink) dashboard.dataset.mapLink = mapLink;

    // Push real telemetry to the backend if reachable.
    try {
      const res = await fetch(`${this.apiBase()}/api/emergency/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
      });
      if (res.ok && window.showToast) {
        window.showToast(`SOS broadcast sent with live GPS: ${lat}, ${lng} • ${mapLink}`, 'error', '🆘');
      }
    } catch (e) {
      console.warn('SOS backend unreachable — broadcast kept local.', e);
      if (window.showToast) {
        window.showToast(`SOS active. GPS: ${lat}, ${lng} (backend offline)`, 'error', '🆘');
      }
    }
  },

  simulateCall(serviceName, number) {
    if (window.showToast) {
      window.showToast(`Simulating Call to ${serviceName} (${number})... Connected to Police Dispatch!`, 'info', '📞');
    }
  },

  simulateShareLocation(contactName) {
    const lat = window.TripMapEngine ? window.TripMapEngine.currentCoords.lat.toFixed(4) : '15.5524';
    const lng = window.TripMapEngine ? window.TripMapEngine.currentCoords.lng.toFixed(4) : '73.7516';
    const mapLink = `https://maps.google.com/?q=${lat},${lng}`;

    if (window.showToast) {
      window.showToast(`Emergency SMS sent to ${contactName} with Live GPS Link: ${mapLink}`, 'success', '📍');
    }
  },

  // Contact Management
  renderContacts() {
    const container = document.getElementById('emergencyContactsList');
    if (!container) return;

    container.innerHTML = '';
    this.contacts.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.cssText = 'padding:1.1rem; display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;';
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.85rem;">
          <div style="width:42px; height:42px; border-radius:50%; background:rgba(239,68,68,0.12); color:var(--sos-red); display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
            👤
          </div>
          <div>
            <div style="font-weight:700; color:var(--text-primary);">${c.name}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${c.relation} • ${c.phone}</div>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-sm btn-secondary" onclick="EmergencyEngine.simulateShareLocation('${c.name}')" title="Share Live Location">
            📍 Share
          </button>
          <button class="btn btn-sm btn-danger" onclick="EmergencyEngine.simulateCall('${c.name}', '${c.phone}')" title="Call Contact">
            📞 Call
          </button>
          <button style="color:var(--text-muted); background:none; border:none; padding:4px 8px; cursor:pointer;" onclick="EmergencyEngine.deleteContact(${idx})" title="Remove">✕</button>
        </div>
      `;
      container.appendChild(card);
    });
  },

  addContact(name, relation, phone) {
    if (!name || !phone) return;
    this.contacts.push({ id: `c-${Date.now()}`, name, relation, phone, notify: true });
    localStorage.setItem('trip_genie_emergency_contacts', JSON.stringify(this.contacts));
    this.renderContacts();
    if (window.showToast) window.showToast(`Emergency Contact ${name} added successfully`, 'success', '✓');
  },

  deleteContact(idx) {
    this.contacts.splice(idx, 1);
    localStorage.setItem('trip_genie_emergency_contacts', JSON.stringify(this.contacts));
    this.renderContacts();
    if (window.showToast) window.showToast('Contact removed', 'info');
  }
};

window.EmergencyEngine = EmergencyEngine;

document.addEventListener('DOMContentLoaded', () => {
  EmergencyEngine.init();
});
