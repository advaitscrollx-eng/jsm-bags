/* ==========================================================================
   JSM BAGS - SECURE ADMIN DASHBOARD & CATALOG MANAGER (V2)
   Complete SaaS Dashboard with 7 Tabs:
   1. Overview
   2. Products (Manage Catalog, Search, Filter, Sort, Status Toggle, Price Edit)
   3. Add / Edit Product (Full attributes, Multi-size manager, Image WebP compression)
   4. Categories (19 Catalog Categories)
   5. Coupons (Create, Edit, Min-purchase, Expiry, Toggle)
   6. Store Settings (Store Name, Phone, WhatsApp, Address, Announcement)
   7. Account / Logout
   ========================================================================== */

(function () {
  'use strict';

  // 19 Standard Bag Categories matching JSM Bags Catalog
  const ALL_19_CATEGORIES = [
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

  // Admin State
  const adminState = {
    currentTab: 'overview',
    filterCategory: 'All',
    filterStatus: 'all', // 'all', 'active', 'inactive'
    filterColor: 'all', // 'all' or color name
    sortBy: 'newest', // 'newest', 'price-low', 'price-high', 'name'
    searchQuery: '',
    productsList: [],
    couponsList: [],
    categoriesList: [],
    editingProductId: null,
    editingProductData: null,
    pendingCompressedBlob: null,
    pendingCompressedStats: null,
    pendingExtraFiles: [],
    isLoading: false
  };

  const $ = id => document.getElementById(id);
  const rupees = n => '₹' + Number(n).toLocaleString('en-IN');

  function showToast(msg) {
    if (window.jsmApp && typeof window.jsmApp.showToast === 'function') {
      window.jsmApp.showToast(msg);
    } else {
      const t = $('toastNotice');
      if (t) {
        t.querySelector('.toast-msg').textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
      }
    }
  }

  /* ==========================================================================
     1. AUTHENTICATION & DASHBOARD CONTROLLER
     ========================================================================== */

  async function openLoginOrDashboard() {
    const session = await window.jsmSupabase.getAdminSession();
    if (session) {
      openAdminDashboard();
    } else {
      openLoginModal();
    }
  }

  function openLoginModal() {
    const modal = $('adminLoginModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const emailInput = $('adminLoginEmail');
    if (emailInput && !emailInput.value) {
      emailInput.value = window.jsmSupabase.config.defaultEmail;
    }
    const errBox = $('adminLoginError');
    if (errBox) errBox.style.display = 'none';

    setTimeout(() => {
      $('adminLoginPassword')?.focus();
    }, 100);
  }

  function closeLoginModal() {
    const modal = $('adminLoginModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    const errBox = $('adminLoginError');
    if (errBox) errBox.style.display = 'none';
  }

  async function handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const email = $('adminLoginEmail')?.value?.trim() || window.jsmSupabase.config.defaultEmail;
    const password = $('adminLoginPassword')?.value;
    const btn = $('adminLoginBtn');
    const errBox = $('adminLoginError');

    if (!password) {
      if (errBox) {
        errBox.textContent = 'Please enter your admin password.';
        errBox.style.display = 'block';
      }
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="admin-spinner"></span> Authenticating...';
    }
    if (errBox) errBox.style.display = 'none';

    try {
      await window.jsmSupabase.signInAdmin(email, password);
      closeLoginModal();
      openAdminDashboard();
      showToast('Welcome back, Admin!');
    } catch (err) {
      console.error('Supabase Login Error:', err);
      if (errBox) {
        if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
          errBox.innerHTML = '<strong>Connection Error:</strong> Browser was unable to reach Supabase. Please do a hard refresh (Ctrl + F5) to load the updated connection settings.';
        } else {
          errBox.textContent = err.message || 'Incorrect password or authentication error.';
        }
        errBox.style.display = 'block';
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Sign In to Dashboard';
      }
    }
  }

  function togglePasswordVisibility() {
    const passInput = $('adminLoginPassword');
    const eyeBtn = $('togglePassBtn');
    if (!passInput) return;
    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (eyeBtn) eyeBtn.textContent = '🙈';
    } else {
      passInput.type = 'password';
      if (eyeBtn) eyeBtn.textContent = '👁️';
    }
  }

  async function handleLogout() {
    const confirmLogout = confirm('Are you sure you want to sign out of the Admin Dashboard?');
    if (!confirmLogout) return;

    await window.jsmSupabase.signOutAdmin();
    closeAdminDashboard();
    showToast('Signed out of Admin Dashboard.');
  }

  async function openAdminDashboard() {
    const dash = $('adminDashboardModal');
    if (!dash) return;
    dash.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Populate Category select elements
    populateCategoryDropdowns();

    // Set user email display
    const session = await window.jsmSupabase.getAdminSession();
    const email = session?.user?.email || window.jsmSupabase.config.defaultEmail;
    if ($('adminSessionEmailDisplay')) $('adminSessionEmailDisplay').textContent = email;
    if ($('accountEmailDisplay')) $('accountEmailDisplay').textContent = email;

    // Load initial tab
    switchTab(adminState.currentTab || 'overview');
  }

  function closeAdminDashboard() {
    const dash = $('adminDashboardModal');
    if (!dash) return;
    dash.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Switch between the 7 tabs
  function switchTab(tabKey) {
    adminState.currentTab = tabKey;

    // Update sidebar navigation pills
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabKey);
    });

    // Hide all panes
    const panes = {
      overview: $('paneOverview'),
      products: $('paneProducts'),
      addProduct: $('paneAddProduct'),
      categories: $('paneCategories'),
      coupons: $('paneCoupons'),
      settings: $('paneSettings'),
      account: $('paneAccount')
    };

    Object.keys(panes).forEach(k => {
      if (panes[k]) panes[k].style.display = k === tabKey ? 'block' : 'none';
    });

    // Tab-specific initializers
    if (tabKey === 'overview') {
      loadOverviewMetrics();
    } else if (tabKey === 'products') {
      loadAdminProducts();
    } else if (tabKey === 'addProduct' && !adminState.editingProductId) {
      resetProductForm();
    } else if (tabKey === 'categories') {
      loadAdminCategories();
    } else if (tabKey === 'coupons') {
      loadAdminCoupons();
    } else if (tabKey === 'settings') {
      loadStoreSettings();
    }
  }

  function populateCategoryDropdowns() {
    const list = (adminState.categoriesList && adminState.categoriesList.length > 0)
      ? adminState.categoriesList.map(c => c.name)
      : (window.CATEGORIES && window.CATEGORIES.length > 0)
        ? window.CATEGORIES.map(c => c.name)
        : ALL_19_CATEGORIES;

    const catSelect = $('prodCategory');
    if (catSelect) {
      const curVal = catSelect.value;
      catSelect.innerHTML = '<option value="" disabled selected>Select from Categories...</option>' +
        list.map(c => `<option value="${c}">${c}</option>`).join('');
      if (curVal) catSelect.value = curVal;
    }

    const filterSelect = $('adminFilterCategorySelect');
    if (filterSelect) {
      const curFilter = filterSelect.value || 'All';
      filterSelect.innerHTML = `<option value="All">All Categories (${list.length} Total)</option>` +
        list.map(c => `<option value="${c}">${c}</option>`).join('');
      filterSelect.value = curFilter;
    }
  }

  /* ==========================================================================
     2. TAB 1: OVERVIEW METRICS & RECENT ACTIVITY
     ========================================================================== */

  async function loadOverviewMetrics() {
    // 1. Fetch products & coupons in parallel
    const [prodRes, coupRes] = await Promise.all([
      window.jsmSupabase.fetchAllProducts(),
      window.jsmSupabase.fetchAllCoupons()
    ]);

    const products = prodRes.data || [];
    const coupons = coupRes.data || [];
    adminState.productsList = products;
    adminState.couponsList = coupons;

    // 2. Compute metrics
    const totalCount = products.length;
    const activeCount = products.filter(p => p.is_active !== false).length;
    const activeCoupons = coupons.filter(c => c.is_active).length;
    const inactiveCoupons = coupons.filter(c => !c.is_active).length;
    const estimatedMB = ((totalCount * 140) / 1024).toFixed(1);

    if ($('overviewTotalProducts')) $('overviewTotalProducts').textContent = totalCount;
    if ($('overviewActiveProducts')) $('overviewActiveProducts').textContent = activeCount;
    if ($('overviewTotalCategories')) $('overviewTotalCategories').textContent = ALL_19_CATEGORIES.length;
    if ($('overviewActiveCoupons')) $('overviewActiveCoupons').textContent = activeCoupons;
    if ($('overviewInactiveCoupons')) $('overviewInactiveCoupons').textContent = `${inactiveCoupons} inactive`;
    if ($('overviewStorageUsed')) $('overviewStorageUsed').textContent = `${estimatedMB} MB`;

    // 3. Render recent products activity (top 5)
    const recentBody = $('overviewRecentProductsBody');
    if (recentBody) {
      if (products.length === 0) {
        recentBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center; padding: 24px; color: #64748B;">
              No products found in database yet. Click "+ Add New Product" to publish your first bag.
            </td>
          </tr>`;
      } else {
        const top5 = products.slice(0, 5);
        recentBody.innerHTML = top5.map(p => `
          <tr>
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${p.image_url}" alt="${p.name}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px; border: 1px solid #E2E8F0;" />
                <strong style="color: #0F172A;">${p.name}</strong>
              </div>
            </td>
            <td><span class="admin-cat-pill">${p.category}</span></td>
            <td><strong>${rupees(p.price)}</strong></td>
            <td>
              <span class="admin-status-badge ${p.is_active !== false ? 'active' : 'inactive'}">
                ${p.is_active !== false ? '● Active' : '○ Hidden'}
              </span>
            </td>
            <td style="color: #64748B; font-size: 0.8125rem;">
              ${new Date(p.updated_at || p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td>
              <button type="button" class="admin-btn-secondary-sm" onclick="window.jsmAdmin.startEditProduct('${p.id}')">
                Edit
              </button>
            </td>
          </tr>
        `).join('');
      }
    }
  }

  /* ==========================================================================
     3. TAB 2: PRODUCTS MANAGER (SEARCH, FILTER, SORT, INLINE ACTIONS)
     ========================================================================== */

  async function loadAdminProducts() {
    const container = $('adminProductsContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <div class="admin-spinner" style="margin: 0 auto 12px; width: 24px; height: 24px;"></div>
        <p>Loading catalog from Supabase...</p>
      </div>`;

    const { data: products, error } = await window.jsmSupabase.fetchAllProducts();

    if (error) {
      container.innerHTML = `
        <div class="admin-alert-box error">
          <h4>Could not fetch products from Supabase</h4>
          <p>${error.message}</p>
          <p style="margin-top: 8px; font-size: 0.8125rem;">
            Ensure you have run <code>supabase-migration-v2.sql</code> in your Supabase SQL editor.
          </p>
        </div>`;
      return;
    }

    adminState.productsList = products || [];

    // Populate Color Filter select
    const colorSelect = $('adminFilterColorSelect');
    if (colorSelect) {
      const allColors = new Set();
      adminState.productsList.forEach(p => {
        if (Array.isArray(p.colours)) {
          p.colours.forEach(c => {
            if (c.name) allColors.add(c.name.trim());
          });
        }
      });
      const curColor = colorSelect.value || 'all';
      colorSelect.innerHTML = '<option value="all">All Colours</option>' +
        Array.from(allColors).sort().map(c => `<option value="${c}">${c}</option>`).join('');
      colorSelect.value = curColor;
    }

    renderFilteredProducts();
  }

  function renderFilteredProducts() {
    const container = $('adminProductsContainer');
    if (!container) return;

    let items = [...adminState.productsList];

    // Filter Category
    if (adminState.filterCategory && adminState.filterCategory !== 'All') {
      items = items.filter(p => p.category === adminState.filterCategory);
    }

    // Filter Status
    if (adminState.filterStatus === 'active') {
      items = items.filter(p => p.is_active !== false);
    } else if (adminState.filterStatus === 'inactive') {
      items = items.filter(p => p.is_active === false);
    }

    // Filter Colour
    if (adminState.filterColor && adminState.filterColor !== 'all') {
      const fc = adminState.filterColor.toLowerCase();
      items = items.filter(p => {
        if (!Array.isArray(p.colours)) return false;
        return p.colours.some(c => (c.name && c.name.toLowerCase() === fc) || (c.hex && c.hex.toLowerCase() === fc));
      });
    }

    // Filter Search
    if (adminState.searchQuery) {
      const q = adminState.searchQuery.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // Sort
    if (adminState.sortBy === 'price-low') {
      items.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (adminState.sortBy === 'price-high') {
      items.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (adminState.sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Newest
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; background: #FFFFFF; border-radius: 12px; border: 1px dashed #CBD5E1;">
          <p style="font-size: 1.125rem; font-weight: 700; color: #0F172A;">No products match your filter criteria</p>
          <p style="font-size: 0.875rem; color: #64748B; margin: 6px 0 16px;">Try clearing filters or click "+ Add New Product" to create one.</p>
          <button type="button" class="admin-btn-primary" onclick="window.jsmAdmin.switchTab('addProduct')">+ Add New Product</button>
        </div>`;
      return;
    }

    container.innerHTML = items.map(p => {
      const sizeList = Array.isArray(p.sizes) && p.sizes.length > 0
        ? p.sizes.map(s => typeof s === 'string' ? s : s.name).join(', ')
        : 'Standard size';

      const colourSwatches = Array.isArray(p.colours) && p.colours.length > 0
        ? `<div style="display:flex; gap:5px; margin-top:5px; align-items:center;">
             <span style="font-size:0.75rem; color:#64748B;">Colours:</span>
             ${p.colours.map(c => `<span style="display:inline-block; width:13px; height:13px; border-radius:50%; background:${c.hex || '#1E3A8A'}; border:1px solid #CBD5E1;" title="${c.name}"></span>`).join('')}
             <span style="font-size:0.75rem; color:#64748B; font-weight:600;">(${p.colours.length})</span>
           </div>`
        : '';

      const skuText = p.sku ? `<span style="font-size:0.75rem; color:#64748B;">• SKU: <code>${p.sku}</code></span>` : '';
      const stockBadge = p.stock_quantity !== undefined && p.stock_quantity !== null
        ? `<span style="font-size: 0.6875rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${p.stock_quantity > 0 ? '#DCFCE7' : '#FEE2E2'}; color: ${p.stock_quantity > 0 ? '#166534' : '#DC2626'};">Stock: ${p.stock_quantity}</span>`
        : '';
      const featuredBadge = p.is_featured
        ? `<span style="font-size: 0.6875rem; font-weight: 700; background: #FEF3C7; color: #B45309; padding: 2px 6px; border-radius: 4px;">⭐ Featured</span>`
        : '';

      return `
        <div class="admin-product-row ${p.is_active === false ? 'inactive-row' : ''}" id="admin-prod-${p.id}" style="${p.is_active === false ? 'opacity: 0.68;' : ''}">
          <div class="admin-prod-thumb-box">
            <img src="${p.image_url}" alt="${p.name}" class="admin-prod-thumb" loading="lazy" />
            <span class="admin-webp-pill">WebP</span>
          </div>

          <div class="admin-prod-details">
            <div class="admin-prod-meta">
              <span class="admin-cat-pill">${p.category}</span>
              ${p.subcategory ? `<span style="font-size:0.75rem; color:#64748B;">• ${p.subcategory}</span>` : ''}
              ${skuText}
              ${featuredBadge}
              ${stockBadge}
              ${p.badge ? `<span style="font-size: 0.6875rem; font-weight: 700; background: #E0E7FF; color: #3730A3; padding: 2px 6px; border-radius: 4px;">${p.badge}</span>` : ''}
              <span class="admin-status-badge ${p.is_active !== false ? 'active' : 'inactive'}">
                ${p.is_active !== false ? '● Active' : '○ Hidden'}
              </span>
            </div>
            <h4 class="admin-prod-title">${p.name}</h4>
            <div style="font-size: 0.75rem; color: #64748B; margin-top: 2px;">
              Sizes: <strong>${sizeList}</strong>
            </div>
            ${colourSwatches}
          </div>

          <!-- Inline Quick Price Editor -->
          <div class="admin-price-editor">
            <label for="price-input-${p.id}" class="admin-input-label">Retail Price (₹):</label>
            <div class="admin-price-input-group">
              <span class="admin-currency-prefix">₹</span>
              <input type="number" id="price-input-${p.id}" class="admin-price-input" value="${p.price}" min="1" step="1" />
              <button type="button" class="admin-btn-save-price" onclick="window.jsmAdmin.savePrice('${p.id}')" title="Save new price">
                Save
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="admin-prod-actions">
            <button type="button" class="admin-action-btn edit-btn" onclick="window.jsmAdmin.startEditProduct('${p.id}')" title="Full edit product">
              ✏️ Edit
            </button>
            <button type="button" class="admin-action-btn toggle-status-btn" onclick="window.jsmAdmin.toggleProductActive('${p.id}', ${p.is_active === false})" title="${p.is_active === false ? 'Publish to storefront' : 'Hide from storefront'}">
              ${p.is_active === false ? '👁️ Publish' : '🚫 Hide'}
            </button>
            <button type="button" class="admin-action-btn delete-bag-btn" onclick="window.jsmAdmin.deleteBag('${p.id}', '${p.storage_path}', '${encodeURIComponent(p.name)}')" title="Delete from catalog & storage">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Quick Price Save
  async function savePrice(productId) {
    const input = $(`price-input-${productId}`);
    if (!input) return;

    const newPrice = input.value;
    if (!newPrice || Number(newPrice) <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    const row = $(`admin-prod-${productId}`);
    const saveBtn = row?.querySelector('.admin-btn-save-price');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = '...';
    }

    try {
      await window.jsmSupabase.updateProductPrice(productId, newPrice);
      showToast(`Price updated to ₹${Number(newPrice).toLocaleString('en-IN')}`);

      // Update in local state
      const target = adminState.productsList.find(p => p.id === productId);
      if (target) target.price = Number(newPrice);

      if (saveBtn) {
        saveBtn.textContent = '✓ Saved';
        saveBtn.style.background = '#059669';
        setTimeout(() => {
          saveBtn.textContent = 'Save';
          saveBtn.style.background = '';
          saveBtn.disabled = false;
        }, 1500);
      }

      window.jsmApp?.refreshDynamicCatalog?.();
    } catch (err) {
      alert(`Could not update price: ${err.message}`);
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    }
  }

  // Toggle Product Active / Hidden
  async function toggleProductActive(productId, makeActive) {
    const target = adminState.productsList.find(p => p.id === productId);
    const actionName = makeActive ? 'publish' : 'hide';

    if (!confirm(`Are you sure you want to ${actionName} "${target?.name || 'this product'}"?`)) return;

    try {
      await window.jsmSupabase.toggleProductStatus(productId, makeActive);
      showToast(`Product is now ${makeActive ? 'Active on Storefront' : 'Hidden from customers'}.`);

      if (target) target.is_active = makeActive;
      renderFilteredProducts();
      window.jsmApp?.refreshDynamicCatalog?.();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  }

  // Delete product with confirmation dialog
  async function deleteBag(productId, storagePath, encodedName) {
    const bagName = decodeURIComponent(encodedName || 'this bag');
    const confirmDelete = confirm(
      `Are you sure you want to permanently delete "${bagName}"?\n\n` +
      `• The bag will be removed from your Supabase catalog.\n` +
      `• Its photos will be cleaned up from Supabase Storage.\n` +
      `• This action cannot be undone.`
    );

    if (!confirmDelete) return;

    const row = $(`admin-prod-${productId}`);
    if (row) row.style.opacity = '0.4';

    try {
      await window.jsmSupabase.deleteProduct(productId, storagePath);
      showToast(`Product "${bagName}" deleted.`);

      // Remove from local state
      adminState.productsList = adminState.productsList.filter(p => p.id !== productId);
      renderFilteredProducts();
      window.jsmApp?.refreshDynamicCatalog?.();
    } catch (err) {
      alert(`Could not delete product: ${err.message}`);
      if (row) row.style.opacity = '1';
    }
  }

  /* ==========================================================================
     4. TAB 3: ADD / EDIT PRODUCT FORM CONTROLLER (SIZES, IMAGES, WEBP)
     ========================================================================== */

  function resetProductForm() {
    adminState.editingProductId = null;
    adminState.editingProductData = null;
    adminState.pendingCompressedBlob = null;
    adminState.pendingCompressedStats = null;
    adminState.pendingExtraFiles = [];
    adminState.existingGallery = [];
    adminState.removedStoragePaths = [];

    $('productManageForm')?.reset();
    if ($('editProductId')) $('editProductId').value = '';
    if ($('productFormTitle')) $('productFormTitle').textContent = 'Add New Bag Product';
    if ($('productFormSub')) $('productFormSub').textContent = 'Fill in details, upload photos, and publish to the live storefront';
    if ($('saveBtnText')) $('saveBtnText').textContent = 'Publish Product';
    if ($('mainImageFileLabel')) $('mainImageFileLabel').textContent = 'Main Product Image (.jpg, .png, .webp) *';
    if ($('prodMainImageFile')) $('prodMainImageFile').required = true;
    if ($('prodBrand')) $('prodBrand').value = 'JSM Bags';
    if ($('prodStockQuantity')) $('prodStockQuantity').value = 100;
    if ($('prodIsFeatured')) $('prodIsFeatured').checked = false;

    if ($('productImagePreviewContainer')) $('productImagePreviewContainer').style.display = 'none';
    if ($('editExistingImagesBox')) $('editExistingImagesBox').style.display = 'none';
    if ($('galleryPreviewDeck')) $('galleryPreviewDeck').innerHTML = '';
    if ($('existingImagesList')) $('existingImagesList').innerHTML = '';

    // Clear colours list
    const coloursList = $('productColoursList');
    if (coloursList) coloursList.innerHTML = '';

    // Clear sizes list
    const sizesList = $('productSizesList');
    if (sizesList) {
      sizesList.innerHTML = '';
    }

    // Clear variants list
    const variantsList = $('productVariantsList');
    if (variantsList) variantsList.innerHTML = '';
  }

  // --- 1. SIZES MANAGER ---
  function addSizeRow(name = '', capacity = '', priceOffset = 0) {
    const list = $('productSizesList');
    if (!list) return;

    const rowId = 'size-row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const div = document.createElement('div');
    div.className = 'admin-size-row';
    div.id = rowId;
    div.innerHTML = `
      <input type="text" class="admin-input size-name-input" placeholder="Size Name (e.g. 10x12, 14 inch, Medium)" value="${name}" />
      <input type="text" class="admin-input size-cap-input" placeholder="Capacity / Dimensions (e.g. Holds 5kg)" value="${capacity}" />
      <input type="number" class="admin-input size-offset-input" placeholder="Price offset (₹)" value="${priceOffset}" step="1" title="Price offset relative to base retail price" />
      <button type="button" class="admin-size-del-btn" onclick="document.getElementById('${rowId}').remove()" title="Remove size">✕</button>
    `;
    list.appendChild(div);
  }

  function getSizesFromForm() {
    const rows = document.querySelectorAll('#productSizesList .admin-size-row');
    const sizes = [];
    rows.forEach(r => {
      const name = r.querySelector('.size-name-input')?.value?.trim();
      const cap = r.querySelector('.size-cap-input')?.value?.trim();
      const offset = Number(r.querySelector('.size-offset-input')?.value) || 0;
      if (name) {
        sizes.push({
          name: name,
          capacity: cap || 'Standard Dimensions',
          priceOffset: offset
        });
      }
    });
    return sizes;
  }

  // --- 2. COLOURS MANAGER WITH WEBP CONVERSION ---
  function addColorRow(name = '', hex = '#1E3A8A', photoUrl = '', isActive = true, storagePath = null) {
    const list = $('productColoursList');
    if (!list) return;

    const rowId = 'color-row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const div = document.createElement('div');
    div.className = 'admin-colour-row';
    div.id = rowId;
    div.dataset.photoUrl = photoUrl || '';
    div.dataset.imageUrl = photoUrl || '';
    div.dataset.storagePath = storagePath || '';

    div.innerHTML = `
      <input type="text" class="admin-input color-name-input" placeholder="Colour (e.g. Royal Blue, Beige)" value="${name}" />
      <div class="admin-colour-picker-wrap">
        <input type="color" class="admin-colour-swatch color-picker-input" value="${hex.startsWith('#') && hex.length === 7 ? hex : '#1E3A8A'}" title="Pick colour" />
        <input type="text" class="admin-input color-hex-input" placeholder="#1E3A8A" value="${hex}" maxlength="7" style="font-family: monospace; font-size: 0.8125rem;" />
      </div>
      <div class="admin-colour-photo-wrap">
        <input type="file" class="admin-file-input color-photo-input" accept="image/jpeg,image/png,image/webp" style="font-size: 0.75rem; padding: 4px;" title="Optional photo for this colour" />
        <img class="admin-colour-thumb" src="${photoUrl || 'assets/images/placeholder-product.svg'}" alt="Preview" style="${photoUrl ? '' : 'display:none;'}" />
      </div>
      <label class="admin-toggle-label" style="font-size: 0.75rem;">
        <input type="checkbox" class="color-active-input" ${isActive ? 'checked' : ''} />
        <span>Active</span>
      </label>
      <button type="button" class="admin-size-del-btn" onclick="document.getElementById('${rowId}').remove()" title="Remove colour">✕</button>
    `;

    // Hook two-way sync for color picker and hex text
    const colorPicker = div.querySelector('.color-picker-input');
    const hexInput = div.querySelector('.color-hex-input');
    colorPicker?.addEventListener('input', e => {
      hexInput.value = e.target.value.toUpperCase();
    });
    hexInput?.addEventListener('input', e => {
      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
        colorPicker.value = e.target.value;
      }
    });

    // Hook photo compression preview on file select
    const fileInput = div.querySelector('.color-photo-input');
    const thumbImg = div.querySelector('.admin-colour-thumb');
    fileInput?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const comp = await window.jsmSupabase.compressImageToWebP(file, 800, 0.80);
          div._pendingColorBlob = comp.blob;
          div._pendingColorStats = comp;
          if (thumbImg) {
            thumbImg.src = comp.previewUrl;
            thumbImg.style.display = 'block';
          }
          showToast(`Compressed colour photo: ${comp.savedPercent}% saved (${comp.compressedSizeKB} KB WebP)`);
        } catch (err) {
          console.error('Colour photo compression error:', err);
        }
      }
    });

    list.appendChild(div);
  }

  function getColoursFromForm() {
    const rows = document.querySelectorAll('#productColoursList .admin-colour-row');
    const colours = [];
    rows.forEach(r => {
      const name = r.querySelector('.color-name-input')?.value?.trim();
      const hex = r.querySelector('.color-hex-input')?.value?.trim() || '#1E3A8A';
      const isActive = r.querySelector('.color-active-input')?.checked !== false;
      const existingUrl = r.dataset.imageUrl || r.dataset.photoUrl || '';
      const existingStoragePath = r.dataset.storagePath || null;
      const pendingBlob = r._pendingColorBlob || null;

      if (name) {
        colours.push({
          name,
          hex,
          is_active: isActive,
          image_url: existingUrl,
          photo_url: existingUrl,
          storage_path: existingStoragePath,
          pendingBlob
        });
      }
    });
    return colours;
  }

  // --- 3. VARIANT COMBINATIONS & PRICING MATRIX ---
  function addVariantRow(color = '', size = '', price = '', mrp = '', inStock = true) {
    const list = $('productVariantsList');
    if (!list) return;

    const rowId = 'variant-row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const div = document.createElement('div');
    div.className = 'admin-variant-row';
    div.id = rowId;

    div.innerHTML = `
      <input type="text" class="admin-input variant-color-input" placeholder="Colour" value="${color}" />
      <input type="text" class="admin-input variant-size-input" placeholder="Size (e.g. 10x12)" value="${size}" />
      <input type="number" class="admin-input variant-price-input" placeholder="Price (₹)" value="${price}" min="0" step="1" title="Custom price for this variant" />
      <input type="number" class="admin-input variant-mrp-input" placeholder="MRP (₹)" value="${mrp}" min="0" step="1" title="Optional MRP" />
      <label class="admin-toggle-label" style="font-size: 0.75rem;">
        <input type="checkbox" class="variant-stock-input" ${inStock ? 'checked' : ''} />
        <span>In Stock</span>
      </label>
      <button type="button" class="admin-size-del-btn" onclick="document.getElementById('${rowId}').remove()" title="Remove variant">✕</button>
    `;
    list.appendChild(div);
  }

  function generateVariantCombinations() {
    const colours = getColoursFromForm().filter(c => c.is_active);
    const sizes = getSizesFromForm();
    const basePrice = Number($('prodRetailPrice')?.value) || 0;

    if (colours.length === 0 && sizes.length === 0) {
      alert('Please add at least one Colour or Size option first before auto-generating combinations.');
      return;
    }

    const list = $('productVariantsList');
    if (!list) return;
    list.innerHTML = '';

    // If both colours and sizes exist: generate Matrix
    if (colours.length > 0 && sizes.length > 0) {
      colours.forEach(c => {
        sizes.forEach(s => {
          const effectivePrice = basePrice + (s.priceOffset || 0);
          addVariantRow(c.name, s.name, effectivePrice > 0 ? effectivePrice : '', '', true);
        });
      });
      showToast(`Generated ${colours.length * sizes.length} variant combinations!`);
    } else if (colours.length > 0) {
      colours.forEach(c => {
        addVariantRow(c.name, 'All Sizes', basePrice > 0 ? basePrice : '', '', true);
      });
      showToast(`Generated ${colours.length} colour variants!`);
    } else if (sizes.length > 0) {
      sizes.forEach(s => {
        const effectivePrice = basePrice + (s.priceOffset || 0);
        addVariantRow('All Colours', s.name, effectivePrice > 0 ? effectivePrice : '', '', true);
      });
      showToast(`Generated ${sizes.length} size variants!`);
    }
  }

  function getVariantsFromForm() {
    const rows = document.querySelectorAll('#productVariantsList .admin-variant-row');
    const variants = [];
    rows.forEach(r => {
      const color = r.querySelector('.variant-color-input')?.value?.trim();
      const size = r.querySelector('.variant-size-input')?.value?.trim();
      const priceStr = r.querySelector('.variant-price-input')?.value?.trim();
      const mrpStr = r.querySelector('.variant-mrp-input')?.value?.trim();
      const inStock = r.querySelector('.variant-stock-input')?.checked !== false;

      if (color || size) {
        variants.push({
          color: color || 'Standard',
          size: size || 'Standard',
          price: priceStr ? Number(priceStr) : null,
          original_price: mrpStr ? Number(mrpStr) : null,
          in_stock: inStock
        });
      }
    });
    return variants;
  }

  // --- 4. IMAGE HANDLING & WEBP PREVIEW ---
  async function handleMainImageSelect(e) {
    const file = e.target.files?.[0];
    const previewContainer = $('productImagePreviewContainer');
    const previewImg = $('productMainPreviewImg');
    const previewStats = $('productCompressionStats');

    if (!file) {
      adminState.pendingCompressedBlob = null;
      adminState.pendingCompressedStats = null;
      if (previewContainer) previewContainer.style.display = 'none';
      return;
    }

    try {
      if (previewContainer) previewContainer.style.display = 'block';
      if (previewStats) previewStats.innerHTML = '<span class="admin-spinner"></span> Compressing main photo to WebP in browser...';

      const compressed = await window.jsmSupabase.compressImageToWebP(file, 1200, 0.80);
      adminState.pendingCompressedBlob = compressed.blob;
      adminState.pendingCompressedStats = compressed;

      if (previewImg) previewImg.src = compressed.previewUrl;
      if (previewStats) {
        previewStats.innerHTML = `
          <div class="compress-badge-row">
            <span class="badge-tag webp-tag">Auto-Compressed WebP</span>
            <span class="badge-tag saved-tag">${compressed.savedPercent}% Smaller</span>
          </div>
          <p class="compress-stat-line">
            Original: <strong>${compressed.originalSizeKB} KB</strong> &rarr; WebP: <strong>${compressed.compressedSizeKB} KB</strong> (${compressed.width}&times;${compressed.height}px)
          </p>
          <p class="compress-notice-line">Ready for zero-cost Supabase Storage upload (~120KB avg).</p>
        `;
      }
    } catch (err) {
      adminState.pendingCompressedBlob = null;
      adminState.pendingCompressedStats = null;
      if (previewStats) {
        previewStats.innerHTML = `<span style="color:#DC2626;">Compression notice: ${err.message}</span>`;
      }
    }
  }

  async function handleExtraImagesSelect(e) {
    const files = Array.from(e.target.files || []);
    const deck = $('galleryPreviewDeck');
    if (!files.length) return;

    for (const file of files) {
      try {
        const comp = await window.jsmSupabase.compressImageToWebP(file, 1200, 0.80);
        adminState.pendingExtraFiles.push(comp.blob);

        const cardId = 'gal-card-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
        const card = document.createElement('div');
        card.className = 'admin-gallery-card';
        card.id = cardId;
        card.innerHTML = `
          <img src="${comp.previewUrl}" alt="Gallery Preview" />
          <div class="gallery-stats">${comp.compressedSizeKB} KB WebP (-${comp.savedPercent}%)</div>
          <div class="gallery-actions">
            <button type="button" class="del-btn" title="Remove image">Remove</button>
          </div>
        `;
        card.querySelector('.del-btn')?.addEventListener('click', () => {
          const idx = adminState.pendingExtraFiles.indexOf(comp.blob);
          if (idx !== -1) adminState.pendingExtraFiles.splice(idx, 1);
          card.remove();
        });
        deck?.appendChild(card);
      } catch (err) {
        console.error('Error compressing gallery photo:', err);
      }
    }
  }

  // --- 5. EDIT PRODUCT MODE ---
  function renderExistingGalleryUI() {
    const existingBox = $('editExistingImagesBox');
    const existingList = $('existingImagesList');
    if (!existingBox || !existingList) return;

    if (!adminState.existingGallery || adminState.existingGallery.length === 0) {
      existingBox.style.display = 'none';
      existingList.innerHTML = '';
      return;
    }

    existingBox.style.display = 'block';
    existingList.innerHTML = adminState.existingGallery.map((img, i) => {
      const url = typeof img === 'string' ? img : (img.url || '');
      const isMain = typeof img === 'object' ? Boolean(img.is_main) : (i === 0);
      return `
        <div style="position:relative; width:75px; height:75px; display:inline-block; margin-right:8px; margin-bottom:8px;">
          <img src="${url}" alt="Photo ${i+1}" style="width:100%; height:100%; object-fit:cover; border-radius:8px; border:1px solid #CBD5E1;" />
          ${isMain ? '<span style="position:absolute; bottom:2px; left:2px; background:#D97706; color:#fff; font-size:9px; font-weight:700; padding:1px 4px; border-radius:3px;">Main</span>' : ''}
          <button type="button" onclick="window.jsmAdmin.removeExistingGalleryImage(${i})" title="Remove photo" style="position:absolute; top:-6px; right:-6px; background:#EF4444; color:#fff; border:none; border-radius:50%; width:20px; height:20px; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 1px 3px rgba(0,0,0,0.3);">&times;</button>
        </div>
      `;
    }).join('');
  }

  function removeExistingGalleryImage(index) {
    if (!adminState.existingGallery || !adminState.existingGallery[index]) return;
    const removed = adminState.existingGallery[index];
    if (adminState.existingGallery.length === 1 && !adminState.pendingCompressedBlob && !$('prodMainImageFile')?.files?.[0]) {
      alert('A product must retain at least one photo. Please upload a replacement main image first before removing this one.');
      return;
    }

    if (typeof removed === 'object' && removed.storage_path) {
      if (!adminState.removedStoragePaths) adminState.removedStoragePaths = [];
      adminState.removedStoragePaths.push(removed.storage_path);
    }

    adminState.existingGallery.splice(index, 1);
    if (adminState.existingGallery.length > 0 && !adminState.existingGallery.some(img => img.is_main)) {
      adminState.existingGallery[0].is_main = true;
    }
    renderExistingGalleryUI();
  }

  async function startEditProduct(productId) {
    const prod = adminState.productsList.find(p => p.id === productId);
    if (!prod) return;

    adminState.editingProductId = productId;
    adminState.editingProductData = prod;
    adminState.existingGallery = [];
    adminState.removedStoragePaths = [];

    switchTab('addProduct');

    if ($('productFormTitle')) $('productFormTitle').textContent = `Edit Product: ${prod.name}`;
    if ($('productFormSub')) $('productFormSub').textContent = 'Make your changes below and click Save Changes to update Supabase';
    if ($('saveBtnText')) $('saveBtnText').textContent = 'Save Changes';
    if ($('editProductId')) $('editProductId').value = prod.id;
    if ($('mainImageFileLabel')) $('mainImageFileLabel').textContent = 'Replace Main Image (Optional)';
    if ($('prodMainImageFile')) $('prodMainImageFile').required = false;

    // Populate basic fields
    if ($('prodCategory')) $('prodCategory').value = prod.category;
    if ($('prodSubcategory')) $('prodSubcategory').value = prod.subcategory || '';
    if ($('prodName')) $('prodName').value = prod.name;
    if ($('prodSku')) $('prodSku').value = prod.sku || '';
    if ($('prodBrand')) $('prodBrand').value = prod.brand || 'JSM Bags';
    
    // Exact zero-stock preservation
    if ($('prodStockQuantity')) {
      $('prodStockQuantity').value = (prod.stock_quantity !== undefined && prod.stock_quantity !== null) ? prod.stock_quantity : 0;
    }
    
    if ($('prodDescription')) $('prodDescription').value = prod.description || '';
    if ($('prodBadge')) $('prodBadge').value = prod.badge || '';
    if ($('prodIsActive')) $('prodIsActive').checked = prod.is_active !== false;
    if ($('prodIsFeatured')) $('prodIsFeatured').checked = Boolean(prod.is_featured);

    if ($('prodRetailPrice')) $('prodRetailPrice').value = prod.price;
    if ($('prodOriginalPrice')) $('prodOriginalPrice').value = prod.original_price || '';
    if ($('prodBulkPrice')) $('prodBulkPrice').value = prod.bulk_price || '';
    if ($('prodWholesalePrice')) $('prodWholesalePrice').value = prod.wholesale_price || '';

    const moq = prod.moq || {};
    if ($('prodMoqBulk')) $('prodMoqBulk').value = moq.bulk || 50;
    if ($('prodMoqWholesale')) $('prodMoqWholesale').value = moq.wholesale || 250;

    // Populate Colours (seamless image_url and photo_url normalization)
    const coloursList = $('productColoursList');
    if (coloursList) {
      coloursList.innerHTML = '';
      if (Array.isArray(prod.colours) && prod.colours.length > 0) {
        prod.colours.forEach(c => {
          const colImg = c.image_url || c.photo_url || '';
          addColorRow(c.name, c.hex || '#1E3A8A', colImg, c.is_active !== false, c.storage_path || null);
        });
      }
    }

    // Populate Sizes
    const sizesList = $('productSizesList');
    if (sizesList) {
      sizesList.innerHTML = '';
      if (Array.isArray(prod.sizes) && prod.sizes.length > 0) {
        prod.sizes.forEach(s => {
          if (typeof s === 'string') {
            addSizeRow(s, 'Standard Dimensions', 0);
          } else {
            addSizeRow(s.name, s.capacity, s.priceOffset || 0);
          }
        });
      } else {
        addSizeRow('Standard Unit', 'Standard Dimensions', 0);
      }
    }

    // Populate Variants
    const variantsList = $('productVariantsList');
    if (variantsList) {
      variantsList.innerHTML = '';
      if (Array.isArray(prod.variants) && prod.variants.length > 0) {
        prod.variants.forEach(v => {
          addVariantRow(v.color, v.size, v.price || '', v.original_price || '', v.in_stock !== false);
        });
      }
    }

    // Normalize and render existing gallery images deck
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      adminState.existingGallery = prod.images.map((img, i) => {
        if (typeof img === 'string') {
          return { url: img, storage_path: i === 0 ? prod.storage_path : null, is_main: i === 0, display_order: i + 1 };
        }
        return {
          url: img.url,
          storage_path: img.storage_path || (img.is_main ? prod.storage_path : null),
          is_main: Boolean(img.is_main),
          display_order: img.display_order || (i + 1)
        };
      });
    } else if (prod.image_url) {
      adminState.existingGallery = [{
        url: prod.image_url,
        storage_path: prod.storage_path || null,
        is_main: true,
        display_order: 1
      }];
    }
    renderExistingGalleryUI();

    // Features
    if ($('prodFeaturesText')) {
      $('prodFeaturesText').value = Array.isArray(prod.features) ? prod.features.join('\n') : '';
    }
  }

  // --- 6. SUBMIT PRODUCT FORM (ADD OR UPDATE) ---
  async function handleProductFormSubmit(e) {
    if (e) e.preventDefault();

    const isEdit = Boolean(adminState.editingProductId);
    const category = $('prodCategory')?.value;
    const name = $('prodName')?.value?.trim();
    const price = $('prodRetailPrice')?.value;
    const mainFileInput = $('prodMainImageFile')?.files?.[0];
    const mainFile = adminState.pendingCompressedBlob || mainFileInput;
    const extraFiles = adminState.pendingExtraFiles || [];
    const submitBtn = $('productSaveBtn');

    if (!category) {
      alert('Please select a category.');
      return;
    }
    if (!name) {
      alert('Please enter a product name.');
      return;
    }
    if (!price || Number(price) <= 0) {
      alert('Please enter a valid retail price.');
      return;
    }
    if (!isEdit && !mainFile) {
      alert('Please select a main product image.');
      return;
    }

    // Stock validation (0 must be accepted, empty defaults to 100)
    let stockRaw = $('prodStockQuantity')?.value;
    if (stockRaw === undefined || stockRaw === null || (typeof stockRaw === 'string' && stockRaw.trim() === '')) {
      stockRaw = '100';
      if ($('prodStockQuantity')) $('prodStockQuantity').value = '100';
    }
    const stockQuantity = Number(stockRaw);
    if (isNaN(stockQuantity) || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
      alert('Stock quantity must be a non-negative whole number (0, 1, 2, ...). Negative or decimal values are not allowed.');
      return;
    }

    const subcategory = $('prodSubcategory')?.value?.trim() || '';
    const sku = $('prodSku')?.value?.trim() || '';
    const brand = $('prodBrand')?.value?.trim() || 'JSM Bags';
    const description = $('prodDescription')?.value?.trim() || `Authentic handcrafted ${name} directly manufactured in Rajahmundry. Available for retail, wedding gifting, and wholesale dispatch.`;
    const originalPrice = $('prodOriginalPrice')?.value ? Number($('prodOriginalPrice').value) : null;
    const bulkPrice = $('prodBulkPrice')?.value ? Number($('prodBulkPrice').value) : Math.round(Number(price) * 0.68);
    const wholesalePrice = $('prodWholesalePrice')?.value ? Number($('prodWholesalePrice').value) : Math.round(Number(price) * 0.50);
    const moqBulk = Number($('prodMoqBulk')?.value) || 50;
    const moqWholesale = Number($('prodMoqWholesale')?.value) || 250;
    const badge = $('prodBadge')?.value?.trim() || '';
    const isActive = $('prodIsActive')?.checked !== false;
    const isFeatured = $('prodIsFeatured')?.checked === true;

    // Collect Colours & upload any pending colour photo blobs
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="admin-spinner"></span> Processing photos & WebP...';
    }

    const rawColours = getColoursFromForm();
    const finalColours = [];
    for (const c of rawColours) {
      let finalUrl = c.image_url || c.photo_url || '';
      let storagePath = c.storage_path || null;
      if (c.pendingBlob) {
        try {
          const colorSlug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const upRes = await window.jsmSupabase.uploadImageFile(c.pendingBlob, category, `color-${colorSlug}`);
          finalUrl = upRes.publicUrl;
          storagePath = upRes.storagePath;
        } catch (colorUploadErr) {
          console.warn('Could not upload colour photo:', colorUploadErr);
        }
      }
      finalColours.push({
        name: c.name,
        hex: c.hex,
        is_active: c.is_active,
        image_url: finalUrl,
        photo_url: finalUrl,
        storage_path: storagePath
      });
    }

    // Auto-fallback if client did not add colours
    if (finalColours.length === 0) {
      finalColours.push({
        name: 'Standard',
        hex: '#556B2F',
        is_active: true,
        image_url: '',
        photo_url: '',
        storage_path: null
      });
    }

    let sizes = getSizesFromForm();
    // Auto-fallback if client did not add sizes
    if (!sizes || sizes.length === 0) {
      sizes = [{
        name: 'Standard Unit',
        capacity: 'Standard Dimensions',
        priceOffset: 0
      }];
    }

    const variants = getVariantsFromForm();
    const featuresRaw = $('prodFeaturesText')?.value || '';
    const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean);

    try {
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="admin-spinner"></span> Saving to Supabase...';
      }

      if (isEdit) {
        // Update product
        const updates = {
          category,
          name,
          price: Number(price),
          subcategory,
          sku,
          brand,
          stock_quantity: stockQuantity,
          description,
          original_price: originalPrice,
          bulk_price: bulkPrice,
          wholesale_price: wholesalePrice,
          moq: { retail: 1, bulk: moqBulk, wholesale: moqWholesale },
          colours: finalColours,
          sizes,
          variants,
          features,
          badge,
          images: adminState.existingGallery || [],
          is_active: isActive,
          is_featured: isFeatured
        };

        await window.jsmSupabase.updateProduct(
          adminState.editingProductId,
          updates,
          mainFile || null,
          extraFiles,
          {},
          adminState.removedStoragePaths || []
        );

        showToast(`Product "${name}" updated successfully!`);
      } else {
        // Add new product
        await window.jsmSupabase.addProduct({
          category,
          name,
          price: Number(price),
          file: mainFile,
          subcategory,
          sku,
          brand,
          stock_quantity: stockQuantity,
          description,
          original_price: originalPrice,
          bulk_price: bulkPrice,
          wholesale_price: wholesalePrice,
          moq: { retail: 1, bulk: moqBulk, wholesale: moqWholesale },
          colours: finalColours,
          sizes,
          variants,
          features,
          badge,
          additionalFiles: extraFiles,
          is_active: isActive,
          is_featured: isFeatured
        });

        showToast(`Product "${name}" published to ${category}!`);
      }

      resetProductForm();
      switchTab('products');
      window.jsmApp?.refreshDynamicCatalog?.();
    } catch (err) {
      alert(`Save operation error: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>🚀</span> <span>' + (isEdit ? 'Save Changes' : 'Publish Product') + '</span>';
      }
    }
  }

  /* ==========================================================================
     5. TAB 4: CATEGORIES MANAGEMENT (ADD, EDIT, TOGGLE, DELETE GUARD)
     ========================================================================== */

  async function loadAdminCategories() {
    const tableBody = $('adminCategoriesTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" class="table-loading-cell"><span class="admin-spinner"></span> Loading categories from Supabase...</td></tr>`;

    try {
      const res = await window.jsmSupabase.fetchCategories();
      const categories = res.data || [];
      adminState.categoriesList = categories;

      if ($('catTotalBadge')) {
        $('catTotalBadge').textContent = `${categories.length} Categories`;
      }

      populateCategoryDropdowns();

      if (categories.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #64748B;">No categories found. Add one above.</td></tr>`;
        return;
      }

      tableBody.innerHTML = categories.map((cat, idx) => {
        const bagCount = adminState.productsList.filter(p => p.category === cat.name || p.category_id === cat.id).length;
        const isActive = cat.is_active !== false;
        const statusBadge = isActive
          ? `<span class="admin-badge admin-badge-active">Active</span>`
          : `<span class="admin-badge admin-badge-inactive">Disabled</span>`;

        return `
          <tr>
            <td style="font-weight: 600; color: #64748B;">${cat.display_order ?? idx + 1}</td>
            <td><strong>${cat.name}</strong></td>
            <td><code style="font-size:0.75rem; color:#64748B;">${cat.slug || '-'}</code></td>
            <td>
              <span class="admin-badge" style="background:#F1F5F9; color:#334155;">${bagCount} Products</span>
            </td>
            <td>${statusBadge}</td>
            <td>
              <div class="admin-table-actions">
                <button type="button" class="admin-btn-action" onclick="window.jsmAdmin.filterByCat('${cat.name}')" title="Filter products in this category">
                  🔍 View
                </button>
                <button type="button" class="admin-btn-action" onclick="window.jsmAdmin.handleEditCategory('${cat.id}', '${cat.name.replace(/'/g, "\\'")}', ${cat.display_order ?? idx + 1})" title="Edit Name/Order">
                  ✏️ Edit
                </button>
                <button type="button" class="admin-btn-action" onclick="window.jsmAdmin.handleToggleCategory('${cat.id}', ${isActive})" title="Toggle Active">
                  ${isActive ? '⏸️ Disable' : '▶️ Enable'}
                </button>
                <button type="button" class="admin-btn-action danger" onclick="window.jsmAdmin.handleDeleteCategory('${cat.id}', '${cat.name.replace(/'/g, "\\'")}', ${bagCount})" title="Delete Category">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #DC2626;">Error: ${err.message}</td></tr>`;
    }
  }

  async function handleAddCategorySubmit(e) {
    if (e) e.preventDefault();
    const nameInput = $('catNameInput');
    const slugInput = $('catSlugInput');
    const orderInput = $('catOrderInput');
    const saveBtn = $('saveCategoryBtn');

    const name = nameInput?.value?.trim();
    if (!name) {
      alert('Please enter a category name.');
      return;
    }

    const slug = slugInput?.value?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const display_order = Number(orderInput?.value) || 20;

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="admin-spinner"></span> Saving...';
    }

    try {
      await window.jsmSupabase.addCategory({ name, slug, display_order, is_active: true });
      showToast(`Category "${name}" added successfully!`);
      nameInput.value = '';
      if (slugInput) slugInput.value = '';
      await loadAdminCategories();
      window.jsmApp?.loadDynamicCategories?.();
    } catch (err) {
      alert(`Could not add category: ${err.message}`);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '+ Add Category';
      }
    }
  }

  async function handleToggleCategory(catId, currentActive) {
    try {
      await window.jsmSupabase.updateCategory(catId, { is_active: !currentActive });
      showToast(`Category status updated!`);
      await loadAdminCategories();
      window.jsmApp?.loadDynamicCategories?.();
    } catch (err) {
      alert(`Could not toggle category: ${err.message}`);
    }
  }

  async function handleEditCategory(catId, currentName, currentOrder) {
    const newName = prompt('Enter new category name:', currentName);
    if (!newName || newName.trim() === '') return;
    const cleanNewName = newName.trim();
    const newOrderStr = prompt('Enter display order (number):', currentOrder);
    const newOrder = Number(newOrderStr) || currentOrder;

    try {
      await window.jsmSupabase.updateCategory(catId, {
        name: cleanNewName,
        display_order: newOrder
      }, currentName);
      showToast(`Category updated to "${cleanNewName}" and associated products updated!`);
      await loadAdminCategories();
      await loadAdminProducts();
      window.jsmApp?.loadDynamicCategories?.();
      window.jsmApp?.refreshDynamicCatalog?.();
    } catch (err) {
      alert(`Could not update category: ${err.message}`);
    }
  }

  async function handleDeleteCategory(catId, catName, bagCount) {
    if (bagCount > 0) {
      const confirmReassign = confirm(
        `Category "${catName}" has ${bagCount} product(s) currently assigned.\n\n` +
        `To safely delete this category without breaking catalog integrity, would you like to reassign these products to another category first?\n\n` +
        `Click OK to select a new category, or Cancel to abort deletion.`
      );
      if (!confirmReassign) return;

      const otherCats = (adminState.categoriesList || []).filter(c => c.name !== catName);
      if (otherCats.length === 0) {
        alert('No other category available to reassign products. Please create another category first.');
        return;
      }

      const catListText = otherCats.map((c, i) => `${i + 1}. ${c.name}`).join('\n');
      const chosenInput = prompt(`Enter the name of destination category:\n\n${catListText}`);
      if (!chosenInput || !chosenInput.trim()) return;

      const targetCat = otherCats.find(c => c.name.toLowerCase() === chosenInput.trim().toLowerCase());
      if (!targetCat) {
        alert(`Category "${chosenInput}" not recognized. Deletion cancelled.`);
        return;
      }

      try {
        await window.jsmSupabase.reassignCategoryProducts(catName, targetCat.name);
        showToast(`Reassigned ${bagCount} product(s) from "${catName}" to "${targetCat.name}".`);
      } catch (reassignErr) {
        alert(`Failed to reassign products: ${reassignErr.message}`);
        return;
      }
    } else {
      const confirmDelete = confirm(`Are you sure you want to permanently delete category "${catName}"?`);
      if (!confirmDelete) return;
    }

    try {
      await window.jsmSupabase.deleteCategory(catId, catName);
      showToast(`Category "${catName}" deleted!`);
      await loadAdminCategories();
      await loadAdminProducts();
      window.jsmApp?.loadDynamicCategories?.();
      window.jsmApp?.refreshDynamicCatalog?.();
    } catch (err) {
      alert(`Could not delete category: ${err.message}`);
    }
  }

  function filterByCat(catName) {
    adminState.filterCategory = catName;
    if ($('adminFilterCategorySelect')) $('adminFilterCategorySelect').value = catName;
    switchTab('products');
  }

  /* ==========================================================================
     6. TAB 5: COUPONS MANAGER (V2 - EXPIRY, MIN PURCHASE, EDIT)
     ========================================================================== */

  async function loadAdminCoupons() {
    const tableBody = $('adminCouponsTableBodyV2');
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="table-loading-cell">
          <div class="admin-spinner" style="margin: 0 auto 8px; width: 20px; height: 20px;"></div>
          Loading coupons from Supabase...
        </td>
      </tr>`;

    const { data: coupons, error } = await window.jsmSupabase.fetchAllCoupons();

    if (error) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 20px; color: #DC2626;">
            Failed to load coupons: ${error.message}
          </td>
        </tr>`;
      return;
    }

    adminState.couponsList = coupons || [];
    renderCouponsTableV2();
  }

  function renderCouponsTableV2() {
    const tableBody = $('adminCouponsTableBodyV2');
    if (!tableBody) return;

    if (adminState.couponsList.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 30px; color: #64748B;">
            No coupons found. Use the form above to create your first discount code.
          </td>
        </tr>`;
      return;
    }

    tableBody.innerHTML = adminState.couponsList.map(c => {
      const isExpired = c.expires_at && new Date(c.expires_at) < new Date();
      const expiryDisplay = c.expires_at
        ? new Date(c.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Never';

      const minOrder = Number(c.min_purchase) > 0 ? rupees(c.min_purchase) : 'No min.';

      return `
        <tr id="coupon-row-${c.id}">
          <td>
            <span class="admin-coupon-code">${c.code}</span>
          </td>
          <td>
            <strong style="color: #059669; font-size: 0.9375rem;">${c.discount_percent}% OFF</strong>
          </td>
          <td style="color: #475569;">${minOrder}</td>
          <td>
            <span style="${isExpired ? 'color:#DC2626; font-weight:700;' : 'color:#64748B;'}">
              ${expiryDisplay} ${isExpired ? '(Expired)' : ''}
            </span>
          </td>
          <td>
            <span class="admin-status-badge ${c.is_active && !isExpired ? 'active' : 'inactive'}">
              ${c.is_active && !isExpired ? '● Active' : '○ Inactive'}
            </span>
          </td>
          <td>
            <label class="admin-toggle-switch" title="Toggle coupon active/inactive">
              <input type="checkbox" ${c.is_active ? 'checked' : ''} onchange="window.jsmAdmin.toggleCoupon('${c.id}', this.checked)" />
              <span class="admin-toggle-slider"></span>
            </label>
          </td>
          <td>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="admin-btn-action" onclick="window.jsmAdmin.startEditCoupon('${c.id}')" title="Edit Coupon">
                ✏️ Edit
              </button>
              <button type="button" class="admin-coupon-del-btn" onclick="window.jsmAdmin.deleteCoupon('${c.id}', '${c.code}')" title="Delete coupon">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function startEditCoupon(couponId) {
    const coupon = adminState.couponsList.find(c => c.id === couponId);
    if (!coupon) return;

    if ($('editCouponId')) $('editCouponId').value = coupon.id;
    if ($('cCode')) $('cCode').value = coupon.code;
    if ($('cDiscount')) $('cDiscount').value = coupon.discount_percent;
    if ($('cMinPurchase')) $('cMinPurchase').value = coupon.min_purchase || '';
    if ($('cExpiresAt')) {
      $('cExpiresAt').value = coupon.expires_at ? coupon.expires_at.split('T')[0] : '';
    }

    if ($('couponFormTitle')) $('couponFormTitle').textContent = `Edit Coupon: ${coupon.code}`;
    if ($('saveCouponBtn')) $('saveCouponBtn').textContent = 'Update Coupon';
    if ($('cancelCouponEditBtn')) $('cancelCouponEditBtn').style.display = 'inline-block';

    $('manageCouponForm')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function cancelEditCoupon() {
    $('manageCouponForm')?.reset();
    if ($('editCouponId')) $('editCouponId').value = '';
    if ($('couponFormTitle')) $('couponFormTitle').textContent = 'Create New Promo Coupon';
    if ($('saveCouponBtn')) $('saveCouponBtn').textContent = '+ Save Coupon';
    if ($('cancelCouponEditBtn')) $('cancelCouponEditBtn').style.display = 'none';
  }

  // Create or Update Coupon Submit
  async function handleCreateCouponSubmit(e) {
    if (e) e.preventDefault();

    const editId = $('editCouponId')?.value;
    const code = $('cCode')?.value?.trim();
    const discount = $('cDiscount')?.value;
    const minPurchase = $('cMinPurchase')?.value || 0;
    const expiresAt = $('cExpiresAt')?.value ? new Date($('cExpiresAt').value).toISOString() : null;
    const submitBtn = $('saveCouponBtn');

    if (!code) {
      alert('Please enter a coupon code.');
      return;
    }
    const numDisc = Number(discount);
    if (!discount || isNaN(numDisc) || numDisc < 1 || numDisc > 100) {
      alert('Discount must be between 1% and 100%.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = editId ? 'Updating...' : 'Saving...';
    }

    try {
      if (editId) {
        await window.jsmSupabase.updateCoupon(editId, {
          code,
          discountPercent: numDisc,
          minPurchase: Number(minPurchase),
          expiresAt: expiresAt
        });
        showToast(`Coupon "${code.toUpperCase()}" updated successfully!`);
      } else {
        await window.jsmSupabase.createCoupon({
          code,
          discountPercent: numDisc,
          minPurchase: Number(minPurchase),
          expiresAt: expiresAt,
          isActive: true
        });
        showToast(`Coupon "${code.toUpperCase()}" (${numDisc}% OFF) created!`);
      }

      cancelEditCoupon();
      await loadAdminCoupons();
    } catch (err) {
      alert(`Could not ${editId ? 'update' : 'create'} coupon: ${err.message}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = editId ? 'Update Coupon' : '+ Save Coupon';
      }
    }
  }

  // Toggle Coupon Status
  async function toggleCoupon(couponId, isActive) {
    try {
      await window.jsmSupabase.toggleCouponStatus(couponId, isActive);
      showToast(`Coupon is now ${isActive ? 'Active' : 'Inactive'}.`);

      const target = adminState.couponsList.find(c => c.id === couponId);
      if (target) target.is_active = isActive;
      renderCouponsTableV2();
    } catch (err) {
      alert(`Could not toggle coupon: ${err.message}`);
      loadAdminCoupons();
    }
  }

  // Delete Coupon
  async function deleteCoupon(couponId, code) {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    try {
      await window.jsmSupabase.deleteCoupon(couponId);
      showToast(`Coupon "${code}" deleted.`);
      adminState.couponsList = adminState.couponsList.filter(c => c.id !== couponId);
      renderCouponsTableV2();
    } catch (err) {
      alert(`Could not delete coupon: ${err.message}`);
    }
  }

  /* ==========================================================================
     7. TAB 6: STORE SETTINGS
     ========================================================================== */

  async function loadStoreSettings() {
    const { data: settings } = await window.jsmSupabase.fetchStoreSettings();
    if (settings) {
      if ($('setBrandName')) $('setBrandName').value = settings.brand_name || 'JSM Bags';
      if ($('setPhone')) $('setPhone').value = settings.phone || '+91 94408 63516';
      if ($('setWhatsApp')) $('setWhatsApp').value = settings.whatsapp_number || '919440863516';
      if ($('setAddress')) $('setAddress').value = settings.address || 'Innes Peta, Rajahmundry, Andhra Pradesh - 533101, India';
      if ($('setAnnouncement')) $('setAnnouncement').value = settings.announcement || '';
      if ($('setAnnouncementEnabled')) $('setAnnouncementEnabled').checked = settings.announcement_enabled !== false;
    }
  }

  async function handleStoreSettingsSubmit(e) {
    if (e) e.preventDefault();

    const brandName = $('setBrandName')?.value?.trim();
    const phone = $('setPhone')?.value?.trim();
    const whatsapp = $('setWhatsApp')?.value?.trim();
    const address = $('setAddress')?.value?.trim();
    const announcement = $('setAnnouncement')?.value?.trim();
    const announcementEnabled = $('setAnnouncementEnabled')?.checked !== false;
    const btn = $('saveSettingsBtn');

    if (!brandName || !phone || !whatsapp) {
      alert('Please fill in required store fields.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Saving Settings...';
    }

    try {
      await window.jsmSupabase.updateStoreSettings({
        brand_name: brandName,
        phone,
        whatsapp_number: whatsapp,
        address,
        announcement,
        announcement_enabled: announcementEnabled
      });

      showToast('Store settings saved to Supabase!');
      window.jsmApp?.loadStoreSettingsAndAnnouncement?.();
    } catch (err) {
      alert(`Could not save settings: ${err.message}`);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Save Store Settings';
      }
    }
  }

  /* ==========================================================================
     8. EVENT LISTENERS INITIALIZATION
     ========================================================================== */

  function initAdmin() {
    // 1. Entry point triggers (footer link, header button & modal close)
    $('footerAdminTrigger')?.addEventListener('click', openLoginOrDashboard);
    $('headerAdminTrigger')?.addEventListener('click', openLoginOrDashboard);
    $('adminLoginClose')?.addEventListener('click', closeLoginModal);
    $('adminDashboardClose')?.addEventListener('click', closeAdminDashboard);
    $('adminLogoutBtn')?.addEventListener('click', handleLogout);

    // Keyboard shortcut (Ctrl + Shift + A or Alt + A)
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        openLoginOrDashboard();
      }
    });

    // URL shortcut: if user visits #admin or ?admin
    if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
      setTimeout(openLoginOrDashboard, 600);
    }

    // 2. Login form
    $('adminLoginForm')?.addEventListener('submit', handleLoginSubmit);
    $('togglePassBtn')?.addEventListener('click', togglePasswordVisibility);

    // 3. Sidebar Navigation items
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab === 'account') {
          switchTab('account');
        } else {
          switchTab(tab);
        }
      });
    });

    // 4. Products Tab Filters & Search
    $('adminFilterSearch')?.addEventListener('input', e => {
      adminState.searchQuery = e.target.value.trim();
      renderFilteredProducts();
    });

    $('adminFilterCategorySelect')?.addEventListener('change', e => {
      adminState.filterCategory = e.target.value;
      renderFilteredProducts();
    });

    $('adminFilterStatusSelect')?.addEventListener('change', e => {
      adminState.filterStatus = e.target.value;
      renderFilteredProducts();
    });

    $('adminFilterColorSelect')?.addEventListener('change', e => {
      adminState.filterColor = e.target.value;
      renderFilteredProducts();
    });

    $('adminSortBySelect')?.addEventListener('change', e => {
      adminState.sortBy = e.target.value;
      renderFilteredProducts();
    });

    // 5. Product Manage Form (Add / Edit)
    $('productManageForm')?.addEventListener('submit', handleProductFormSubmit);
    $('prodMainImageFile')?.addEventListener('change', handleMainImageSelect);
    $('prodExtraImages')?.addEventListener('change', handleExtraImagesSelect);

    // 6. Category Form
    $('addCategoryForm')?.addEventListener('submit', handleAddCategorySubmit);

    // 7. Coupons Form
    $('manageCouponForm')?.addEventListener('submit', handleCreateCouponSubmit);
    $('cancelCouponEditBtn')?.addEventListener('click', cancelEditCoupon);

    // 8. Store Settings Form
    $('storeSettingsForm')?.addEventListener('submit', handleStoreSettingsSubmit);
  }

  // Global namespace export
  window.jsmAdmin = {
    openLoginOrDashboard,
    openLoginModal,
    closeLoginModal,
    openAdminDashboard,
    closeAdminDashboard,
    switchTab,
    savePrice,
    toggleProductActive,
    startEditProduct,
    removeExistingGalleryImage,
    deleteBag,
    resetProductForm,
    addSizeRow,
    addColorRow,
    addVariantRow,
    generateVariantCombinations,
    filterByCat,
    loadAdminCategories,
    handleAddCategorySubmit,
    handleToggleCategory,
    handleEditCategory,
    handleDeleteCategory,
    startEditCoupon,
    cancelEditCoupon,
    toggleCoupon,
    deleteCoupon,
    handleLogout
  };

  document.addEventListener('DOMContentLoaded', initAdmin);
})();
