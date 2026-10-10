# 🧞 TRIP GENIE — "Your Journey. One Genie."

> **"Plan. Travel. Explore. Stay Safe."**
> A modern, responsive local travel application combining digital payments, transport bookings, stays, food discovery, movies, offline maps, and 24/7 AI travel assistance.

---

## 🌟 Concept & Inspiration

TRIP GENIE brings together the most essential travel features into a single, unified travel operating system:
* **💳 TRIP PAY** (Digital payments, UPI simulation, QR scan, mobile recharge & scratch card cashback rewards inspired by PhonePe).
* **✈️ TRIP BOOK** (Domestic flight search, class selection & instant printable e-ticket generation inspired by MakeMyTrip).
* **🏨 TRIP STAYS** (Beach resorts, Himalayan villas & heritage homestays with amenity filters inspired by Airbnb).
* **🚕 TRIP RIDE** (Bike, Auto, Mini, Prime Sedan, and SUV rides with live driver matching simulation inspired by Uber).
* **🍜 TRIP FOOD** (Local restaurant food discovery, interactive menu add-to-cart & simulated delivery tracking inspired by Zomato).
* **🎬 TRIP ENTERTAINMENT** (IMAX movies, beach concerts, and cultural galas with interactive seat matrix selector inspired by BookMyShow).
* **🗺️ TRIP MAP & GPS** (Leaflet/OpenStreetMap interactive maps with browser Geolocation API, POI filters, and offline map pack download simulator).
* **📡 TRIP CONNECT** (Simulated Bluetooth/Wi-Fi Direct offline traveler mesh network inspired by Bridgefy).
* **🤖 GENIE AI COPILOT** (Interactive conversational travel assistant with 3-day itinerary generation, packing checklists, and budget advice).
* **🛡️ TRIP PROTECT** (Travel insurance dashboard with ₹5,00,000 active sum insured and instant claim filing simulation).
* **🆘 EMERGENCY SOS** (Prominent safety button with 3-second abort countdown, Web Audio API emergency siren synthesizer, 112/100/108 quick dials, and simulated live GPS broadcast to contacts).
* **🌐 MULTI-LANGUAGE ASSISTANT** (Instant UI translation across 10 Indian and global languages + speech synthesis voice phrasebook).

---

## 🚀 Key Technologies Used

* **HTML5 Semantic Markup**
* **Modern CSS3** (CSS Variables, Glassmorphism `backdrop-filter`, Flexbox, CSS Grid, Micro-animations, Dark & Light Mode themes)
* **Vanilla JavaScript (ES6+)** with modular architecture
* **Browser Geolocation API** (with fallback to high-precision demo coordinates)
* **Browser Web Audio API** (Siren frequency oscillator synthesizer)
* **Browser Speech Synthesis API** (Voice pronunciation phrasebook)
* **Leaflet.js + OpenStreetMap** (Free, zero-API-key map rendering)
* **LocalStorage** (Persistent theme preference, bookings, emergency contacts, wallet balance, and offline map packs)

---

## 📁 Project Structure

```
trip-genie/
├── index.html                   # Main Super-App Landing Hub
├── pages/
│   ├── explore.html             # Destination discovery & curated travel guides
│   ├── services.html            # All-in-one Quick Services Hub (Pay, Book, Stays, Rides, Food, Movies, Protect)
│   ├── bookings.html            # My Bookings dashboard & printable e-tickets
│   ├── trips.html               # My Trip unified 5-day itinerary timeline & budget tracker
│   ├── maps.html                # TRIP MAP, GPS Geolocation & Offline Mesh (Trip Connect)
│   ├── emergency.html           # TRIP SOS Emergency Hub (Siren, quick dials, SMS broadcast)
│   ├── genie-ai.html            # Dedicated Genie AI Travel Copilot & Voice Phrasebook
│   └── profile.html             # User Profile, Wallet balance, and Security Settings
├── css/
│   ├── style.css                # Base design tokens, typography, glassmorphism & cards
│   ├── responsive.css           # Mobile responsiveness & bottom navigation bar
│   └── animations.css           # SOS radar pulse, typing indicators & payment checkmarks
├── js/
│   ├── mock-data.js             # Comprehensive mock datasets (flights, stays, foods, movies, mesh)
│   ├── language.js              # 10-Language translation dictionary & voice assistant
│   ├── app.js                   # Main application engine (Theme, search, payments, toasts)
│   ├── chatbot.js               # Genie AI conversational logic & typing simulation
│   ├── maps.js                  # Leaflet/OSM map controller & offline pack downloader
│   ├── emergency.js             # SOS alarm, Web Audio siren, and contact telemetry
│   └── bookings.js              # Booking state manager, seat selector & ride matching
└── README.md                    # Project documentation
```

---

## 💻 How to Run

> ⚠️ The app is a full-stack project. The login/register flow and every `/api/*`
> feature need the Python backend (`server.py`) running. Opening `index.html` or
> `login.html` by double-clicking, or serving it with a plain static server
> (`python -m http.server`), will render the pages but **the API will be missing**
> and login will fail with "Could not reach the backend" / "Unable to reach the
> server".

1. Start the backend, then open the app through it:
   ```powershell
   # In the project directory:
   python server.py
   ```
2. Navigate to `http://localhost:8000` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 🛡️ Local Application & Integration Notes

The project includes a Python HTTP application server with a durable SQLite database in `data/tripgenie.sqlite3`. Wallet writes, bookings, and SOS telemetry are stored locally and served through REST endpoints. The current workspace does not contain payment, airline, hotel, dispatch, or AI provider credentials, so those external integrations must be configured before production launch. Never use the local wallet flow for real financial transactions or treat SOS telemetry as a replacement for emergency services.

Start the application with:

```powershell
python server.py
```

Then open `http://localhost:8000`. Keep provider secrets on the server in environment variables when adding real integrations.
