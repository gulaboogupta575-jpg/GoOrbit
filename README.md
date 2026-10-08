# 🌍 Go Orbit (`go orbit`) - Tour & Travel Platform

> **"Explore the Earth, Orbit the World"**  
> A full-stack tour & travel web application with day-wise itineraries, real-time travel transit price breakdown (Flight, Train, AC Bus), automated multi-tier discount & coupon engine, online booking with payment gateway, customer reviews with photo/video uploads, custom trip planner, and an Admin Command Center.

---

## 🌟 Key Features

### 1. 🇮🇳 India Tour (10 Destinations, each with 4-5 Places)
1. **Shimla & Manali** (Mall Road, Solang Valley, Rohtang Pass, Hadimba Temple, Atal Tunnel)
2. **Delhi & Goa** (India Gate, Baga Beach, Fort Aguada, Dudhsagar Falls, Basilica of Bom Jesus)
3. **Kashmir** (Dal Lake Shikara, Gulmarg Gondola, Pahalgam Betaab Valley, Sonamarg, Shankaracharya Hill)
4. **Mumbai** (Gateway of India, Marine Drive, Elephanta Caves, Juhu Beach, Bandra-Worli Sea Link)
5. **Kerala** (Alleppey Backwaters, Munnar Tea Gardens, Wayanad Edakkal Caves, Fort Kochi, Varkala Cliff)
6. **Jaipur** (Amber Fort, Hawa Mahal, City Palace, Jal Mahal, Nahargarh Sunset Point)
7. **Andaman & Nicobar** (Radhanagar Beach Havelock, Cellular Jail, Elephant Beach Snorkeling, Ross Island, Neil Island)
8. **Darjeeling & Gangtok** (Tiger Hill Sunrise, Batasia Loop, Heritage Toy Train, Peace Pagoda, Happy Valley Tea)
9. **Leh - Ladakh** (Pangong Tso Lake, Nubra Valley Dunes, Khardung La Pass, Magnetic Hill, Thiksey Monastery)
10. **Meghalaya** (Cherrapunji Nohkalikai Falls, Double Decker Living Root Bridge, Dawki Umngot River, Mawlynnong, Mawsmai Caves)

### 2. ✈️ International Tour (11 Destinations)
- **Dubai & Abu Dhabi, UAE** (Burj Khalifa, Red Dunes Desert Safari, Palm Jumeirah & Atlantis, Museum of the Future)
- **Japan** (Mount Fuji, Kyoto Fushimi Inari, Tokyo Shibuya, Osaka Dotonbori, Nara Deer Park)
- **Bali, Indonesia** (Ubud Monkey Forest, Tanah Lot, Nusa Penida T-Rex Beach, Mount Batur Sunrise)
- **Turkey** (Cappadocia Hot Air Balloons, Hagia Sophia, Pamukkale Terraces, Bosphorus Cruise)
- **Switzerland** (Jungfraujoch Top of Europe, Mount Titlis Revolving Cable Car, Lake Lucerne, Matterhorn)
- **London, UK** (Big Ben, Tower Bridge, London Eye, Buckingham Palace, British Museum)
- **Paris, France** (Eiffel Tower, Louvre Museum, Seine River Cruise, Arc de Triomphe, Montmartre)
- **Singapore** (Marina Bay Sands, Gardens by the Bay, Universal Studios Sentosa, Jewel Changi Vortex)
- **Malaysia** (Petronas Twin Towers, Batu Caves, Langkawi Sky Bridge, Genting Highlands)
- **Maldives** (Overwater Luxury Villa, Coral Reef Snorkeling, Banana Reef Diving, Sunset Dolphin Cruise)
- **USA** (Times Square NYC, Grand Canyon Skywalk, Las Vegas Strip, Hollywood Walk of Fame, Golden Gate)

