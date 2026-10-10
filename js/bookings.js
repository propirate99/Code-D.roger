/**
 * TRIP GENIE - BOOKING & INTERACTIVE SERVICES CONTROLLER
 * Handles Flight Search & E-Tickets, Stay Bookings, Ride Matching Simulation,
 * Food Cart & Delivery, Movie Interactive Seat Matrix, and LocalStorage Booking History.
 */

const BookingsManager = {
  bookings: JSON.parse(localStorage.getItem('trip_genie_all_bookings')) || (window.TRIP_GENIE_DATA ? window.TRIP_GENIE_DATA.initialBookings : []),
  foodCart: [],
  selectedSeats: [],
  selectedMovieShowtime: null,

  init() {
    this.renderBookingsList('All');
  },

  saveBookings() {
    localStorage.setItem('trip_genie_all_bookings', JSON.stringify(this.bookings));
  },

  // --- 1. Flight Booking Wizard ---
  bookFlight(flightId) {
    const flight = window.TRIP_GENIE_DATA.flights.find(f => f.id === flightId);
    if (!flight) return;

    const modal = document.getElementById('flightBookingModal');
    const body = document.getElementById('flightBookingBody');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="background:var(--bg-body); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1.5rem; border:1px solid var(--border-color);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span style="font-weight:800; font-size:1.1rem; color:var(--primary-purple);">${flight.airline} (${flight.flightNumber})</span>
          <span class="badge badge-primary">${flight.stops}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:1.4rem; font-weight:800;">${flight.departureTime}</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">${flight.fromCity} (${flight.fromCode})</div>
          </div>
          <div style="text-align:center; color:var(--text-muted); font-size:0.8rem;">
            <div>✈️</div>
            <div>${flight.duration}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.4rem; font-weight:800;">${flight.arrivalTime}</div>
            <div style="font-size:0.85rem; color:var(--text-muted);">${flight.toCity} (${flight.toCode})</div>
          </div>
        </div>
      </div>

      <form onsubmit="BookingsManager.confirmFlightBooking(event, '${flight.id}')">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div>
            <label class="input-label">Lead Passenger Name</label>
            <div class="input-field-wrapper">
              <input type="text" id="flPassName" value="Rahul Sharma" required />
            </div>
          </div>
          <div>
            <label class="input-label">Contact Mobile</label>
            <div class="input-field-wrapper">
              <input type="tel" id="flPassPhone" value="+91 98765 43210" required />
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
          <div>
            <label class="input-label">Seat Preference</label>
            <div class="input-field-wrapper">
              <select id="flSeatPref">
                <option>Window (12A)</option>
                <option>Aisle (12C)</option>
                <option>Extra Legroom (01A - ₹500)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="input-label">Meal Add-on</label>
            <div class="input-field-wrapper">
              <select id="flMeal">
                <option>Complimentary Snack + Tea</option>
                <option>Junglee Chicken Sandwich (₹350)</option>
                <option>Paneer Tikka Roll (₹300)</option>
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid var(--border-color); margin-bottom:1.5rem;">
          <div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Total Fare (Incl. Taxes):</div>
            <div style="font-size:1.6rem; font-weight:800; color:var(--primary-purple);">₹${flight.price.toLocaleString('en-IN')}</div>
          </div>
          <button type="submit" class="btn btn-primary btn-lg">
            <span>Pay & Confirm Flight</span> ✈️
          </button>
        </div>
      </form>
    `;

    modal.classList.add('active');
  },

  confirmFlightBooking(e, flightId) {
    e.preventDefault();
    const flight = window.TRIP_GENIE_DATA.flights.find(f => f.id === flightId);
    const name = document.getElementById('flPassName').value;
    const seat = document.getElementById('flSeatPref').value;

    const newBooking = {
      id: `TG-FL-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: 'Flights',
      title: `${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode})`,
      provider: `${flight.airline} ${flight.flightNumber}`,
      date: 'Tomorrow, 15 Oct 2026',
      time: flight.departureTime,
      passengers: `${name} • 1 Adult`,
      price: flight.price,
      status: 'Confirmed',
      seat: seat,
      gate: 'Terminal 3, Gate 14'
    };

    this.bookings.unshift(newBooking);
    this.saveBookings();

    // Close flight modal
    const modal = document.getElementById('flightBookingModal');
    if (modal) modal.classList.remove('active');

    // Show Confirmation Ticket Modal
    this.showTicketModal(newBooking);
    if (window.showToast) window.showToast(`Flight booking confirmed for ${name}!`, 'success', '✈️');
  },

  // --- 2. Stays Booking Wizard ---
  bookStay(stayId) {
    const stay = window.TRIP_GENIE_DATA.stays.find(s => s.id === stayId);
    if (!stay) return;

    const newBooking = {
      id: `TG-STAY-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: 'Hotels',
      title: stay.name,
      provider: stay.location,
      date: '15 Oct - 18 Oct 2026 (3 Nights)',
      time: 'Check-in: 02:00 PM',
      passengers: '2 Guests • Deluxe View Room',
      price: stay.pricePerNight * 3,
      status: 'Confirmed',
      seat: 'Room 304'
    };

    this.bookings.unshift(newBooking);
    this.saveBookings();
    this.showTicketModal(newBooking);
    if (window.showToast) window.showToast(`Reservation confirmed at ${stay.name}!`, 'success', '🏨');
  },

  // --- 3. Ride Booking & Live Driver Matching Simulator ---
  bookRide(rideType) {
    const ride = window.TRIP_GENIE_DATA.rides.find(r => r.type === rideType);
    if (!ride) return;

    const randomDriver = window.TRIP_GENIE_DATA.mockDrivers[Math.floor(Math.random() * window.TRIP_GENIE_DATA.mockDrivers.length)];
    const modal = document.getElementById('rideBookingModal');
    const content = document.getElementById('rideBookingBody');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; padding:1.5rem 0;">
        <div style="width:70px; height:70px; border-radius:50%; background:rgba(16, 185, 129, 0.15); color:var(--accent-green); display:flex; align-items:center; justify-content:center; font-size:2.2rem; margin:0 auto 1rem; animation:gpsPulse 1.8s infinite;">
          ${ride.icon}
        </div>
        <h3 style="font-size:1.3rem; margin-bottom:0.35rem;">Connecting Nearby Driver...</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">Searching for highest-rated drivers within 2 km</p>
        
        <div id="driverFoundCard" style="display:none; background:var(--bg-body); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.25rem; text-align:left; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div>
              <div style="font-weight:800; font-size:1.1rem; color:var(--text-primary);">${randomDriver.name}</div>
              <div style="font-size:0.8rem; color:var(--accent-amber); font-weight:700;">⭐ ${randomDriver.rating} (${randomDriver.trips} trips)</div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-success">Arriving in <span id="driverEtaCountdown">3</span> mins</span>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary); padding-top:0.75rem; border-top:1px solid var(--border-color);">
            <div><strong>Vehicle:</strong> ${randomDriver.vehicle}</div>
            <div><strong>Plate:</strong> <span style="background:var(--bg-surface); padding:2px 6px; border-radius:4px; font-weight:700;">${randomDriver.plate}</span></div>
          </div>
        </div>

        <button id="cancelRideBtn" class="btn btn-secondary btn-full" onclick="document.getElementById('rideBookingModal').classList.remove('active')">
          Cancel Ride Request
        </button>
      </div>
    `;

    modal.classList.add('active');

    // Simulate Driver Match after 1.5 seconds
    setTimeout(() => {
      const card = document.getElementById('driverFoundCard');
      const title = modal.querySelector('h3');
      const sub = modal.querySelector('p');
      if (card && title && sub) {
        title.textContent = 'Driver Assigned & On The Way!';
        sub.textContent = 'Your driver is arriving in 3 minutes.';
        card.style.display = 'block';

        // Add to bookings
        const rideBooking = {
          id: `TG-RIDE-${Math.floor(1000 + Math.random() * 9000)}`,
          serviceType: 'Rides',
          title: `Current Location → Baga Beach`,
          provider: `${ride.name} (${randomDriver.vehicle})`,
          date: 'Today',
          time: 'Pickup in 3 mins',
          passengers: `Driver: ${randomDriver.name} (${randomDriver.phone})`,
          price: ride.fare,
          status: 'Confirmed',
          seat: randomDriver.plate
        };
        this.bookings.unshift(rideBooking);
        this.saveBookings();
      }
    }, 1500);
  },

  // --- 4. Food Ordering & Cart System ---
  addToCart(foodId, foodName, price, restaurantName) {
    const existing = this.foodCart.find(item => item.id === foodId);
    if (existing) {
      existing.qty++;
    } else {
      this.foodCart.push({ id: foodId, name: foodName, price: price, restaurant: restaurantName, qty: 1 });
    }

    if (window.showToast) window.showToast(`Added ${foodName} (₹${price}) to cart`, 'success', '🍜');
    this.updateCartDrawer();
  },

  updateCartDrawer() {
    const countEl = document.getElementById('foodCartCount');
    const listEl = document.getElementById('foodCartItemsList');
    const totalEl = document.getElementById('foodCartTotal');

    const totalQty = this.foodCart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = this.foodCart.reduce((sum, item) => sum + item.qty * item.price, 0);

    if (countEl) countEl.textContent = totalQty;
    if (totalEl) totalEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

    if (listEl) {
      listEl.innerHTML = '';
      if (this.foodCart.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-muted);">Your food cart is empty</div>';
        return;
      }
      this.foodCart.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0; border-bottom:1px solid var(--border-color); font-size:0.9rem;';
        div.innerHTML = `
          <div>
            <div style="font-weight:700;">${item.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">₹${item.price} each</div>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button onclick="BookingsManager.changeCartQty('${item.id}', -1)" style="width:24px; height:24px; border-radius:50%; background:var(--bg-body); border:1px solid var(--border-color); cursor:pointer;">-</button>
            <span style="font-weight:700;">${item.qty}</span>
            <button onclick="BookingsManager.changeCartQty('${item.id}', 1)" style="width:24px; height:24px; border-radius:50%; background:var(--bg-body); border:1px solid var(--border-color); cursor:pointer;">+</button>
            <span style="font-weight:800; min-width:55px; text-align:right;">₹${item.qty * item.price}</span>
          </div>
        `;
        listEl.appendChild(div);
      });
    }
  },

  changeCartQty(id, delta) {
    const item = this.foodCart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.foodCart = this.foodCart.filter(i => i.id !== id);
    }
    this.updateCartDrawer();
  },

  checkoutFoodOrder() {
    if (this.foodCart.length === 0) {
      if (window.showToast) window.showToast('Your cart is empty', 'warning');
      return;
    }

    const total = this.foodCart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const newBooking = {
      id: `TG-FOOD-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: 'Food',
      title: `Food Order (${this.foodCart.length} items)`,
      provider: this.foodCart[0].restaurant || 'Coastal Spice',
      date: 'Today',
      time: 'Delivery in 25 mins',
      passengers: this.foodCart.map(i => `${i.name} (x${i.qty})`).join(', '),
      price: total,
      status: 'Confirmed',
      seat: 'Live Tracking Active'
    };

    this.bookings.unshift(newBooking);
    this.saveBookings();
    this.foodCart = [];
    this.updateCartDrawer();

    const drawer = document.getElementById('foodCartDrawer');
    if (drawer) drawer.classList.remove('active');

    this.showTicketModal(newBooking);
    if (window.showToast) window.showToast('Order Placed! The kitchen is preparing your meal.', 'success', '🍳');
  },

  // --- 5. Interactive Movie & Event Seat Selector ---
  openSeatSelector(entertainmentId) {
    const item = window.TRIP_GENIE_DATA.entertainment.find(e => e.id === entertainmentId);
    if (!item) return;

    this.selectedSeats = [];
    const modal = document.getElementById('movieSeatModal');
    const titleEl = document.getElementById('seatModalTitle');
    const matrixEl = document.getElementById('seatMatrixGrid');
    if (!modal || !matrixEl) return;

    titleEl.textContent = `${item.title} • Seat Selection`;

    // Render interactive seat grid (6 rows of 8 seats)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    matrixEl.innerHTML = '';

    rows.forEach(r => {
      const rowDiv = document.createElement('div');
      rowDiv.style.cssText = 'display:flex; justify-content:center; gap:8px; margin-bottom:8px;';

      for (let num = 1; num <= 8; num++) {
        const seatId = `${r}${num}`;
        const isOccupied = (r === 'C' && (num === 3 || num === 4)) || (r === 'A' && num === 6);
        const seatBtn = document.createElement('button');
        seatBtn.className = `seat-btn ${isOccupied ? 'occupied' : 'available'}`;
        seatBtn.style.cssText = `
          width: 34px; height: 32px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
          background: ${isOccupied ? 'var(--text-muted)' : 'var(--bg-body)'};
          color: ${isOccupied ? '#fff' : 'var(--text-primary)'};
          border: 1px solid var(--border-color);
          cursor: ${isOccupied ? 'not-allowed' : 'pointer'};
        `;
        seatBtn.textContent = seatId;

        if (!isOccupied) {
          seatBtn.onclick = () => {
            if (this.selectedSeats.includes(seatId)) {
              this.selectedSeats = this.selectedSeats.filter(s => s !== seatId);
              seatBtn.style.background = 'var(--bg-body)';
              seatBtn.style.color = 'var(--text-primary)';
              seatBtn.style.borderColor = 'var(--border-color)';
            } else {
              this.selectedSeats.push(seatId);
              seatBtn.style.background = 'var(--primary-purple)';
              seatBtn.style.color = '#fff';
              seatBtn.style.borderColor = 'var(--primary-purple)';
            }
            this.updateSeatSummary(item);
          };
        }
        rowDiv.appendChild(seatBtn);
      }
      matrixEl.appendChild(rowDiv);
    });

    this.updateSeatSummary(item);
    modal.classList.add('active');
  },

  updateSeatSummary(item) {
    const countEl = document.getElementById('selectedSeatCount');
    const namesEl = document.getElementById('selectedSeatNames');
    const priceEl = document.getElementById('selectedSeatTotalPrice');
    const bookBtn = document.getElementById('confirmSeatsBtn');

    const total = this.selectedSeats.length * item.goldPrice;
    if (countEl) countEl.textContent = this.selectedSeats.length;
    if (namesEl) namesEl.textContent = this.selectedSeats.length > 0 ? this.selectedSeats.join(', ') : 'None';
    if (priceEl) priceEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (bookBtn) {
      bookBtn.disabled = this.selectedSeats.length === 0;
      bookBtn.onclick = () => this.confirmMovieBooking(item, total);
    }
  },

  confirmMovieBooking(item, total) {
    const newBooking = {
      id: `TG-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: 'Movies',
      title: item.title,
      provider: item.venue,
      date: 'Today, 06:15 PM',
      time: 'Screen 1 (Gold Class)',
      passengers: `${this.selectedSeats.length} Tickets (Seats: ${this.selectedSeats.join(', ')})`,
      price: total,
      status: 'Confirmed',
      seat: this.selectedSeats.join(', ')
    };

    this.bookings.unshift(newBooking);
    this.saveBookings();

    const modal = document.getElementById('movieSeatModal');
    if (modal) modal.classList.remove('active');

    this.showTicketModal(newBooking);
    if (window.showToast) window.showToast(`Tickets booked for ${item.title}!`, 'success', '🎬');
  },

  // --- 6. E-Ticket / Confirmation Modal with QR Code ---
  showTicketModal(booking) {
    const modal = document.getElementById('eTicketModal');
    const content = document.getElementById('eTicketBody');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="background:var(--bg-body); border-radius:var(--radius-xl); border:1px dashed var(--primary-purple); padding:1.5rem; position:relative; overflow:hidden;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem;">
          <div>
            <span class="badge badge-success">✓ ${booking.status}</span>
            <h3 style="font-size:1.25rem; font-weight:800; margin-top:0.4rem; color:var(--text-primary);">${booking.title}</h3>
            <div style="font-size:0.85rem; color:var(--text-muted);">${booking.provider}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:var(--text-muted);">Booking ID</div>
            <div style="font-weight:800; font-family:monospace; color:var(--primary-purple);">${booking.id}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; padding:1rem 0; border-top:1px solid var(--border-color); border-bottom:1px solid var(--border-color); font-size:0.88rem;">
          <div>
            <div style="color:var(--text-muted); font-size:0.78rem;">DATE & TIME</div>
            <div style="font-weight:700;">${booking.date}</div>
            <div>${booking.time}</div>
          </div>
          <div>
            <div style="color:var(--text-muted); font-size:0.78rem;">SEAT / DETAILS</div>
            <div style="font-weight:700;">${booking.seat || 'Assigned on arrival'}</div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">${booking.passengers}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1.25rem;">
          <div>
            <div style="font-size:0.78rem; color:var(--text-muted);">Total Paid (Trip Pay)</div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--primary-purple);">₹${booking.price.toLocaleString('en-IN')}</div>
          </div>
          <div style="background:#fff; padding:6px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${booking.id}" alt="QR Code" style="width:70px; height:70px;" />
          </div>
        </div>
      </div>

      <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
        <button class="btn btn-secondary btn-full" onclick="window.print()">
          🖨️ Print / Save Ticket
        </button>
        <button class="btn btn-primary btn-full" onclick="document.getElementById('eTicketModal').classList.remove('active')">
          Done
        </button>
      </div>
    `;

    modal.classList.add('active');
  },

  // --- 7. Booking Management Dashboard Rendering ---
  renderBookingsList(filterTab = 'All') {
    const listEl = document.getElementById('myBookingsList');
    if (!listEl) return;

    listEl.innerHTML = '';
    const filtered = this.bookings.filter(b => filterTab === 'All' || b.serviceType.toLowerCase() === filterTab.toLowerCase());

    if (filtered.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted);">No bookings found in ${filterTab}</div>`;
      return;
    }

    filtered.forEach(b => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.cssText = 'padding:1.5rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem;';
      card.innerHTML = `
        <div style="display:flex; gap:1rem; align-items:flex-start;">
          <div style="width:50px; height:50px; border-radius:var(--radius-lg); background:rgba(124,58,237,0.1); color:var(--primary-purple); display:flex; align-items:center; justify-content:center; font-size:1.6rem;">
            ${b.serviceType === 'Flights' ? '✈️' : b.serviceType === 'Hotels' ? '🏨' : b.serviceType === 'Rides' ? '🚕' : b.serviceType === 'Food' ? '🍜' : '🎬'}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
              <span class="badge ${b.status === 'Confirmed' ? 'badge-success' : 'badge-danger'}">${b.status}</span>
              <span style="font-size:0.78rem; color:var(--text-muted); font-family:monospace;">${b.id}</span>
            </div>
            <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-primary);">${b.title}</h4>
            <div style="font-size:0.85rem; color:var(--text-muted);">${b.provider} • ${b.date} (${b.time})</div>
            <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:4px;">${b.passengers}</div>
          </div>
        </div>
        <div style="text-align:right; display:flex; flex-direction:column; gap:0.5rem; align-items:flex-end;">
          <div style="font-size:1.35rem; font-weight:800; color:var(--primary-purple);">₹${b.price.toLocaleString('en-IN')}</div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-sm btn-secondary" onclick="BookingsManager.showTicketModal(BookingsManager.bookings.find(x => x.id === '${b.id}'))">
              View Ticket
            </button>
            ${b.status === 'Confirmed' ? `<button class="btn btn-sm btn-danger" onclick="BookingsManager.cancelBooking('${b.id}')">Cancel</button>` : ''}
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  },

  cancelBooking(bookingId) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    booking.status = 'Cancelled';
    this.saveBookings();
    this.renderBookingsList('All');

    // Refund simulation to TRIP PAY wallet
    if (window.AppState) {
      window.AppState.walletBalance += booking.price;
      localStorage.setItem('trip_genie_wallet', window.AppState.walletBalance);
      if (window.updateWalletDisplay) window.updateWalletDisplay();
    }

    if (window.showToast) window.showToast(`Booking ${bookingId} cancelled. Refund of ₹${booking.price} credited to Trip Pay!`, 'info', '↩️');
  }
};

window.BookingsManager = BookingsManager;

document.addEventListener('DOMContentLoaded', () => {
  BookingsManager.init();
});
