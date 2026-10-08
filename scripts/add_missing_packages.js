const fs = require('fs');
const path = require('path');

const pkgsPath = path.join(__dirname, '..', 'server', 'data', 'packages.json');
const destsPath = path.join(__dirname, '..', 'server', 'data', 'destinations.json');

const pkgs = JSON.parse(fs.readFileSync(pkgsPath, 'utf8'));
const dests = JSON.parse(fs.readFileSync(destsPath, 'utf8'));

const existingDestIds = new Set(pkgs.map(p => p.destinationId));

const newPackagesData = [
  {
    id: 'pkg-delhi-goa-sunshine',
    destinationId: 'delhi-goa',
    title: 'Heritage to Coastline: Delhi Monuments & Goa Sun-Kissed Beaches',
    category: 'india',
    badge: 'Bestseller',
    duration: '7 Days / 6 Nights',
    price: 18499,
    originalPrice: 24999,
    rating: 4.7,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight', 'train', 'bus'],
    overview: 'From the imperial Mughal capitals of Delhi to the sun-drenched golden sands of Goa. Experience centuries of history at Qutub Minar, followed by water sports on Baga Beach, Dudhsagar Falls jeep safari, and Portuguese cathedrals.',
    highlights: [
      'Delhi Heritage: India Gate, Qutub Minar & Red Fort architectural glory',
      'Goa Golden Sands: Baga, Calangute & Anjuna beach shacks with sunset music',
      'Excursion to Dudhsagar Waterfalls (310m) jeep safari in Mollem National Park',
      '17th-century Fort Aguada & UNESCO Basilica of Bom Jesus in Old Goa'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi & Monument Tour', description: 'Arrive in Delhi. Visit Qutub Minar, Humayun Tomb, and drive past Parliament House & India Gate.', meals: 'Dinner Included', stay: '4-Star Central Hotel Delhi' },
      { day: 2, title: 'Old Delhi Heritage & Flight to Goa', description: 'Explore Chandni Chowk and Jama Masjid. Afternoon flight to Dabolim/Mopa Goa. Check in to beachfront resort.', meals: 'Breakfast & Dinner', stay: 'Beachfront Resort North Goa' },
      { day: 3, title: 'North Goa Beaches & Fort Aguada', description: 'Visit 17th-century Portuguese Fort Aguada lighthouse. Afternoon water sports at Baga & Calangute beaches.', meals: 'Breakfast & Dinner', stay: 'Beachfront Resort North Goa' },
      { day: 4, title: 'Dudhsagar Waterfalls Jungle Safari', description: 'Thrilling open-jeep safari through Bhagwan Mahavir Wildlife Sanctuary to the majestic 4-tiered Dudhsagar milky waterfall.', meals: 'Breakfast & Picnic Lunch', stay: 'Beachfront Resort North Goa' },
      { day: 5, title: 'Old Goa Heritage & Mandovi Sunset Cruise', description: 'Visit Basilica of Bom Jesus and Se Cathedral. Evening luxury cruise along Mandovi River with Goan folk dances.', meals: 'Breakfast & Dinner', stay: 'Beachfront Resort North Goa' },
      { day: 6, title: 'South Goa Tranquility & Sunset Shacks', description: 'Relax at pristine Colva and Palolem beaches, shop in Panjim Latin Quarter (Fontainhas).', meals: 'Breakfast & Dinner', stay: 'Beachfront Resort North Goa' },
      { day: 7, title: 'Goa Departure', description: 'Morning breakfast with Arabian sea breeze. Transfer to Goa Airport for flight back home.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '6 Nights accommodation (2N Delhi + 4N Goa Beach Resort)',
      'Daily breakfast and buffet dinners',
      'All inter-city transfers and local sightseeing in private AC car',
      'Dudhsagar waterfall jeep permit and Mandovi sunset river cruise ticket',
      '24x7 Go Orbit on-trip concierge assistance'
    ],
    exclusions: ['Personal water sports fees (parasailing, jet-ski)', 'Monument entry tickets in Delhi', 'Lunch expenses']
  },
  {
    id: 'pkg-mumbai-maximum-city',
    destinationId: 'mumbai',
    title: 'Maximum City Charm: Mumbai Gateway, Marine Drive & Elephanta Island',
    category: 'india',
    badge: 'City Lights',
    duration: '4 Days / 3 Nights',
    price: 12999,
    originalPrice: 17499,
    rating: 4.7,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600100397608-f010f4438df3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595658658481-d53d3f999be7?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight', 'train', 'bus'],
    overview: 'Feel the electric pulse of the City of Dreams. Ferry to UNESCO Elephanta Caves, drive across the engineering feat Bandra-Worli Sea Link, stroll the Queen’s Necklace at night, and savor iconic street chaat at Juhu Beach.',
    highlights: [
      'Iconic basalt Gateway of India and historic Colaba Causeway shopping',
      'Scenic ferry ride across Mumbai harbor to rock-cut Elephanta Caves',
      'Evening Marine Drive Queen’s Necklace walk & Bandra-Worli Sea Link cruise',
      'Celebrity mansions at Bandra Bandstand and street food at Juhu Beach'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & South Mumbai Heritage', description: 'Arrive in Mumbai. Check in to hotel. Visit Gateway of India, Taj Mahal Palace Hotel, and Victoria Terminus (CSMT).', meals: 'Dinner Included', stay: '4-Star South Mumbai Hotel' },
      { day: 2, title: 'Elephanta Caves & Marine Drive Sunset', description: 'Board harbor ferry to Elephanta Island caves. Evening stroll along the 3.6 km Marine Drive glowing under night streetlights.', meals: 'Breakfast & Dinner', stay: '4-Star South Mumbai Hotel' },
      { day: 3, title: 'Bandra-Worli Sea Link, Bandstand & Juhu', description: 'Drive over the high-speed 8-lane Sea Link. Visit Mount Mary Church, Bandra street art, and sunset street food at Juhu Beach.', meals: 'Breakfast & Dinner', stay: '4-Star South Mumbai Hotel' },
      { day: 4, title: 'Siddhi Vinayak & Departure', description: 'Morning visit to Siddhivinayak Temple and Colaba souvenir shopping before transfer to airport/station.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '3 Nights stay in premium 4-Star Mumbai hotel with breakfast',
      'Ferry tickets and toy train pass to Elephanta Caves',
      'All sightseeing transfers in private AC sedan with toll/Sea Link charges',
      'Professional certified local city guide'
    ],
    exclusions: ['Personal shopping & meals not listed', 'Museum entrance camera fees']
  },
  {
    id: 'pkg-jaipur-pink-royalty',
    destinationId: 'jaipur',
    title: 'Royal Rajputana: Jaipur Amber Fort, Hawa Mahal & Nahargarh Sunset',
    category: 'india',
    badge: 'Royal Heritage',
    duration: '4 Days / 3 Nights',
    price: 13999,
    originalPrice: 18999,
    rating: 4.8,
    reviewCount: 440,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1609137144820-721fbce3b708?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight', 'train', 'bus'],
    overview: 'Live like royalty in Rajasthan’s Pink City. Gaze at the honeycomb facade of Hawa Mahal, explore the glittering mirror palace (Sheesh Mahal) inside hilltop Amber Fort, and enjoy golden hour sunsets from Nahargarh Fort.',
    highlights: [
      'Hilltop Amber Fort with Sheesh Mahal and optional elephant/jeep ride',
      'Pink sandstone 953-window facade of Hawa Mahal and floating Jal Mahal',
      'Royal armory and Chandra Mahal museum inside City Palace',
      'Sunset tea and panoramic pink cityscape views atop Nahargarh Fort'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Pink City & Chokhi Dhani', description: 'Arrive in Jaipur. Check in to heritage hotel. Evening excursion to Chokhi Dhani ethnic village for folk dances and traditional Rajasthani thali.', meals: 'Dinner Included', stay: 'Heritage Haveli Hotel Jaipur' },
      { day: 2, title: 'Amber Fort & Jal Mahal', description: 'Ascend to Amber Fort. Marvel at the Sheesh Mahal. Photo stop at water palace Jal Mahal and visit ancient royal observatory Jantar Mantar.', meals: 'Breakfast & Dinner', stay: 'Heritage Haveli Hotel Jaipur' },
      { day: 3, title: 'Hawa Mahal, City Palace & Nahargarh Sunset', description: 'Photograph Hawa Mahal at sunrise. Tour Maharaja’s City Palace. Evening drive up the Aravalli hills for sunset over Jaipur from Nahargarh Fort.', meals: 'Breakfast & Dinner', stay: 'Heritage Haveli Hotel Jaipur' },
      { day: 4, title: 'Bapu Bazar Shopping & Departure', description: 'Morning handicraft shopping for blue pottery, bandhani dupattas and mojaris in Bapu Bazar before departure transfer.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '3 Nights in luxury Heritage Palace hotel with daily breakfast & dinner',
      'All monument transfers in private AC cab with parking & fuel included',
      'Chokhi Dhani cultural village entry and traditional dinner feast',
      'Dedicated Rajputana guide at Amber Fort'
    ],
    exclusions: ['Elephant safari ride fee at Amber Fort', 'Monument camera fees']
  },
  {
    id: 'pkg-andaman-tropical-paradise',
    destinationId: 'andaman-nicobar',
    title: 'Tropical Andaman Paradise: Havelock Radhanagar, Neil Island & Coral Reefs',
    category: 'india',
    badge: 'Island Escape',
    duration: '6 Days / 5 Nights',
    price: 27999,
    originalPrice: 36999,
    rating: 4.9,
    reviewCount: 365,
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'Step onto Asia’s finest powder-white sands. Watch fiery tropical sunsets on Havelock Island’s Radhanagar Beach, snorkel with kaleidoscope clownfish at Elephant Beach, and marvel at the natural rock bridge on Neil Island.',
    highlights: [
      'Radhanagar Beach (Havelock), ranked among Asia’s best beaches',
      'Elephant Beach snorkeling, jet-skiing and live coral reef exploration',
      'Fast high-speed Catamaran luxury ferry transfers (Makruzz / Nautika)',
      'Cellular Jail historic Light & Sound show and Ross Island British ruins'
    ],
    itinerary: [
      { day: 1, title: 'Port Blair Arrival & Cellular Jail', description: 'Arrive at Veer Savarkar Airport Port Blair. Visit national memorial Cellular Jail and attend evening patriotic Light & Sound Show.', meals: 'Dinner Included', stay: 'Seafront Resort Port Blair' },
      { day: 2, title: 'Catamaran to Havelock & Radhanagar Sunset', description: 'Board premium Makruzz catamaran across Andaman Sea to Havelock Island. Afternoon relaxation at world-famous Radhanagar Beach.', meals: 'Breakfast & Dinner', stay: 'Beachside Villa Havelock' },
      { day: 3, title: 'Elephant Beach Snorkeling & Water Sports', description: 'Speedboat to Elephant Beach for complimentary coral reef snorkeling. Optional sea walking and scuba diving.', meals: 'Breakfast & Dinner', stay: 'Beachside Villa Havelock' },
      { day: 4, title: 'Neil Island Natural Bridge & Beaches', description: 'Cruise to Neil Island (Shaheed Dweep). Visit natural rock bridge formation, Laxmanpur sunset beach and Bharatpur water sports beach.', meals: 'Breakfast & Dinner', stay: 'Tropical Resort Neil Island' },
      { day: 5, title: 'Ross Island Ruins & Return to Port Blair', description: 'Ferry back to Port Blair. Short boat excursion to Ross Island (Netaji Subhash Bose Dweep) to see colonial ruins and roaming deer.', meals: 'Breakfast & Dinner', stay: 'Seafront Resort Port Blair' },
      { day: 6, title: 'Port Blair Departure', description: 'Breakfast with ocean panorama. Transfer to airport with seashells and tropical memories.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '5 Nights in 4-Star beach resorts across Port Blair, Havelock & Neil Island',
      'All inter-island transfers by luxury AC Catamaran (Makruzz/Green Ocean)',
      'Complimentary snorkeling session at Elephant Beach',
      'All entry permits, ferry tickets, and private road transfers',
      'Breakfast and buffet dinners throughout the tour'
    ],
    exclusions: ['Scuba diving & Sea walk charges (can be added on request)', 'Airfare to Port Blair']
  },
  {
    id: 'pkg-darjeeling-gangtok-sunrise',
    destinationId: 'darjeeling',
    title: 'Misty Himalayan Escapade: Darjeeling Tiger Hill, Toy Train & Gangtok',
    category: 'india',
    badge: 'Mountain Serenity',
    duration: '5 Days / 4 Nights',
    price: 16999,
    originalPrice: 22999,
    rating: 4.8,
    reviewCount: 298,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight', 'train', 'bus'],
    overview: 'Watch the golden first sun rays illuminate Mount Kanchenjunga from Tiger Hill. Chug along misty pine curves on the UNESCO Heritage Steam Toy Train and explore organic tea gardens and Gangtok’s alpine monasteries.',
    highlights: [
      'Tiger Hill 4 AM sunrise overlooking Mount Kanchenjunga & Everest',
      'UNESCO World Heritage Darjeeling Himalayan Railway Toy Train joyride',
      'Happy Valley 150-year-old tea estate stroll and tea tasting',
      'Peace Pagoda, Batasia Loop spiral war memorial & Gangtok MG Marg'
    ],
    itinerary: [
      { day: 1, title: 'Bagdogra to Darjeeling Hill Drive', description: 'Pick up from Bagdogra Airport / NJP Station. Drive through rolling tea hills. Check in to mountain resort in Darjeeling.', meals: 'Dinner Included', stay: 'Valley View Resort Darjeeling' },
      { day: 2, title: 'Tiger Hill Sunrise & Heritage Toy Train', description: 'Early morning Tiger Hill sunrise. Visit Batasia Loop and Ghoom Monastery. Afternoon iconic steam Toy Train ride to Kurseong.', meals: 'Breakfast & Dinner', stay: 'Valley View Resort Darjeeling' },
      { day: 3, title: 'Happy Valley Tea Estate & Japanese Pagoda', description: 'Tour second oldest tea estate Happy Valley, Himalayan Mountaineering Institute (HMI), and Japanese Peace Pagoda.', meals: 'Breakfast & Dinner', stay: 'Valley View Resort Darjeeling' },
      { day: 4, title: 'Scenic Transfer to Gangtok & MG Marg', description: 'Drive alongside Teesta River to Gangtok. Visit Enchey Monastery, Do Drul Chorten stupa, and evening stroll on vehicle-free MG Marg.', meals: 'Breakfast & Dinner', stay: 'Premium Hill Resort Gangtok' },
      { day: 5, title: 'Departure from Gangtok', description: 'Final mountain breakfast. Transfer to Bagdogra Airport / NJP Railway Station for return journey.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '4 Nights in 3-Star / 4-Star mountain view hotels with breakfast & dinner',
      'Tiger Hill excursion permit and Batasia Loop entry',
      'All transfers and sightseeing in dedicated private vehicle',
      'Happy Valley tea garden guided tour'
    ],
    exclusions: ['Toy Train ticket (can be bundled)', 'Tsomgo Lake pass fee']
  },
  {
    id: 'pkg-ladakh-high-passes',
    destinationId: 'leh-ladakh',
    title: 'High Altitude Wonder: Leh, Pangong Tso Lake & Khardung La Pass',
    category: 'india',
    badge: 'Bucket List',
    duration: '7 Days / 6 Nights',
    price: 24999,
    originalPrice: 33999,
    rating: 4.9,
    reviewCount: 485,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'Conquer the highest motorable road in the world at Khardung La (17,982 ft). Camp beside the color-changing sapphire waters of Pangong Tso Lake, and ride double-humped Bactrian camels on high-altitude white sand dunes in Nubra Valley.',
    highlights: [
      'Sapphire blue Pangong Tso Lake (14,270 ft) with overnight lakeside swiss tent',
      'Cross the epic Khardung La Pass (17,982 ft) motorable summit',
      'Nubra Valley Hunder white sand dunes with Bactrian camel safari',
      'Magnetic Hill gravity illusion, Sangam confluence & Thiksey Monastery'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Leh (Acclimatization Day)', description: 'Fly into Kushok Bakula Rimpochee Airport Leh (11,500 ft). Complete rest for acclimatization. Evening sunset walk to Shanti Stupa.', meals: 'Dinner Included', stay: 'Boutique Hotel Leh' },
      { day: 2, title: 'Magnetic Hill, Indus-Zanskar Sangam & Hall of Fame', description: 'Visit gravity-defying Magnetic Hill, confluence of green Indus & muddy Zanskar rivers, and Indian Army Hall of Fame museum.', meals: 'Breakfast & Dinner', stay: 'Boutique Hotel Leh' },
      { day: 3, title: 'Khardung La Pass (17,982 ft) to Nubra Valley', description: 'Climb the world-famous Khardung La pass. Descend into Nubra Valley. Ride double-humped camels amidst Hunder sand dunes.', meals: 'Breakfast & Dinner', stay: 'Deluxe Camp Nubra Valley' },
      { day: 4, title: 'Diskit Monastery & Drive to Pangong Lake', description: 'Visit 106 ft Maitreya Buddha at Diskit. Scenic off-road drive along Shyok River to arrive at Pangong Tso Lake for starlight camping.', meals: 'Breakfast & Dinner', stay: 'Lakeside Swiss Camp Pangong' },
      { day: 5, title: 'Pangong Sunrise & Return to Leh via Chang La', description: 'Witness sunrise turning Pangong waters from azure to deep violet. Traverse Chang La Pass (17,590 ft) and visit 12-story Thiksey Monastery.', meals: 'Breakfast & Dinner', stay: 'Boutique Hotel Leh' },
      { day: 6, title: 'Leh Local Bazaars & Hemis Cultural Tour', description: 'Visit Hemis Monastery (largest in Ladakh) and 3 Idiots Rancho School. Evening Tibetan souvenir shopping in Leh main market.', meals: 'Breakfast & Dinner', stay: 'Boutique Hotel Leh' },
      { day: 7, title: 'Leh Airport Departure', description: 'Morning breakfast with Himalayan mountain panorama. Transfer to Leh Airport for flight back.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '6 Nights accommodation (4N Leh Hotel + 1N Nubra Camp + 1N Pangong Camp)',
      'Daily breakfast and hot Tibetan/multi-cuisine dinners',
      'Private Innova/Scorpio vehicle for all passes and lakes transfers',
      'Ladakh Inner Line Permits and Wildlife environmental protection fees',
      'Oxygen cylinder on board in vehicle for high-altitude emergency safety'
    ],
    exclusions: ['Camel safari ride fees at Hunder', 'Monument entrance tickets']
  },
  {
    id: 'pkg-japan-sakura-fuji',
    destinationId: 'japan',
    title: 'Land of the Rising Sun: Tokyo Neon, Mount Fuji, Kyoto & Osaka Food Trail',
    category: 'international',
    badge: 'Global Iconic',
    duration: '8 Days / 7 Nights',
    price: 115000,
    originalPrice: 149000,
    rating: 4.95,
    reviewCount: 540,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1478436127897-769e00d2c715?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'A timeless journey balancing futuristic mega-cities and ancient zen temples. Cross the bustling Shibuya pedestrian scramble, gaze at sacred Mount Fuji reflected on Lake Kawaguchiko, walk through 10,000 vermilion Torii gates in Kyoto, and feast on Osaka takoyaki.',
    highlights: [
      'Tokyo Shibuya Crossing, teamLab digital art & Senso-ji Temple',
      'Mount Fuji 5th Station & panoramic Lake Kawaguchiko cruise',
      'Shinkansen Bullet Train journey at 320 km/h across Japan',
      'Kyoto Fushimi Inari Shrine, Arashiyama Bamboo Grove & Nara sacred deer'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Tokyo & Shibuya Scramble', description: 'Arrive at Tokyo Haneda/Narita Airport. Check in to central Tokyo hotel. Evening visit to the neon-drenched Shibuya Crossing and Hachiko statue.', meals: 'Welcome Dinner', stay: '4-Star City Hotel Tokyo' },
      { day: 2, title: 'Tokyo Heritage & Futuristic Neon', description: 'Tour ancient Asakusa Senso-ji Temple, stroll traditional Nakamise-dori, and explore high-tech Akihabara & Shinjuku skyscraper observation deck.', meals: 'Breakfast Included', stay: '4-Star City Hotel Tokyo' },
      { day: 3, title: 'Mount Fuji & Lake Kawaguchiko Excursion', description: 'Drive to sacred Mount Fuji 5th station (7,500 ft). Cruise Lake Kawaguchiko on the pirate boat and ride Mt. Fuji panoramic ropeway.', meals: 'Breakfast & Lunch', stay: '4-Star City Hotel Tokyo' },
      { day: 4, title: 'Bullet Train Shinkansen to Kyoto', description: 'Board the 320 km/h Shinkansen Bullet Train to Kyoto. Afternoon visit to the Golden Pavilion (Kinkaku-ji) reflecting on mirror pond.', meals: 'Breakfast Included', stay: 'Traditional Boutique Hotel Kyoto' },
      { day: 5, title: 'Fushimi Inari & Arashiyama Bamboo Forest', description: 'Walk through 10,000 vermilion Torii gates up Mount Inari. Stroll inside the towering Arashiyama Bamboo Grove and visit Sagano romantic train.', meals: 'Breakfast Included', stay: 'Traditional Boutique Hotel Kyoto' },
      { day: 6, title: 'Nara Sacred Deer Park & Osaka Food Trail', description: 'Travel to Nara Park where 1,000 friendly sacred deer bow for deer crackers. Evening arrival in Osaka Dotonbori food mecca.', meals: 'Breakfast Included', stay: '4-Star Central Hotel Osaka' },
      { day: 7, title: 'Osaka Castle & Dotonbori Neon Night', description: 'Explore Osaka Castle tower and gardens. Savor authentic takoyaki (octopus balls) and okonomiyaki under the famous Glico Running Man neon sign.', meals: 'Breakfast & Dinner', stay: '4-Star Central Hotel Osaka' },
      { day: 8, title: 'Osaka / Tokyo Departure', description: 'Last-minute matcha and Japanese KitKat souvenir shopping before transfer to Kansai / Tokyo airport for flight home.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '7 Nights in premium 4-Star hotels with daily breakfast buffet',
      'Japan Rail Pass for Shinkansen Bullet Train',
      'Guided Mount Fuji & Lake Kawaguchiko day tour',
      'All local train and subway transit IC travel card passes',
      'Japan tourist visa documentation assistance'
    ],
    exclusions: ['International airfare (available in live estimator)', 'Personal shopping and optional theme park tickets']
  },
  {
    id: 'pkg-turkey-cappadocia-balloons',
    destinationId: 'turkey',
    title: 'Grand Turkish Odyssey: Istanbul Bosphorus, Cappadocia Balloons & Pamukkale',
    category: 'international',
    badge: 'Fairytale Dream',
    duration: '7 Days / 6 Nights',
    price: 69999,
    originalPrice: 92000,
    rating: 4.85,
    reviewCount: 430,
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'Where Europe meets Asia. Cruise between continents on the Bosphorus Strait, marvel at the 1,500-year-old domes of Hagia Sophia, soar 2,000 ft in a sunrise hot air balloon over Cappadocia’s fairytale fairy chimneys, and bathe in warm thermal waters at Pamukkale.',
    highlights: [
      'Cappadocia Sunrise Hot Air Balloon Flight over volcanic fairy chimneys',
      'Istanbul Sultanahmet: Hagia Sophia, Blue Mosque & Grand Bazaar (4,000 shops)',
      'Scenic Bosphorus Strait Cruise dividing Europe and Asia',
      'Pamukkale gleaming white travertine calcium pools & ancient Hierapolis ruins'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Istanbul & Bosphorus Sunset Cruise', description: 'Arrive at Istanbul Airport (IST). Private transfer to hotel. In the evening, private yacht cruise dividing European and Asian shores of the Bosphorus.', meals: 'Dinner on Cruise', stay: '4-Star Hotel Sultanahmet Istanbul' },
      { day: 2, title: 'Hagia Sophia, Blue Mosque & Grand Bazaar', description: 'Walk through 1,500-year-old Hagia Sophia Byzantine dome, the 6 minarets of Blue Mosque, and bargain for carpets & spices in Grand Bazaar.', meals: 'Breakfast Included', stay: '4-Star Hotel Sultanahmet Istanbul' },
      { day: 3, title: 'Flight to Cappadocia & Underground Cave City', description: 'Domestic flight to Cappadocia. Explore subterranean Kaymakli underground city carved by early Christians and stay in an authentic Cave Hotel.', meals: 'Breakfast & Dinner', stay: 'Luxury Cave Suite Cappadocia' },
      { day: 4, title: 'The Big Flight: Sunrise Hot Air Balloon', description: 'Pre-dawn takeoff in a colorful hot air balloon soaring above lunar rock formations and fairy chimneys. Afternoon Göreme Open-Air Museum tour.', meals: 'Breakfast & Dinner', stay: 'Luxury Cave Suite Cappadocia' },
      { day: 5, title: 'Pamukkale White Travertine Terraces', description: 'Drive/train to Pamukkale. Walk barefoot on warm calcium thermal terraces and swim in Cleopatra’s antique thermal pool among Roman marble columns.', meals: 'Breakfast & Dinner', stay: 'Thermal Spa Resort Pamukkale' },
      { day: 6, title: 'Hierapolis Amphitheatre & Return to Istanbul', description: 'Explore ancient Greco-Roman amphitheatre of Hierapolis. Fly back to Istanbul. Evening traditional Turkish hammam bath and baklava tasting.', meals: 'Breakfast Included', stay: '4-Star Hotel Sultanahmet Istanbul' },
      { day: 7, title: 'Istanbul Departure', description: 'Final Turkish coffee and lokum delight shopping before private executive transfer to Istanbul Airport for return flight.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '6 Nights in handpicked hotels including 2 Nights in luxury Cappadocia Cave Suite',
      'Hot Air Balloon sunrise flight booking assistance & certificate',
      'Bosphorus dinner cruise with Turkish folk dance performance',
      'Domestic flights Istanbul-Cappadocia and Pamukkale-Istanbul',
      'All airport transfers and guided museum entry tickets'
    ],
    exclusions: ['International flight tickets', 'Turkey e-Visa fee ($43)']
  },
  {
    id: 'pkg-london-oxford-royal',
    destinationId: 'london',
    title: 'British Crown & Oxford Heritage: London Big Ben, Tower Bridge & Royal Palaces',
    category: 'international',
    badge: 'Royal Classic',
    duration: '6 Days / 5 Nights',
    price: 98000,
    originalPrice: 128000,
    rating: 4.8,
    reviewCount: 475,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'Live the timeless charm of Great Britain. Stand before Big Ben, take flight on the London Eye observation wheel, watch the Changing of the Guard at Buckingham Palace, and take a day excursion to the historic dreaming spires of Oxford University.',
    highlights: [
      'Big Ben chimes, Palace of Westminster & Westminster Abbey',
      'Fast-track London Eye 360-degree panorama flight over River Thames',
      'Tower Bridge glass floor walkway and Crown Jewels at Tower of London',
      'Day trip to Oxford University dreaming spires & Bodleian Library'
    ],
    itinerary: [
      { day: 1, title: 'Heathrow Arrival & River Thames Walk', description: 'Arrive at London Heathrow (LHR). Executive transfer to central hotel. Evening stroll along the South Bank past illuminated Tower Bridge.', meals: 'Welcome Dinner', stay: '4-Star Central London Hotel' },
      { day: 2, title: 'Big Ben, Westminster & London Eye Flight', description: 'Photograph Big Ben and Parliament House. Step inside Westminster Abbey. Board the iconic 135m London Eye for 360-degree city panorama.', meals: 'Breakfast Included', stay: '4-Star Central London Hotel' },
      { day: 3, title: 'Buckingham Palace & Tower of London', description: 'Watch royal Changing of the Guard at Buckingham Palace. Tour 900-year-old Tower of London fortress housing the 530-carat Cullinan Crown Jewels.', meals: 'Breakfast Included', stay: '4-Star Central London Hotel' },
      { day: 4, title: 'Day Trip to Oxford Dreaming Spires', description: 'Scenic train journey to Oxford. Walk the cobbled collegiate quadrangles of Christ Church (Harry Potter hall) and Radcliffe Camera library.', meals: 'Breakfast Included', stay: '4-Star Central London Hotel' },
      { day: 5, title: 'British Museum & Covent Garden', description: 'Marvel at Rosetta Stone and Egyptian mummies in British Museum. Evening West End musical theatre show and Covent Garden street buskers.', meals: 'Breakfast Included', stay: '4-Star Central London Hotel' },
      { day: 6, title: 'London Departure', description: 'Harrods shopping and traditional English afternoon tea with scones before transfer to Heathrow Airport.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '5 Nights in 4-Star central London hotel with English breakfast',
      'London Eye fast-track priority boarding ticket',
      'Tower of London and Crown Jewels admission pass',
      'Roundtrip express train tickets to Oxford University',
      'London Underground Oyster Card with preloaded travel credit'
    ],
    exclusions: ['UK Standard Visitor Visa stamping fee', 'International flights']
  },
  {
    id: 'pkg-paris-lights-eiffel',
    destinationId: 'paris',
    title: 'Parisian Romance: Eiffel Tower Summit, Louvre Masterpieces & Seine Cruise',
    category: 'international',
    badge: 'Romantic Chic',
    duration: '6 Days / 5 Nights',
    price: 105000,
    originalPrice: 138000,
    rating: 4.9,
    reviewCount: 630,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'Immerse in the world’s capital of romance, fashion, and haute cuisine. Ascend the summit of the Eiffel Tower, gaze into the eyes of the Mona Lisa at the Louvre, glide down the River Seine past Notre-Dame Cathedral, and stroll charming cobblestone alleys in Montmartre.',
    highlights: [
      'Eiffel Tower Summit entrance ticket with glass elevator panorama',
      'Louvre Museum skip-the-line pass: Mona Lisa & Venus de Milo',
      'Illuminated Seine River evening dinner cruise past shimmering landmarks',
      'Palace of Versailles Hall of Mirrors day trip & bohemian Montmartre'
    ],
    itinerary: [
      { day: 1, title: 'Paris CDG Arrival & Romantic Seine Cruise', description: 'Land at Charles de Gaulle Airport. Private transfer to hotel. Evening illuminated Seine river boat cruise with French cheese & wine tasting.', meals: 'Dinner on Cruise', stay: 'Boutique Hotel Central Paris' },
      { day: 2, title: 'Eiffel Tower Summit & Champs-Élysées', description: 'Ascend to the top of 330m Eiffel Tower for sweeping vistas of Paris. Walk down luxury Avenue des Champs-Élysées to the Arc de Triomphe.', meals: 'Breakfast Included', stay: 'Boutique Hotel Central Paris' },
      { day: 3, title: 'Louvre Museum & Gothic Notre-Dame', description: 'Skip-the-line Louvre Museum guided tour to see Da Vinci’s Mona Lisa and Winged Victory. Afternoon walk in Île de la Cité by Notre-Dame.', meals: 'Breakfast Included', stay: 'Boutique Hotel Central Paris' },
      { day: 4, title: 'Palace of Versailles Royal Day Trip', description: 'Excursion to the glittering royal estate of Versailles. Walk through the 357 mirrors of Hall of Mirrors and sculpted musical fountain gardens.', meals: 'Breakfast Included', stay: 'Boutique Hotel Central Paris' },
      { day: 5, title: 'Montmartre Artists & Sacré-Cœur Basilica', description: 'Climb the bohemian hilltop of Montmartre. Visit artist square Place du Tertre and enjoy panoramic city views from Sacré-Cœur basilica.', meals: 'Breakfast Included', stay: 'Boutique Hotel Central Paris' },
      { day: 6, title: 'Paris Departure', description: 'Fresh Parisian croissants, macarons at Ladurée, and boutique shopping before transfer to airport for departure.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '5 Nights in romantic Parisian boutique hotel with French breakfast',
      'Eiffel Tower top-tier observatory entrance pass',
      'Louvre Museum fast-track timed entrance ticket',
      'Palace of Versailles estate and garden passport ticket',
      'Seine River cruise pass and Paris Visite travel card'
    ],
    exclusions: ['Schengen visa fees', 'International airfare']
  },
  {
    id: 'pkg-singapore-futuristic-marvel',
    destinationId: 'singapore',
    title: 'Futuristic Singapore: Marina Bay Sands, Gardens by the Bay & Universal Studios',
    category: 'international',
    badge: 'Family Favorite',
    duration: '5 Days / 4 Nights',
    price: 52999,
    originalPrice: 69999,
    rating: 4.9,
    reviewCount: 510,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506351421178-63b52a2d15c2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'Experience the world’s cleanest and greenest smart metropolis. Watch the music and light show beneath 50-meter Supertrees, marvel at the 40m indoor Rain Vortex waterfall at Jewel Changi, and enjoy heart-pounding rollercoasters at Universal Studios Sentosa.',
    highlights: [
      'Marina Bay Sands 57th-floor SkyPark observation deck & infinity pool view',
      'Gardens by the Bay Supertree Grove, Flower Dome & indoor Cloud Forest',
      'Full Day Universal Studios Singapore with theme park rides & shows',
      'World’s tallest indoor waterfall at Jewel Changi & Sentosa Cable Car'
    ],
    itinerary: [
      { day: 1, title: 'Jewel Changi Arrival & Marina Bay Sands', description: 'Land at award-winning Changi Airport. Witness 7-story Rain Vortex waterfall. Check in to hotel. Evening visit to Marina Bay Sands SkyPark.', meals: 'Dinner Included', stay: '4-Star Hotel Marina Bay / Orchard' },
      { day: 2, title: 'Gardens by the Bay & Merlion Park', description: 'Photograph Singapore’s mythic Merlion fountain. Tour Flower Dome and misty Cloud Forest mountain. Evening Supertree light and sound show.', meals: 'Breakfast Included', stay: '4-Star Hotel Marina Bay / Orchard' },
      { day: 3, title: 'Sentosa Island & Universal Studios VIP', description: 'Scenic cable car ride to Sentosa Island. Full day at Universal Studios: Transformers 3D, Battlestar Galactica, and Jurassic Park rapids.', meals: 'Breakfast Included', stay: '4-Star Hotel Marina Bay / Orchard' },
      { day: 4, title: 'Singapore Night Safari & Chinatown', description: 'Explore colorful heritage shophouses in Chinatown. Evening open-tram tram ride through the world’s first nocturnal zoo Night Safari.', meals: 'Breakfast Included', stay: '4-Star Hotel Marina Bay / Orchard' },
      { day: 5, title: 'Orchard Road Shopping & Departure', description: 'Shop duty-free along luxury Orchard Road malls before private executive transfer to Changi Airport for flight home.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '4 Nights in 4-Star Singapore hotel with daily international breakfast',
      'Full day Universal Studios Singapore admission pass',
      'Gardens by the Bay Flower Dome & Cloud Forest combo pass',
      'Marina Bay Sands SkyPark observatory ticket',
      'Sentosa Mount Faber scenic return cable car pass'
    ],
    exclusions: ['International flight tickets', 'Singapore Tourist e-Visa ($30)']
  },
  {
    id: 'pkg-malaysia-twin-towers-langkawi',
    destinationId: 'malaysia',
    title: 'Marvels of Malaysia: Kuala Lumpur Petronas, Batu Caves & Langkawi Island',
    category: 'international',
    badge: 'Tropical Duo',
    duration: '6 Days / 5 Nights',
    price: 38999,
    originalPrice: 51999,
    rating: 4.8,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'A vibrant blend of futuristic skyscrapers, ancient limestone cavern shrines, and duty-free tropical island paradise. Walk between the 452m Petronas Twin Towers, climb 272 rainbow steps at Batu Caves, and stroll on the curved Langkawi Sky Bridge.',
    highlights: [
      'Petronas Twin Towers 41st-floor double-decker Skybridge & 86th Observatory',
      'Batu Caves 140 ft golden Lord Murugan statue & limestone temple caves',
      'Domestic flight to duty-free island paradise Langkawi',
      'Langkawi SkyCab cable car & curved suspension bridge 660m above sea level'
    ],
    itinerary: [
      { day: 1, title: 'Kuala Lumpur Arrival & Petronas Towers', description: 'Arrive at KLIA. Check in to central KL hotel. Evening visit to soaring Petronas Twin Towers and KLCC dancing fountain show.', meals: 'Dinner Included', stay: '4-Star Hotel Bukit Bintang KL' },
      { day: 2, title: 'Batu Caves Rainbow Steps & Genting Highlands', description: 'Climb 272 colorful steps into Batu Caves temple. Cable car ride up to Genting Highlands mountain resort and indoor theme parks.', meals: 'Breakfast & Dinner', stay: '4-Star Hotel Bukit Bintang KL' },
      { day: 3, title: 'Flight to Langkawi Island & Pantai Cenang', description: 'Short flight to Langkawi. Transfer to beachfront resort. Relax on the powder-white sands of Pantai Cenang with fiery tropical sunset.', meals: 'Breakfast & Dinner', stay: 'Beach Resort Langkawi' },
      { day: 4, title: 'Langkawi SkyBridge & Island Hopping Tour', description: 'Ride world’s steepest cable car to Langkawi Sky Bridge suspended over lush rainforest. Afternoon speedboat island hopping tour.', meals: 'Breakfast & Island Lunch', stay: 'Beach Resort Langkawi' },
      { day: 5, title: 'Kilim Geoforest Mangrove Safari & Duty-Free', description: 'Boat safari through limestone mangrove caves, eagle feeding, and bat caves. Duty-free chocolate and perfume shopping in Kuah town.', meals: 'Breakfast & Dinner', stay: 'Beach Resort Langkawi' },
      { day: 6, title: 'Langkawi Departure', description: 'Breakfast overlooking the turquoise Andaman Sea. Transfer to Langkawi Airport for departure via KL.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '5 Nights accommodation (2N Kuala Lumpur + 3N Langkawi Beachfront Resort)',
      'Domestic flight Kuala Lumpur to Langkawi with 20kg luggage allowance',
      'Petronas Twin Towers observatory deck pass',
      'Langkawi SkyBridge and SkyCab cable car combo pass',
      'All airport transfers and private road transport'
    ],
    exclusions: ['International round-trip flights', 'Tourism Tax (approx RM10/room/night payable at hotel)']
  },
  {
    id: 'pkg-maldives-overwater-paradise',
    destinationId: 'maldives',
    title: 'Maldivian Overwater Euphoria: Private Villa, Coral Reef Snorkeling & Dolphin Cruise',
    category: 'international',
    badge: 'Honeymoon Luxury',
    duration: '5 Days / 4 Nights',
    price: 65999,
    originalPrice: 88000,
    rating: 4.95,
    reviewCount: 580,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'The epitome of island luxury. Step directly down from your private overwater sun deck into turquoise crystalline lagoons. Snorkel alongside gentle sea turtles and harmless reef sharks, and cruise on the Indian Ocean surrounded by leaping spinner dolphins.',
    highlights: [
      'Luxury Overwater Pool Villa with glass floor ocean viewing panels',
      'Banana Reef and Maafushi guided coral garden snorkeling safari',
      'Sunset Dolphin Cruise with sparkling beverages & hors d’oeuvres',
      'Complimentary candlelit 4-course seafood dinner on private beach'
    ],
    itinerary: [
      { day: 1, title: 'Male Arrival & Speedboat / Seaplane Transfer', description: 'Land at Velana International Airport (MLE). Board luxury speedboat transfer across turquoise atolls to your Overwater Pool Villa.', meals: 'Welcome Dinner', stay: '5-Star Overwater Pool Villa' },
      { day: 2, title: 'Turquoise Lagoon Swimming & Coral Snorkeling', description: 'Step straight from your private balcony stairs into warm turquoise lagoon waters. Guided snorkeling over kaleidoscope coral gardens.', meals: 'Breakfast, Lunch & Dinner', stay: '5-Star Overwater Pool Villa' },
      { day: 3, title: 'Banana Reef Deep Dive & Water Sports', description: 'Explore Maldives’ first protected dive site Banana Reef with certified dive masters. Afternoon glass-bottom kayaking and stand-up paddleboarding.', meals: 'Breakfast, Lunch & Dinner', stay: '5-Star Overwater Pool Villa' },
      { day: 4, title: 'Sunset Dolphin Cruise & Candlelight Dinner', description: 'Late afternoon cruise into open sea as wild spinner dolphin pods jump alongside the boat. Starlit 4-course dinner set on private beach sands.', meals: 'Breakfast, Lunch & Beach Dinner', stay: '5-Star Overwater Pool Villa' },
      { day: 5, title: 'Floating Breakfast & Male Departure', description: 'Indulge in an iconic floating breakfast in your villa private pool. Speedboat transfer back to Male Airport for flight home.', meals: 'Floating Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '4 Nights in Luxury 5-Star Overwater Villa with private plunge pool',
      'Full Board Meal Plan (Daily Breakfast, Gourmet Lunch & Dinners)',
      'Speedboat / Seaplane airport round-trip transfers',
      'Sunset Dolphin Cruise tour ticket included',
      'Complimentary use of snorkeling fins, mask, and non-motorized water sports',
      'Maldives Green Tax and GST included'
    ],
    exclusions: ['International flight tickets', 'Personal spa treatments']
  },
  {
    id: 'pkg-usa-coast-to-coast',
    destinationId: 'usa',
    title: 'The Great American Journey: NYC Times Square, Grand Canyon, Vegas & San Francisco',
    category: 'international',
    badge: 'Grand Odyssey',
    duration: '10 Days / 9 Nights',
    price: 185000,
    originalPrice: 245000,
    rating: 4.9,
    reviewCount: 495,
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight'],
    overview: 'The definitive Coast-to-Coast American dream. Experience the electric dazzle of Times Square and Statue of Liberty in New York, the mile-deep natural wonder of the Grand Canyon, the glamour of the Las Vegas Strip, Hollywood Walk of Fame, and San Francisco’s Golden Gate Bridge.',
    highlights: [
      'New York: Statue of Liberty ferry, Times Square & Empire State Building',
      'Grand Canyon West Rim Skywalk glass bridge suspended 4,000 ft above canyon',
      'Las Vegas: World-famous Strip, Bellagio fountains & casino spectacles',
      'California: Hollywood Walk of Fame, Santa Monica Pier & Golden Gate Bridge'
    ],
    itinerary: [
      { day: 1, title: 'New York JFK Arrival & Times Square Walk', description: 'Arrive at New York JFK. Transfer to Manhattan hotel. Evening walk through the dazzling digital billboards of Times Square and Broadway.', meals: 'Welcome Dinner', stay: '4-Star Manhattan Hotel NYC' },
      { day: 2, title: 'Statue of Liberty & Financial District', description: 'Ferry to Liberty Island and Ellis Island. Walk Wall Street, Charging Bull, 9/11 Memorial, and sunset from Top of the Rock observation deck.', meals: 'Breakfast Included', stay: '4-Star Manhattan Hotel NYC' },
      { day: 3, title: 'Central Park, 5th Avenue & Empire State', description: 'Stroll romantic bridges in Central Park, luxury shopping along 5th Avenue, and night views from the 86th floor of Empire State Building.', meals: 'Breakfast Included', stay: '4-Star Manhattan Hotel NYC' },
      { day: 4, title: 'Flight to Las Vegas: Capital of Entertainment', description: 'Morning flight to Las Vegas. Check in to iconic Strip resort. Evening walking tour of Bellagio fountains, Caesars Palace, and neon shows.', meals: 'Breakfast Included', stay: '4-Star Strip Resort Las Vegas' },
      { day: 5, title: 'Grand Canyon Skywalk Day Excursion', description: 'Coach / helicopter tour to Grand Canyon West Rim. Walk on the horseshoe-shaped glass Skywalk 4,000 ft above the Colorado River canyon floor.', meals: 'Breakfast & Canyon Lunch', stay: '4-Star Strip Resort Las Vegas' },
      { day: 6, title: 'Drive to Los Angeles: Hollywood & Santa Monica', description: 'Scenic drive across Mojave Desert to Los Angeles. Walk among stars on Hollywood Walk of Fame and sunset carnival rides at Santa Monica Pier.', meals: 'Breakfast Included', stay: '4-Star Hotel Los Angeles / Beverly Hills' },
      { day: 7, title: 'Universal Studios Hollywood Movie Magic', description: 'Full day behind-the-scenes movie studio tram tour, Wizarding World of Harry Potter, and Jurassic World thrill rides at Universal Studios.', meals: 'Breakfast Included', stay: '4-Star Hotel Los Angeles / Beverly Hills' },
      { day: 8, title: 'Flight to San Francisco & Bay Cruise', description: 'Morning flight to San Francisco. Board Golden Gate bay cruise sailing directly under the towering orange suspension bridge and past Alcatraz.', meals: 'Breakfast Included', stay: '4-Star Central Hotel San Francisco' },
      { day: 9, title: 'Fisherman’s Wharf, Cable Cars & Painted Ladies', description: 'Ride historic wooden Cable Cars, see sea lions at Pier 39, crooked Lombard Street, and Victorian Painted Ladies houses at Alamo Square.', meals: 'Breakfast Included', stay: '4-Star Central Hotel San Francisco' },
      { day: 10, title: 'San Francisco Departure', description: 'Breakfast at Ghirardelli Square chocolate shop before executive airport transfer to SFO for flight home.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '9 Nights in premium 4-Star hotels across NYC, Las Vegas, LA & San Francisco',
      'Domestic flights NYC to Las Vegas and LA to San Francisco included',
      'Statue of Liberty ferry pass & Empire State Building 86th floor ticket',
      'Grand Canyon West Rim entrance ticket and Skywalk pass',
      'San Francisco Golden Gate Bay Cruise ticket and Universal Studios pass'
    ],
    exclusions: ['USA B1/B2 tourist visa fees', 'International roundtrip flights']
  },
  {
    id: 'pkg-wilderness-camping-stargazing',
    destinationId: 'camping',
    title: 'Starlit Wilderness Camping: Pawna Lake, Spiti Night Sky & Jaisalmer Thar Dunes',
    category: 'adventure',
    badge: 'Under The Stars',
    duration: '3 Days / 2 Nights',
    price: 4999,
    originalPrice: 7499,
    rating: 4.8,
    reviewCount: 410,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight', 'train', 'bus'],
    overview: 'Unplug and sleep beneath a galaxy of a million stars. Gather around crackling bonfires, kayak on tranquil lake waters, and point high-powered telescopes at the arms of the Milky Way, Saturn’s rings, and meteor showers.',
    highlights: [
      'Waterfront Swiss Cottages & Alpine Dome Tents with comfortable bedding',
      'High-powered telescope astrophotography and Milky Way stargazing session',
      'Evening acoustic campfire music with live barbecue skewers',
      'Morning kayaking, paddleboarding, and sunrise lakeside nature trails'
    ],
    itinerary: [
      { day: 1, title: 'Camp Arrival, Kayaking & Sunset Bonfire', description: 'Arrive at campsite by 3 PM. Welcome refreshments. Sunset kayaking and volleyball. Night campfire with live acoustic guitar and barbecue dinner.', meals: 'Evening Snacks, BBQ & Dinner', stay: 'Riverside / Lake Luxury Swiss Tent' },
      { day: 2, title: 'Himalayan Ridge Hike & Dark Sky Stargazing', description: 'Morning sunrise trail and bird watching. Afternoon camp games. At nightfall, certified astronomer session exploring constellations and planets.', meals: 'Breakfast, Lunch & Dinner', stay: 'Riverside / Lake Luxury Swiss Tent' },
      { day: 3, title: 'Morning Swim & Departure', description: 'Morning tea with dewy mountain breeze. Delicious buffet breakfast. Check out by 11 AM with revitalized mind and spirit.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '2 Nights accommodation in waterproof Swiss cottage tents with attached washrooms',
      'All meals: 2 Breakfasts, 1 Lunch, 2 High Teas, 2 Dinners (Veg & Non-Veg BBQ)',
      'Kayaking and life jacket safety gear',
      'Professional telescope stargazing and bonfire setup'
    ],
    exclusions: ['Personal transport to camp base', 'Alcoholic beverages']
  },
  {
    id: 'pkg-scuba-coral-exploration',
    destinationId: 'scuba-diving',
    title: 'Underwater Marine Expedition: Havelock Coral Gardens & Netrani Island Reefs',
    category: 'adventure',
    badge: 'Ocean Deep',
    duration: '3 Days / 2 Nights',
    price: 9999,
    originalPrice: 14999,
    rating: 4.9,
    reviewCount: 360,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight', 'train', 'bus'],
    overview: 'Plunge into vibrant underwater kingdoms. Glide past multicolored coral reefs, swim alongside majestic sea turtles, stingrays, and clownfish in crystal 30-meter visibility coastal waters under certified PADI dive masters.',
    highlights: [
      '2 Open-Water boat dives with full professional scuba gear & safety briefing',
      'PADI / SSI certified master diver guidance (suitable for non-swimmers too!)',
      'High-definition 4K underwater photography and video clips included',
      'Explore pristine coral beds, sunken shipwrecks, and kaleidoscope marine life'
    ],
    itinerary: [
      { day: 1, title: 'Arrival, Pool Training & Equipment Fitting', description: 'Arrive at diving center. Meet PADI instructors. Gear up with wetsuit, BCD, and regulator. Complete shallow water breathing and equalization training.', meals: 'Welcome Dinner', stay: 'Coastal Beach Resort' },
      { day: 2, title: 'The Big Dives: Deep Reef Exploration', description: 'Board dive boat to offshore coral pinnacles. Complete two guided 45-minute dives down to 12 meters. Spot moray eels, turtles, and brain corals.', meals: 'Breakfast, Packed Lunch & Dinner', stay: 'Coastal Beach Resort' },
      { day: 3, title: 'Logbook Certification & Coastal Departure', description: 'Logbook signing ceremony. Receive your official Discover Scuba Diving Certificate and 4K underwater video files. Departure transfer.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '2 Nights stay in beachside resort with breakfast',
      '2 Guided open-water boat dives with certified master diver',
      'Full scuba gear rental (Regulator, BCD, Wetsuit, Mask, Fins, Tank)',
      'Free 4K underwater video recording and photos package',
      'Diver insurance and marine sanctuary entry permits'
    ],
    exclusions: ['PADI Open Water formal license test fees (optional upgrade)']
  },
  {
    id: 'pkg-extreme-bungee-cliff',
    destinationId: 'bungee-jumping',
    title: 'Ultimate Gravity Defiance: Rishikesh 83m Bungee, Giant Swing & Flying Fox',
    category: 'adventure',
    badge: 'Pure Adrenaline',
    duration: '2 Days / 1 Night',
    price: 6499,
    originalPrice: 8999,
    rating: 4.95,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1000&q=80'
    ],
    transportModes: ['flight', 'train', 'bus'],
    overview: 'Defy gravity at India’s highest fixed cantilever bungee platform (83 meters / 272 ft). Operated by ex-New Zealand jump masters with international safety standards, giant canyon swings, and Asia’s longest 1 km flying fox over raging Himalayan riverbeds.',
    highlights: [
      'India’s Highest 83m (272 ft) Fixed Platform Bungee Jump by Jumpin Heights',
      'High-speed 140 km/h Flying Fox spanning 1 km across Himalayan river gorge',
      'Official Dare to Jump Certificate and multi-angle 4K jump video footage',
      'Overnight luxury riverside camp stay with pool and evening bonfire'
    ],
    itinerary: [
      { day: 1, title: 'Arrival at Camp & The 83m Bungee Plunge', description: 'Arrive in Rishikesh. Transfer to Mohan Chatti jump zone. Safety briefing and rubber cord harness fitting. Step onto the edge 83m above rocky riverbed and jump! Evening celebratory camp bonfire.', meals: 'Lunch & Dinner', stay: 'Riverside Luxury Tents' },
      { day: 2, title: 'Asia’s Longest 1 km Flying Fox & Departure', description: 'Harness into the tandem flying fox soaring 120m above ground at 140 km/h. Collect your jump videos and certificate. Check out with adrenaline rush.', meals: 'Breakfast Included', stay: 'Departure Day' }
    ],
    inclusions: [
      '1 Night stay in luxury riverside AC tent with attached washroom',
      '83m Bungee Jump ticket with certified jump master supervision',
      '1 km Flying Fox high-speed zip ride ticket',
      'Dare to Jump official certificate and video footage',
      'All meals: 1 Lunch, 1 Dinner, 1 Breakfast'
    ],
    exclusions: ['Optional 83m Giant Swing upgrade', 'Personal transport to Rishikesh']
  }
];

newPackagesData.forEach(newPkg => {
  if (!existingDestIds.has(newPkg.destinationId)) {
    pkgs.push(newPkg);
    console.log('Added: ' + newPkg.title);
  }
});

fs.writeFileSync(pkgsPath, JSON.stringify(pkgs, null, 2), 'utf8');
console.log('ALL DONE! Total packages count in packages.json:', pkgs.length);
