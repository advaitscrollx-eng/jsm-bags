/* ==========================================================================
   JSM BAGS - COMPREHENSIVE INDIAN & INTERNATIONAL APPLICATION ENGINE
   Handles multi-tier pricing, 2-view SPA navigation (Home & Category Page),
   custom digital printing (Front/Back/Both), cart drawer, and WhatsApp.
   ========================================================================== */

(function () {
  'use strict';

  // State Management
  const state = {
    products: PRODUCTS.map(p => ({
      ...p,
      selectedColor: p.colors[0],
      selectedSize: p.sizes[0],
      activeImage: p.colors[0]?.image || p.defaultImage,
      selectedPrintPlacement: 'none', // 'none', 'front', 'back', 'both'
      customText: '',
      customPhotoName: ''
    })),
    staticProducts: PRODUCTS.map(p => ({
      ...p,
      selectedColor: p.colors[0],
      selectedSize: p.sizes[0],
      activeImage: p.colors[0]?.image || p.defaultImage,
      selectedPrintPlacement: 'none',
      customText: '',
      customPhotoName: ''
    })),
    appliedCoupon: null,
    categoryCache: {},
    activeCategory: 'All',
    activeSubCategory: 'All',
    activeTier: 'retail', // 'retail', 'bulk', 'wholesale'
    searchQuery: '',
    sortBy: 'relevant',
    activeColorFilter: 'all',
    cart: JSON.parse(localStorage.getItem('jsm_cart_v3_india') || '[]'),
    modalProduct: null,
    modalTier: 'retail',
    modalPrintPlacement: 'none',
    modalCustomText: '',
    modalCustomPhoto: null
  };

  // DOM Helpers
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);
  const rupees = n => '₹' + Number(n).toLocaleString('en-IN');

  function saveCart() {
    localStorage.setItem('jsm_cart_v3_india', JSON.stringify(state.cart));
    updateCartUI();
  }

  // Toast Notification
  function showToast(message) {
    const toast = $('toastNotice');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Category Metadata & High-Res Photography (Reference Image 2)
  const CATEGORY_META = {
    'All': {
      label: 'All Collections',
      cardLabel: 'ALL 48 BAGS',
      image: 'assets/images/products/jsm-108-bubble-gum-pink-bundle.jpg',
      title: 'ALL BAG COLLECTIONS',
      desc: 'Browse all 48 handcrafted bag styles manufactured in our Rajahmundry unit — including 21 new Canvas styles. Available in retail single piece, bulk gifting and factory wholesale.'
    },
    'Potli Bags': {
      label: 'Potli Bags',
      cardLabel: 'POTLI BAGS',
      image: 'assets/images/products/potli-round-01.jpg',
      title: 'POTLI BAGS',
      desc: 'Authentic Indian bridal and festive potlis — round velvet, bangle-handle, sling, and mobile pouches with hand-finished zardozi embroidery and latkans.'
    },
    'Jute Bags': {
      label: 'Jute Bags',
      cardLabel: 'JUTE & CANVAS',
      image: 'assets/images/products/jute-pure-01.jpg',
      title: 'JUTE & CANVAS BAGS',
      desc: '100% natural, eco-friendly laminated golden jute, heavy canvas carry totes, and Juko blended eco-bags directly stitched in our Rajahmundry factory.'
    },
    'Paper Bags': {
      label: 'Paper Bags',
      cardLabel: 'PAPER BAGS',
      image: 'assets/images/products/event-paper-01.jpg',
      title: 'BOUTIQUE PAPER BAGS',
      desc: 'Premium gold-embossed, laminated kraft and boutique paper gift bags with reinforced rope handles for retail shops, jewelers, and return gifting.'
    },
    'Kids Bags': {
      label: 'Kids Bags',
      cardLabel: 'KIDS BAGS',
      image: 'assets/images/products/daily-kids-01.jpg',
      title: 'KIDS & PRESCHOOL BAGS',
      desc: 'Vibrant 3D embossed cartoon preschool backpacks, lightweight, water-resistant with cushioned shoulder straps for toddlers and kindergarten children.'
    },
    'School Bags': {
      label: 'School Bags',
      cardLabel: 'SCHOOL BAGS',
      image: 'assets/images/products/daily-school-01.jpg',
      title: 'SCHOOL & COLLEGE BACKPACKS',
      desc: 'Ergonomic multi-compartment school bags and college backpacks crafted from heavy-duty 900D ballistic polyester with spine support padding.'
    },
    'Gym Bags': {
      label: 'Gym Bags',
      cardLabel: 'GYM BAGS',
      image: 'assets/images/products/daily-gym-duffel-01.jpg',
      title: 'GYM & SPORTS DUFFEL BAGS',
      desc: 'ActiveFit athletic gym duffels featuring dedicated ventilated shoe compartments, moisture-proof wet gear pockets, and dual carry straps.'
    },
    'Travel Bags': {
      label: 'Travel Bags',
      cardLabel: 'TRAVEL BAGS',
      image: 'assets/images/products/daily-travel-01.jpg',
      title: 'TRAVEL & WEEKENDER BAGS',
      desc: 'Heavy-duty all-weather weekend duffels, cabin duffels, and luggage travel bags designed for road trips, flights, and long journeys.'
    },
    'Trekking Bags': {
      label: 'Trekking Bags',
      cardLabel: 'TREKKING BAGS',
      image: 'assets/images/products/daily-trekking-hiking-01.jpg',
      title: 'TREKKING & HIKING RUCKSACKS',
      desc: 'High-capacity 60L tactical expedition rucksacks with internal aluminum frame support, integrated rain cover, and trekking pole loops.'
    },
    'Trolleys': {
      label: 'Trolleys',
      cardLabel: 'TROLLEYS',
      image: 'assets/images/products/daily-trolley-luggage-01.jpg',
      title: 'TROLLEYS & CABIN LUGGAGE',
      desc: 'Unbreakable AeroShield polycarbonate hard-shell suitcases with silent 360° dual spinner wheels, TSA number lock, and telescopic aluminum handle.'
    },
    'Laptop Bags': {
      label: 'Laptop Bags',
      cardLabel: 'LAPTOP BAGS',
      image: 'assets/images/products/corp-laptop-01.jpg',
      title: 'LAPTOP & TECH BACKPACKS',
      desc: 'Executive tech backpacks with shockproof 16-inch padded laptop sleeves, external USB charging port, anti-theft hidden pockets, and luggage pass-through strap.'
    },
    'Executive Bags': {
      label: 'Executive Bags',
      cardLabel: 'EXECUTIVE BAGS',
      image: 'assets/images/products/corp-executive-01.jpg',
      title: 'EXECUTIVE BRIEFCASES',
      desc: 'Diplomat structured leatherette office briefcases with dual combination brass locks, expanding accordion filing organizers, and premium hand-grip.'
    },
    'Carriage / Carry Bags': {
      label: 'Carriage / Carry Bags',
      cardLabel: 'CARRIAGE BAGS',
      image: 'assets/images/products/daily-carriage-shopping-01.jpg',
      title: 'CARRIAGE & SHOPPING BAGS',
      desc: 'Heavy-duty shopping carriage bags with cross-stitched nylon webbing handles and reinforced gusset bases for groceries, retail distribution, and bulk hauling.'
    },
    'Handbags': {
      label: 'Handbags',
      cardLabel: 'HANDBAGS',
      image: 'assets/images/products/corp-handbag-01.jpg',
      title: 'LADIES HANDBAGS',
      desc: 'Atelier structured Italian leatherette shoulder bags and satchels with polished gold metal hardware, zippered compartments, and matching charm accents.'
    },
    'Leather-Type (Faux/Vegan Leather) Bags': {
      label: 'Leather-Type Bags',
      cardLabel: 'LEATHER BAGS',
      image: 'assets/images/products/corp-leather-vegan-01.jpg',
      title: 'VEGAN & FAUX LEATHER BAGS',
      desc: 'Cruelty-free saddle tan vegan leather messenger bags, satchels, and crossbodies with hand-finished burnished edges and weather-resistant lining.'
    },
    'Eco-Friendly Biodegradable Return Gift Bags': {
      label: 'Eco Return Gifts',
      cardLabel: 'ECO RETURN GIFTS',
      image: 'assets/images/products/event-return-gift-01.jpg',
      title: 'ECO-FRIENDLY RETURN GIFT BAGS',
      desc: '100% biodegradable wedding return gift thamboolam bags, cotton drawstring pouches, and sustainable event gift bags manufactured with zero plastics.'
    },
    'Transparent Bags': {
      label: 'Transparent Bags',
      cardLabel: 'TRANSPARENT BAGS',
      image: 'assets/images/products/event-transparent-clear-01.jpg',
      title: 'TRANSPARENT & CLEAR BAGS',
      desc: 'Heavy-gauge transparent clear PVC stadium and event totes with reinforced contrast piping and zip closure, compliant with venue security standards.'
    },
    'Gift Hamper Bags': {
      label: 'Gift Hamper Bags',
      cardLabel: 'GIFT HAMPER BAGS',
      image: 'assets/images/products/event-hamper-01.jpg',
      title: 'GIFT HAMPER BAGS',
      desc: 'Rigid luxury gift boxes and hamper bags with transparent display windows, gold foil accents, and satin ribbon ties for Diwali, corporate hampers, and weddings.'
    },
    'Backpack Bundles': {
      label: 'Backpack Bundles',
      cardLabel: 'BACKPACK BUNDLES',
      image: 'assets/images/products/jsm-108-bubble-gum-pink-bundle.jpg',
      title: 'BACKPACK BUNDLE SETS',
      desc: 'Matching 2-piece student sets: full-size school backpack + insulated lunch box/pencil pouch in pastel blue, bubble gum pink, rainbow dots, and animal illusion.'
    },
    'Canvas Bags': {
      label: 'Canvas Bags',
      cardLabel: 'CANVAS BAGS',
      image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg',
      title: 'CANVAS BAGS COLLECTION',
      desc: 'Premium canvas bags featuring digital prints, screen prints, devotional motifs, eco-friendly designs, and transparent PVC styles — directly manufactured in Rajahmundry. 21 styles available in multiple sizes.'
    }
  };

  // Sub-Category Photography & Metadata
  const SUBCAT_META = {
    // Potlis
    'Round-Shaped Potlis': { label: 'Round-Shaped Potlis', cardLabel: 'ROUND POTLIS', image: 'assets/images/products/potli-round-01.jpg' },
    'Bangle-Type Potlis': { label: 'Bangle-Type Potlis', cardLabel: 'BANGLE POTLIS', image: 'assets/images/products/potli-bangle-01.jpg' },
    'Sling Potlis': { label: 'Sling Potlis', cardLabel: 'SLING POTLIS', image: 'assets/images/products/potli-sling-01.jpg' },
    'Mobile Pouch Potlis': { label: 'Mobile Pouch Potlis', cardLabel: 'MOBILE POUCHES', image: 'assets/images/products/potli-mobile-01.jpg' },
    // Jute
    'Pure Jute Bags': { label: 'Pure Jute Bags', cardLabel: 'PURE JUTE BAGS', image: 'assets/images/products/jute-pure-01.jpg' },
    'Canvas Carry Totes': { label: 'Canvas Carry Totes', cardLabel: 'CANVAS TOTES', image: 'assets/images/products/jute-canvas-01.jpg' },
    'Juko Bags': { label: 'Juko Bags', cardLabel: 'JUKO ECO TOTES', image: 'assets/images/products/jute-juko-01.jpg' },
    // Return & Hampers
    'Wedding Return Gifts': { label: 'Wedding Return Gifts', cardLabel: 'RETURN GIFT BAGS', image: 'assets/images/products/event-return-gift-01.jpg' },
    'Cotton Cloth Bags': { label: 'Cotton Cloth Bags', cardLabel: 'COTTON CLOTH BAGS', image: 'assets/images/products/event-cotton-cloth-01.jpg' },
    'Luxury Window Hampers': { label: 'Luxury Window Hampers', cardLabel: 'WINDOW HAMPERS', image: 'assets/images/products/event-hamper-01.jpg' },
    'Laminated Boutique Bags': { label: 'Laminated Boutique Bags', cardLabel: 'BOUTIQUE PAPER', image: 'assets/images/products/event-paper-01.jpg' },
    'Clear PVC Bags': { label: 'Clear PVC Bags', cardLabel: 'CLEAR PVC TOTES', image: 'assets/images/products/event-transparent-clear-01.jpg' },
    // School & Bundles
    'Ergonomic School Backpacks': { label: 'Ergonomic Backpacks', cardLabel: 'SCHOOL BACKPACKS', image: 'assets/images/products/daily-school-01.jpg' },
    'School Backpack Sets': { label: '2-Piece Bundle Sets', cardLabel: 'BUNDLE SETS', image: 'assets/images/products/jsm-107-sky-blue-bundle.jpg' },
    // Canvas
    'Digital Print Canvas': { label: 'Digital Print Canvas', cardLabel: 'DIGITAL PRINT', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Screen Print Canvas': { label: 'Screen Print Canvas', cardLabel: 'SCREEN PRINT', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Canvas Handbags': { label: 'Canvas Handbags', cardLabel: 'CANVAS HANDBAGS', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Devotional Print Canvas': { label: 'Devotional Print Canvas', cardLabel: 'DEVOTIONAL PRINT', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Mixed Print Canvas': { label: 'Mixed Print Canvas', cardLabel: 'MIXED PRINTS', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Floral Canvas': { label: 'Floral Canvas', cardLabel: 'FLORAL CANVAS', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Occasion Canvas': { label: 'Occasion Canvas', cardLabel: 'OCCASION CANVAS', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Eco-Friendly Canvas': { label: 'Eco-Friendly Canvas', cardLabel: 'ECO CANVAS', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Non-Woven Canvas': { label: 'Non-Woven Canvas', cardLabel: 'NON-WOVEN', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Transparent Canvas': { label: 'Transparent Canvas', cardLabel: 'TRANSPARENT', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' },
    'Imported Strip Canvas': { label: 'Imported Strip Canvas', cardLabel: 'IMPORTED STRIP', image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg' }
  };

  // Helper for subcategories
  function getSubCategoriesForCurrentCategory() {
    if (state.activeCategory === 'All') return [];
    const prods = state.products.filter(p => p.category === state.activeCategory);
    return ['All', ...new Set(prods.map(p => p.subCategory).filter(Boolean))];
  }

  // ---------- Navigation / Routing Engine (Matching User Request) ----------
  function navigateToHome() {
    window.location.hash = '';
    showHomeView();
  }

  function navigateToCategory(catName, subCatName = 'All') {
    const hash = 'category=' + encodeURIComponent(catName) + (subCatName && subCatName !== 'All' ? '&sub=' + encodeURIComponent(subCatName) : '');
    window.location.hash = hash;
    showCategoryView(catName, subCatName);
  }

  function navigateToWholesale(catName = 'All') {
    state.activeTier = 'wholesale';
    updateTierButtons();
    navigateToCategory(catName);
    showToast('🏭 Wholesale B2B Factory Mode Activated (250+ units)');
  }

  function navigateToCustomPrinting() {
    showHomeView();
    setTimeout(() => {
      $('spotlightPrinting')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  function navigateToExportDesk() {
    showHomeView();
    setTimeout(() => {
      $('exportDesk')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  function showHomeView() {
    if ($('homeView')) $('homeView').style.display = 'block';
    if ($('categoryView')) $('categoryView').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNavActive('home');
    window.resumeCinematicScroll?.();
    setTimeout(() => {
      window.refreshCinematicScroll?.();
    }, 150);
  }

  function showCategoryView(catName, subCatName = 'All') {
    window.pauseCinematicScroll?.();
    state.activeCategory = catName || 'All';
    state.activeSubCategory = subCatName || 'All';
    if ($('homeView')) $('homeView').style.display = 'none';
    if ($('categoryView')) $('categoryView').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateNavActive(catName);
    renderCategoryPage();
    loadDynamicCategoryProducts(catName);
  }

  // ---------- Dynamic Supabase Catalog Loader with Bandwidth Optimization ----------
  function formatSupabaseProduct(p) {
    const basePrice = Number(p.price);
    const origPrice = p.original_price ? Number(p.original_price) : Math.round(basePrice * 1.35);
    const bPrice = p.bulk_price ? Number(p.bulk_price) : Math.round(basePrice * 0.68);
    const wsPrice = p.wholesale_price ? Number(p.wholesale_price) : Math.round(basePrice * 0.50);
    const moqConfig = (p.moq && typeof p.moq === 'object') ? p.moq : { retail: 1, bulk: 50, wholesale: 250 };

    // Format sizes array
    let productSizes = [];
    if (Array.isArray(p.sizes) && p.sizes.length > 0) {
      productSizes = p.sizes.map(s => {
        if (typeof s === 'string') {
          return { name: s, capacity: 'Standard Dimensions', priceOffset: 0 };
        }
        return {
          name: s.name || s.size || 'Standard',
          capacity: s.capacity || s.dimensions || 'Standard Dimensions',
          priceOffset: Number(s.priceOffset || s.price_offset || 0),
          price: s.price ? Number(s.price) : null
        };
      });
    } else {
      productSizes = [
        { name: 'Standard Unit', capacity: 'Standard Dimensions', priceOffset: 0 }
      ];
    }

    // Gallery images
    const gallery = Array.isArray(p.image_urls) ? p.image_urls.map(g => (typeof g === 'string' ? g : g.url)).filter(Boolean) : [];
    const allImages = [p.image_url, ...gallery];

    // Colors mapping (supports both image_url and photo_url)
    let productColors = [];
    if (Array.isArray(p.colours) && p.colours.length > 0) {
      productColors = p.colours.map(c => ({
        name: c.name || 'Standard',
        hex: c.hex || '#556B2F',
        image: c.image_url || c.photo_url || p.image_url
      }));
    } else if (Array.isArray(p.colors) && p.colors.length > 0) {
      productColors = p.colors.map(c => ({
        name: c.name || 'Standard',
        hex: c.hex || '#556B2F',
        image: c.image_url || c.photo_url || c.image || p.image_url
      }));
    } else {
      productColors = [{ name: 'Standard Model', hex: '#556B2F', image: p.image_url }];
    }

    const defaultColor = productColors[0];
    const stockQty = (p.stock_quantity !== undefined && p.stock_quantity !== null) ? Number(p.stock_quantity) : 100;

    return {
      id: p.id,
      sku: p.sku || '',
      brand: p.brand || 'JSM Bags',
      name: p.name,
      category: p.category,
      subCategory: p.subcategory || p.category,
      price: basePrice,
      bulkPrice: bPrice,
      wholesalePrice: wsPrice,
      moq: moqConfig,
      stockQuantity: stockQty,
      isSoldOut: stockQty <= 0,
      originalPrice: origPrice,
      rating: 5.0,
      reviews: 28,
      badge: p.badge || (p.is_featured ? 'Featured' : 'Direct Manufacturer'),
      isFeatured: Boolean(p.is_featured),
      description: p.description || `Authentic handcrafted ${p.name} directly stitched in Rajahmundry. Available for single piece retail, custom wedding gifting and wholesale container export.`,
      defaultImage: p.image_url,
      activeImage: defaultColor.image || p.image_url,
      storage_path: p.storage_path,
      galleryImages: allImages,
      sizes: productSizes,
      colors: productColors,
      variants: Array.isArray(p.variants) ? p.variants : [],
      selectedColor: defaultColor,
      selectedSize: productSizes[0],
      selectedPrintPlacement: 'none',
      customText: '',
      customPhotoName: '',
      customEligible: true,
      variantNotes: p.variant_notes || '',
      features: (Array.isArray(p.features) && p.features.length > 0) ? p.features : ['Reinforced heavy-duty stitching', 'Direct factory manufacturer price', 'Washable durable construction', 'Custom logo & photo printing available'],
      printOptions: { front: 35, back: 35, both: 60 }
    };
  }

  async function loadDynamicCategoryProducts(category = 'All') {
    if (!window.jsmSupabase || typeof window.jsmSupabase.fetchProducts !== 'function') {
      return;
    }

    try {
      if (!state.dynamicProductsMap) state.dynamicProductsMap = new Map();

      // Fetch from Supabase ('All' or specific category)
      const catToFetch = (!state.hasLoadedAllDynamic || category === 'All') ? 'All' : category;
      const { data, error } = await window.jsmSupabase.fetchProducts(catToFetch);
      if (catToFetch === 'All') state.hasLoadedAllDynamic = true;

      if (!error && Array.isArray(data)) {
        data.forEach(p => {
          const formatted = formatSupabaseProduct(p);
          state.dynamicProductsMap.set(p.id, formatted);
        });
      }

      // Read status overrides from localStorage
      let statusMap = {};
      try {
        statusMap = JSON.parse(localStorage.getItem('jsm_product_status_overrides') || '{}');
      } catch (e) {}

      // Build active dynamic product list
      const dynamicList = Array.from(state.dynamicProductsMap.values()).map(p => {
        if (statusMap[p.id] !== undefined) {
          p.is_active = statusMap[p.id];
        }
        return p;
      }).filter(p => p.is_active !== false);

      const dynamicIds = new Set(dynamicList.map(p => p.id));
      const remainingStatic = state.staticProducts.filter(p => !dynamicIds.has(p.id));

      state.products = [...dynamicList, ...remainingStatic];
      renderCategoryPage();
    } catch (err) {
      console.warn('Could not load dynamic products from Supabase:', err);
    }
  }

  // Load and sync dynamic categories from Supabase (if available)
  async function loadDynamicCategories() {
    if (!window.jsmSupabase || typeof window.jsmSupabase.fetchCategories !== 'function') return;
    try {
      const { data: dbCats } = await window.jsmSupabase.fetchCategories();
      if (dbCats && dbCats.length > 0) {
        dbCats.forEach(c => {
          if (!CATEGORIES.includes(c.name)) {
            CATEGORIES.push(c.name);
          }
          if (!CATEGORY_META[c.name]) {
            CATEGORY_META[c.name] = {
              label: c.name,
              cardLabel: c.name.toUpperCase(),
              image: 'assets/images/products/jsm-102-everyday-canvas-tote.jpg',
              title: c.name.toUpperCase(),
              desc: `Handcrafted ${c.name} manufactured in our Rajahmundry factory. Available in retail single piece, bulk gifting and factory wholesale.`
            };
          }
        });
      }
    } catch (err) {
      console.warn('Category sync note:', err);
    }
  }

  // Load and apply live store settings from Supabase
  async function loadStoreSettings() {
    if (!window.jsmSupabase || typeof window.jsmSupabase.fetchStoreSettings !== 'function') return;

    try {
      const { data, error } = await window.jsmSupabase.fetchStoreSettings();
      if (!error && data) {
        if (data.phone) STORE_CONFIG.phoneDisplay = data.phone;
        if (data.whatsapp_number) STORE_CONFIG.whatsappNumber = data.whatsapp_number.replace(/\D/g, '');
        if (data.address) STORE_CONFIG.address = data.address;
        if (data.brand_name) STORE_CONFIG.brand = data.brand_name;

        // Update live DOM elements if present
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(a => {
          a.href = `tel:${data.phone || STORE_CONFIG.phoneDisplay}`;
          if (a.textContent.includes('94408')) a.textContent = data.phone || STORE_CONFIG.phoneDisplay;
        });

        const waLinks = document.querySelectorAll('a[href*="wa.me"]');
        waLinks.forEach(a => {
          const currentHref = a.getAttribute('href');
          if (currentHref) {
            a.setAttribute('href', currentHref.replace(/wa\.me\/\d+/, `wa.me/${STORE_CONFIG.whatsappNumber}`));
          }
        });

        // Live announcement banner synchronization & visibility toggle
        const banner = document.querySelector('.announcement-bar');
        if (banner) {
          if (data.announcement_enabled === false) {
            banner.style.display = 'none';
          } else {
            banner.style.display = '';
            if (data.announcement && data.announcement.trim()) {
              const contentSpan = banner.querySelector('.announcement-content span') || banner.querySelector('.announcement-content');
              if (contentSpan) {
                contentSpan.innerHTML = `🌿 <strong>${data.announcement.trim()}</strong>`;
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('Store settings sync note:', err);
    }
  }

  function refreshDynamicCatalog() {
    state.categoryCache = {};
    if (state.dynamicProductsMap) state.dynamicProductsMap.clear();
    state.hasLoadedAllDynamic = false;
    loadDynamicCategories();
    loadDynamicCategoryProducts(state.activeCategory || 'All');
  }

  function updateNavActive(current) {
    $$('.header-nav-link').forEach(link => link.classList.remove('active'));
    if (current === 'home') {
      $('navHomeLink')?.classList.add('active');
    } else {
      $('navRetailLink')?.classList.add('active');
    }
  }

  function handleRoute() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    if (!raw) {
      showHomeView();
      return;
    }
    const params = new URLSearchParams(raw);
    const cat = params.get('category');
    const sub = params.get('sub') || 'All';
    if (cat) {
      showCategoryView(decodeURIComponent(cat), decodeURIComponent(sub));
    } else {
      showHomeView();
    }
  }

  // ---------- 1. Home Page: Visual Category Grid (Photo Tiles matching Image 2) ----------
  function renderCategoryVisualGrid() {
    const grid = $('categoryVisualGrid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES.filter(cat => cat !== 'All').map(cat => {
      const meta = CATEGORY_META[cat] || { cardLabel: cat.toUpperCase(), image: 'assets/images/products/potli-round-01.jpg', count: 0 };

      return `
        <div class="cat-photo-card" data-cat="${cat}" role="button" tabindex="0" aria-label="Explore ${cat}">
          <div class="cat-card-imgwrap">
            <img src="${meta.image}" alt="${cat}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/products/jsm-102-everyday-canvas-tote.jpg';" />
          </div>
          <div class="cat-card-bar">
            <span class="cat-card-title">${meta.cardLabel}</span>
            <span class="cat-card-arrow" aria-hidden="true">&rarr;</span>
          </div>
        </div>
      `;
    }).join('');

    // Clicking ANY category tile directs to dedicated Category Page (Image 3)
    grid.querySelectorAll('.cat-photo-card').forEach(card => {
      card.addEventListener('click', () => {
        navigateToCategory(card.dataset.cat);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToCategory(card.dataset.cat);
        }
      });
    });
  }

  // ---------- 2. Order Tier Manager (Retail, Bulk, Wholesale) ----------
  function setOrderTier(tier) {
    state.activeTier = tier;
    updateTierUI();

    if (tier === 'retail') {
      showToast('🛍️ Single Piece Retail Mode Active (MOQ: 1 pc)');
    } else if (tier === 'bulk') {
      showToast('📦 Bulk Pricing Activated! Save ~35% on 50+ units');
    } else if (tier === 'wholesale') {
      showToast('🏭 Wholesale B2B Factory Mode Activated (250+ units)');
    }

    renderCategoryPage();
  }

  function updateTierUI() {
    const active = state.activeTier;

    // Update bottom tier cards on Home page
    ['retail', 'bulk', 'wholesale'].forEach(t => {
      const box = $(`tierBox${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (box) {
        box.classList.toggle('active', t === active);
        const statusText = box.querySelector('.tier-status-text');
        if (statusText) statusText.textContent = t === active ? 'Active Tier' : 'Click to Activate';
      }

      // Bottom tier button on Category page
      const catBottomBtn = $(`catBottomTier${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (catBottomBtn) catBottomBtn.classList.toggle('active', t === active);
    });

    // Update bottom tier description banner
    const bannerIcon = $('tierBannerIcon');
    const bannerTitle = $('tierBannerTitle');
    const bannerDesc = $('tierBannerDesc');

    if (active === 'retail') {
      if (bannerIcon) bannerIcon.textContent = '🛍️';
      if (bannerTitle) bannerTitle.textContent = 'Single Piece Retail Mode Active';
      if (bannerDesc) bannerDesc.textContent = 'Browsing standard retail prices with MOQ: 1 pc. Free local pickup in Rajahmundry & Pan-India express delivery.';
    } else if (active === 'bulk') {
      if (bannerIcon) bannerIcon.textContent = '📦';
      if (bannerTitle) bannerTitle.textContent = 'Bulk Orders (Events & Gifting) Active';
      if (bannerDesc) bannerDesc.textContent = 'Tiered discount rates active! Save up to 35% on wedding return gifts, schools, and bulk orders of 50+ units.';
    } else if (active === 'wholesale') {
      if (bannerIcon) bannerIcon.textContent = '🏭';
      if (bannerTitle) bannerTitle.textContent = 'Wholesale B2B Factory Mode Active';
      if (bannerDesc) bannerDesc.textContent = 'Direct factory-gate manufacturing prices for 250+ units with tax invoices & worldwide export shipping.';
    }
  }

  function getEffectivePrice(prod, tier = state.activeTier) {
    if (!prod) return 0;

    // 1. Check for specific variant price combination (Color + Size)
    if (Array.isArray(prod.variants) && prod.variants.length > 0) {
      const selColor = prod.selectedColor?.name;
      const selSize = prod.selectedSize?.name;
      const match = prod.variants.find(v => {
        const matchColor = !v.color || !selColor || v.color === selColor;
        const matchSize = !v.size || !selSize || v.size === selSize;
        return matchColor && matchSize;
      });

      if (match && Number(match.price) > 0) {
        let vPrice = Number(match.price);
        if (tier === 'bulk') return Math.round(vPrice * 0.68);
        if (tier === 'wholesale') return Math.round(vPrice * 0.50);
        return vPrice;
      }
    }

    // 2. Base tier pricing
    let base = Number(prod.price) || 0;
    if (tier === 'bulk') base = Number(prod.bulkPrice) || Math.round(base * 0.68);
    if (tier === 'wholesale') base = Number(prod.wholesalePrice) || Math.round(base * 0.50);

    // 3. Explicit size price or size price offset
    if (prod.selectedSize?.price && Number(prod.selectedSize.price) > 0) {
      base = Number(prod.selectedSize.price);
      if (tier === 'bulk') base = Math.round(base * 0.68);
      if (tier === 'wholesale') base = Math.round(base * 0.50);
      return base;
    }

    return base + (Number(prod.selectedSize?.priceOffset) || 0);
  }

  function setCardSize(productId, sizeName) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    const size = prod.sizes.find(s => s.name === sizeName);
    if (size) {
      prod.selectedSize = size;
      renderCategoryPage();
    }
  }

  // ---------- 3. Dedicated Category Page View (Matching Reference Image 3) ----------
  function renderCategoryPage() {
    const titleEl = $('catViewTitle');
    const descEl = $('catViewDesc');
    const crumbCurrentEl = $('catCrumbCurrent');
    const subtypesBox = $('catViewSubtypes');
    const grid = $('catViewProductsGrid');
    const countEl = $('catViewCount');

    if (!grid) return;

    const catMeta = CATEGORY_META[state.activeCategory] || {
      title: state.activeCategory.toUpperCase(),
      desc: 'High-quality bags crafted with premium materials at direct Indian factory pricing.',
      label: state.activeCategory
    };

    // 1. Heading & Descriptions
    if (titleEl) {
      if (state.activeSubCategory !== 'All') {
        titleEl.textContent = `${catMeta.title} - ${state.activeSubCategory.toUpperCase()}`;
      } else {
        titleEl.textContent = catMeta.title;
      }
    }
    if (descEl) descEl.textContent = catMeta.desc;
    if (crumbCurrentEl) {
      crumbCurrentEl.textContent = state.activeSubCategory === 'All'
        ? (catMeta.label || state.activeCategory)
        : `${catMeta.label || state.activeCategory} › ${state.activeSubCategory}`;
    }

    // 2. Subcategory Style Filter Chips
    if (subtypesBox) {
      if (state.activeCategory === 'All') {
        subtypesBox.style.display = 'flex';
        // Show main categories as pills
        const allCount = state.products.length;
        let pillsHTML = `
          <button type="button" class="cat-subtype-pill ${state.activeCategory === 'All' && state.activeSubCategory === 'All' ? 'active' : ''}" onclick="window.jsmApp.navigateToCategory('All')">
            <span>All Bags</span>
            <span class="chip-count-pill">(${allCount})</span>
          </button>
        `;
        CATEGORIES.filter(c => c !== 'All').forEach(c => {
          const count = state.products.filter(p => p.category === c || (c === 'School Bags' && p.category === 'Backpack Bundles')).length;
          pillsHTML += `
            <button type="button" class="cat-subtype-pill" onclick="window.jsmApp.navigateToCategory('${c}')">
              <span>${CATEGORY_META[c]?.label || c}</span>
              <span class="chip-count-pill">(${count})</span>
            </button>
          `;
        });
        subtypesBox.innerHTML = pillsHTML;
      } else {
        // Show subcategories of this specific category
        let subCats = getSubCategoriesForCurrentCategory().filter(s => s !== 'All');
        if (state.activeCategory === 'School Bags') {
          subCats = ['Ergonomic School Backpacks', 'Backpack Bundles'];
        }

        const totalInCat = state.products.filter(p => p.category === state.activeCategory || (state.activeCategory === 'School Bags' && p.category === 'Backpack Bundles')).length;

        // If there's only 1 subcategory or no distinctive sub-types, hide the bar to keep the UI clean
        if (subCats.length <= 1) {
          subtypesBox.style.display = 'none';
        } else {
          subtypesBox.style.display = 'flex';
          let pillsHTML = `
            <button type="button" class="cat-subtype-pill ${state.activeSubCategory === 'All' ? 'active' : ''}" data-sub="All">
              <span>All ${CATEGORY_META[state.activeCategory]?.label || state.activeCategory}</span>
              <span class="chip-count-pill">(${totalInCat})</span>
            </button>
          `;

          subCats.forEach(sub => {
            const isActive = state.activeSubCategory === sub;
            const count = state.products.filter(p => (p.category === state.activeCategory || (state.activeCategory === 'School Bags' && p.category === 'Backpack Bundles')) && (p.subCategory === sub || p.category === sub)).length;
            pillsHTML += `
              <button type="button" class="cat-subtype-pill ${isActive ? 'active' : ''}" data-sub="${sub}">
                <span>${sub}</span>
                <span class="chip-count-pill">(${count})</span>
              </button>
            `;
          });
          subtypesBox.innerHTML = pillsHTML;

          // Subtype chip click handlers
          subtypesBox.querySelectorAll('.cat-subtype-pill').forEach(btn => {
            btn.addEventListener('click', () => {
              const chosenSub = btn.dataset.sub;
              state.activeSubCategory = chosenSub;
              const hash = 'category=' + encodeURIComponent(state.activeCategory) + (chosenSub !== 'All' ? '&sub=' + encodeURIComponent(chosenSub) : '');
              window.location.hash = hash;
              renderCategoryPage();
            });
          });
        }
      }
    }

    // 3. Filter products matching category, subcategory, search, and color
    let items = state.products.filter(p => {
      const matchCat = state.activeCategory === 'All' || 
        p.category === state.activeCategory ||
        (state.activeCategory === 'School Bags' && (p.category === 'Backpack Bundles' || p.category === 'School Bags'));
      const matchSub = state.activeSubCategory === 'All' || 
        p.subCategory === state.activeSubCategory ||
        p.category === state.activeSubCategory;
      const matchSearch = !state.searchQuery ||
        p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(state.searchQuery.toLowerCase()));
      const matchColor = state.activeColorFilter === 'all' ||
        p.colors.some(c => c.name.toLowerCase().includes(state.activeColorFilter.toLowerCase()));
      return matchCat && matchSub && matchSearch && matchColor;
    });

    // 4. Sort
    if (state.sortBy === 'price-low') {
      items.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (state.sortBy === 'price-high') {
      items.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else if (state.sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    }

    if (countEl) countEl.textContent = `${items.length} Products`;

    // 5. Render products grid (4 Columns matching Image 3)
    if (items.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <p style="font-size: 1.25rem; font-weight: 700; color: var(--text-dark);">No bags match your criteria</p>
          <p style="color: var(--text-muted); margin-top: 6px;">Try clearing color filter or browse all collections.</p>
          <button type="button" class="crumb-btn active" style="margin: 18px auto 0;" onclick="window.jsmApp.navigateToCategory('All')">Browse All 27 Bags</button>
        </div>`;
      return;
    }

    grid.innerHTML = items.map(p => {
      const displayPrice = getEffectivePrice(p, state.activeTier);
      const moq = p.moq[state.activeTier] || 1;

      // Price block with strikethrough savings when in Bulk or Wholesale
      let priceDisplayHTML = '';
      if (state.activeTier === 'retail') {
        priceDisplayHTML = `<span class="card-price-number">${rupees(displayPrice)}</span>`;
      } else if (state.activeTier === 'bulk') {
        priceDisplayHTML = `
          <div>
            <span class="card-orig-price-strike">${rupees(p.price)}</span>
            <span class="card-price-number" style="color: #059669;">${rupees(displayPrice)}</span>
          </div>
          <span class="card-saving-pill">Bulk Rate</span>
        `;
      } else {
        priceDisplayHTML = `
          <div>
            <span class="card-orig-price-strike">${rupees(p.price)}</span>
            <span class="card-price-number" style="color: #0284C7;">${rupees(displayPrice)}</span>
          </div>
          <span class="card-saving-pill" style="background:#E0F2FE; color:#0284C7;">Wholesale</span>
        `;
      }

      const isSoldOut = Boolean(p.isSoldOut || (p.stockQuantity !== undefined && p.stockQuantity <= 0));
      const badgeHTML = isSoldOut
        ? `<span class="card-badge" style="background:#DC2626; color:#FFF; font-weight:700;">SOLD OUT</span>`
        : `<span class="card-badge">${p.subCategory || p.category}</span>`;

      const cartBtnHTML = isSoldOut
        ? `<button type="button" class="btn-card-cart disabled" style="opacity:0.55; cursor:not-allowed; background:#94A3B8;" disabled title="Out of Stock">Sold Out</button>`
        : `<button type="button" class="btn-card-cart" onclick="window.jsmApp.addToCart('${p.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Cart
          </button>`;

      return `
        <article class="product-card" data-id="${p.id}" id="prod-${p.id}">
          <div class="card-img-box">
            ${badgeHTML}
            <img src="${p.activeImage}" alt="${p.name}" class="card-main-img" loading="lazy" onclick="window.jsmApp.openModal('${p.id}')" onerror="this.onerror=null;this.src='assets/images/products/jsm-102-everyday-canvas-tote.jpg';" />
            <div class="card-overlay-actions">
              <button type="button" class="card-quick-view-btn" onclick="window.jsmApp.openModal('${p.id}')">Quick View &amp; Customize</button>
            </div>
          </div>

          <div class="card-content">
            <div class="card-meta-line">
              <span class="card-category-tag">${p.category}</span>
              <span class="card-moq-pill">${state.activeTier.toUpperCase()} &bull; MOQ: ${moq} pc${moq > 1 ? 's' : ''}</span>
            </div>

            <h3 class="card-title" onclick="window.jsmApp.openModal('${p.id}')" style="cursor: pointer;">${p.name}</h3>
            
            <p class="card-desc-snippet">${p.description.substring(0, 85)}...</p>

            <!-- Color Swatches Row -->
            <div class="card-swatches-row">
              <span class="swatch-label">Color:</span>
              <div class="swatches-container">
                ${p.colors.map((c, idx) => `
                  <button type="button" class="swatch-circle ${c.name === p.selectedColor.name ? 'active' : ''}" 
                    style="background-color: ${c.hex};" 
                    title="${c.name}" 
                    data-pid="${p.id}" 
                    data-color-idx="${idx}"
                    aria-label="Color ${c.name}">
                  </button>
                `).join('')}
              </div>
              <span class="swatch-name-display">${p.selectedColor.name}</span>
            </div>

            <!-- Size Selector Pills -->
            <div class="card-sizes-row">
              ${p.sizes.map(s => `
                <button type="button" class="size-pill-sm ${s.name === p.selectedSize.name ? 'active' : ''}" 
                  onclick="window.jsmApp.setCardSize('${p.id}', '${s.name}')">
                  ${s.name}
                </button>
              `).join('')}
            </div>

            <!-- Pricing Box -->
            <div class="card-pricing-box">
              <div class="card-primary-price">
                ${priceDisplayHTML}
              </div>
              <div class="card-sub-tiers">
                <span>Bulk: <strong>${rupees(p.bulkPrice)}</strong> (${p.moq.bulk}+)</span>
                <span>Wholesale: <strong>${rupees(p.wholesalePrice)}</strong> (${p.moq.wholesale}+)</span>
              </div>
            </div>

            <!-- Reviews & Digital Print badge -->
            <div class="card-reviews-row">
              <span class="star-rating">★★★★★</span>
              <span class="review-count">(${p.reviews})</span>
              ${p.customEligible ? `<span style="margin-left: auto; font-size: 0.6875rem; font-weight: 700; color: #B45309; background: #FEF3C7; padding: 2px 6px; border-radius: 4px;">🎨 Front &amp; Back Print</span>` : ''}
            </div>

            <!-- Action Buttons -->
            <div class="card-action-buttons">
              <button type="button" class="btn-card-whatsapp" onclick="window.jsmApp.directOrderWhatsApp('${p.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>
                Order on WhatsApp
              </button>
              ${cartBtnHTML}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach swatch click events in category page
    grid.querySelectorAll('.swatch-circle').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const pid = btn.dataset.pid;
        const colorIdx = parseInt(btn.dataset.colorIdx, 10);
        const prod = state.products.find(x => x.id === pid);
        if (prod && prod.colors[colorIdx]) {
          prod.selectedColor = prod.colors[colorIdx];
          prod.activeImage = prod.selectedColor.image || prod.defaultImage;
          renderCategoryPage();
        }
      });
    });
  }

  // ---------- 4. Shopping Cart Logic ----------
  function addToCart(productId, customColor, customSize, customTier, printPlacement, printText) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    if (prod.isSoldOut || (prod.stockQuantity !== undefined && prod.stockQuantity <= 0)) {
      alert(`"${prod.name}" is currently out of stock. Please order on WhatsApp for custom factory production.`);
      return;
    }

    const color = customColor || prod.selectedColor;
    const size = customSize || prod.selectedSize;
    const tier = customTier || state.activeTier;
    const placement = printPlacement || 'none';
    const text = printText || '';

    let unitPrice = getEffectivePrice(prod, tier);
    if (placement === 'front' || placement === 'back') unitPrice += (prod.printOptions?.front || 40);
    if (placement === 'both') unitPrice += (prod.printOptions?.both || 70);

    const minQty = prod.moq[tier] || 1;

    const existingIndex = state.cart.findIndex(
      item => item.id === prod.id && item.color.name === color.name && item.size.name === size.name && item.tier === tier && item.placement === placement && item.text === text
    );

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += minQty;
    } else {
      state.cart.push({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        subCategory: prod.subCategory,
        color: color,
        size: size,
        tier: tier,
        placement: placement,
        text: text,
        price: unitPrice,
        image: color.image || prod.defaultImage,
        quantity: minQty
      });
    }

    saveCart();
    showToast(`Added ${minQty} × "${prod.name}" (${tier.toUpperCase()}) to cart`);
    openCartDrawer();
  }

  function updateCartUI() {
    const countEl = $('cartCount');
    const bodyEl = $('cartDrawerBody');
    const subtotalEl = $('cartDrawerSubtotal');
    const discountRow = $('drawerDiscountRow');
    const discountVal = $('cartDrawerDiscount');
    const discountPct = $('discountPercentLabel');
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (countEl) countEl.textContent = totalItems;
    if ($('drawerItemCount')) $('drawerItemCount').textContent = `(${totalItems} items)`;

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = state.appliedCoupon ? Math.round(subtotal * (state.appliedCoupon.discount_percent / 100)) : 0;
    const finalTotal = Math.max(0, subtotal - discount);

    if (subtotalEl) {
      if (state.appliedCoupon && discount > 0) {
        subtotalEl.innerHTML = `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.85em; margin-right: 6px;">${rupees(subtotal)}</span><span style="color: #059669; font-weight: 800;">${rupees(finalTotal)}</span>`;
      } else {
        subtotalEl.textContent = rupees(subtotal);
      }
    }

    if (discountRow) {
      if (state.appliedCoupon && discount > 0) {
        discountRow.style.display = 'flex';
        if (discountVal) discountVal.textContent = `-${rupees(discount)}`;
        if (discountPct) discountPct.textContent = `${state.appliedCoupon.discount_percent}% (${state.appliedCoupon.code})`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (!bodyEl) return;

    if (state.cart.length === 0) {
      bodyEl.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🛍️</span>
          <p style="font-size: 1.125rem; font-weight: 700; color: var(--text-dark);">Your shopping bag is empty</p>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 6px;">Add single pieces, event bulk bags or wholesale orders.</p>
          <button type="button" class="crumb-btn active" style="margin: 20px auto 0;" onclick="window.jsmApp.closeCartDrawer(); window.jsmApp.navigateToCategory('All');">Browse Collections</button>
        </div>`;
      return;
    }

    bodyEl.innerHTML = state.cart.map((item, idx) => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null;this.src='assets/images/products/jsm-102-everyday-canvas-tote.jpg';" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <p class="cart-item-variant">Tier: <strong style="color:#0369A1;">${item.tier.toUpperCase()}</strong> &bull; Color: <strong>${item.color.name}</strong></p>
          <p class="cart-item-variant">Size: <strong>${item.size.name}</strong></p>
          ${item.placement !== 'none' ? `<p class="cart-item-variant" style="color:#B45309;">Print: <strong>${item.placement.toUpperCase()}</strong> ${item.text ? `("${item.text}")` : ''}</p>` : ''}
          <p class="cart-item-price">${rupees(item.price)} each &bull; Total: <strong>${rupees(item.price * item.quantity)}</strong></p>

          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button type="button" class="qty-btn" onclick="window.jsmApp.changeCartQty(${idx}, -1)" aria-label="Decrease">&minus;</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn" onclick="window.jsmApp.changeCartQty(${idx}, 1)" aria-label="Increase">+</button>
            </div>
            <button type="button" class="cart-item-remove" onclick="window.jsmApp.removeCartItem(${idx})">Remove</button>
          </div>
        </div>
      </div>
    `).join('') + `
      <div style="margin-top: 14px; padding: 12px; background: #F8FAFC; border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
        <label style="display: block; font-size: 0.8125rem; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;" for="cartOrderNote">📝 Delivery PIN Code / Event Date / Custom Notes:</label>
        <input type="text" id="cartOrderNote" style="width: 100%; padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); font-size: 0.8125rem;" placeholder="e.g. Wedding on Dec 12, PIN: 533101, Print groom & bride name" />
      </div>
    `;
  }

  function changeCartQty(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
  }

  function removeCartItem(index) {
    state.cart.splice(index, 1);
    saveCart();
  }

  function openCartDrawer() {
    $('cartDrawer')?.classList.add('open');
    $('cartDrawerOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    $('cartDrawer')?.classList.remove('open');
    $('cartDrawerOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---------- 5. WhatsApp Order Generator (THE HIGHLIGHT) ----------
  function checkoutWhatsApp() {
    if (state.cart.length === 0) {
      alert('Your cart is empty! Please add a bag to order.');
      return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = state.appliedCoupon ? Math.round(subtotal * (state.appliedCoupon.discount_percent / 100)) : 0;
    const finalTotal = Math.max(0, subtotal - discount);
    const orderNote = $('cartOrderNote')?.value?.trim();

    let msg = `🛍️ *NEW ORDER - JSM BAGS*\n`;
    msg += `Jai Sundha Mata Bags And Decoration, Rajahmundry (AP)\n`;
    msg += `----------------------------------------\n\n`;

    state.cart.forEach((item, i) => {
      msg += `*${i + 1}. ${item.name}* (ID: ${item.id})\n`;
      msg += `   • Tier: ${item.tier.toUpperCase()}\n`;
      msg += `   • Color: ${item.color.name}\n`;
      msg += `   • Size: ${item.size.name}\n`;
      if (item.placement !== 'none') {
        msg += `   • Digital Printing: ${item.placement.toUpperCase()} SIDE\n`;
        if (item.text) msg += `   • Custom Text/Name: "${item.text}"\n`;
      }
      msg += `   • Quantity: ${item.quantity} pcs\n`;
      msg += `   • Item Total: ${rupees(item.price * item.quantity)}\n\n`;
    });

    msg += `----------------------------------------\n`;
    msg += `💰 *ORDER SUB-TOTAL:* ${rupees(subtotal)}\n`;
    if (state.appliedCoupon && discount > 0) {
      msg += `🎟️ *COUPON APPLIED:* ${state.appliedCoupon.code} (${state.appliedCoupon.discount_percent}% OFF)\n`;
      msg += `💸 *COUPON SAVINGS:* -${rupees(discount)}\n`;
      msg += `✨ *FINAL TOTAL TO PAY:* ${rupees(finalTotal)}\n`;
    }
    msg += `🚚 *Logistics Request:* Pan-India Express Delivery / Worldwide Export\n`;
    if (orderNote) {
      msg += `📝 *Customer Notes:* ${orderNote}\n`;
    }
    msg += `\nPlease confirm stock availability, invoice, and dispatch timeline. Thank you!`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  // ---------- Customer Coupon Verification & Application ----------
  async function applyCoupon(codeToApply) {
    const input = $('couponCodeInput');
    const code = (codeToApply || input?.value || '').trim();
    const statusMsg = $('couponStatusMsg');
    const applyBtn = $('applyCouponBtn');

    if (!code) {
      if (statusMsg) {
        statusMsg.innerHTML = '<span style="color:#DC2626; font-weight: 600;">Please enter a coupon code.</span>';
        statusMsg.style.display = 'block';
      }
      return;
    }

    const currentSubtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (applyBtn) {
      applyBtn.disabled = true;
      applyBtn.textContent = 'Checking...';
    }

    try {
      const { coupon, error } = await window.jsmSupabase.verifyCoupon(code, currentSubtotal);
      if (error || !coupon) {
        state.appliedCoupon = null;
        if (statusMsg) {
          statusMsg.innerHTML = `<span style="color:#DC2626; font-weight: 600;">⚠️ ${error?.message || 'Invalid or expired coupon code.'}</span>`;
          statusMsg.style.display = 'block';
        }
      } else {
        state.appliedCoupon = coupon;
        if (statusMsg) {
          statusMsg.innerHTML = `
            <div class="coupon-success-badge">
              <span>🎉 Code <strong>${coupon.code}</strong> applied: <strong>${coupon.discount_percent}% OFF</strong></span>
              <button type="button" class="coupon-remove-link" onclick="window.jsmApp.removeCoupon()">Remove</button>
            </div>`;
          statusMsg.style.display = 'block';
        }
        showToast(`Coupon ${coupon.code} (${coupon.discount_percent}% OFF) applied!`);
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.innerHTML = `<span style="color:#DC2626;">Error verifying coupon: ${err.message}</span>`;
        statusMsg.style.display = 'block';
      }
    } finally {
      if (applyBtn) {
        applyBtn.disabled = false;
        applyBtn.textContent = 'Apply';
      }
      updateCartUI();
    }
  }

  function removeCoupon() {
    state.appliedCoupon = null;
    const input = $('couponCodeInput');
    const statusMsg = $('couponStatusMsg');
    if (input) input.value = '';
    if (statusMsg) statusMsg.style.display = 'none';
    showToast('Coupon removed.');
    updateCartUI();
  }

  function directOrderWhatsApp(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    const unitPrice = getEffectivePrice(prod, state.activeTier);
    const moq = prod.moq[state.activeTier] || 1;

    let msg = `👋 *HELLO JSM BAGS RAJAHMUNDRY!*\n`;
    msg += `I am interested in ordering this bag:\n\n`;
    msg += `*Bag Name:* ${prod.name}\n`;
    msg += `*Product Code:* ${prod.id}\n`;
    msg += `*Category:* ${prod.category} (${prod.subCategory || ''})\n`;
    msg += `*Selected Tier:* ${state.activeTier.toUpperCase()} (MOQ: ${moq} pcs)\n`;
    msg += `*Color:* ${prod.selectedColor.name}\n`;
    msg += `*Size:* ${prod.selectedSize.name}\n`;
    if (prod.variantNotes) {
      msg += `*Variant/Print Notes:* ${prod.variantNotes}\n`;
    }
    msg += `*Estimated Rate:* ${rupees(unitPrice)} / piece\n\n`;
    msg += `✨ *Custom Digital Printing:* I would like to inquire about Front & Back photo/name printing on this order.\n\n`;
    msg += `Please confirm availability, bulk discount, and delivery to my location. Thank you!`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  // Worldwide Export Inquiry
  function openExportInquiryWhatsApp() {
    let msg = `🌐 *INTERNATIONAL EXPORT INQUIRY - JSM BAGS INDIA*\n`;
    msg += `Hello Export Desk, Jai Sundha Mata Bags And Decoration!\n\n`;
    msg += `I am an overseas buyer / importer interested in sourcing bags from India.\n`;
    msg += `• *Categories of Interest:* Jute Bags / Potli Bags / Event Totes / Backpacks\n`;
    msg += `• *Destination Country:* [Please specify USA, UK, UAE, Australia, Canada, etc.]\n`;
    msg += `• *Quantity Requirement:* Container / Air Cargo / Pallet volume\n`;
    msg += `• *Custom Branding:* Required (Logos & digital printing)\n\n`;
    msg += `Please share your export catalog, FOB/CIF pricing, and lead times. Thank you!`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  // ---------- 6. Quick View / Product Detail Modal ----------
  function openModal(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    state.modalProduct = { ...prod };
    state.modalTier = state.activeTier;
    state.modalPrintPlacement = 'none';
    state.modalCustomText = '';

    const overlay = $('modalOverlay');

    const updateModalUI = () => {
      const p = state.modalProduct;
      let unitPrice = getEffectivePrice(p, state.modalTier);
      
      if (state.modalPrintPlacement === 'front' || state.modalPrintPlacement === 'back') {
        unitPrice += (p.printOptions?.front || 40);
      } else if (state.modalPrintPlacement === 'both') {
        unitPrice += (p.printOptions?.both || 70);
      }

      $('modalMainImg').src = p.activeImage;
      if ($('modalMainImg')) {
        $('modalMainImg').onerror = function() {
          this.onerror = null;
          this.src = 'assets/images/products/jsm-102-everyday-canvas-tote.jpg';
        };
      }
      $('modalCategory').textContent = `${p.category} • ${p.subCategory || ''} • Code: ${p.id}`;
      $('modalTitle').textContent = p.name;
      $('modalDesc').textContent = p.description;

      // Variant Notes (print options, motif choices, style notes)
      const variantNotesEl = $('modalVariantNotes');
      if (variantNotesEl) {
        if (p.variantNotes) {
          variantNotesEl.textContent = p.variantNotes;
          variantNotesEl.style.display = 'block';
        } else {
          variantNotesEl.style.display = 'none';
        }
      }

      // Tier Selector Cards in Modal
      $('modalTierCards').innerHTML = `
        <div class="modal-tier-card ${state.modalTier === 'retail' ? 'active' : ''}" onclick="window.jsmApp.setModalTier('retail')">
          <div class="tier-name">Single Piece</div>
          <div class="tier-rate">${rupees(p.price)}</div>
          <div class="tier-moq">MOQ: 1 pc</div>
        </div>
        <div class="modal-tier-card ${state.modalTier === 'bulk' ? 'active' : ''}" onclick="window.jsmApp.setModalTier('bulk')">
          <div class="tier-name">Bulk Order</div>
          <div class="tier-rate">${rupees(p.bulkPrice)}</div>
          <div class="tier-moq">MOQ: ${p.moq.bulk} pcs</div>
        </div>
        <div class="modal-tier-card ${state.modalTier === 'wholesale' ? 'active' : ''}" onclick="window.jsmApp.setModalTier('wholesale')">
          <div class="tier-name">Wholesale B2B</div>
          <div class="tier-rate">${rupees(p.wholesalePrice)}</div>
          <div class="tier-moq">MOQ: ${p.moq.wholesale} pcs</div>
        </div>
      `;

      // Price Row
      $('modalPrice').textContent = `${rupees(unitPrice)} / piece`;
      $('modalOrigPrice').textContent = rupees(p.originalPrice);

      // Color swatches in modal
      $('modalSwatches').innerHTML = p.colors.map(c => `
        <div class="modal-swatch-item ${c.name === p.selectedColor.name ? 'active' : ''}" 
          onclick="window.jsmApp.setModalColor('${c.name}')">
          <span class="modal-swatch-dot" style="background-color: ${c.hex}"></span>
          <span>${c.name}</span>
        </div>
      `).join('');
      $('modalColorName').textContent = p.selectedColor.name;

      // Size cards in modal
      $('modalSizes').innerHTML = p.sizes.map(s => `
        <div class="modal-size-card ${s.name === p.selectedSize.name ? 'active' : ''}" 
          onclick="window.jsmApp.setModalSize('${s.name}')">
          <div class="size-card-title">${s.name}</div>
          <div class="size-card-cap">${s.capacity}</div>
        </div>
      `).join('');
      $('modalSizeName').textContent = p.selectedSize.name;

      // Print Placement Radios
      const frontExtra = p.printOptions?.front || 40;
      const bothExtra = p.printOptions?.both || 70;
      $('modalPrintRadios').innerHTML = `
        <label class="print-radio-label">
          <input type="radio" name="mPrintPlace" value="none" ${state.modalPrintPlacement === 'none' ? 'checked' : ''} onchange="window.jsmApp.setModalPrintPlacement('none')" />
          <span>No Print (Plain)</span>
        </label>
        <label class="print-radio-label">
          <input type="radio" name="mPrintPlace" value="front" ${state.modalPrintPlacement === 'front' ? 'checked' : ''} onchange="window.jsmApp.setModalPrintPlacement('front')" />
          <span>Front Side (+${rupees(frontExtra)})</span>
        </label>
        <label class="print-radio-label">
          <input type="radio" name="mPrintPlace" value="back" ${state.modalPrintPlacement === 'back' ? 'checked' : ''} onchange="window.jsmApp.setModalPrintPlacement('back')" />
          <span>Back Side (+${rupees(frontExtra)})</span>
        </label>
        <label class="print-radio-label">
          <input type="radio" name="mPrintPlace" value="both" ${state.modalPrintPlacement === 'both' ? 'checked' : ''} onchange="window.jsmApp.setModalPrintPlacement('both')" />
          <span>Both Sides (+${rupees(bothExtra)})</span>
        </label>
      `;

      // Toggle front/back custom text & photo inputs if printing is selected
      const frontBox = $('modalFrontInputBox');
      const backBox = $('modalBackInputBox');
      if (frontBox) {
        frontBox.style.display = (state.modalPrintPlacement === 'front' || state.modalPrintPlacement === 'both') ? 'block' : 'none';
      }
      if (backBox) {
        backBox.style.display = (state.modalPrintPlacement === 'back' || state.modalPrintPlacement === 'both') ? 'block' : 'none';
      }

      // Bind photo input listeners once
      const frontFileInput = $('modalFrontPhotoInput');
      const backFileInput = $('modalBackPhotoInput');
      if (frontFileInput && !frontFileInput._bound) {
        frontFileInput._bound = true;
        frontFileInput.addEventListener('change', e => {
          const f = e.target.files[0];
          if (f && $('modalFrontPhotoName')) $('modalFrontPhotoName').textContent = `✓ Attached: ${f.name}`;
        });
      }
      if (backFileInput && !backFileInput._bound) {
        backFileInput._bound = true;
        backFileInput.addEventListener('change', e => {
          const f = e.target.files[0];
          if (f && $('modalBackPhotoName')) $('modalBackPhotoName').textContent = `✓ Attached: ${f.name}`;
        });
      }

      // Out-of-stock guard for modal cart button
      const modalCartBtn = document.querySelector('.modal-btn-cart');
      if (modalCartBtn) {
        if (p.isSoldOut || (p.stockQuantity !== undefined && p.stockQuantity <= 0)) {
          modalCartBtn.disabled = true;
          modalCartBtn.style.opacity = '0.55';
          modalCartBtn.style.cursor = 'not-allowed';
          modalCartBtn.innerHTML = `<span>Currently Out of Stock</span>`;
        } else {
          modalCartBtn.disabled = false;
          modalCartBtn.style.opacity = '1';
          modalCartBtn.style.cursor = 'pointer';
          modalCartBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Add to Order Bag</span>`;
        }
      }
    };

    state.updateModalUI = updateModalUI;
    updateModalUI();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function setModalTier(tier) {
    state.modalTier = tier;
    state.updateModalUI?.();
  }

  function setModalPrintPlacement(placement) {
    state.modalPrintPlacement = placement;
    state.updateModalUI?.();
  }

  function setModalColor(colorName) {
    if (!state.modalProduct) return;
    const color = state.modalProduct.colors.find(c => c.name === colorName);
    if (color) {
      state.modalProduct.selectedColor = color;
      state.modalProduct.activeImage = color.image || state.modalProduct.defaultImage;
      state.updateModalUI?.();
    }
  }

  function setModalSize(sizeName) {
    if (!state.modalProduct) return;
    const size = state.modalProduct.sizes.find(s => s.name === sizeName);
    if (size) {
      state.modalProduct.selectedSize = size;
      state.updateModalUI?.();
    }
  }

  function addModalToCart() {
    if (!state.modalProduct) return;
    if (state.modalProduct.isSoldOut || (state.modalProduct.stockQuantity !== undefined && state.modalProduct.stockQuantity <= 0)) {
      alert(`"${state.modalProduct.name}" is currently out of stock. Please order on WhatsApp for custom factory production.`);
      return;
    }
    const frontText = $('modalFrontTextInput')?.value?.trim() || '';
    const backText = $('modalBackTextInput')?.value?.trim() || '';
    let customTextSummary = '';
    if (state.modalPrintPlacement === 'front') customTextSummary = frontText ? `Front: "${frontText}"` : 'Front Print';
    else if (state.modalPrintPlacement === 'back') customTextSummary = backText ? `Back: "${backText}"` : 'Back Print';
    else if (state.modalPrintPlacement === 'both') {
      customTextSummary = [frontText && `Front: "${frontText}"`, backText && `Back: "${backText}"`].filter(Boolean).join(' | ') || 'Both Sides Print';
    }

    addToCart(
      state.modalProduct.id,
      state.modalProduct.selectedColor,
      state.modalProduct.selectedSize,
      state.modalTier,
      state.modalPrintPlacement,
      customTextSummary
    );
    closeModal();
  }

  function orderModalWhatsApp() {
    if (!state.modalProduct) return;
    const p = state.modalProduct;
    let unitPrice = getEffectivePrice(p, state.modalTier);
    if (state.modalPrintPlacement === 'front' || state.modalPrintPlacement === 'back') unitPrice += (p.printOptions?.front || 40);
    if (state.modalPrintPlacement === 'both') unitPrice += (p.printOptions?.both || 70);

    const moq = p.moq[state.modalTier] || 1;
    const frontText = $('modalFrontTextInput')?.value?.trim() || '';
    const backText = $('modalBackTextInput')?.value?.trim() || '';
    const frontPhoto = $('modalFrontPhotoInput')?.files[0]?.name || '';
    const backPhoto = $('modalBackPhotoInput')?.files[0]?.name || '';

    let msg = `👋 *HELLO JSM BAGS!*\n`;
    msg += `I want to order this bag:\n\n`;
    msg += `*Bag:* ${p.name} (Code: ${p.id})\n`;
    msg += `*Order Tier:* ${state.modalTier.toUpperCase()} (MOQ: ${moq} pcs)\n`;
    msg += `*Color:* ${p.selectedColor.name}\n`;
    msg += `*Size:* ${p.selectedSize.name}\n`;
    if (p.variantNotes) {
      msg += `*Variant/Print Notes:* ${p.variantNotes}\n`;
    }
    if (state.modalPrintPlacement !== 'none') {
      msg += `*Digital Printing:* ${state.modalPrintPlacement.toUpperCase()} SIDES\n`;
      if (state.modalPrintPlacement === 'front' || state.modalPrintPlacement === 'both') {
        msg += `• *Front Side:* ${frontText ? `"${frontText}"` : 'Logo/Photo'}`;
        if (frontPhoto) msg += ` (File: ${frontPhoto})`;
        msg += `\n`;
      }
      if (state.modalPrintPlacement === 'back' || state.modalPrintPlacement === 'both') {
        msg += `• *Back Side:* ${backText ? `"${backText}"` : 'Quote/Details'}`;
        if (backPhoto) msg += ` (File: ${backPhoto})`;
        msg += `\n`;
      }
      msg += `*(I will send design logo/photo in this chat)*\n`;
    }
    msg += `*Rate:* ${rupees(unitPrice)} / piece\n\n`;
    msg += `Please confirm delivery timeline and payment options. Thank you!`;

    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function closeModal() {
    $('modalOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---------- 7. Customer / B2B Profile Modal ----------
  function openProfileModal() {
    let overlay = $('profileModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'profileModalOverlay';
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="product-modal" style="max-width: 480px; padding: 28px;">
          <button type="button" class="modal-close-btn" onclick="window.jsmApp.closeProfileModal()" aria-label="Close">&times;</button>
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #E8F2EA; color: #164E3D; display: grid; place-items: center; margin: 0 auto 12px; font-size: 1.5rem;">👤</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: #1E3D34; margin-bottom: 4px;">Customer &amp; B2B Wholesale Portal</h3>
            <p style="font-size: 0.8125rem; color: #64748B;">Jai Sundha Mata Bags And Decoration &bull; Rajahmundry</p>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 0.8125rem; line-height: 1.6;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #64748B;">Manufacturing:</span>
              <strong style="color: #0F172A;">In-house Workshop &amp; Printing</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748B;">Head Office:</span>
              <strong style="color: #0F172A;">Maya bazar, Innespeta, Rajamahendravaram (AP)</strong>
            </div>
          </div>
          <p style="font-size: 0.8125rem; color: #334155; margin-bottom: 16px;">
            For wholesale dealer pricing, customized bag printing, and factory dispatch tracking, chat directly with our Rajahmundry sales office:
          </p>
          <a href="https://wa.me/919440863516?text=Hello%20JSM%20Bags!%20I%20am%20a%20buyer/retailer%20inquiring%20about%20my%20account%20and%20orders." target="_blank" rel="noopener" class="header-wa-btn" style="width: 100%; justify-content: center; padding: 12px; font-size: 0.9375rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>
            <span>Connect on WhatsApp Support</span>
          </a>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProfileModal() {
    const overlay = $('profileModalOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ---------- 8. Navigation Drawer (Three Horizontal Lines Menu) ----------
  function openMobileNav() {
    $('navDrawer')?.classList.add('open');
    $('navDrawerBackdrop')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderDrawerCategories();
  }

  function closeMobileNav() {
    $('navDrawer')?.classList.remove('open');
    $('navDrawerBackdrop')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderDrawerCategories() {
    const list = $('drawerCatsList');
    if (!list) return;
    list.innerHTML = CATEGORIES.filter(c => c !== 'All').map(cat => {
      const count = state.products.filter(p => p.category === cat || (cat === 'School Bags' && p.category === 'Backpack Bundles')).length;
      return `
        <button type="button" class="drawer-cat-btn" onclick="window.jsmApp.navigateToCategory('${cat}'); window.jsmApp.closeMobileNav();">
          <span>${CATEGORY_META[cat]?.cardLabel || cat}</span>
          <span class="cat-arrow">&bull; ${count} items &rarr;</span>
        </button>
      `;
    }).join('');
  }

  // ---------- 9. Spotlight Custom Studio Stage Controller (Front & Back) ----------
  const spotlightState = {
    placement: 'both', // 'front', 'back', 'both'
    viewSide: 'front', // 'front', 'back'
    frontPhotoData: null,
    frontPhotoName: '',
    frontText: '',
    backPhotoData: null,
    backPhotoName: '',
    backText: ''
  };

  function setSpotlightPlacement(placement) {
    spotlightState.placement = placement;
    $('tabPlacementFront')?.classList.toggle('active', placement === 'front');
    $('tabPlacementBack')?.classList.toggle('active', placement === 'back');
    $('tabPlacementBoth')?.classList.toggle('active', placement === 'both');

    const frontCard = $('spotlightFrontCard');
    const backCard = $('spotlightBackCard');
    if (frontCard) frontCard.style.display = (placement === 'front' || placement === 'both') ? 'block' : 'none';
    if (backCard) backCard.style.display = (placement === 'back' || placement === 'both') ? 'block' : 'none';

    if (placement === 'front') setMockupSide('front');
    if (placement === 'back') setMockupSide('back');

    updateMockupStage();
  }

  function setMockupSide(side) {
    spotlightState.viewSide = side;
    $('btnStageFront')?.classList.toggle('active', side === 'front');
    $('btnStageBack')?.classList.toggle('active', side === 'back');
    updateMockupStage();
  }

  function updateMockupStage() {
    const isFront = spotlightState.viewSide === 'front';
    const zoneBadge = $('spotlightZoneBadge');
    const photoImg = $('spotlightPhotoImg');
    const placeholder = $('spotlightPhotoPlaceholder');
    const textLabel = $('spotlightTextLabel');
    const printZone = $('mockupPrintZone');

    if (zoneBadge) zoneBadge.textContent = isFront ? 'FRONT PRINT ZONE' : 'BACK PRINT ZONE';

    const photoData = isFront ? spotlightState.frontPhotoData : spotlightState.backPhotoData;
    const textVal = isFront ? spotlightState.frontText : spotlightState.backText;

    if (photoImg && placeholder) {
      if (photoData) {
        // ── Photo uploaded: show it filling the zone, hide placeholder ──
        photoImg.src = photoData;
        photoImg.style.display = 'block';
        placeholder.style.display = 'none';
        if (textLabel) textLabel.style.display = 'none';
        if (printZone) printZone.classList.add('has-photo');
      } else {
        // ── No photo: show placeholder ──
        photoImg.style.display = 'none';
        placeholder.style.display = 'flex';
        if (textLabel) {
          textLabel.style.display = 'block';
          textLabel.textContent = textVal || (isFront ? 'YOUR NAME / LOGO' : 'CUSTOM MESSAGE / QUOTE');
        }
        if (printZone) printZone.classList.remove('has-photo');
      }
    }

    // Update text label (only when no photo)
    if (!photoData && textLabel) {
      textLabel.textContent = textVal || (isFront ? 'YOUR NAME / LOGO' : 'CUSTOM MESSAGE / QUOTE');
    }
  }

  function initSpotlightStage() {
    $('spotlightFrontText')?.addEventListener('input', e => {
      spotlightState.frontText = e.target.value.trim();
      updateMockupStage();
    });

    $('spotlightBackText')?.addEventListener('input', e => {
      spotlightState.backText = e.target.value.trim();
      updateMockupStage();
    });

    $('spotlightFrontPhoto')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        spotlightState.frontPhotoName = file.name;
        if ($('frontFileStatus')) $('frontFileStatus').textContent = `✓ ${file.name}`;
        const reader = new FileReader();
        reader.onload = ev => {
          spotlightState.frontPhotoData = ev.target.result;
          setMockupSide('front');
        };
        reader.readAsDataURL(file);
      }
    });

    $('spotlightBackPhoto')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        spotlightState.backPhotoName = file.name;
        if ($('backFileStatus')) $('backFileStatus').textContent = `✓ ${file.name}`;
        const reader = new FileReader();
        reader.onload = ev => {
          spotlightState.backPhotoData = ev.target.result;
          setMockupSide('back');
        };
        reader.readAsDataURL(file);
      }
    });

    updateMockupStage();
  }

  function orderSpotlightWhatsApp() {
    let msg = `👋 *HELLO JSM BAGS RAJAHMUNDRY!*\n`;
    msg += `I am interested in *Custom Digital Printing* on bags:\n\n`;
    msg += `*Selected Placement:* ${spotlightState.placement.toUpperCase()} SIDES\n`;
    if (spotlightState.placement === 'front' || spotlightState.placement === 'both') {
      msg += `• *Front Side:* ${spotlightState.frontText ? `"${spotlightState.frontText}"` : 'Custom Logo/Photo'}`;
      if (spotlightState.frontPhotoName) msg += ` (File: ${spotlightState.frontPhotoName})`;
      msg += `\n`;
    }
    if (spotlightState.placement === 'back' || spotlightState.placement === 'both') {
      msg += `• *Back Side:* ${spotlightState.backText ? `"${spotlightState.backText}"` : 'Custom Quote/Details'}`;
      if (spotlightState.backPhotoName) msg += ` (File: ${spotlightState.backPhotoName})`;
      msg += `\n`;
    }
    msg += `\nPlease share bag recommendations, digital sample preview & bulk/wholesale quote.\n`;
    msg += `🏭 *Factory Unit:* Maya bazar, Innespeta, Rajamahendravaram`;

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=` + encodeURIComponent(msg);
    window.open(url, '_blank');
  }

  // ---------- 10. Initialization ----------
  function init() {
    renderCategoryVisualGrid();
    updateCartUI();
    initSpotlightStage();

    // Drawer search input
    $('drawerSearchInput')?.addEventListener('input', e => {
      state.searchQuery = e.target.value.trim();
      if (state.searchQuery) {
        closeMobileNav();
        showCategoryView('All');
      }
    });

    // Category page filter controls
    $('catColorFilterSelect')?.addEventListener('change', e => {
      state.activeColorFilter = e.target.value;
      renderCategoryPage();
    });

    $('catSortSelect')?.addEventListener('change', e => {
      state.sortBy = e.target.value;
      renderCategoryPage();
    });

    // Search input
    $('searchInput')?.addEventListener('input', e => {
      state.searchQuery = e.target.value.trim();
      if (state.searchQuery) {
        showCategoryView(state.activeCategory === 'All' ? 'All' : state.activeCategory);
      } else {
        renderCategoryPage();
      }
    });

    // Cart Drawer triggers
    $('cartBtn')?.addEventListener('click', openCartDrawer);
    $('cartDrawerClose')?.addEventListener('click', closeCartDrawer);
    $('cartDrawerOverlay')?.addEventListener('click', closeCartDrawer);
    $('cartCheckoutWhatsApp')?.addEventListener('click', checkoutWhatsApp);

    // Modal close triggers
    $('modalCloseBtn')?.addEventListener('click', closeModal);
    $('modalOverlay')?.addEventListener('click', e => {
      if (e.target === $('modalOverlay')) closeModal();
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
      $('siteHeader')?.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Keyboard ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal();
        closeProfileModal();
        closeCartDrawer();
        closeMobileNav();
      }
    });

    // Coupon enter key listener
    $('couponCodeInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCoupon();
      }
    });

    // Dynamic initial catalog fetch
    loadDynamicCategoryProducts('All');
    loadDynamicCategories();
    loadStoreSettings();

    // Hash routing
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  // Expose API on window.jsmApp
  window.jsmApp = {
    navigateToHome,
    navigateToCategory,
    navigateToWholesale,
    navigateToCustomPrinting,
    navigateToExportDesk,
    addToCart,
    changeCartQty,
    removeCartItem,
    openCartDrawer,
    closeCartDrawer,
    checkoutWhatsApp,
    directOrderWhatsApp,
    openExportInquiryWhatsApp,
    openModal,
    closeModal,
    openProfileModal,
    closeProfileModal,
    openMobileNav,
    closeMobileNav,
    setSpotlightPlacement,
    setMockupSide,
    orderSpotlightWhatsApp,
    setModalColor,
    setModalSize,
    setModalTier,
    setModalPrintPlacement,
    addModalToCart,
    orderModalWhatsApp,
    setOrderTier,
    setCardSize,
    applyCoupon,
    removeCoupon,
    refreshDynamicCatalog,
    loadStoreSettingsAndAnnouncement: loadStoreSettings,
    showToast,
    filterCategory: function (cat) {
      navigateToCategory(cat);
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();
