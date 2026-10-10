/**
 * TRIP GENIE - OFFLINE MAPS & GPS SIMULATOR (TRIP MAP)
 * Integrates Leaflet.js / OpenStreetMap, Browser Geolocation API,
 * Interactive POI layers (Hospitals, Food, Fuel, Spots), and Offline Pack Downloader.
 */

const TripMapEngine = {
  map: null,
  userMarker: null,
  currentCoords: { lat: 15.5524, lng: 73.7516 }, // Default: Goa Baga Beach (demo fallback)
  isRealGps: false,
  isTracking: false,
  watchId: null,
  autoLoadedReal: false,
  poisAreReal: false,
  offlinePacks: JSON.parse(localStorage.getItem('trip_genie_offline_maps')) || {
    'goa': { name: 'Goa Coastal Pack', size: '45 MB', downloaded: false },
    'manali': { name: 'Manali & Solang Valley', size: '38 MB', downloaded: false },
    'kerala': { name: 'Kerala Backwaters & Munnar', size: '52 MB', downloaded: false }
  },

  // Mock POIs around default/current location
  pointsOfInterest: [
    { name: 'Baga Beach Watersports', type: 'spot', icon: '🏖️', lat: 15.5553, lng: 73.7517, desc: 'Parasailing, Jet ski, Beach Shacks' },
    { name: 'Fort Aguada & Lighthouse', type: 'spot', icon: '🏰', lat: 15.4920, lng: 73.7737, desc: '17th-century Portuguese fortress' },
    { name: 'Coastal Spice Seafood Shack', type: 'food', icon: '🍜', lat: 15.5510, lng: 73.7540, desc: 'Authentic Goan curry & fresh catch' },
    { name: 'Ocean Cafe & Bistro', type: 'food', icon: '☕', lat: 15.5580, lng: 73.7525, desc: 'Woodfired pizza & craft drinks' },
    { name: 'Indian Oil 24x7 Fuel Station', type: 'fuel', icon: '⛽', lat: 15.5420, lng: 73.7650, desc: 'Petrol, Diesel, Air & EV Fast Charger' },
    { name: 'Goa Medical College & Hospital', type: 'hospital', icon: '🏥', lat: 15.4678, lng: 73.8560, desc: '24/7 Emergency Trauma & Ambulance' },
    { name: 'St. Anthony Emergency Clinic', type: 'hospital', icon: '🏥', lat: 15.5480, lng: 73.7610, desc: 'Emergency First Aid & Pharmacy' }
  ],

  init(containerId = 'tripMapContainer') {
    const mapEl = document.getElementById(containerId);
    if (!mapEl) return;

    this.checkGeolocation(() => {
      this.renderMap(containerId);
      this.renderOfflinePacksUI();
      this.renderRealPOIList();
      // Load real nearby places from OpenStreetMap once we have a position
      // (non-blocking; falls back to demo POIs if the network is unavailable).
      if (!this.autoLoadedReal) {
        this.autoLoadedReal = true;
        this.refreshRealNearby();
      }
    });
  },

  checkGeolocation(callback) {
    const statusLabel = document.getElementById('gpsStatusLabel');
    const coordsLabel = document.getElementById('gpsCoordsLabel');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          this.isRealGps = true;
          if (statusLabel) statusLabel.innerHTML = '<span class="status-dot-green"></span> Live GPS Active';
          if (coordsLabel) coordsLabel.textContent = `${this.currentCoords.lat.toFixed(4)}° N, ${this.currentCoords.lng.toFixed(4)}° E`;
          callback();
        },
        (err) => {
          console.warn('Geolocation denied or unavailable. Using High-Precision Demo Location.', err);
          this.isRealGps = false;
          if (statusLabel) statusLabel.innerHTML = '<span style="width:8px; height:8px; border-radius:50%; background:var(--accent-amber); display:inline-block;"></span> Demo Location (Goa)';
          if (coordsLabel) coordsLabel.textContent = `${this.currentCoords.lat.toFixed(4)}° N, ${this.currentCoords.lng.toFixed(4)}° E`;
          callback();
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      this.isRealGps = false;
      if (statusLabel) statusLabel.textContent = 'Demo GPS Mode';
      callback();
    }
  },

  renderMap(containerId) {
    if (typeof L === 'undefined') {
      console.error('Leaflet.js not loaded');
      return;
    }

    // Initialize Leaflet Map
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map(containerId, {
      center: [this.currentCoords.lat, this.currentCoords.lng],
      zoom: 13,
      zoomControl: false
    });

    // Add Custom Dark / Light OpenStreetMap Tiles
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap contributors | TRIP GENIE Maps',
      maxZoom: 19
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // User Location Marker with Pulse Wave
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position:relative; width:24px; height:24px;">
          <div style="position:absolute; width:100%; height:100%; background:var(--accent-sky); border-radius:50%; border:3px solid #fff; box-shadow:0 0 15px var(--accent-sky); z-index:2;"></div>
          <div style="position:absolute; top:-10px; left:-10px; width:44px; height:44px; background:rgba(14, 165, 233, 0.35); border-radius:50%; animation:gpsPulse 2s infinite ease-out; z-index:1;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    this.userMarker = L.marker([this.currentCoords.lat, this.currentCoords.lng], { icon: userIcon })
      .addTo(this.map)
      .bindPopup('<strong>📍 You are here</strong><br/>' + (this.isRealGps ? 'Live Browser Location' : 'Demo Location: Baga, Goa'))
      .openPopup();

    // Render POI markers
    this.renderPOIs('all');
  },

  renderPOIs(filterType = 'all') {
    if (!this.map) return;

    this.pointsOfInterest.forEach(poi => {
      if (filterType !== 'all' && poi.type !== filterType) return;

      const poiIcon = L.divIcon({
        className: 'poi-custom-marker',
        html: `
          <div style="background:var(--bg-surface); border:2px solid var(--primary-purple); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
            ${poi.icon}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const safeName = String(poi.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      L.marker([poi.lat, poi.lng], { icon: poiIcon })
        .addTo(this.map)
        .bindPopup(`
          <div style="font-family:var(--font-main); padding:4px;">
            <div style="font-weight:700; font-size:0.95rem; color:#0F172A;">${poi.icon} ${poi.name}</div>
            <div style="font-size:0.8rem; color:#475569; margin:4px 0 8px;">${poi.desc}</div>
            ${poi.distKm != null ? `<div style="font-size:0.8rem; color:#0369A1; font-weight:600; margin-bottom:8px;">📏 ${poi.distKm.toFixed(1)} km away</div>` : ''}
            <button onclick="TripMapEngine.startNavigation('${safeName}', ${poi.lat}, ${poi.lng})" style="background:#7C3AED; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:0.78rem; font-weight:600; cursor:pointer; width:100%; margin-bottom:4px;">
              🧭 Navigate Here
            </button>
            <button onclick="TripMapEngine.openExternalNav(${poi.lat}, ${poi.lng})" style="background:#0369A1; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:0.78rem; font-weight:600; cursor:pointer; width:100%;">
              🗺️ Open in Google Maps
            </button>
          </div>
        `);
    });
  },

  filterLayer(type) {
    if (!this.map) return;
    this.renderMap('tripMapContainer');
    this.renderPOIs(type);
    if (window.showToast) window.showToast(`Filtering map by: ${type.toUpperCase()}`, 'info');
  },

  centerUserLocation() {
    if (!this.map) return;
    this.map.flyTo([this.currentCoords.lat, this.currentCoords.lng], 15, { duration: 1.5 });
  },

  // Real geodesic distance in kilometres (Haversine formula)
  haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = d => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  },

  // Fetch real nearby places (hospitals, fuel, food, attractions) from
  // OpenStreetMap via the public Overpass API, sorted by real distance.
  async fetchNearbyPOIs(radiusKm = 3) {
    const { lat, lng } = this.currentCoords;
    const meters = Math.max(500, Math.round(radiusKm * 1000));
    const q = `[out:json][timeout:25];(
      node["amenity"~"^(hospital|clinic)$"](around:${meters},${lat},${lng});
      way["amenity"~"^(hospital|clinic)$"](around:${meters},${lat},${lng});
      node["amenity"="fuel"](around:${meters},${lat},${lng});
      way["amenity"="fuel"](around:${meters},${lat},${lng});
      node["amenity"~"^(restaurant|cafe)$"](around:${meters},${lat},${lng});
      way["amenity"~"^(restaurant|cafe)$"](around:${meters},${lat},${lng});
      node["tourism"~"^(attraction|museum)$"](around:${meters},${lat},${lng});
      way["tourism"~"^(attraction|museum)$"](around:${meters},${lat},${lng});
    );out center 40;`;

    // The public Overpass server is heavily rate-limited and often slow, so we
    // try several mirrors in order before giving up on real data.
    const mirrors = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter'
    ];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let json = null;
    for (const endpoint of mirrors) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'data=' + encodeURIComponent(q),
          signal: controller.signal
        });
        if (!res.ok) throw new Error('Overpass API responded ' + res.status);
        json = await res.json();
        break; // got real data from one mirror
      } catch (e) {
        console.warn('Overpass mirror failed:', endpoint, e);
      }
    }
    clearTimeout(timer);
    if (!json) throw new Error('All Overpass mirrors failed');

    const classify = (tags) => {
      const a = tags.amenity || '';
      if (/hospital|clinic/.test(a)) return { type: 'hospital', icon: '🏥' };
      if (a === 'fuel') return { type: 'fuel', icon: '⛽' };
      if (/restaurant|cafe/.test(a)) return { type: 'food', icon: '🍜' };
      if (/attraction|museum/.test(tags.tourism || '')) return { type: 'spot', icon: '📍' };
      return null;
    };

    const raw = [];
    (json.elements || []).forEach(el => {
      const cls = classify(el.tags || {});
      if (!cls) return;
      const elat = el.lat != null ? el.lat : (el.center && el.center.lat);
      const elng = el.lon != null ? el.lon : (el.center && el.center.lon);
      if (elat == null || elng == null) return;
      const street = el.tags['addr:street'] ? el.tags['addr:street'] + ', ' : '';
      const city = el.tags['addr:city'] || el.tags['addr:town'] || el.tags['addr:village'] || '';
      raw.push({
        name: el.tags.name || (cls.type === 'hospital' ? 'Health Facility'
          : cls.type === 'fuel' ? 'Fuel Station'
          : cls.type === 'food' ? 'Restaurant / Cafe'
          : 'Tourist Spot'),
        type: cls.type,
        icon: cls.icon,
        lat: elat,
        lng: elng,
        desc: (street + city).replace(/,\s*$/, ''),
        distKm: this.haversineKm(lat, lng, elat, elng)
      });
    });

    // Group by type, sort nearest-first, cap per type, then overall.
    const byType = {};
    raw.forEach(p => { (byType[p.type] = byType[p.type] || []).push(p); });
    const capped = [];
    Object.keys(byType).forEach(t => {
      byType[t].sort((a, b) => a.distKm - b.distKm);
      capped.push(...byType[t].slice(0, 8));
    });
    capped.sort((a, b) => a.distKm - b.distKm);
    return capped;
  },

  async refreshRealNearby() {
    if (window.showToast) window.showToast('Fetching real nearby places…', 'info', '📡');
    try {
      const real = await this.fetchNearbyPOIs(3);
      if (real.length) {
        this.pointsOfInterest = real;
        this.poisAreReal = true;
        this.renderMap('tripMapContainer');
        this.renderRealPOIList();
        if (window.showToast) window.showToast(`Found ${real.length} real places near you`, 'success', '📍');
      } else {
        if (window.showToast) window.showToast('No places found nearby — showing saved demo locations', 'info');
      }
    } catch (e) {
      console.warn('Real POI fetch failed, keeping demo POIs.', e);
      if (window.showToast) window.showToast('Could not reach places service (offline). Using demo locations.', 'error', '⚠️');
    }
  },

  renderRealPOIList() {
    const container = document.getElementById('realNearbyList');
    if (!container) return;
    container.innerHTML = '';
    if (!this.pointsOfInterest.length) {
      container.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">No nearby places yet. Tap “Refresh Nearby” (or enable location) to see real places around you.</p>';
      return;
    }
    this.pointsOfInterest.forEach(poi => {
      // Names come from external OpenStreetMap data — escape them before
      // injecting into HTML text and into a JS string inside an attribute.
      const escHtml = (s) => String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[c]);
      // Safe for a single-quoted JS literal inside an HTML attribute:
      // single quotes as \', double quotes as &quot; (decoded back before JS runs),
      // and < > & escaped so they never break the attribute markup.
      const jsName = String(poi.name || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.cssText = 'padding:0.85rem 1rem; margin-bottom:0.6rem; display:flex; justify-content:space-between; align-items:center; gap:0.75rem;';
      card.innerHTML = `
        <div style="min-width:0;">
          <div style="font-weight:700; font-size:0.92rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${poi.icon} ${escHtml(poi.name)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted); text-transform:capitalize;">${poi.type}${poi.distKm != null ? ' • ' + poi.distKm.toFixed(1) + ' km away' : ''}</div>
        </div>
        <div style="display:flex; gap:0.4rem; flex-shrink:0;">
          <button class="btn btn-primary btn-sm" onclick="TripMapEngine.startNavigation('${jsName}', ${poi.lat}, ${poi.lng})">🧭 Navigate</button>
          <button class="btn btn-secondary btn-sm" onclick="TripMapEngine.openExternalNav(${poi.lat}, ${poi.lng})" title="Open in Google Maps">🗺️</button>
        </div>`;
      container.appendChild(card);
    });
  },

  startLiveTracking() {
    if (!('geolocation' in navigator)) {
      if (window.showToast) window.showToast('Geolocation is not supported on this device', 'error');
      return;
    }
    this.stopLiveTracking();
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.currentCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.isRealGps = true;
        const status = document.getElementById('gpsStatusLabel');
        const coords = document.getElementById('gpsCoordsLabel');
        if (status) status.innerHTML = '<span class="status-dot-green"></span> Live GPS Active';
        if (coords) coords.textContent = `${this.currentCoords.lat.toFixed(4)}° N, ${this.currentCoords.lng.toFixed(4)}° E`;
        if (this.userMarker && this.map) {
          this.userMarker.setLatLng([this.currentCoords.lat, this.currentCoords.lng]);
        }
      },
      (err) => console.warn('Live GPS tracking error:', err),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 12000 }
    );
    this.isTracking = true;
    if (window.showToast) window.showToast('Live GPS tracking started — marker follows your position', 'success', '🔴');
  },

  stopLiveTracking() {
    if (this.watchId != null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.isTracking) {
      this.isTracking = false;
      if (window.showToast) window.showToast('Live GPS tracking paused', 'info');
    }
  },

  toggleLiveTracking() {
    if (this.isTracking) { this.stopLiveTracking(); } else { this.startLiveTracking(); }
    const btn = document.getElementById('liveGpsBtn');
    if (btn) btn.textContent = this.isTracking ? '🟢 Live GPS On' : '🔴 Live GPS';
  },

  // Open the destination in an external turn-by-turn app (no API key needed)
  openExternalNav(destLat, destLng) {
    const from = this.currentCoords;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${destLat},${destLng}`;
    window.open(url, '_blank');
  },

  async startNavigation(destinationName, destLat, destLng) {
    if (!this.map) return;
    const from = this.currentCoords;
    if (window.showToast) window.showToast(`Routing to ${destinationName}…`, 'info', '🧭');

    let realCoords = null, distKm = null, mins = null;
    // Ask OSRM for the real driving route (distance, duration, geometry).
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      const json = await res.json();
      if (json && json.routes && json.routes[0]) {
        const r = json.routes[0];
        realCoords = (r.geometry.coordinates || []).map(c => [c[1], c[0]]);
        distKm = r.distance / 1000;
        mins = Math.round(r.duration / 60);
      }
    } catch (e) {
      console.warn('OSRM routing failed, falling back to simulated route.', e);
    }

    let routeLine;
    if (realCoords && realCoords.length >= 2) {
      routeLine = L.polyline(realCoords, {
        color: '#7C3AED', weight: 5, opacity: 0.85, lineCap: 'round'
      }).addTo(this.map);
    } else {
      // Offline fallback: gentle curve between the real endpoints.
      const routeCoords = [
        [from.lat, from.lng],
        [(from.lat + destLat) / 2 + 0.002, (from.lng + destLng) / 2 - 0.001],
        [destLat, destLng]
      ];
      distKm = distKm || this.haversineKm(from.lat, from.lng, destLat, destLng);
      mins = mins || Math.max(3, Math.round(distKm * 3));
      routeLine = L.polyline(routeCoords, {
        color: '#7C3AED', weight: 5, opacity: 0.85, dashArray: '10, 10', lineCap: 'round'
      }).addTo(this.map);
    }

    this.map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    const minsLabel = mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} min`;
    if (window.showToast) {
      window.showToast(`${destinationName}: ${distKm.toFixed(1)} km • ${minsLabel}`, 'success', '🧭');
    }
  },

  // Offline Pack Downloader Simulator
  downloadPack(packId) {
    const pack = this.offlinePacks[packId];
    if (!pack) return;

    const progressEl = document.getElementById(`progress-${packId}`);
    const barEl = document.getElementById(`bar-${packId}`);
    const btnEl = document.getElementById(`btn-${packId}`);

    if (btnEl) btnEl.disabled = true;
    if (progressEl) progressEl.style.display = 'block';

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (barEl) barEl.style.width = `${Math.min(progress, 100)}%`;

      if (progress >= 100) {
        clearInterval(interval);
        pack.downloaded = true;
        localStorage.setItem('trip_genie_offline_maps', JSON.stringify(this.offlinePacks));
        if (btnEl) {
          btnEl.disabled = false;
          btnEl.className = 'btn btn-sm btn-success';
          btnEl.textContent = '✓ Downloaded (Ready Offline)';
        }
        if (window.showToast) {
          window.showToast(`${pack.name} is now saved for 100% Offline GPS Navigation!`, 'success', '💾');
        }
      }
    }, 200);
  },

  renderOfflinePacksUI() {
    const container = document.getElementById('offlinePacksList');
    if (!container) return;

    container.innerHTML = '';
    Object.keys(this.offlinePacks).forEach(key => {
      const pack = this.offlinePacks[key];
      const div = document.createElement('div');
      div.className = 'glass-card';
      div.style.cssText = 'padding:1rem; margin-bottom:0.75rem;';
      div.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
          <div>
            <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">${pack.name}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${pack.size} • 3D Terrain & Street Data</div>
          </div>
          <button id="btn-${key}" class="btn btn-sm ${pack.downloaded ? 'btn-success' : 'btn-secondary'}" onclick="TripMapEngine.downloadPack('${key}')">
            ${pack.downloaded ? '✓ Saved Offline' : '💾 Download Offline'}
          </button>
        </div>
        <div id="progress-${key}" style="display:none; width:100%; height:6px; background:var(--bg-body); border-radius:10px; overflow:hidden; margin-top:8px;">
          <div id="bar-${key}" style="width:0%; height:100%; background:var(--primary-purple); transition:width 0.2s;"></div>
        </div>
      `;
      container.appendChild(div);
    });
  }
};

window.TripMapEngine = TripMapEngine;
