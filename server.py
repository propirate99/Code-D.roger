#!/usr/bin/env python3
"""
TRIP GENIE - BACKEND SERVER (Python REST API & Static Server)
"Your Journey. One Genie."

Provides REST API endpoints for:
- Destinations Discovery (/api/destinations)
- Flight Search & Booking (/api/flights, /api/flights/book)
- Stays & Hotels (/api/stays, /api/stays/book)
- Rides & Driver Matching (/api/rides, /api/rides/book)
- Food Discovery & Orders (/api/restaurants, /api/food/order)
- Movie Tickets & Seat Matrix (/api/movies, /api/movies/book)
- TRIP PAY Wallet & Transactions (/api/wallet, /api/wallet/pay, /api/wallet/recharge)
- Bookings CRUD (/api/bookings, /api/bookings/cancel)
- Emergency SOS Telemetry (/api/emergency/sos)
- Genie AI Conversational Agent (/api/genie/chat)
- Static Frontend File Serving (HTML, CSS, JS)
"""

import os
import sys
import json
import sqlite3
import hashlib
import secrets
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = BASE_DIR
DATA_DIR = os.path.join(BASE_DIR, 'data')
DB_FILE = os.path.join(DATA_DIR, 'tripgenie.sqlite3')

# In-Memory Database (Synced with initial mock dataset)
DB = {
    "wallet_balance": 12450.00,
    "transactions": [
        {"id": "TXN-9841", "title": "IndiGo Flight to Goa (DEL → GOI)", "category": "Travel", "date": "02 Sep 2026, 09:30 AM", "amount": -4299, "status": "Success", "icon": "✈️"},
        {"id": "TXN-9840", "title": "Ocean Pearl Luxury Resort Advance", "category": "Hotel", "date": "01 Sep 2026, 04:15 PM", "amount": -3499, "status": "Success", "icon": "🏨"},
        {"id": "TXN-9839", "title": "Coastal Spice Goan Dinner", "category": "Food", "date": "01 Sep 2026, 08:45 PM", "amount": -620, "status": "Success", "icon": "🍜"},
        {"id": "TXN-9838", "title": "Genie Prime Cab Ride (Airport to Hotel)", "category": "Rides", "date": "01 Sep 2026, 10:20 AM", "amount": -249, "status": "Success", "icon": "🚕"},
        {"id": "TXN-9837", "title": "Added to Trip Genie Wallet (UPI)", "category": "Wallet Top-up", "date": "30 Aug 2026, 02:00 PM", "amount": 15000, "status": "Success", "icon": "💳"}
    ],
    "bookings": [
        {
            "id": "TG-BK-7701",
            "serviceType": "Flights",
            "title": "Delhi (DEL) → Goa (GOI)",
            "provider": "IndiGo 6E-2044",
            "date": "15 Oct 2026",
            "time": "06:30 AM",
            "passengers": "2 Adults",
            "price": 4299,
            "status": "Confirmed",
            "seat": "12A, 12B",
            "gate": "Terminal 3, Gate 14"
        },
        {
            "id": "TG-BK-7702",
            "serviceType": "Hotels",
            "title": "Ocean Pearl Luxury Beach Resort",
            "provider": "Calangute Beach, Goa",
            "date": "15 Oct - 19 Oct 2026",
            "time": "Check-in: 02:00 PM",
            "passengers": "2 Guests • Deluxe Sea View",
            "price": 3499,
            "status": "Confirmed",
            "seat": "Room 304"
        },
        {
            "id": "TG-BK-7703",
            "serviceType": "Rides",
            "title": "Goa Airport (GOI) → Calangute",
            "provider": "Genie Prime Sedan (Maruti Dzire)",
            "date": "15 Oct 2026",
            "time": "09:30 AM",
            "passengers": "Driver: Ramesh Sharma",
            "price": 249,
            "status": "Confirmed",
            "seat": "GA-03-AB-4921"
        }
    ],
    "destinations": [
        {"id": "dest-goa", "name": "Goa", "category": "Beaches", "rating": 4.8, "startingPrice": 4299, "state": "Goa, India", "bestTime": "Nov - Feb", "highlights": ["Baga Beach", "Fort Aguada", "Old Goa Churches"]},
        {"id": "dest-manali", "name": "Manali", "category": "Mountains", "rating": 4.9, "startingPrice": 5999, "state": "Himachal Pradesh, India", "bestTime": "Oct - Jun", "highlights": ["Solang Valley", "Rohtang Pass", "Atal Tunnel"]},
        {"id": "dest-kerala", "name": "Kerala Backwaters", "category": "Family", "rating": 4.8, "startingPrice": 6499, "state": "Kerala, India", "bestTime": "Sep - Mar", "highlights": ["Alleppey Houseboats", "Munnar Tea Gardens"]},
        {"id": "dest-jaipur", "name": "Jaipur Pink City", "category": "Historical", "rating": 4.7, "startingPrice": 3499, "state": "Rajasthan, India", "bestTime": "Oct - Mar", "highlights": ["Hawa Mahal", "Amber Fort"]},
        {"id": "dest-mysore", "name": "Mysore", "category": "Heritage", "rating": 4.8, "startingPrice": 3299, "state": "Karnataka, India", "bestTime": "Oct - Feb", "highlights": ["Mysore Palace", "Chamundi Hills", "Brindavan Gardens"]},
        {"id": "dest-mumbai", "name": "Mumbai", "category": "City Life", "rating": 4.7, "startingPrice": 2999, "state": "Maharashtra, India", "bestTime": "Oct - Feb", "highlights": ["Gateway of India", "Marine Drive"]},
        {"id": "dest-hyderabad", "name": "Hyderabad", "category": "Food & Culture", "rating": 4.7, "startingPrice": 2799, "state": "Telangana, India", "bestTime": "Oct - Feb", "highlights": ["Charminar", "Golconda Fort", "Biryani Trail"]}
    ],
    "emergency_logs": []
}


