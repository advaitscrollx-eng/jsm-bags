/* ==========================================================================
   JSM BAGS - COMPREHENSIVE INDIAN MARKET CATALOG & STORE CONFIGURATION
   Jai Sundha Mata Bags And Decoration - Manufacturer & Wholesaler, Rajahmundry
   ========================================================================== */

const STORE_CONFIG = {
  brand: 'JSM Bags',
  legalName: 'Jai Sundha Mata Bags And Decoration',
  tagline: 'Manufacturer, Wholesaler & Digital Printing Specialists',
  whatsappNumber: '919440863516',
  phoneDisplay: '+91 94408 63516',
  address: 'Maya bazar, Innespeta, Rajamahendravaram, Andhra Pradesh 533101, India',
  gstin: '',
  msme: '',
  currency: '₹',
  rating: { score: 4.9, count: 480 },
  shipping: {
    domestic: 'Pan-India Delivery across 19,000+ PIN Codes (Bluedart, Delhivery, DTDC, India Post)',
    international: 'Worldwide Export to USA, UK, UAE, Australia, Canada, Singapore & Europe (Sea & Air Cargo)'
  }
};

let CATEGORIES = [
  'All',
  'Potli Bags',
  'Jute Bags',
  'Canvas Bags',
  'Paper Bags',
  'Kids Bags',
  'School Bags',
  'Gym Bags',
  'Travel Bags',
  'Trekking Bags',
  'Trolleys',
  'Laptop Bags',
  'Executive Bags',
  'Carriage / Carry Bags',
  'Handbags',
  'Leather-Type (Faux/Vegan Leather) Bags',
  'Eco-Friendly Biodegradable Return Gift Bags',
  'Transparent Bags',
  'Gift Hamper Bags',
  'Backpack Bundles'
];