### 3. 🏔️ Adventure Tour (6 High-Adrenaline Hubs & Activities)
1. **Alpine & Himalayan Trekking** (Kedarkantha 12,500 ft Winter Summit, Triund, Hampta Pass)
2. **White Water River Rafting** (Rishikesh Ganges Grade IV Rapids, Kundalika River Kolad)
3. **Tandem Paragliding** (Bir Billing World Championship Site, Solang Valley)
4. **Wilderness Camping & Stargazing** (Pawna Lake, Spiti Valley High Altitude, Jaisalmer Thar Desert)
5. **Scuba Diving & Coral Exploration** (Havelock Island Andaman, Netrani Island, Grande Island Goa)
6. **Bungee Jumping & Cliff Jumping** (Mohan Chatti Rishikesh 83m, Kolad, Mayem Lake Goa)

---

## ⚡ Technical Highlights

- **Real-Time Travel Cost Estimator**:
  - Live simulated price matrix based on origin city (Delhi, Mumbai, Bengaluru, etc.)
  - Real-time comparison: **Flight** (Fastest), **Train** (IRCTC AC Rail), **Bus** (Luxury AC Sleeper)
  - Full itemized transparent breakdown: Transit Tickets + Hotel Upgrades (Standard, Deluxe, Luxury) + Local Cab & Chauffeur + Sightseeing & Monument passes + Food + 5% GST - Discounts.
- **Dynamic Multi-Tier Discount & Coupon Engine**:
  - **Coupons**: `ORBITNEW` (Flat ₹2,500 off), `SUMMER2026` (15% off up to ₹7,500), `DIWALI25` (Flat ₹5,000 off), `ADVENTURE10` (10% off).
  - **Multi-Package Bundle Discount**: 2 packages = 10% Extra Off; 3+ packages = 15% Extra Off.
  - **Regular / Old Customer Loyalty Tier**: 5% auto-discount for Regulars, 10% auto-discount for Gold VIP.
  - **Active Seasonal Event Sale**: "Himalayan Summer & Alps Fest 2026" with banner and countdown.
- **Online Booking & Interactive Payment Gateway**:
  - Step 1: Passenger info & date selection
  - Step 2: Realistic Razorpay / Stripe style Checkout modal supporting **UPI QR Code**, **Credit/Debit Card**, **Net Banking**, and **One-Click Instant Demo Payment**!
  - Step 3: Instant confirmed booking voucher & official tax invoice with printable PDF view (`window.print()`) and WhatsApp share.
- **Reviews & Rating with Photo/Video Upload**:
  - Customers can review trips, rate 1-5 stars, and upload real trip photos and video links.
- **Custom Trip Planner / Concierge**:
  - Interactive multi-destination custom trip builder with live estimated budget calculations.
- **Admin Command Center**:
  - Live statistics (Revenue, Bookings, Inquiries, Ratings)
  - Bookings Manager (Confirmed, Completed, Cancelled)
  - Custom Trip Inquiries Manager
  - Promo Coupons Manager & Seasonal Sales Manager
- **Currency Switcher**:
  - Live conversion between **₹ INR**, **$ USD**, **€ EUR**, and **AED**.

---

## 🚀 How to Run

1. Open your terminal in the project directory:
   ```bash
   cd C:\Users\RISHI\.gemini\antigravity\scratch\go-orbit
   ```

2. Start the full-stack server (serves both API & Frontend):
   ```bash
   node server/index.js
   ```
   Open your browser at: **`http://localhost:5005`**

3. For frontend live development:
   ```bash
   npm run dev
   ```
   Vite dev server runs at: **`http://localhost:3000`** (auto-proxies `/api` to port 5005).

---

## 🔑 Demo Logins & Test Coupons
- **Regular Customer**: Click `Login` -> Click `Regular Customer` (5% auto-discount activated)
- **VIP Customer**: Click `Login` -> Click `Gold VIP Elite` (10% auto-discount activated)
- **Admin Dashboard**: Click `Admin` button in the top navigation bar.
- **Coupons to try**: `ORBITNEW`, `SUMMER2026`, `DIWALI25`, `ADVENTURE10`.