def load_database():
    os.makedirs(DATA_DIR, exist_ok=True)
    with sqlite3.connect(DB_FILE) as connection:
        connection.execute('CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY CHECK (id = 1), payload TEXT NOT NULL)')
        connection.execute(
            'CREATE TABLE IF NOT EXISTS users ('
            ' id INTEGER PRIMARY KEY AUTOINCREMENT,'
            ' name TEXT NOT NULL,'
            ' email TEXT NOT NULL UNIQUE,'
            ' phone TEXT,'
            ' password_hash TEXT NOT NULL,'
            ' salt TEXT NOT NULL,'
            ' role TEXT NOT NULL DEFAULT "TOURIST",'
            ' account_status TEXT NOT NULL DEFAULT "ACTIVE",'
            ' created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP'
            ')'
        )
        connection.execute(
            'CREATE TABLE IF NOT EXISTS sessions ('
            ' token TEXT PRIMARY KEY,'
            ' user_id INTEGER NOT NULL,'
            ' created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,'
            ' FOREIGN KEY (user_id) REFERENCES users(id)'
            ')'
        )
        row = connection.execute('SELECT payload FROM app_state WHERE id = 1').fetchone()
        if row:
            try:
                stored = json.loads(row[0])
                DB.update(stored)
            except (TypeError, json.JSONDecodeError):
                pass
        save_database(connection)


def hash_password(password, salt=None):
    """Return (salt, hex_digest) using PBKDF2-HMAC-SHA256 with a per-user salt."""
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return salt, digest.hex()


def verify_password(password, salt, expected_digest):
    """Constant-time comparison of a password against a stored PBKDF2 digest."""
    digest = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return secrets.compare_digest(digest.hex(), expected_digest)


def find_user_by_email(email):
    with sqlite3.connect(DB_FILE) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute('SELECT * FROM users WHERE lower(email) = lower(?)', (email,)).fetchone()
        return dict(row) if row else None


def create_session(user_id):
    token = secrets.token_hex(24)
    with sqlite3.connect(DB_FILE) as connection:
        connection.execute('INSERT INTO sessions (token, user_id) VALUES (?, ?)', (token, user_id))
        connection.commit()
    return token


def public_user(user):
    """Strip sensitive fields before returning to the client."""
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user.get("phone"),
        "role": user.get("role", "TOURIST")
    }


def save_database(connection=None):
    owns_connection = connection is None
    if owns_connection:
        connection = sqlite3.connect(DB_FILE)
    connection.execute(
        'INSERT OR REPLACE INTO app_state (id, payload) VALUES (1, ?)',
        (json.dumps(DB, ensure_ascii=False),)
    )
    connection.commit()
    if owns_connection:
        connection.close()


load_database()


class TripGenieRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def _set_json_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_json_headers(200)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API Routes
        if path == '/api/health':
            self._set_json_headers(200)
            self.wfile.write(json.dumps({"status": "healthy", "service": "TRIP GENIE API", "version": "1.0.0"}).encode())
            return

        elif path == '/api/wallet':
            self._set_json_headers(200)
            self.wfile.write(json.dumps({
                "wallet_balance": DB["wallet_balance"],
                "currency": "INR",
                "upi_id": "user@tripgenie",
                "transactions": DB["transactions"]
            }).encode())
            return

        elif path == '/api/destinations':
            category = query.get('category', [None])[0]
            items = DB["destinations"]
            if category and category != 'All':
                items = [d for d in items if d['category'].lower() == category.lower()]
            self._set_json_headers(200)
            self.wfile.write(json.dumps({"success": True, "count": len(items), "data": items}).encode())
            return

        elif path == '/api/bookings':
            self._set_json_headers(200)
            self.wfile.write(json.dumps({"success": True, "data": DB["bookings"]}).encode())
            return

        # Default: Fallback to static frontend file serving
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_len = int(self.headers.get('Content-Length', 0))
        body_data = {}
        if content_len > 0:
            raw_body = self.rfile.read(content_len).decode('utf-8')
            try:
                body_data = json.loads(raw_body)
            except Exception:
                body_data = {}

        # 1. TRIP PAY Payment Endpoint
        if path == '/api/wallet/pay':
            amount = float(body_data.get('amount', 0))
            recipient = body_data.get('recipient', 'Merchant')
            category = body_data.get('category', 'Payment')

            if amount > DB["wallet_balance"]:
                self._set_json_headers(400)
                self.wfile.write(json.dumps({"success": False, "error": "Insufficient wallet balance"}).encode())
                return

            DB["wallet_balance"] -= amount
            txn_id = f"TXN-{len(DB['transactions']) + 1001}"
            new_txn = {
                "id": txn_id,
                "title": f"Paid to {recipient}",
                "category": category,
                "date": "Just now",
                "amount": -amount,
                "status": "Success",
                "icon": "💸"
            }
            DB["transactions"].insert(0, new_txn)
            save_database()

            self._set_json_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "txn_id": txn_id,
                "amount_paid": amount,
                "recipient": recipient,
                "new_balance": DB["wallet_balance"],
                "message": "Payment successful via TRIP PAY"
            }).encode())
            return

        # 2. Bookings Create Endpoint
        elif path == '/api/bookings/create':
            service_type = body_data.get('serviceType', 'General')
            title = body_data.get('title', 'Service Booking')
            provider = body_data.get('provider', 'Trip Genie Partner')
            price = float(body_data.get('price', 0))
            
            booking_id = f"TG-{service_type[:2].upper()}-{len(DB['bookings']) + 5001}"
            new_booking = {
                "id": booking_id,
                "serviceType": service_type,
                "title": title,
                "provider": provider,
                "date": body_data.get('date', 'Today'),
                "time": body_data.get('time', 'Instant'),
                "passengers": body_data.get('passengers', '1 Traveler'),
                "price": price,
                "status": "Confirmed",
                "seat": body_data.get('seat', 'Confirmed')
            }
            DB["bookings"].insert(0, new_booking)
            save_database()

            self._set_json_headers(200)
            self.wfile.write(json.dumps({"success": True, "booking": new_booking}).encode())
            return

        # 3. Emergency SOS Broadcast Logging
        elif path == '/api/emergency/sos':
            lat = body_data.get('lat', 15.5524)
            lng = body_data.get('lng', 73.7516)
            log_entry = {
                "timestamp": "2026-09-02T20:45:00Z",
                "status": "DISTRESS_SIGNAL_ACTIVE",
                "coords": {"lat": lat, "lng": lng},
                "dispatches": ["112 National Police", "108 Ambulance", "4 Family Contacts"]
            }
            DB["emergency_logs"].append(log_entry)
            save_database()
            print(f"[BACKEND SOS ALERT] Received emergency telemetry: {lat}, {lng}")

            self._set_json_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "message": "Emergency SOS broadcast received by server",
                "telemetry": log_entry
            }).encode())
            return

        # 4. Genie AI Chatbot Endpoint
        elif path == '/api/genie/chat':
            prompt = body_data.get('message', '').lower()
            response_text = "I am your Genie AI Travel Assistant! How can I help you plan your journey?"
            
            if 'goa' in prompt:
                response_text = "✨ 3-Day Goa Itinerary: Day 1: Baga Beach & Nightlife, Day 2: Fort Aguada & Old Goa Churches, Day 3: South Goa & Spice Farm. Estimated Budget: ₹12,000."
            elif 'manali' in prompt:
                response_text = "🏔️ 4-Day Manali Adventure: Day 1: Old Manali Cafes, Day 2: Solang Valley Snow Sports, Day 3: Atal Tunnel & Sissu, Day 4: Hot Springs. Estimated Budget: ₹15,000."
            elif 'pack' in prompt:
                response_text = "🎒 Packing Essentials: ID Proofs, Powerbank 10000mAh, Sunglasses, Sunscreen SPF50+, First Aid kit, Offline Maps in TRIP GENIE."

            self._set_json_headers(200)
            self.wfile.write(json.dumps({"success": True, "reply": response_text}).encode())
            return

        # 5. User Registration Endpoint
        elif path == '/api/auth/register':
            name = (body_data.get('name') or '').strip()
            email = (body_data.get('email') or '').strip().lower()
            phone = (body_data.get('phone') or '').strip()
            password = body_data.get('password') or ''

            if not name:
                self._set_json_headers(400)
                self.wfile.write(json.dumps({"success": False, "error": "Full name is required"}).encode())
                return
            if not email or '@' not in email or '.' not in email:
                self._set_json_headers(400)
                self.wfile.write(json.dumps({"success": False, "error": "A valid email is required"}).encode())
                return
            if len(password) < 6:
                self._set_json_headers(400)
                self.wfile.write(json.dumps({"success": False, "error": "Password must contain at least 6 characters"}).encode())
                return
            if find_user_by_email(email):
                self._set_json_headers(409)
                self.wfile.write(json.dumps({"success": False, "error": "An account with this email already exists"}).encode())
                return

            salt, pwd_hash = hash_password(password)
            with sqlite3.connect(DB_FILE) as connection:
                cursor = connection.execute(
                    'INSERT INTO users (name, email, phone, password_hash, salt) VALUES (?, ?, ?, ?, ?)',
                    (name, email, phone, pwd_hash, salt)
                )
                connection.commit()
                user_id = cursor.lastrowid
            user = public_user({"id": user_id, "name": name, "email": email, "phone": phone, "role": "TOURIST"})
            token = create_session(user_id)

            self._set_json_headers(201)
            self.wfile.write(json.dumps({"success": True, "message": "Registration successful", "token": token, "user": user}).encode())
            return

        # 6. User Login Endpoint
        elif path == '/api/auth/login':
            email = (body_data.get('email') or '').strip().lower()
            password = body_data.get('password') or ''

            user = find_user_by_email(email) if email else None
            if not user or not verify_password(password, user['salt'], user['password_hash']):
                self._set_json_headers(401)
                self.wfile.write(json.dumps({"success": False, "error": "Invalid email or password"}).encode())
                return
            if user.get('account_status', 'ACTIVE') != 'ACTIVE':
                self._set_json_headers(403)
                self.wfile.write(json.dumps({"success": False, "error": "This account is suspended"}).encode())
                return

            token = create_session(user['id'])
            self._set_json_headers(200)
            self.wfile.write(json.dumps({"success": True, "message": "Login successful", "token": token, "user": public_user(user)}).encode())
            return

        # 7. User Logout Endpoint
        elif path == '/api/auth/logout':
            token = None
            auth_header = self.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                token = auth_header[7:].strip()
            if token:
                with sqlite3.connect(DB_FILE) as connection:
                    connection.execute('DELETE FROM sessions WHERE token = ?', (token,))
                    connection.commit()
            self._set_json_headers(200)
            self.wfile.write(json.dumps({"success": True, "message": "Logged out successfully"}).encode())
            return

        self._set_json_headers(404)
        self.wfile.write(json.dumps({"success": False, "error": "Endpoint not found"}).encode())


def run_server():
    print("=" * 65)
    print("🧞 TRIP GENIE - FULLSTACK SERVER")
    print(f"🚀 Serving Frontend & REST APIs at: http://localhost:{PORT}")
    print(f"📁 Frontend Root: {FRONTEND_DIR}")
    print("=" * 65)
    
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, TripGenieRequestHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping TRIP GENIE Server...")
        httpd.server_close()


if __name__ == '__main__':
    run_server()