const PRODUCTS = [
  /* ================= 1. POTLI BAGS ================= */
  {
    id: 'JSM-POT-01',
    name: 'Royal Heritage Velvet Round Potli Bag',
    category: 'Potli Bags',
    subCategory: 'Round-Shaped Potlis',
    price: 380, // Retail price
    bulkPrice: 240, // 50+ pcs
    wholesalePrice: 175, // 250+ pcs
    moq: { retail: 1, bulk: 50, wholesale: 250 },
    originalPrice: 550,
    rating: 4.9,
    reviews: 64,
    badge: 'Wedding Favorite',
    description: 'Opulent round velvet potli bag embellished with traditional gold zardozi embroidery, pearl drawstring cords, and elaborate golden latkan tassels. Ideal for bridal wear and wedding return gifts.',
    defaultImage: 'assets/images/products/potli-round-01.jpg',
    sizes: [
      { name: 'Standard (8" × 8")', capacity: 'Wedding Shagun Size', priceOffset: 0 },
      { name: 'Large (10" × 10")', capacity: 'Sweet Box & Dryfruit Fit', priceOffset: 60 }
    ],
    colors: [
      { name: 'Maroon Ruby', hex: '#800020', image: 'assets/images/products/potli-round-01.jpg' },
      { name: 'Emerald Green', hex: '#004B23', image: 'assets/images/products/potli-bangle-01.jpg' },
      { name: 'Royal Gold', hex: '#D4AF37', image: 'assets/images/products/potli-sling-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Handcrafted Zardozi & Resham work', 'High-density velvet with satin lining', 'Heavy pearl & gold tassel latkans', 'Custom wedding monogram printing eligible']
  },
  {
    id: 'JSM-POT-02',
    name: 'Designer Zari Brocade Bangle Potli',
    category: 'Potli Bags',
    subCategory: 'Bangle-Type Potlis',
    price: 450,
    bulkPrice: 290,
    wholesalePrice: 210,
    moq: { retail: 1, bulk: 50, wholesale: 250 },
    originalPrice: 650,
    rating: 5.0,
    reviews: 48,
    badge: 'Bestseller',
    description: 'Contemporary rigid gold bangle handle potli fashioned from emerald green & gold Banarasi brocade silk. The bangle slips comfortably over the wrist, keeping hands free at receptions.',
    defaultImage: 'assets/images/products/potli-bangle-01.jpg',
    sizes: [
      { name: 'Classic Wrist Bangle', capacity: 'Fits Phone, Keys & Makeup', priceOffset: 0 }
    ],
    colors: [
      { name: 'Emerald Green & Gold', hex: '#0B6623', image: 'assets/images/products/potli-bangle-01.jpg' },
      { name: 'Maroon Velvet', hex: '#722F37', image: 'assets/images/products/potli-round-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Sturdy cast-metal gold bangle ring', 'Woven Banarasi gold zari weave', 'Inner zip pocket for coins/jewelry', 'Ideal luxury return gift for Haldi/Mehendi']
  },
  {
    id: 'JSM-POT-03',
    name: 'Embroidered Silk Sling Potli with Pearl Strap',
    category: 'Potli Bags',
    subCategory: 'Sling Potlis',
    price: 490,
    bulkPrice: 320,
    wholesalePrice: 235,
    moq: { retail: 1, bulk: 50, wholesale: 250 },
    originalPrice: 700,
    rating: 4.8,
    reviews: 37,
    badge: 'Festive Wear',
    description: 'Versatile festive sling potli crafted with pearl beads chain and ornate floral embroidery. Comes with a 42-inch gold pearl cross-body sling chain for seamless hands-free styling.',
    defaultImage: 'assets/images/products/potli-sling-01.jpg',
    sizes: [
      { name: 'Standard Sling (9" × 7")', capacity: 'Smart Crossbody', priceOffset: 0 }
    ],
    colors: [
      { name: 'Golden Champagne', hex: '#CDB78F', image: 'assets/images/products/potli-sling-01.jpg' },
      { name: 'Wine Velvet', hex: '#58111A', image: 'assets/images/products/potli-round-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Detachable 42" faux-pearl chain', 'Drawstring closure with brass bells', 'Reinforced padded base', 'Custom family name foil tag']
  },
  {
    id: 'JSM-POT-04',
    name: 'Ethnic Raw Silk Mobile Pouch Potli',
    category: 'Potli Bags',
    subCategory: 'Mobile Pouch Potlis',
    price: 320,
    bulkPrice: 195,
    wholesalePrice: 140,
    moq: { retail: 1, bulk: 50, wholesale: 250 },
    originalPrice: 450,
    rating: 4.9,
    reviews: 52,
    badge: 'Everyday Ethnic',
    description: 'Sleek vertical mobile pouch potli designed specifically to carry all modern smartphones, cards, and keys securely. Finished with fine golden embroidery and magnetic clasp.',
    defaultImage: 'assets/images/products/potli-mobile-01.jpg',
    sizes: [
      { name: 'Universal Mobile Fit (8" × 5")', capacity: 'Fits iPhone Pro Max & Galaxy Ultra', priceOffset: 0 }
    ],
    colors: [
      { name: 'Ruby Pink Silk', hex: '#C71585', image: 'assets/images/products/potli-mobile-01.jpg' },
      { name: 'Deep Maroon', hex: '#63101E', image: 'assets/images/products/potli-round-01.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['Slim padded phone partition', 'Soft velvet inner lining to prevent scratches', 'Lightweight gold shoulder chain', 'Personalized initial embroidery available']
  },

  /* ================= 2. JUTE BAGS ================= */
  {
    id: 'JSM-JUT-01',
    name: 'Natural Golden Pure Jute Shopping & Gift Bag',
    category: 'Jute Bags',
    subCategory: 'Pure Jute Bags',
    price: 180,
    bulkPrice: 110,
    wholesalePrice: 75,
    moq: { retail: 1, bulk: 50, wholesale: 500 },
    originalPrice: 280,
    rating: 4.9,
    reviews: 142,
    badge: '100% Eco-Friendly',
    description: '100% biodegradable golden natural jute bag laminated on the inside with water-resistant food-safe liner. Fitted with cushioned cotton cane handles. Premium choice for grocery, shopping and corporate events.',
    defaultImage: 'assets/images/products/jute-pure-01.jpg',
    sizes: [
      { name: 'Small (10" × 12" × 5")', capacity: 'Return Gift / Lunch Bag', priceOffset: 0 },
      { name: 'Medium (12" × 14" × 6")', capacity: 'Conference / Shopping (10 kg)', priceOffset: 25 },
      { name: 'Large (14" × 16" × 7")', capacity: 'Grocery / Supermarket (18 kg)', priceOffset: 45 }
    ],
    colors: [
      { name: 'Natural Golden Jute', hex: '#C5A059', image: 'assets/images/products/jute-pure-01.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 50 },
    customEligible: true,
    features: ['Internal water-resistant LDPE lamination', 'Padded cotton core rope handles', 'Supports full-color screen & digital printing', 'Factory wholesale pricing for 500+ units']
  },
  {
    id: 'JSM-JUT-02',
    name: 'Heavy-Duty 16oz Heavy Canvas Carry Tote',
    category: 'Jute Bags',
    subCategory: 'Canvas Carry Totes',
    price: 320,
    bulkPrice: 210,
    wholesalePrice: 155,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 480,
    rating: 4.8,
    reviews: 89,
    badge: 'Custom Print Ready',
    description: 'High-density unbleached natural 16oz cotton canvas tote featuring reinforced cross-stitched web handles. Premium surface for high-resolution photo and logo digital printing on front and back.',
    defaultImage: 'assets/images/products/jute-canvas-01.jpg',
    sizes: [
      { name: 'Standard (14" × 15")', capacity: 'Book / Laptop Shopper', priceOffset: 0 },
      { name: 'Jumbo Gusset (16" × 16" × 5")', capacity: 'Exhibition & Travel Tote', priceOffset: 40 }
    ],
    colors: [
      { name: 'Natural Off-White Canvas', hex: '#FDFBF7', image: 'assets/images/products/jute-canvas-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['16oz 100% pure organic cotton canvas', 'Supports photo-quality digital flatbed printing', 'Machine washable & shrink-resistant', 'Box stitched handles hold up to 15 kg']
  },
  {
    id: 'JSM-JUT-03',
    name: 'Juko Designer Eco Tote (Jute + Cotton Blend)',
    category: 'Jute Bags',
    subCategory: 'Juko Bags',
    price: 240,
    bulkPrice: 150,
    wholesalePrice: 105,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 360,
    rating: 4.9,
    reviews: 67,
    badge: 'Export Quality',
    description: 'Innovative Juko fabric blending the organic strength of natural jute with the soft smooth touch of cotton. Features a coconut button closure and an exterior white canvas printing pocket.',
    defaultImage: 'assets/images/products/jute-juko-01.jpg',
    sizes: [
      { name: 'Medium Juko (12" × 14" × 5")', capacity: '12 Litres Eco Carry', priceOffset: 0 }
    ],
    colors: [
      { name: 'Juko Earth Blend', hex: '#B89B72', image: 'assets/images/products/jute-juko-01.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Jute-Cotton union weave fabric', 'Natural coconut shell button & loop', 'Soft folded cotton shoulder handles', 'Huge hit for corporate seminars & green events']
  },

  /* ================= 3. ECO-FRIENDLY & EVENT BAGS ================= */
  {
    id: 'JSM-EVT-01',
    name: 'Biodegradable Wedding Return Gift Thamboolam Bag',
    category: 'Eco-Friendly Biodegradable Return Gift Bags',
    subCategory: 'Wedding Return Gifts',
    price: 95,
    bulkPrice: 58,
    wholesalePrice: 42,
    moq: { retail: 5, bulk: 100, wholesale: 500 },
    originalPrice: 140,
    rating: 5.0,
    reviews: 184,
    badge: 'Bulk Hit #1',
    description: 'Traditional Indian auspicious return gift bag for marriages, thread ceremonies, and housewarmings. Holds 2 coconuts, betel leaves, sweets box, and gift items gracefully.',
    defaultImage: 'assets/images/products/event-return-gift-01.jpg',
    sizes: [
      { name: 'Thamboolam Size (9" × 11" × 4")', capacity: 'Standard Return Gift', priceOffset: 0 },
      { name: 'Mega Shagun (11" × 13" × 5")', capacity: 'Saree & Sweet Box Gift', priceOffset: 18 }
    ],
    colors: [
      { name: 'Kalyanam Red & Gold', hex: '#9E1B32', image: 'assets/images/products/event-return-gift-01.jpg' }
    ],
    printOptions: { front: 15, back: 15, both: 25 },
    customEligible: true,
    features: ['100% compostable & eco-friendly', 'Gold foil peacock & Kalash motifs', 'Strong braided carry cords', 'Personalized couple names printed for orders >100 pcs']
  },
  {
    id: 'JSM-EVT-02',
    name: 'Rigid Luxury Window Gift Hamper Bag',
    category: 'Gift Hamper Bags',
    subCategory: 'Luxury Window Hampers',
    price: 180,
    bulkPrice: 115,
    wholesalePrice: 85,
    moq: { retail: 2, bulk: 50, wholesale: 300 },
    originalPrice: 260,
    rating: 4.8,
    reviews: 73,
    badge: 'Festive Hampers',
    description: 'Structured gift hamper carrier featuring transparent front window and satin ribbon bow. Tailored for Diwali dry fruit hampers, corporate onboarding kits, and wedding trousseau gifts.',
    defaultImage: 'assets/images/products/event-hamper-01.jpg',
    sizes: [
      { name: 'Hamper Box (10" × 10" × 6")', capacity: 'Holds 2-3 Jars / Boxes', priceOffset: 0 },
      { name: 'Grand Hamper (12" × 14" × 6")', capacity: 'Holds 4-6 Jars / Gifts', priceOffset: 35 }
    ],
    colors: [
      { name: 'Champagne Ivory', hex: '#EADBB6', image: 'assets/images/products/event-hamper-01.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 50 },
    customEligible: true,
    features: ['High-clarity scratchproof transparent window', 'Heavy 350 GSM craft board reinforced sides', 'Satin bow tie and sturdy cotton handles', 'Full corporate logo screen/foil printing']
  },
  {
    id: 'JSM-EVT-03',
    name: 'Boutique Gold-Embossed Laminated Paper Bags',
    category: 'Paper Bags',
    subCategory: 'Laminated Boutique Bags',
    price: 45,
    bulkPrice: 28,
    wholesalePrice: 19,
    moq: { retail: 10, bulk: 100, wholesale: 1000 },
    originalPrice: 70,
    rating: 4.7,
    reviews: 95,
    badge: 'Retail Wholesale',
    description: 'Premium 250 GSM kraft and ivory art paper bags with matte lamination, turnover top reinforcement, and twisted cotton cord handles. Popular with apparel boutiques and jewellery stores.',
    defaultImage: 'assets/images/products/event-paper-01.jpg',
    sizes: [
      { name: 'Boutique Medium (10" × 12" × 4")', capacity: 'Jewellery / Apparel', priceOffset: 0 },
      { name: 'Shopping Large (13" × 16" × 5")', capacity: 'Saree / Garment Box', priceOffset: 12 }
    ],
    colors: [
      { name: 'Kraft Beige & Gold', hex: '#D2B48C', image: 'assets/images/products/event-paper-01.jpg' }
    ],
    printOptions: { front: 10, back: 10, both: 18 },
    customEligible: true,
    features: ['Heavy 250 GSM virgin paperboard', 'Tear-resistant matte film lamination', 'Eyelet reinforced handle holes', 'Custom brand printing available for 250+ units']
  },
  {
    id: 'JSM-EVT-04',
    name: 'Pure Cotton Drawstring Thamboolam Potli',
    category: 'Eco-Friendly Biodegradable Return Gift Bags',
    subCategory: 'Cotton Cloth Bags',
    price: 65,
    bulkPrice: 38,
    wholesalePrice: 27,
    moq: { retail: 10, bulk: 100, wholesale: 1000 },
    originalPrice: 95,
    rating: 4.9,
    reviews: 128,
    badge: 'Zero Plastic',
    description: 'Unbleached natural 100% South Indian cotton fabric drawstring pouch with traditional elephant block print. Reusable, washable, and zero-plastic return gift packing.',
    defaultImage: 'assets/images/products/event-cotton-cloth-01.jpg',
    sizes: [
      { name: 'Pouch Size (8" × 10")', capacity: 'Pooja Prasadam / Shagun', priceOffset: 0 }
    ],
    colors: [
      { name: 'Kora Natural Cotton', hex: '#F7F4EB', image: 'assets/images/products/event-cotton-cloth-01.jpg' }
    ],
    printOptions: { front: 12, back: 12, both: 20 },
    customEligible: true,
    features: ['100% natural kora cotton cloth', 'Dual pull natural braided drawstring', 'Pre-washed and dye-safe', 'Direct manufacturer wholesale rates']
  },
  {
    id: 'JSM-EVT-05',
    name: 'Heavy-Gauge Transparent Clear PVC Event Tote',
    category: 'Transparent Bags',
    subCategory: 'Clear PVC Bags',
    price: 195,
    bulkPrice: 130,
    wholesalePrice: 92,
    moq: { retail: 2, bulk: 50, wholesale: 300 },
    originalPrice: 280,
    rating: 4.8,
    reviews: 42,
    badge: 'Waterproof',
    description: 'Ultra-clear heavy gauge waterproof PVC bag with golden border piping and strong web handles. Widely used for stadium entry, cosmetic packaging, and modern gift sets.',
    defaultImage: 'assets/images/products/event-transparent-clear-01.jpg',
    sizes: [
      { name: 'Clear Medium (12" × 12" × 4")', capacity: 'Event Security Approved', priceOffset: 0 }
    ],
    colors: [
      { name: 'Crystal Clear & Gold', hex: '#E5E4E2', image: 'assets/images/products/event-transparent-clear-01.jpg' }
    ],
    printOptions: { front: 25, back: 25, both: 40 },
    customEligible: true,
    features: ['0.4mm heavy-gauge odorless PVC', '100% waterproof & wipe-clean', 'Reinforced corner stitching', 'Custom logo screen printing available']
  },

  /* ================= 4. DAILY, TRAVEL & UTILITY BAGS ================= */
  {
    id: 'JSM-UTL-01',
    name: 'Kids 3D Embossed Cartoon Preschool Bag',
    category: 'Kids Bags',
    subCategory: 'Cartoon Preschool Bags',
    price: 490,
    bulkPrice: 320,
    wholesalePrice: 240,
    moq: { retail: 1, bulk: 30, wholesale: 150 },
    originalPrice: 750,
    rating: 4.9,
    reviews: 79,
    badge: 'Kids Favorite',
    description: 'Vibrant 3D embossed waterproof school bag for nursery, preschool and kindergarten kids. Cushioned honeycomb breathable shoulder straps and chest buckle for comfort.',
    defaultImage: 'assets/images/products/daily-kids-01.jpg',
    sizes: [
      { name: 'Preschool Size (14" × 10")', capacity: '12 Litres (Ages 3-7)', priceOffset: 0 }
    ],
    colors: [
      { name: 'Pastel Unicorn Pink', hex: '#FFB6C1', image: 'assets/images/products/daily-kids-01.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['High-density EVA waterproof front shell', 'Lightweight ergonomic design (<400g)', 'Dual side water bottle pockets', 'Name tag holder printed with child’s name']
  },
  {
    id: 'JSM-UTL-02',
    name: 'Ergonomic Ballistic School & College Bag',
    category: 'School Bags',
    subCategory: 'Ergonomic School Backpacks',
    price: 790,
    bulkPrice: 510,
    wholesalePrice: 390,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 1200,
    rating: 4.8,
    reviews: 112,
    badge: 'Heavy Duty',
    description: 'Tough 900D water-repellent ballistic twill backpack with 3 large main compartments, padded laptop divider, and rain cover pocket. Engineered for rough school and tuition use.',
    defaultImage: 'assets/images/products/daily-school-01.jpg',
    sizes: [
      { name: 'Standard School (32L)', capacity: 'Classes 5 to 10', priceOffset: 0 },
      { name: 'College Master (38L)', capacity: 'Junior & Degree College', priceOffset: 90 }
    ],
    colors: [
      { name: 'Navy & Tan', hex: '#1C2E4A', image: 'assets/images/products/daily-school-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['3 Compartments + Organizer front section', '10mm high-density cushioned spine support', 'Reinforced dual-layer base', 'Bulk school crest & emblem screen printing']
  },
  {
    id: 'JSM-UTL-03',
    name: 'ActiveFit Gym & Sports Duffel with Shoe Compartment',
    category: 'Gym Bags',
    subCategory: 'Sports Duffel Bags',
    price: 680,
    bulkPrice: 440,
    wholesalePrice: 330,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 990,
    rating: 4.8,
    reviews: 86,
    badge: 'Gym & Sports',
    description: 'Sleek sports gym duffel featuring dedicated isolated ventilated shoe tunnel, wet towel pouch, and bottle holder. Made from ripstop waterproof polyester with padded shoulder strap.',
    defaultImage: 'assets/images/products/daily-gym-duffel-01.jpg',
    sizes: [
      { name: 'Standard Gym (30L)', capacity: 'Gym Gear + Shoes', priceOffset: 0 }
    ],
    colors: [
      { name: 'Stealth Matte Black', hex: '#2B2B2B', image: 'assets/images/products/daily-gym-duffel-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Separate zippered shoe tunnel with air eyelets', 'Waterproof inner partition for sweaty clothes', 'Padded detachable shoulder strap', 'Corporate wellness & gym bulk branding']
  },
  {
    id: 'JSM-UTL-04',
    name: 'Apex 60L Tactical Trekking & Hiking Rucksack',
    category: 'Trekking Bags',
    subCategory: 'Tactical Rucksacks',
    price: 1890,
    bulkPrice: 1290,
    wholesalePrice: 980,
    moq: { retail: 1, bulk: 15, wholesale: 50 },
    originalPrice: 2800,
    rating: 4.9,
    reviews: 63,
    badge: 'Outdoor Ready',
    description: 'Professional 60L internal-frame rucksack engineered for high-altitude trekking, Western Ghats hiking, and camping. Includes integrated waterproof rain cover, trekking pole loops, and load-lifter waist harness.',
    defaultImage: 'assets/images/products/daily-trekking-hiking-01.jpg',
    sizes: [
      { name: '60 Litres Expedition', capacity: '5-7 Days Trekking Capacity', priceOffset: 0 }
    ],
    colors: [
      { name: 'Army Tactical Olive', hex: '#4B5320', image: 'assets/images/products/daily-trekking-hiking-01.jpg' }
    ],
    printOptions: { front: 50, back: 50, both: 90 },
    customEligible: true,
    features: ['Internal lightweight fiber stays & lumbar pad', 'Bottom shoe compartment + sleeping bag straps', 'High-visibility neon rain cover included', 'Tear-proof hexagonal ripstop fabric']
  },
  {
    id: 'JSM-UTL-05',
    name: 'Voyager All-Weather Weekend Travel Duffle',
    category: 'Travel Bags',
    subCategory: 'Weekend Travel Bags',
    price: 1250,
    bulkPrice: 850,
    wholesalePrice: 620,
    moq: { retail: 1, bulk: 20, wholesale: 100 },
    originalPrice: 1850,
    rating: 4.9,
    reviews: 94,
    badge: 'Travel Essential',
    description: 'Rugged weekend travel bag crafted with water-resistant fabric, heavy-duty metal sliders, and wide trolley pass-through sleeve for airport spinner attachment. 45-litre capacity.',
    defaultImage: 'assets/images/products/daily-travel-01.jpg',
    sizes: [
      { name: 'Weekend (45L)', capacity: 'Flight Cabin Approved', priceOffset: 0 },
      { name: 'Long Stay (60L)', capacity: 'Expedition Weekender', priceOffset: 250 }
    ],
    colors: [
      { name: 'Olive Waxed Canvas', hex: '#556B2F', image: 'assets/images/products/daily-travel-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Cabin luggage compliant (fits overhead bin)', 'Rear trolley sleeve slides over suitcase handle', 'Heavy-gauge solid brass zippers', 'Reinforced luggage bottom studs']
  },
  {
    id: 'JSM-UTL-06',
    name: 'AeroShield Hard-Shell 360° Spinner Cabin Trolley',
    category: 'Trolleys',
    subCategory: 'Spinner Cabin Trolleys',
    price: 2450,
    bulkPrice: 1750,
    wholesalePrice: 1350,
    moq: { retail: 1, bulk: 10, wholesale: 50 },
    originalPrice: 3800,
    rating: 4.9,
    reviews: 58,
    badge: 'Premium Luggage',
    description: 'Lightweight unbreakable German Bayer polycarbonate hard-shell suitcase with whisper-silent 360° Japanese dual spinner wheels, flush TSA combination lock, and telescopic alloy handle.',
    defaultImage: 'assets/images/products/daily-trolley-luggage-01.jpg',
    sizes: [
      { name: 'Cabin 20-Inch (42L)', capacity: 'Domestic & International Flight Cabin', priceOffset: 0 },
      { name: 'Check-in 24-Inch (70L)', capacity: 'Family Holiday Check-in', priceOffset: 650 }
    ],
    colors: [
      { name: 'Graphite Charcoal Grey', hex: '#36454F', image: 'assets/images/products/daily-trolley-luggage-01.jpg' }
    ],
    printOptions: { front: 60, back: 60, both: 110 },
    customEligible: true,
    features: ['100% pure Polycarbonate scratch-resistant shell', 'Smooth 8-wheel silent spinner system', 'TSA certified 3-digit combination lock', 'Custom UV corporate printing available on shell']
  },
  {
    id: 'JSM-UTL-07',
    name: 'Heavy-Duty Reinforced Carriage Shopping Carrier',
    category: 'Carriage / Carry Bags',
    subCategory: 'Heavy-Duty Carry Totes',
    price: 140,
    bulkPrice: 85,
    wholesalePrice: 58,
    moq: { retail: 5, bulk: 100, wholesale: 500 },
    originalPrice: 220,
    rating: 4.8,
    reviews: 136,
    badge: 'Commercial Grade',
    description: 'Heavyweight laminated non-woven carriage bag with cross-stitched nylon webbing handle that wraps all the way around the base. Carries up to 25 kg easily without tearing.',
    defaultImage: 'assets/images/products/daily-carriage-shopping-01.jpg',
    sizes: [
      { name: 'Carriage Jumbo (16" × 18" × 8")', capacity: 'Heavy Goods (Holds 25 kg)', priceOffset: 0 }
    ],
    colors: [
      { name: 'Industrial Royal Blue', hex: '#002366', image: 'assets/images/products/daily-carriage-shopping-01.jpg' }
    ],
    printOptions: { front: 15, back: 15, both: 25 },
    customEligible: true,
    features: ['Continuous webbing handle wraps around bottom', 'Tear-proof waterproof woven polypropylene', 'Foldable & reusable for years', 'Essential for wholesale cloth merchants & delivery']
  },

  /* ================= 5. CORPORATE & FASHION BAGS ================= */
  {
    id: 'JSM-CRP-01',
    name: 'Executive TechPro 16" Padded Laptop Backpack',
    category: 'Laptop Bags',
    subCategory: 'TechPro Laptop Backpacks',
    price: 990,
    bulkPrice: 650,
    wholesalePrice: 480,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 1590,
    rating: 4.9,
    reviews: 147,
    badge: 'Corporate Bestseller',
    description: 'Slim executive business laptop bag with velvet-lined 360° air-cushioned 16" MacBook compartment, external USB charging port, anti-theft hidden pocket, and water-resistant matte fabric.',
    defaultImage: 'assets/images/products/corp-laptop-01.jpg',
    sizes: [
      { name: 'Slimline (15.6" Laptop)', capacity: '18 Litres Daily Office', priceOffset: 0 },
      { name: 'Overnight Expandable (16")', capacity: '26 Litres Travel & Office', priceOffset: 150 }
    ],
    colors: [
      { name: 'Dark Charcoal Black', hex: '#1C1C1C', image: 'assets/images/products/corp-laptop-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['360° EVA padded laptop suspension cradle', 'External USB passthrough charging port', 'Luggage strap for suitcase attachment', 'Highest ordered corporate induction welcome gift']
  },
  {
    id: 'JSM-CRP-02',
    name: 'Diplomat Structured Dual-Lock Leatherette Briefcase',
    category: 'Executive Bags',
    subCategory: 'Diplomat Briefcases',
    price: 1350,
    bulkPrice: 920,
    wholesalePrice: 690,
    moq: { retail: 1, bulk: 20, wholesale: 80 },
    originalPrice: 1990,
    rating: 4.8,
    reviews: 53,
    badge: 'Legal & Executive',
    description: 'Formal hard-sided briefcase tailored for advocates, chartered accountants, and senior executives. Equipped with dual 3-digit combination locks and expandable accordian file folders.',
    defaultImage: 'assets/images/products/corp-executive-01.jpg',
    sizes: [
      { name: 'Standard Briefcase (17" × 12" × 4")', capacity: 'A4 & Legal Files + Laptop', priceOffset: 0 }
    ],
    colors: [
      { name: 'Executive Matte Black', hex: '#1B1816', image: 'assets/images/products/corp-executive-01.jpg' }
    ],
    printOptions: { front: 50, back: 50, both: 90 },
    customEligible: true,
    features: ['Dual combination brass lock system', 'Expandable 4-tier document accordion divider', 'Solid wooden-core frame structure', 'Company logo gold foil / laser etching option']
  },
  {
    id: 'JSM-CRP-03',
    name: 'Atelier Structured Italian Leatherette Handbag',
    category: 'Handbags',
    subCategory: 'Ladies Shoulder Handbags',
    price: 1150,
    bulkPrice: 780,
    wholesalePrice: 580,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 1750,
    rating: 4.9,
    reviews: 91,
    badge: 'Luxury Fashion',
    description: 'Sculptural luxury ladies handbag finished in rich wine Italian leatherette with curved rolled handles, 18k gold-tone turnlock closure, and detachable crossbody shoulder strap.',
    defaultImage: 'assets/images/products/corp-handbag-01.jpg',
    sizes: [
      { name: 'Medium Satchel (11" × 9" × 5")', capacity: 'Daily Work & Party Carry', priceOffset: 0 }
    ],
    colors: [
      { name: 'Burgundy Wine', hex: '#63212D', image: 'assets/images/products/corp-handbag-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Rich grained vegan leather with gold hardware', 'Triple interior compartment with central zipper', 'Bottom protective gold metal studs', 'Custom initial monogram printing']
  },
  {
    id: 'JSM-CRP-04',
    name: 'Saddle Tan Vegan Leather Messenger Crossbody',
    category: 'Leather-Type (Faux/Vegan Leather) Bags',
    subCategory: 'Vegan Leather Messenger',
    price: 980,
    bulkPrice: 640,
    wholesalePrice: 470,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 1450,
    rating: 4.8,
    reviews: 62,
    badge: 'Cruelty-Free',
    description: 'Premium cruelty-free faux leather messenger bag in classic saddle tan with magnetic flap closures, adjustable canvas strap, and multi-pocket organizer for tablets and notebooks.',
    defaultImage: 'assets/images/products/corp-leather-vegan-01.jpg',
    sizes: [
      { name: 'Messenger (13" × 10" × 3.5")', capacity: 'iPad / 13" MacBook Messenger', priceOffset: 0 }
    ],
    colors: [
      { name: 'Vintage Saddle Tan', hex: '#9E6B3B', image: 'assets/images/products/corp-leather-vegan-01.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['High-grade pull-up vegan faux leather', 'Durable antique brass magnetic quick-snaps', 'Wide adjustable shoulder belt', 'Embossed custom corporate logo service']
  },

  /* ================= 6. BACKPACK BUNDLES (JANSPORT STYLE) ================= */
  {
    id: 'JSM-BND-01',
    name: 'SuperBreak® Plus Bubble Gum Backpack Bundle Set',
    category: 'Backpack Bundles',
    subCategory: 'School Bags',
    price: 1490,
    bulkPrice: 990,
    wholesalePrice: 750,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 2200,
    rating: 4.9,
    reviews: 82,
    badge: 'Combo Set',
    description: 'Pastel bubblegum pink student backpack paired with a matching zippered organizer accessory pouch. Lightweight, water-repellent, and crafted for school, college, and daily commute.',
    defaultImage: 'assets/images/products/jsm-108-bubble-gum-pink-bundle.jpg',
    sizes: [
      { name: 'Standard Set', capacity: '26L Backpack + 2L Pouch', priceOffset: 0 },
      { name: 'Plus XL Set', capacity: '32L Backpack + 3L Pouch', priceOffset: 200 }
    ],
    colors: [
      { name: 'Bubble Gum Pink', hex: '#F4A7B9', image: 'assets/images/products/jsm-108-bubble-gum-pink-bundle.jpg' },
      { name: 'Sky High Blue', hex: '#9ED2EA', image: 'assets/images/products/jsm-107-sky-blue-bundle.jpg' },
      { name: 'Rainbow Dots Black', hex: '#232528', image: 'assets/images/products/jsm-109-rainbow-dots-bundle.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Includes matching accessory pouch', 'Padded ergonomic shoulder straps', 'Internal 15" laptop sleeve', 'Custom name/photo printing eligible']
  },
  {
    id: 'JSM-BND-02',
    name: 'SuperBreak® Plus Sky High Blue Bundle Set',
    category: 'Backpack Bundles',
    subCategory: 'School Bags',
    price: 1550,
    bulkPrice: 1020,
    wholesalePrice: 780,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 2300,
    rating: 4.8,
    reviews: 74,
    badge: 'Popular Set',
    description: 'Refreshing pastel sky-blue daypack with coordinated insulated lunch & tech pouch. Durable double-stitched twill with smooth glide nylon zippers.',
    defaultImage: 'assets/images/products/jsm-107-sky-blue-bundle.jpg',
    sizes: [
      { name: 'Standard Set', capacity: '26L Backpack + 2L Pouch', priceOffset: 0 }
    ],
    colors: [
      { name: 'Sky High Blue', hex: '#9ED2EA', image: 'assets/images/products/jsm-107-sky-blue-bundle.jpg' },
      { name: 'Bubble Gum Pink', hex: '#F4A7B9', image: 'assets/images/products/jsm-108-bubble-gum-pink-bundle.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Coordinated insulated pouch included', 'Side water bottle pocket', 'Reinforced haul handle', 'Front utility pocket with organizer']
  },
  {
    id: 'JSM-BND-03',
    name: 'SuperBreak® Plus Midnight Rainbow Dots Set',
    category: 'Backpack Bundles',
    subCategory: 'School Bags',
    price: 1650,
    bulkPrice: 1090,
    wholesalePrice: 820,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 2450,
    rating: 5.0,
    reviews: 98,
    badge: 'Top Rated',
    description: 'Statement polka-dot patterned backpack featuring a coordinated mini travel pouch. Heavy-duty 600D abrasion-resistant polyester with vibrant fade-free printing.',
    defaultImage: 'assets/images/products/jsm-109-rainbow-dots-bundle.jpg',
    sizes: [
      { name: 'Standard Set', capacity: '26L Backpack + Mini Pack', priceOffset: 0 }
    ],
    colors: [
      { name: 'Rainbow Dots Black', hex: '#1E2024', image: 'assets/images/products/jsm-109-rainbow-dots-bundle.jpg' },
      { name: 'Bubble Gum Pink', hex: '#F4A7B9', image: 'assets/images/products/jsm-108-bubble-gum-pink-bundle.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Includes matching mini backpack pouch', 'Fully padded back panel', 'Web haul loop', 'Custom front/back monogramming available']
  },
  {
    id: 'JSM-BND-04',
    name: 'SuperBreak® Plus Animal Illusion Set',
    category: 'Backpack Bundles',
    subCategory: 'School Bags',
    price: 1590,
    bulkPrice: 1050,
    wholesalePrice: 790,
    moq: { retail: 1, bulk: 25, wholesale: 100 },
    originalPrice: 2350,
    rating: 4.9,
    reviews: 86,
    badge: 'Trending Print',
    description: 'Striking leopard print backpack bundle paired with a matching mini lunch & tech daypack. Engineered with high-density polyester and reinforced stress points.',
    defaultImage: 'assets/images/products/jsm-110-animal-illusion-bundle.jpg',
    sizes: [
      { name: 'Standard Set', capacity: '26L Backpack + Mini Pack', priceOffset: 0 }
    ],
    colors: [
      { name: 'Leopard Animal Print', hex: '#8B5A2B', image: 'assets/images/products/jsm-110-animal-illusion-bundle.jpg' },
      { name: 'Bubble Gum Pink', hex: '#F4A7B9', image: 'assets/images/products/jsm-108-bubble-gum-pink-bundle.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Includes matching mini backpack pouch', 'Contoured ergonomic shoulder straps', 'Front organizer stash pocket', 'Custom monogram printing eligible']
  },

  /* ==========================================================================
     7. CANVAS BAGS — 21 Products (canvas-01 through canvas-21)
     Image path convention: assets/images/products/canvas-XX-slug.jpg
     Fallback onerror: assets/images/products/jsm-102-everyday-canvas-tote.jpg
     ========================================================================== */

  /* IMAGE FILE REFERENCE MAP — drop these into assets/images/products/ when ready:
     canvas-01-digital-peacock.jpg
     canvas-02-u-shape-handbag.jpg
     canvas-03-screen-printing.jpg
     canvas-04-ganesh-ji.jpg
     canvas-05-radha-krishna.jpg
     canvas-06-mixing-prints.jpg
     canvas-07-both-side-screen-printing.jpg
     canvas-08-digital-print-floral-model.jpg
     canvas-09-baby-shower.jpg
     canvas-10-flower-model-compact.jpg
     canvas-11-flower-model-multi-size.jpg
     canvas-12-ganesh-saree-model.jpg
     canvas-13-imported-strip.jpg
     canvas-14-non-woven-cow.jpg
     canvas-15-digital-print-dhanalakshmi.jpg
     canvas-16-complementary-house-warming.jpg
     canvas-17-eco-friendly-go-green.jpg
     canvas-18-house-warming-lotus-cow.jpg
     canvas-19-transparent-pvc.jpg
     canvas-20-ganesh-print.jpg
     canvas-21-digital-print.jpg
  */

  {
    id: 'canvas-01',
    name: 'Canvas Digital Peacock',
    category: 'Canvas Bags',
    subCategory: 'Digital Print Canvas',
    price: 220,
    bulkPrice: 145,
    wholesalePrice: 105,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 320,
    rating: 4.9,
    reviews: 38,
    badge: 'Digital Print',
    description: 'Vibrant canvas bag featuring a full-color digital peacock motif. Available in One Side print and Two Side print options. A striking choice for festive gifting and retail.',
    variantNotes: 'Available in: One Side Print | Two Side Print',
    defaultImage: 'assets/images/products/canvas-01-digital-peacock.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Standard Canvas Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Natural Canvas — One Side Print', hex: '#D4B896', image: 'assets/images/products/canvas-01-digital-peacock.jpg' },
      { name: 'Natural Canvas — Two Side Print', hex: '#B8976A', image: 'assets/images/products/canvas-01-digital-peacock.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['Full-color digital peacock print', 'One Side or Two Side print available', 'Sturdy natural canvas fabric', 'Custom name/logo printing eligible']
  },
  {
    id: 'canvas-02',
    name: 'Canvas U-Shape Handbag',
    category: 'Canvas Bags',
    subCategory: 'Canvas Handbags',
    price: 260,
    bulkPrice: 170,
    wholesalePrice: 120,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 380,
    rating: 4.8,
    reviews: 29,
    badge: 'Handbag Style',
    description: 'Elegant U-shape canvas handbag with structured silhouette and comfortable carry handles. Available in two sizes for everyday use and gifting.',
    variantNotes: 'Available in sizes: 10×12 and 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-02-u-shape-handbag.jpg',
    sizes: [
      { name: '10×12 inches', capacity: 'Compact Handbag Size', priceOffset: 0 },
      { name: '12×14 inches', capacity: 'Standard Handbag Size', priceOffset: 30 }
    ],
    colors: [
      { name: 'Natural Off-White Canvas', hex: '#F5EED8', image: 'assets/images/products/canvas-02-u-shape-handbag.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['U-shape structured frame', 'Dual top carry handles', 'Available in 2 sizes', 'Custom front/back print ready']
  },
  {
    id: 'canvas-03',
    name: 'Canvas Screen Printing',
    category: 'Canvas Bags',
    subCategory: 'Screen Print Canvas',
    price: 195,
    bulkPrice: 125,
    wholesalePrice: 90,
    moq: { retail: 1, bulk: 50, wholesale: 500 },
    originalPrice: 290,
    rating: 4.8,
    reviews: 54,
    badge: 'Screen Print',
    description: 'Classic canvas tote with crisp one-side screen printing. Available in three sizes — ideal for corporate events, promotions, and retail branding.',
    variantNotes: 'One Side screen print. Available in 3 sizes: 10×11, 12×14, 13×16 inches.',
    defaultImage: 'assets/images/products/canvas-03-screen-printing.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Small Tote Size', priceOffset: 0 },
      { name: '12×14 inches', capacity: 'Medium Tote Size', priceOffset: 20 },
      { name: '13×16 inches', capacity: 'Large Tote Size', priceOffset: 40 }
    ],
    colors: [
      { name: 'Natural Canvas — One Side Print', hex: '#D6C9A8', image: 'assets/images/products/canvas-03-screen-printing.jpg' }
    ],
    printOptions: { front: 25, back: 25, both: 45 },
    customEligible: true,
    features: ['Precision one-side screen print', '3 size options available', 'Durable woven canvas base fabric', 'Bulk corporate branding eligible']
  },
  {
    id: 'canvas-04',
    name: 'Canvas Ganesh Ji',
    category: 'Canvas Bags',
    subCategory: 'Devotional Print Canvas',
    price: 210,
    bulkPrice: 135,
    wholesalePrice: 98,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 310,
    rating: 5.0,
    reviews: 47,
    badge: 'Devotional',
    description: 'Auspicious canvas bag bearing a traditional Ganesh Ji motif. Perfect for Ganesh Chaturthi gifting, temple distributions, and festive return gifts.',
    variantNotes: 'Single size: 10×11 inches.',
    defaultImage: 'assets/images/products/canvas-04-ganesh-ji.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Standard Gifting Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Natural Canvas — Ganesh Ji Print', hex: '#DFC9A0', image: 'assets/images/products/canvas-04-ganesh-ji.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Traditional Ganesh Ji motif', 'Ideal for Chaturthi & Pooja gifting', 'Natural cotton canvas body', 'Wholesale bulk rates for 300+ pcs']
  },
  {
    id: 'canvas-05',
    name: 'Canvas Radha Krishna',
    category: 'Canvas Bags',
    subCategory: 'Devotional Print Canvas',
    price: 215,
    bulkPrice: 138,
    wholesalePrice: 100,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 315,
    rating: 4.9,
    reviews: 41,
    badge: 'Devotional',
    description: 'Beautifully printed Radha Krishna themed canvas bag — a meaningful and elegant choice for Krishna Janmashtami gifting, spiritual events, and return gifts.',
    variantNotes: 'Available in sizes: 10×11 and 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-05-radha-krishna.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Small Gifting Size', priceOffset: 0 },
      { name: '12×14 inches', capacity: 'Standard Gifting Size', priceOffset: 20 }
    ],
    colors: [
      { name: 'Natural Canvas — Radha Krishna Print', hex: '#D9C49A', image: 'assets/images/products/canvas-05-radha-krishna.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Radha Krishna devotional motif', 'Two size options available', 'Natural canvas fabric', 'Event & return gift bulk pricing']
  },
  {
    id: 'canvas-06',
    name: 'Canvas Mixing Prints',
    category: 'Canvas Bags',
    subCategory: 'Mixed Print Canvas',
    price: 240,
    bulkPrice: 155,
    wholesalePrice: 112,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 350,
    rating: 4.8,
    reviews: 33,
    badge: 'Mixed Prints',
    description: 'Creative canvas bag with a vibrant mix of print patterns combining multiple motifs and colors into a single eye-catching design. Great for retail and gifting assortments.',
    variantNotes: 'Available in sizes: 12×14 and 14×16 inches.',
    defaultImage: 'assets/images/products/canvas-06-mixing-prints.jpg',
    sizes: [
      { name: '12×14 inches', capacity: 'Medium Tote Size', priceOffset: 0 },
      { name: '14×16 inches', capacity: 'Large Tote Size', priceOffset: 35 }
    ],
    colors: [
      { name: 'Natural Canvas — Mixed Prints', hex: '#C8B890', image: 'assets/images/products/canvas-06-mixing-prints.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['Multi-motif mixed print design', '2 size options', 'Natural woven canvas body', 'Trendy retail display bags']
  },
  {
    id: 'canvas-07',
    name: 'Canvas Both Side Screen Printing',
    category: 'Canvas Bags',
    subCategory: 'Screen Print Canvas',
    price: 230,
    bulkPrice: 148,
    wholesalePrice: 108,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 340,
    rating: 4.9,
    reviews: 44,
    badge: 'Both Sides Printed',
    description: 'Premium canvas tote with full screen printing on both front and back panels — maximum brand visibility for corporate promotions, events, and retail.',
    variantNotes: 'Both side screen print. Available in sizes: 10×11 and 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-07-both-side-screen-printing.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Small Tote Size', priceOffset: 0 },
      { name: '12×14 inches', capacity: 'Medium Tote Size', priceOffset: 25 }
    ],
    colors: [
      { name: 'Natural Canvas — Both Side Print', hex: '#D2BF9C', image: 'assets/images/products/canvas-07-both-side-screen-printing.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 50 },
    customEligible: true,
    features: ['Full both-side screen printing', '2 size options available', 'Maximum branding surface area', 'Bulk event & corporate pricing']
  },
  {
    id: 'canvas-08',
    name: 'Canvas Digital Print Floral Model',
    category: 'Canvas Bags',
    subCategory: 'Digital Print Canvas',
    price: 250,
    bulkPrice: 162,
    wholesalePrice: 118,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 365,
    rating: 4.9,
    reviews: 36,
    badge: 'Floral Digital',
    description: 'Elegant floral model canvas bag featuring vibrant full-color digital printing with beautiful botanical and floral artwork on the front panel.',
    variantNotes: 'Single size: 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-08-digital-print-floral-model.jpg',
    sizes: [
      { name: '12×14 inches', capacity: 'Standard Canvas Tote Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Natural Canvas — Floral Digital Print', hex: '#D5C4A1', image: 'assets/images/products/canvas-08-digital-print-floral-model.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['High-resolution digital floral art print', 'Vibrant fade-resistant inks', 'Natural canvas fabric', 'Gifting & retail display ready']
  },
  {
    id: 'canvas-09',
    name: 'Canvas Baby Shower',
    category: 'Canvas Bags',
    subCategory: 'Occasion Canvas',
    price: 200,
    bulkPrice: 128,
    wholesalePrice: 93,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 295,
    rating: 4.9,
    reviews: 52,
    badge: 'Baby Shower',
    description: 'Adorable canvas bag designed specifically for baby shower events — printed with cheerful motifs and pastel-toned artwork. A delightful return gift for guests.',
    variantNotes: 'Single size: 10×11 inches.',
    defaultImage: 'assets/images/products/canvas-09-baby-shower.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Standard Baby Shower Gift Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Natural Canvas — Baby Shower Print', hex: '#E2D3B8', image: 'assets/images/products/canvas-09-baby-shower.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Cheerful baby shower themed print', 'Lightweight natural canvas', 'Return gift bulk rates', 'Custom baby name/date printing eligible']
  },
  {
    id: 'canvas-10',
    name: 'Canvas Flower Model (Compact)',
    category: 'Canvas Bags',
    subCategory: 'Floral Canvas',
    price: 205,
    bulkPrice: 132,
    wholesalePrice: 95,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 300,
    rating: 4.8,
    reviews: 31,
    badge: 'Compact Floral',
    description: 'Compact-sized canvas bag with a delicate flower model print. Ideal for retail single-size display and gifting. Light and easy to carry.',
    variantNotes: 'Single size: 10×11 inches. See also Canvas Flower Model (Multi-Size) — canvas-11 — for larger sizes.',
    defaultImage: 'assets/images/products/canvas-10-flower-model-compact.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Compact Flower Model Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Natural Canvas — Flower Print', hex: '#D8C8A8', image: 'assets/images/products/canvas-10-flower-model-compact.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Delicate flower model print', 'Compact 10×11 size', 'Natural canvas fabric', 'Gift & retail single-piece pricing']
  },
  {
    id: 'canvas-11',
    name: 'Canvas Flower Model (Multi-Size)',
    category: 'Canvas Bags',
    subCategory: 'Floral Canvas',
    price: 235,
    bulkPrice: 150,
    wholesalePrice: 110,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 345,
    rating: 4.8,
    reviews: 28,
    badge: 'Multi-Size Floral',
    description: 'Flower model canvas bag available in a wider range of sizes including landscape orientation. Full-size range for wholesale assortments and varied retail display.',
    variantNotes: 'Available in 3 sizes: 18×10, 10×12, 12×14 inches. See also Canvas Flower Model (Compact) — canvas-10 — for 10×11 size.',
    defaultImage: 'assets/images/products/canvas-11-flower-model-multi-size.jpg',
    sizes: [
      { name: '18×10 inches', capacity: 'Wide Landscape Size', priceOffset: 0 },
      { name: '10×12 inches', capacity: 'Standard Portrait Size', priceOffset: 15 },
      { name: '12×14 inches', capacity: 'Large Portrait Size', priceOffset: 30 }
    ],
    colors: [
      { name: 'Natural Canvas — Flower Print', hex: '#D4BFA0', image: 'assets/images/products/canvas-11-flower-model-multi-size.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['Flower model print in 3 size variants', 'Includes wide landscape orientation', 'Natural canvas fabric', 'Wholesale assortment pricing available']
  },
  {
    id: 'canvas-12',
    name: 'Canvas Ganesh Model with Saree Model',
    category: 'Canvas Bags',
    subCategory: 'Devotional Print Canvas',
    price: 245,
    bulkPrice: 158,
    wholesalePrice: 115,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 360,
    rating: 4.9,
    reviews: 39,
    badge: 'Transparent Style',
    description: 'Unique canvas bag combining a Ganesh motif with an elegant saree model design in a transparent style finish. Available in three sizes for versatile gifting.',
    variantNotes: 'Transparent style finish. Available in sizes: 8×10, 11×10, 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-12-ganesh-saree-model.jpg',
    sizes: [
      { name: '8×10 inches', capacity: 'Small Gifting Size', priceOffset: 0 },
      { name: '11×10 inches', capacity: 'Medium Gifting Size', priceOffset: 20 },
      { name: '12×14 inches', capacity: 'Large Gifting Size', priceOffset: 38 }
    ],
    colors: [
      { name: 'Transparent Style — Ganesh & Saree Print', hex: '#C9B896', image: 'assets/images/products/canvas-12-ganesh-saree-model.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['Ganesh motif + saree model design', 'Transparent style finish', '3 size options available', 'Festive & ceremonial gift bag']
  },
  {
    id: 'canvas-13',
    name: 'Canvas Imported Strip',
    category: 'Canvas Bags',
    subCategory: 'Imported Strip Canvas',
    price: 230,
    bulkPrice: 148,
    wholesalePrice: 108,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 340,
    rating: 4.8,
    reviews: 25,
    badge: 'Transparent Style',
    description: 'Canvas bag with premium imported strip detailing and a transparent style construction. A modern, clean aesthetic suitable for contemporary retail and gifting.',
    variantNotes: 'Transparent style. Available in sizes: 8×10 and 10×12 inches.',
    defaultImage: 'assets/images/products/canvas-13-imported-strip.jpg',
    sizes: [
      { name: '8×10 inches', capacity: 'Compact Transparent Strip', priceOffset: 0 },
      { name: '10×12 inches', capacity: 'Standard Transparent Strip', priceOffset: 22 }
    ],
    colors: [
      { name: 'Transparent Style — Imported Strip', hex: '#D1C0A0', image: 'assets/images/products/canvas-13-imported-strip.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Imported strip detailing', 'Transparent style construction', '2 size options', 'Modern retail display piece']
  },
  {
    id: 'canvas-14',
    name: 'Canvas Non Woven Cow',
    category: 'Canvas Bags',
    subCategory: 'Non-Woven Canvas',
    price: 180,
    bulkPrice: 115,
    wholesalePrice: 82,
    moq: { retail: 1, bulk: 50, wholesale: 500 },
    originalPrice: 265,
    rating: 4.7,
    reviews: 22,
    badge: 'Non-Woven',
    description: 'Non-woven canvas bag featuring a charming cow motif. Lightweight, eco-friendly, and ideal for event distributions, housewarming gifts, and retail.',
    variantNotes: 'Single size: 8×10 inches.',
    defaultImage: 'assets/images/products/canvas-14-non-woven-cow.jpg',
    sizes: [
      { name: '8×10 inches', capacity: 'Standard Non-Woven Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Natural Canvas — Cow Print', hex: '#D6C8AA', image: 'assets/images/products/canvas-14-non-woven-cow.jpg' }
    ],
    printOptions: { front: 20, back: 20, both: 35 },
    customEligible: true,
    features: ['Charming cow motif print', 'Lightweight non-woven canvas', 'Eco-friendly & reusable', 'High-volume event distribution pricing']
  },
  {
    id: 'canvas-15',
    name: 'Canvas Digital Print (Dhanalakshmi)',
    category: 'Canvas Bags',
    subCategory: 'Devotional Print Canvas',
    price: 215,
    bulkPrice: 138,
    wholesalePrice: 100,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 315,
    rating: 5.0,
    reviews: 43,
    badge: 'Dhanalakshmi',
    description: 'Auspicious canvas bag with a vibrant digital print of Goddess Dhanalakshmi — a classic return gift for Diwali, Lakshmi Pooja, house warmings, and festive occasions.',
    variantNotes: 'Single size: 8×10 inches.',
    defaultImage: 'assets/images/products/canvas-15-digital-print-dhanalakshmi.jpg',
    sizes: [
      { name: '8×10 inches', capacity: 'Standard Gifting Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Natural Canvas — Dhanalakshmi Print', hex: '#DFC9A2', image: 'assets/images/products/canvas-15-digital-print-dhanalakshmi.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['Dhanalakshmi digital print', 'Ideal for Diwali & Lakshmi Pooja gifting', 'Natural canvas fabric', 'Bulk festive pricing available']
  },
  {
    id: 'canvas-16',
    name: 'Canvas Complementary (House Warming)',
    category: 'Canvas Bags',
    subCategory: 'Occasion Canvas',
    price: 220,
    bulkPrice: 142,
    wholesalePrice: 103,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 325,
    rating: 4.9,
    reviews: 56,
    badge: 'House Warming',
    description: 'Complementary canvas bag for house warming ceremonies in a transparent style. Available in two charming motifs — Elephant and Cow — perfect as a welcome return gift for guests.',
    variantNotes: 'Transparent style. Single size: 10×12 inches. Motif options: Elephant | Cow (House Warming).',
    defaultImage: 'assets/images/products/canvas-16-complementary-house-warming.jpg',
    sizes: [
      { name: '10×12 inches', capacity: 'House Warming Gift Size', priceOffset: 0 }
    ],
    colors: [
      { name: 'Transparent — Elephant Motif', hex: '#C8BAA0', image: 'assets/images/products/canvas-16-complementary-house-warming.jpg' },
      { name: 'Transparent — Cow (House Warming) Motif', hex: '#D6C8A8', image: 'assets/images/products/canvas-16-complementary-house-warming.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Transparent style construction', 'Choose Elephant or Cow motif', 'House warming return gift special', 'Bulk event pricing for 300+ pcs']
  },
  {
    id: 'canvas-17',
    name: 'Canvas Eco-Friendly (Go-Green)',
    category: 'Canvas Bags',
    subCategory: 'Eco-Friendly Canvas',
    price: 195,
    bulkPrice: 125,
    wholesalePrice: 90,
    moq: { retail: 1, bulk: 50, wholesale: 500 },
    originalPrice: 290,
    rating: 4.9,
    reviews: 67,
    badge: 'Go-Green',
    description: 'Eco-conscious Go-Green themed canvas bag promoting sustainability. Available in two design versions and three sizes — a popular choice for green events, CSR drives, and eco gifting.',
    variantNotes: 'Available in Two Versions (design variants). Sizes: 8×10, 10×12, 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-17-eco-friendly-go-green.jpg',
    sizes: [
      { name: '8×10 inches', capacity: 'Small Eco Size', priceOffset: 0 },
      { name: '10×12 inches', capacity: 'Medium Eco Size', priceOffset: 20 },
      { name: '12×14 inches', capacity: 'Large Eco Size', priceOffset: 38 }
    ],
    colors: [
      { name: 'Go-Green — Version 1', hex: '#7CA37C', image: 'assets/images/products/canvas-17-eco-friendly-go-green.jpg' },
      { name: 'Go-Green — Version 2', hex: '#5A8A5A', image: 'assets/images/products/canvas-17-eco-friendly-go-green.jpg' }
    ],
    printOptions: { front: 25, back: 25, both: 45 },
    customEligible: true,
    features: ['Two design versions available', 'Go-Green eco messaging', '3 size options', 'CSR & green event bulk pricing']
  },
  {
    id: 'canvas-18',
    name: 'Canvas House Warming (Lotus & Cow)',
    category: 'Canvas Bags',
    subCategory: 'Occasion Canvas',
    price: 210,
    bulkPrice: 135,
    wholesalePrice: 97,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 310,
    rating: 4.9,
    reviews: 48,
    badge: 'House Warming',
    description: 'Traditional house warming canvas bag featuring auspicious Lotus and Cow print motifs — a culturally meaningful return gift for Griha Pravesh and house warming ceremonies.',
    variantNotes: 'Lotus & Cow print motifs. Available in sizes: 8×10 and 10×12 inches.',
    defaultImage: 'assets/images/products/canvas-18-house-warming-lotus-cow.jpg',
    sizes: [
      { name: '8×10 inches', capacity: 'Small House Warming Size', priceOffset: 0 },
      { name: '10×12 inches', capacity: 'Standard House Warming Size', priceOffset: 22 }
    ],
    colors: [
      { name: 'Natural Canvas — Lotus Print', hex: '#D8C5A5', image: 'assets/images/products/canvas-18-house-warming-lotus-cow.jpg' },
      { name: 'Natural Canvas — Cow Print', hex: '#CCBA98', image: 'assets/images/products/canvas-18-house-warming-lotus-cow.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Lotus & Cow auspicious motifs', 'Griha Pravesh return gift special', '2 size options', 'Wholesale bulk rates for 300+ pcs']
  },
  {
    id: 'canvas-19',
    name: 'Canvas Transparent PVC',
    category: 'Canvas Bags',
    subCategory: 'Transparent Canvas',
    price: 240,
    bulkPrice: 155,
    wholesalePrice: 112,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 355,
    rating: 4.8,
    reviews: 30,
    badge: 'Transparent PVC',
    description: 'Modern canvas bag with a transparent PVC panel insert, combining the organic feel of canvas with see-through clarity for a contemporary look. Ideal for gifting and retail display.',
    variantNotes: 'Transparent PVC construction. Available in sizes: 10×12 and 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-19-transparent-pvc.jpg',
    sizes: [
      { name: '10×12 inches', capacity: 'Standard Transparent Canvas', priceOffset: 0 },
      { name: '12×14 inches', capacity: 'Large Transparent Canvas', priceOffset: 28 }
    ],
    colors: [
      { name: 'Canvas + Clear PVC Panel', hex: '#DCCFB5', image: 'assets/images/products/canvas-19-transparent-pvc.jpg' }
    ],
    printOptions: { front: 35, back: 35, both: 60 },
    customEligible: true,
    features: ['Transparent PVC panel insert', 'Canvas + PVC hybrid design', '2 size options', 'Modern retail & gifting display piece']
  },
  {
    id: 'canvas-20',
    name: 'Canvas Ganesh Print',
    category: 'Canvas Bags',
    subCategory: 'Devotional Print Canvas',
    price: 205,
    bulkPrice: 132,
    wholesalePrice: 95,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 300,
    rating: 4.9,
    reviews: 44,
    badge: 'Ganesh Print',
    description: 'Classic canvas bag with a bold Ganesh print motif. Available in three sizes — a staple for Ganesh Chaturthi, Diwali gifting, and temple distributions across all sizes.',
    variantNotes: 'Available in sizes: 8×10, 10×12, 12×14 inches.',
    defaultImage: 'assets/images/products/canvas-20-ganesh-print.jpg',
    sizes: [
      { name: '8×10 inches', capacity: 'Small Ganesh Gifting Size', priceOffset: 0 },
      { name: '10×12 inches', capacity: 'Medium Ganesh Gifting Size', priceOffset: 20 },
      { name: '12×14 inches', capacity: 'Large Ganesh Gifting Size', priceOffset: 38 }
    ],
    colors: [
      { name: 'Natural Canvas — Ganesh Print', hex: '#DEC9A0', image: 'assets/images/products/canvas-20-ganesh-print.jpg' }
    ],
    printOptions: { front: 30, back: 30, both: 55 },
    customEligible: true,
    features: ['Bold Ganesh motif print', '3 size options', 'Natural canvas fabric', 'Festive bulk pricing for 300+ pcs']
  },
  {
    id: 'canvas-21',
    name: 'Canvas Digital Print',
    category: 'Canvas Bags',
    subCategory: 'Digital Print Canvas',
    price: 230,
    bulkPrice: 148,
    wholesalePrice: 108,
    moq: { retail: 1, bulk: 50, wholesale: 300 },
    originalPrice: 340,
    rating: 4.9,
    reviews: 58,
    badge: 'Full Range Sizes',
    description: 'Versatile digital print canvas bag available across the widest size range in the JSM canvas catalog — from compact to extra-large. Suitable for all retail, gifting, and wholesale needs.',
    variantNotes: 'Available in 5 sizes: 10×11, 12×14, 13×16, 15×18, 17×20 inches.',
    defaultImage: 'assets/images/products/canvas-21-digital-print.jpg',
    sizes: [
      { name: '10×11 inches', capacity: 'Compact Digital Print', priceOffset: 0 },
      { name: '12×14 inches', capacity: 'Standard Digital Print', priceOffset: 20 },
      { name: '13×16 inches', capacity: 'Medium-Large Digital Print', priceOffset: 40 },
      { name: '15×18 inches', capacity: 'Large Digital Print', priceOffset: 65 },
      { name: '17×20 inches', capacity: 'Extra-Large Digital Print', priceOffset: 95 }
    ],
    colors: [
      { name: 'Natural Canvas — Digital Print', hex: '#D4BF9A', image: 'assets/images/products/canvas-21-digital-print.jpg' }
    ],
    printOptions: { front: 40, back: 40, both: 70 },
    customEligible: true,
    features: ['Widest size range: 10×11 to 17×20 inches', 'High-resolution digital printing', 'Natural canvas fabric', 'Full-range wholesale pricing']
  }
];
