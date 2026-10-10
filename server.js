const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// In-Memory Database
let DB = {
  wallet_balance: 12450.00,
  transactions: [
    { id: 'TXN-9841', title: 'IndiGo Flight to Goa (DEL → GOI)', category: 'Travel', date: '02 Sep 2026, 09:30 AM', amount: -4299, status: 'Success', icon: '✈️' },
    { id: 'TXN-9840', title: 'Ocean Pearl Luxury Resort Advance', category: 'Hotel', date: '01 Sep 2026, 04:15 PM', amount: -3499, status: 'Success', icon: '🏨' },
    { id: 'TXN-9839', title: 'Coastal Spice Goan Dinner', category: 'Food', date: '01 Sep 2026, 08:45 PM', amount: -620, status: 'Success', icon: '🍜' },
    { id: 'TXN-9838', title: 'Genie Prime Cab Ride (Airport to Hotel)', category: 'Rides', date: '01 Sep 2026, 10:20 AM', amount: -249, status: 'Success', icon: '🚕' }
  ],
  bookings: [
    { id: 'TG-FL-7701', serviceType: 'Flights', title: 'Delhi (DEL) → Goa (GOI)', provider: 'IndiGo 6E-2044', date: '15 Oct 2026', time: '06:30 AM', price: 4299, status: 'Confirmed', seat: '12A, 12B' }
  ]
};

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', app: 'TRIP GENIE Express Backend', timestamp: new Date() });
});

app.get('/api/wallet', (req, res) => {
  res.json({ balance: DB.wallet_balance, transactions: DB.transactions });
});

app.post('/api/wallet/pay', (req, res) => {
  const { amount, recipient, category } = req.body;
  if (amount > DB.wallet_balance) {
    return res.status(400).json({ success: false, error: 'Insufficient wallet balance' });
  }
  DB.wallet_balance -= parseFloat(amount);
  const newTxn = {
    id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `Paid to ${recipient}`,
    category: category || 'Transfer',
    date: 'Just now',
    amount: -parseFloat(amount),
    status: 'Success',
    icon: '💸'
  };
  DB.transactions.unshift(newTxn);
  res.json({ success: true, txn: newTxn, newBalance: DB.wallet_balance });
});

app.get('/api/bookings', (req, res) => {
  res.json({ success: true, data: DB.bookings });
});

app.post('/api/bookings/create', (req, res) => {
  const booking = { id: `TG-BK-${Math.floor(1000 + Math.random() * 9000)}`, ...req.body, status: 'Confirmed' };
  DB.bookings.unshift(booking);
  res.json({ success: true, booking });
});

app.post('/api/emergency/sos', (req, res) => {
  const { lat, lng } = req.body;
  console.log(`[SOS ALERT RECEIVED] GPS: ${lat}, ${lng}`);
  res.json({ success: true, message: 'Emergency broadcast logged. Contacts notified.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`🧞 TRIP GENIE Fullstack Node Server running on http://localhost:${PORT}`);
});
