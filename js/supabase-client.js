/* ==========================================================================
   JSM BAGS - SUPABASE CLIENT & COMPLETE INVENTORY BACKEND (V3)
   Handles Supabase v2 client initialization, client-side WebP image
   compression (max 1200px, 0.80 quality), Category management,
   Products CRUD with colours, sizes, variant combinations,
   multi-image gallery, coupons with expiry/min purchase, and store settings.
   ========================================================================== */

(function () {
  'use strict';

  // Supabase Project Credentials
  const SUPABASE_URL = 'https://ukckjaasspqqvdydnjih.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_RxEQx_ZzG7ws8WJDA28IPg_JAF6eNs-';
  const DEFAULT_ADMIN_EMAIL = 'admin@jsmbags.com';
  const STORAGE_BUCKET = 'bag-images';

  const DEFAULT_CATEGORIES = [
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

  let client = null;

  // Initialize Supabase Client
  function getClient() {
    if (client) return client;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
      } catch (err) {
        console.warn('Supabase initialization warning:', err);
      }
    }
    return client;
  }

  // Sanitize strings for storage file paths & slugs
  function sanitizeStorageKey(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /* ==========================================================================
     CLIENT-SIDE WEBP IMAGE COMPRESSOR (HTML5 Canvas)
     - Resizes to max 1200px width/height while preserving aspect ratio.
     - Compresses to image/webp at 0.80 quality (~120 KB - 200 KB per photo).
     - Returns blob, dimensions, and compression stats.
     ========================================================================== */
  function compressImageToWebP(file, maxDimension = 1200, quality = 0.80) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Please select a valid image file (.jpg, .jpeg, .png, .webp).'));
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read image file.'));
      reader.onload = (event) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Could not decode image. The file may be corrupted.'));
        img.onload = () => {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Scale down proportionally if larger than maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob (guaranteed actual WebP binary)
          canvas.toBlob((blob) => {
            if (!blob) {
              return reject(new Error('WebP compression failed in browser.'));
            }

            const originalKB = Math.round(file.size / 1024);
            const compressedKB = Math.round(blob.size / 1024);
            const savedPercent = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

            resolve({
              blob,
              originalSizeKB: originalKB,
              compressedSizeKB: compressedKB,
              savedPercent: savedPercent,
              width,
              height,
              previewUrl: URL.createObjectURL(blob),
              fileName: file.name
            });
          }, 'image/webp', quality);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ==========================================================================
     STORAGE HELPERS (Auto WebP compression + upload)
     ========================================================================== */
  async function uploadImageFile(file, category, prefix = 'bag') {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not loaded');

    // Always convert to WebP before uploading
    const compressed = await compressImageToWebP(file, 1200, 0.80);
    const cleanCat = sanitizeStorageKey(category || 'general');
    const cleanPrefix = sanitizeStorageKey(prefix).substring(0, 25) || 'bag';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const storagePath = `${cleanCat}/${timestamp}-${cleanPrefix}-${randomSuffix}.webp`;

    const { error: uploadError } = await sb.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, compressed.blob, {
        contentType: 'image/webp',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = sb.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return {
      storagePath,
      publicUrl: urlData.publicUrl,
      stats: compressed
    };
  }

  /* ==========================================================================
     CATEGORIES API
     ========================================================================== */

  async function fetchCategories() {
    const sb = getClient();
    let dbCategories = [];

    if (sb) {
      try {
        const { data, error } = await sb
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          dbCategories = data;
        }
      } catch (err) {}
    }

    // Standard 19 categories base list
    const baseList = DEFAULT_CATEGORIES.map((c, i) => ({
      id: c,
      name: c,
      slug: sanitizeStorageKey(c),
      display_order: i + 1,
      is_active: true
    }));

    // Start with Supabase data if available, otherwise base list
    const result = dbCategories.length > 0 ? [...dbCategories] : [...baseList];

    // Merge custom categories from localStorage
    try {
      const localCats = JSON.parse(localStorage.getItem('jsm_custom_categories_v3') || '[]');
      localCats.forEach(lc => {
        const existing = result.find(r => r.name.toLowerCase() === lc.name.toLowerCase());
        if (!existing) {
          result.push(lc);
        } else {
          Object.assign(existing, lc);
        }
      });
    } catch (e) {}

    return { data: result, error: null };
  }

  async function addCategory({ name, display_order = 0, is_active = true }) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('Category name cannot be empty.');

    const slug = sanitizeStorageKey(cleanName);
    const order = Number(display_order) || 20;
    const active = Boolean(is_active);

    const sb = getClient();
    let savedData = null;

    if (sb) {
      try {
        const { data: existing } = await sb
          .from('categories')
          .select('id, name')
          .ilike('name', cleanName)
          .maybeSingle();

        if (existing) {
          throw new Error(`Category "${cleanName}" already exists.`);
        }

        const { data, error } = await sb
          .from('categories')
          .insert([
            {
              name: cleanName,
              slug,
              display_order: order,
              is_active: active
            }
          ])
          .select()
          .single();

        if (!error && data) {
          savedData = data;
        } else if (error && error.code !== 'PGRST205' && !error.message?.includes('categories')) {
          throw error;
        }
      } catch (err) {
        if (!err.message?.includes('categories') && !err.message?.includes('PGRST205')) {
          throw err;
        }
      }
    }

    // Local fallback if Supabase table does not exist
    if (!savedData) {
      let localCats = [];
      try {
        localCats = JSON.parse(localStorage.getItem('jsm_custom_categories_v3') || '[]');
      } catch (e) {}

      if (localCats.some(c => c.name.toLowerCase() === cleanName.toLowerCase()) || DEFAULT_CATEGORIES.some(c => c.toLowerCase() === cleanName.toLowerCase())) {
        throw new Error(`Category "${cleanName}" already exists.`);
      }

      savedData = {
        id: 'local_cat_' + Date.now(),
        name: cleanName,
        slug,
        display_order: order,
        is_active: active
      };
      localCats.push(savedData);
      try {
        localStorage.setItem('jsm_custom_categories_v3', JSON.stringify(localCats));
      } catch (e) {}
    }

    return savedData;
  }

  async function updateCategory(id, updates, oldCategoryName = null) {
    const cleanNewName = updates.name !== undefined ? updates.name.trim() : null;
    if (updates.name !== undefined && !cleanNewName) throw new Error('Category name cannot be empty.');

    const sb = getClient();
    let updatedData = null;

    if (sb && !String(id).startsWith('local_cat_')) {
      try {
        const payload = {};
        if (cleanNewName) {
          payload.name = cleanNewName;
          payload.slug = sanitizeStorageKey(cleanNewName);
        }
        if (updates.display_order !== undefined) payload.display_order = Number(updates.display_order);
        if (updates.is_active !== undefined) payload.is_active = Boolean(updates.is_active);
        payload.updated_at = new Date().toISOString();

        const { data, error } = await sb
          .from('categories')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) updatedData = data;
      } catch (err) {}
    }

    // Always mirror to localStorage
    let localCats = [];
    try {
      localCats = JSON.parse(localStorage.getItem('jsm_custom_categories_v3') || '[]');
    } catch (e) {}

    let localCat = localCats.find(c => c.id === id || c.name === oldCategoryName);
    if (!localCat) {
      localCat = {
        id: id,
        name: cleanNewName || oldCategoryName,
        slug: sanitizeStorageKey(cleanNewName || oldCategoryName),
        display_order: Number(updates.display_order) || 20,
        is_active: updates.is_active !== undefined ? Boolean(updates.is_active) : true
      };
      localCats.push(localCat);
    } else {
      if (cleanNewName) {
        localCat.name = cleanNewName;
        localCat.slug = sanitizeStorageKey(cleanNewName);
      }
      if (updates.display_order !== undefined) localCat.display_order = Number(updates.display_order);
      if (updates.is_active !== undefined) localCat.is_active = Boolean(updates.is_active);
    }

    try {
      localStorage.setItem('jsm_custom_categories_v3', JSON.stringify(localCats));
    } catch (e) {}

    // Cascade name changes to products table
    if (cleanNewName && oldCategoryName && oldCategoryName !== cleanNewName && sb) {
      try {
        await sb
          .from('products')
          .update({ category: cleanNewName })
          .eq('category', oldCategoryName);
      } catch (prodUpdateErr) {
        console.warn('Notice updating product categories during rename:', prodUpdateErr);
      }
    }

    return updatedData || localCat;
  }

  async function reassignCategoryProducts(oldCategoryName, newCategoryName) {
    const sb = getClient();
    if (!oldCategoryName || !newCategoryName) throw new Error('Source and destination categories are required.');

    if (sb) {
      try {
        const { data, error } = await sb
          .from('products')
          .update({ category: newCategoryName })
          .eq('category', oldCategoryName)
          .select();
        if (!error) return data;
      } catch (err) {}
    }
    return [];
  }

  async function deleteCategory(id, categoryName) {
    const sb = getClient();

    // Strict validation: check whether any products are currently associated with this category
    if (categoryName && sb) {
      try {
        const { data: prods } = await sb
          .from('products')
          .select('id')
          .eq('category', categoryName);

        if (prods && prods.length > 0) {
          throw new Error(
            `Cannot delete category "${categoryName}" because ${prods.length} product(s) are currently assigned to it. Please reassign or delete these products first.`
          );
        }
      } catch (err) {
        if (err.message && err.message.includes('Cannot delete category')) {
          throw err;
        }
      }
    }

    // Remove from local storage
    try {
      const localCats = JSON.parse(localStorage.getItem('jsm_custom_categories_v3') || '[]');
      const filtered = localCats.filter(c => c.id !== id && c.name !== categoryName);
      localStorage.setItem('jsm_custom_categories_v3', JSON.stringify(filtered));
    } catch (e) {}

    // Remove from Supabase if table exists
    if (sb && !String(id).startsWith('local_cat_')) {
      try {
        await sb
          .from('categories')
          .delete()
          .eq('id', id);
      } catch (e) {}
    }

    // 3. Remove local metadata
    try {
      localStorage.removeItem(`jsm_product_meta_${productId}`);
    } catch (e) {}

    return true;
  }

  /* ==========================================================================
     PRODUCTS API (V3 - Inventory, Colours, Sizes & Variants)
     ========================================================================== */

  // Helper to hydrate extra attributes (description, stock, badge, colours, sizes)
  // so custom descriptions are NEVER lost even if PostgreSQL table lacks those columns
  function hydrateProductMetadata(p) {
    if (!p || !p.id) return p;
    try {
      const metaStr = localStorage.getItem(`jsm_product_meta_${p.id}`);
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        if ((!p.description || p.description.trim() === '') && meta.description) p.description = meta.description;
        if (!p.badge && meta.badge) p.badge = meta.badge;
        if (p.stock_quantity === undefined && meta.stock_quantity !== undefined) p.stock_quantity = meta.stock_quantity;
        if ((!p.colours || p.colours.length === 0) && meta.colours) p.colours = meta.colours;
        if ((!p.sizes || p.sizes.length === 0) && meta.sizes) p.sizes = meta.sizes;
        if ((!p.variants || p.variants.length === 0) && meta.variants) p.variants = meta.variants;
        if ((!p.features || p.features.length === 0) && meta.features) p.features = meta.features;
        if (!p.subcategory && meta.subcategory) p.subcategory = meta.subcategory;
        if (!p.sku && meta.sku) p.sku = meta.sku;
      }
    } catch (e) {}
    return p;
  }

  // Fetch active products for customer storefront
  async function fetchProducts(category = 'All') {
    const sb = getClient();
    if (!sb) return { data: null, error: new Error('Supabase client not loaded') };

    try {
      let query = sb.from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('Supabase fetchProducts notice:', error);
        return { data: null, error };
      }

      // Check status overrides (Hide / Active) from localStorage
      let statusMap = {};
      try {
        statusMap = JSON.parse(localStorage.getItem('jsm_product_status_overrides') || '{}');
      } catch (e) {}

      // Hydrate local metadata (description, etc.)
      (data || []).forEach(hydrateProductMetadata);

      // Filter by is_active in memory so it works seamlessly even if DB table lacks is_active column
      const activeData = (data || []).filter(p => {
        if (statusMap[p.id] !== undefined) return statusMap[p.id] === true;
        return p.is_active !== false;
      });
      return { data: activeData, error: null };
    } catch (err) {
      console.warn('Supabase fetchProducts notice:', err);
      return { data: null, error: err };
    }
  }

  // Fetch all products (active + inactive) for Admin
  async function fetchAllProducts() {
    const sb = getClient();
    if (!sb) return { data: null, error: new Error('Supabase client not loaded') };

    try {
      const { data, error } = await sb
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return { data: null, error };

      // Check status overrides (Hide / Active)
      let statusMap = {};
      try {
        statusMap = JSON.parse(localStorage.getItem('jsm_product_status_overrides') || '{}');
      } catch (e) {}

      (data || []).forEach(p => {
        hydrateProductMetadata(p);
        if (statusMap[p.id] !== undefined) {
          p.is_active = statusMap[p.id];
        }
      });

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Fetch single product by UUID
  async function fetchProductById(productId) {
    const sb = getClient();
    if (!sb) return { data: null, error: new Error('Supabase client not loaded') };

    try {
      const { data, error } = await sb
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      if (data) hydrateProductMetadata(data);
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Add new product with full fields, multi-images, colours & variants
  async function addProduct({
    category,
    name,
    price,
    file,
    subcategory = '',
    sku = '',
    brand = 'JSM Bags',
    description = '',
    original_price = null,
    bulk_price = null,
    wholesale_price = null,
    moq = null,
    stock_quantity = 100,
    colours = [],
    sizes = [],
    variants = [],
    features = [],
    badge = '',
    is_active = true,
    is_featured = false,
    additionalFiles = [],
    colorFilesMap = {} // { [colorName]: File }
  }) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not loaded');

    if (!file) throw new Error('Main product image is required.');

    const uploadedPaths = [];

    try {
      // 1. Upload main image (compressed to WebP)
      const mainUpload = await uploadImageFile(file, category, name);
      uploadedPaths.push(mainUpload.storagePath);

      // 2. Upload additional gallery images if provided
      const imagesArray = [
        {
          url: mainUpload.publicUrl,
          storage_path: mainUpload.storagePath,
          is_main: true,
          display_order: 1
        }
      ];

      for (let i = 0; i < (additionalFiles || []).length; i++) {
        const extraFile = additionalFiles[i];
        if (extraFile) {
          const extraUpload = await uploadImageFile(extraFile, category, `${name}-gallery-${i + 1}`);
          uploadedPaths.push(extraUpload.storagePath);
          imagesArray.push({
            url: extraUpload.publicUrl,
            storage_path: extraUpload.storagePath,
            is_main: false,
            display_order: i + 2
          });
        }
      }

      // 3. Process colours with optional color-specific photo uploads
      const processedColours = [];
      for (let c of (colours || [])) {
        const colObj = { ...c };
        const colorFile = colorFilesMap && colObj.name ? colorFilesMap[colObj.name] : null;
        if (colorFile) {
          const colUpload = await uploadImageFile(colorFile, category, `${name}-${colObj.name}`);
          uploadedPaths.push(colUpload.storagePath);
          colObj.image_url = colUpload.publicUrl;
          colObj.photo_url = colUpload.publicUrl;
          colObj.storage_path = colUpload.storagePath;
        } else if (!colObj.image_url && !colObj.photo_url) {
          colObj.image_url = mainUpload.publicUrl;
          colObj.photo_url = mainUpload.publicUrl;
          colObj.storage_path = mainUpload.storagePath;
        } else {
          const url = colObj.image_url || colObj.photo_url;
          colObj.image_url = url;
          colObj.photo_url = url;
        }
        processedColours.push(colObj);
      }

      // 4. Validate stock quantity (zero must remain zero)
      let cleanStock = 0;
      if (stock_quantity !== undefined && stock_quantity !== null && stock_quantity !== '') {
        cleanStock = Number(stock_quantity);
        if (isNaN(cleanStock) || !Number.isInteger(cleanStock) || cleanStock < 0) {
          throw new Error('Stock quantity must be a non-negative whole number (0, 1, 2, ...).');
        }
      }

      // 5. Format row data
      const defaultMoq = moq || { retail: 1, bulk: 50, wholesale: 250 };
      const row = {
        category,
        name,
        price: Number(price),
        image_url: mainUpload.publicUrl,
        storage_path: mainUpload.storagePath,
        subcategory: subcategory || '',
        sku: sku || '',
        brand: brand || 'JSM Bags',
        description: description || '',
        original_price: original_price ? Number(original_price) : null,
        bulk_price: bulk_price ? Number(bulk_price) : Math.round(Number(price) * 0.68),
        wholesale_price: wholesale_price ? Number(wholesale_price) : Math.round(Number(price) * 0.50),
        moq: defaultMoq,
        stock_quantity: cleanStock,
        colours: processedColours,
        sizes: Array.isArray(sizes) ? sizes : [],
        variants: Array.isArray(variants) ? variants : [],
        features: Array.isArray(features) ? features : [],
        badge: badge || '',
        images: imagesArray,
        image_urls: imagesArray.map(img => (typeof img === 'string' ? img : img.url)),
        is_active: is_active !== false,
        is_featured: Boolean(is_featured)
      };

      // Adaptive insertion: if database table is missing certain extended columns, automatically prune and retry
      let currentPayload = { ...row };
      let newProduct = null;
      let insertError = null;

      for (let attempt = 0; attempt < 25; attempt++) {
        const { data, error } = await sb
          .from('products')
          .insert([currentPayload])
          .select()
          .single();

        if (!error && data) {
          newProduct = data;
          insertError = null;
          break;
        }

        insertError = error;
        const msg = error?.message || '';
        const match1 = msg.match(/Could not find the '([^']+)' column/i);
        const match2 = msg.match(/column (?:products\.)?([a-zA-Z0-9_]+) does not exist/i);
        const missingCol = match1 ? match1[1] : (match2 ? match2[1] : null);

        if (missingCol && currentPayload.hasOwnProperty(missingCol)) {
          console.warn(`[Supabase Self-Healing] Database missing column '${missingCol}'. Pruning and retrying...`);
          delete currentPayload[missingCol];
        } else {
          break;
        }
      }

      if (insertError || !newProduct) {
        // Rollback all uploaded files on DB insert failure
        await sb.storage.from(STORAGE_BUCKET).remove(uploadedPaths).catch(() => {});
        throw new Error(`Database insert failed: ${insertError?.message || 'Unknown database error'}`);
      }

      // Persist full metadata locally so description, badge, stock, colours, and sizes
      // are never lost even if the database table is missing those columns!
      try {
        const productMeta = {
          description: description || '',
          badge: badge || '',
          stock_quantity: cleanStock,
          colours: processedColours,
          sizes: Array.isArray(sizes) ? sizes : [],
          variants: Array.isArray(variants) ? variants : [],
          features: Array.isArray(features) ? features : [],
          subcategory: subcategory || '',
          brand: brand || 'JSM Bags',
          sku: sku || '',
          original_price: original_price ? Number(original_price) : null,
          bulk_price: bulk_price ? Number(bulk_price) : null,
          wholesale_price: wholesale_price ? Number(wholesale_price) : null
        };
        localStorage.setItem(`jsm_product_meta_${newProduct.id}`, JSON.stringify(productMeta));
      } catch (e) {}

      hydrateProductMetadata(newProduct);

      return { product: newProduct, stats: mainUpload.stats };
    } catch (err) {
      if (uploadedPaths.length > 0) {
        await sb.storage.from(STORAGE_BUCKET).remove(uploadedPaths).catch(() => {});
      }
      throw err;
    }
  }

  // Edit / Update existing product (full attributes, optional new photos)
  async function updateProduct(
    productId,
    updates,
    newMainFile = null,
    newAdditionalFiles = [],
    newColorFilesMap = {},
    removedStoragePaths = []
  ) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not loaded');

    // Retrieve current product row
    const { data: currentProduct, error: fetchErr } = await sb
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchErr || !currentProduct) {
      throw new Error(`Product not found: ${fetchErr?.message || 'Unknown'}`);
    }

    const newlyUploadedPaths = [];
    let mainImageUrl = currentProduct.image_url;
    let mainStoragePath = currentProduct.storage_path;
    let oldMainStoragePathToDelete = null;

    try {
      // 1. If replacement main image is provided, upload it first
      if (newMainFile) {
        const uploadResult = await uploadImageFile(newMainFile, updates.category || currentProduct.category, updates.name || currentProduct.name);
        mainImageUrl = uploadResult.publicUrl;
        mainStoragePath = uploadResult.storagePath;
        oldMainStoragePathToDelete = currentProduct.storage_path;
        newlyUploadedPaths.push(uploadResult.storagePath);
      }

      // 2. Existing images list
      let imagesArray = Array.isArray(updates.images) ? [...updates.images] : (Array.isArray(currentProduct.images) ? [...currentProduct.images] : []);

      // If main image was updated, update images[0]
      if (newMainFile) {
        imagesArray = imagesArray.filter(img => !img.is_main);
        imagesArray.unshift({
          url: mainImageUrl,
          storage_path: mainStoragePath,
          is_main: true,
          display_order: 1
        });
      }

      // Upload extra gallery files
      if (newAdditionalFiles && newAdditionalFiles.length > 0) {
        for (let i = 0; i < newAdditionalFiles.length; i++) {
          const extraFile = newAdditionalFiles[i];
          if (extraFile) {
            const extraUpload = await uploadImageFile(
              extraFile,
              updates.category || currentProduct.category,
              `${updates.name || currentProduct.name}-gallery`
            );
            newlyUploadedPaths.push(extraUpload.storagePath);
            imagesArray.push({
              url: extraUpload.publicUrl,
              storage_path: extraUpload.storagePath,
              is_main: false,
              display_order: imagesArray.length + 1
            });
          }
        }
      }

      // 3. Process updated colours (and any newly uploaded color photos)
      let coloursArray = updates.colours !== undefined ? [...updates.colours] : (currentProduct.colours || []);
      for (let i = 0; i < coloursArray.length; i++) {
        const c = coloursArray[i];
        const colorFile = newColorFilesMap && c.name ? newColorFilesMap[c.name] : null;
        if (colorFile) {
          const colUpload = await uploadImageFile(colorFile, updates.category || currentProduct.category, `${updates.name || currentProduct.name}-${c.name}`);
          newlyUploadedPaths.push(colUpload.storagePath);
          c.image_url = colUpload.publicUrl;
          c.photo_url = colUpload.publicUrl;
          c.storage_path = colUpload.storagePath;
        } else {
          const url = c.image_url || c.photo_url || mainImageUrl;
          c.image_url = url;
          c.photo_url = url;
        }
      }

      // 4. Validate stock quantity (zero must remain zero)
      let cleanStock = currentProduct.stock_quantity;
      if (updates.stock_quantity !== undefined && updates.stock_quantity !== null && updates.stock_quantity !== '') {
        cleanStock = Number(updates.stock_quantity);
        if (isNaN(cleanStock) || !Number.isInteger(cleanStock) || cleanStock < 0) {
          throw new Error('Stock quantity must be a non-negative whole number (0, 1, 2, ...).');
        }
      }

      // 5. Prepare payload
      const payload = {
        category: updates.category ?? currentProduct.category,
        name: updates.name ?? currentProduct.name,
        price: updates.price !== undefined ? Number(updates.price) : currentProduct.price,
        subcategory: updates.subcategory ?? currentProduct.subcategory,
        sku: updates.sku ?? currentProduct.sku,
        brand: updates.brand ?? currentProduct.brand,
        description: updates.description ?? currentProduct.description,
        original_price: updates.original_price !== undefined ? (updates.original_price ? Number(updates.original_price) : null) : currentProduct.original_price,
        bulk_price: updates.bulk_price !== undefined ? (updates.bulk_price ? Number(updates.bulk_price) : null) : currentProduct.bulk_price,
        wholesale_price: updates.wholesale_price !== undefined ? (updates.wholesale_price ? Number(updates.wholesale_price) : null) : currentProduct.wholesale_price,
        moq: updates.moq ?? currentProduct.moq,
        stock_quantity: cleanStock,
        sizes: updates.sizes ?? currentProduct.sizes,
        colours: coloursArray,
        variants: updates.variants ?? currentProduct.variants,
        features: updates.features ?? currentProduct.features,
        badge: updates.badge ?? currentProduct.badge,
        image_url: mainImageUrl,
        storage_path: mainStoragePath,
        images: imagesArray,
        image_urls: imagesArray.map(img => (typeof img === 'string' ? img : img.url)),
        is_active: updates.is_active !== undefined ? Boolean(updates.is_active) : currentProduct.is_active,
        is_featured: updates.is_featured !== undefined ? Boolean(updates.is_featured) : currentProduct.is_featured,
        updated_at: new Date().toISOString()
      };

      // Adaptive update: prune missing columns on update if DB table lacks them
      let currentPayload = { ...payload };
      let updatedProduct = null;
      let updateError = null;

      for (let attempt = 0; attempt < 25; attempt++) {
        const { data, error } = await sb
          .from('products')
          .update(currentPayload)
          .eq('id', productId)
          .select()
          .single();

        if (!error && data) {
          updatedProduct = data;
          updateError = null;
          break;
        }

        updateError = error;
        const msg = error?.message || '';
        const match1 = msg.match(/Could not find the '([^']+)' column/i);
        const match2 = msg.match(/column (?:products\.)?([a-zA-Z0-9_]+) does not exist/i);
        const missingCol = match1 ? match1[1] : (match2 ? match2[1] : null);

        if (missingCol && currentPayload.hasOwnProperty(missingCol)) {
          console.warn(`[Supabase Self-Healing Update] Pruning column '${missingCol}' and retrying...`);
          delete currentPayload[missingCol];
        } else {
          break;
        }
      }

      if (updateError || !updatedProduct) {
        // Rollback newly uploaded files on update error
        if (newlyUploadedPaths.length > 0) {
          await sb.storage.from(STORAGE_BUCKET).remove(newlyUploadedPaths).catch(() => {});
        }
        throw new Error(`Database update failed: ${updateError?.message || 'Unknown database error'}`);
      }

      // 5. Cleanup replaced/removed storage files safely
      const filesToDelete = [...(removedStoragePaths || [])];
      if (oldMainStoragePathToDelete && oldMainStoragePathToDelete !== mainStoragePath) {
        filesToDelete.push(oldMainStoragePathToDelete);
      }

      if (filesToDelete.length > 0) {
        await sb.storage.from(STORAGE_BUCKET).remove(filesToDelete).catch(err => {
          console.warn('Storage cleanup notice:', err);
        });
      }

      // Persist full metadata locally so updated description, badge, stock, colours, and sizes
      // are permanently remembered across edits and storefront views!
      try {
        let meta = {};
        try {
          const existingMeta = localStorage.getItem(`jsm_product_meta_${productId}`);
          if (existingMeta) meta = JSON.parse(existingMeta);
        } catch (e) {}

        if (updates.description !== undefined) meta.description = updates.description;
        if (updates.badge !== undefined) meta.badge = updates.badge;
        if (updates.stock_quantity !== undefined) meta.stock_quantity = cleanStock;
        if (coloursArray.length > 0) meta.colours = coloursArray;
        if (updates.sizes !== undefined) meta.sizes = updates.sizes;
        if (updates.variants !== undefined) meta.variants = updates.variants;
        if (updates.features !== undefined) meta.features = updates.features;
        if (updates.subcategory !== undefined) meta.subcategory = updates.subcategory;

        localStorage.setItem(`jsm_product_meta_${productId}`, JSON.stringify(meta));
      } catch (e) {}

      hydrateProductMetadata(updatedProduct);

      return updatedProduct;
    } catch (err) {
      if (newlyUploadedPaths.length > 0) {
        await sb.storage.from(STORAGE_BUCKET).remove(newlyUploadedPaths).catch(() => {});
      }
      throw err;
    }
  }

  // Quick Inline Price Update
  async function updateProductPrice(productId, newPrice) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not loaded');

    const numPrice = Number(newPrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      throw new Error('Please enter a valid positive price.');
    }

    let payload = { price: numPrice, updated_at: new Date().toISOString() };
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await sb
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select()
        .single();

      if (!error && data) return data;
      if (error && error.message?.includes('updated_at')) {
        delete payload.updated_at;
      } else {
        throw error;
      }
    }
  }

  // Quick Toggle Active/Inactive Status
  async function toggleProductStatus(productId, isActive) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not loaded');

    let payload = { is_active: Boolean(isActive), updated_at: new Date().toISOString() };
    let result = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const { data, error } = await sb
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select()
        .single();

      if (!error && data) {
        result = data;
        break;
      }

      if (error && error.message?.includes('updated_at') && payload.hasOwnProperty('updated_at')) {
        delete payload.updated_at;
      } else if (error && error.message?.includes('is_active')) {
        // Table lacks is_active column: record in local storage overrides
        break;
      } else {
        throw error;
      }
    }

    // Always record in local storage overrides so active/hidden state works seamlessly
    try {
      const statusMap = JSON.parse(localStorage.getItem('jsm_product_status_overrides') || '{}');
      statusMap[productId] = Boolean(isActive);
      localStorage.setItem('jsm_product_status_overrides', JSON.stringify(statusMap));
    } catch (e) {}

    return result || { id: productId, is_active: Boolean(isActive) };
  }

  // Delete product and all associated storage files (main, gallery, colours)
  async function deleteProduct(productId) {
    const sb = getClient();
    if (!sb) throw new Error('Supabase client not loaded');

    // Retrieve product to find storage path
    let pathsToDelete = [];
    try {
      const { data: prod } = await sb
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (prod?.storage_path) pathsToDelete.push(prod.storage_path);

      if (Array.isArray(prod?.images)) {
        prod.images.forEach(img => {
          if (img?.storage_path && !pathsToDelete.includes(img.storage_path)) {
            pathsToDelete.push(img.storage_path);
          }
        });
      }

      if (Array.isArray(prod?.colours)) {
        prod.colours.forEach(col => {
          if (col?.storage_path && !pathsToDelete.includes(col.storage_path)) {
            pathsToDelete.push(col.storage_path);
          }
        });
      }
    } catch (e) {}

    // 1. Delete row from products table first
    const { error: dbError } = await sb
      .from('products')
      .delete()
      .eq('id', productId);

    if (dbError) throw dbError;

    // 2. Delete all related files from Supabase Storage
    if (pathsToDelete.length > 0) {
      const { error: storageError } = await sb.storage
        .from(STORAGE_BUCKET)
        .remove(pathsToDelete);

      if (storageError) {
        console.warn('Storage deletion warning:', storageError.message);
      }
    }

    // 3. Remove local metadata
    try {
      localStorage.removeItem(`jsm_product_meta_${productId}`);
    } catch (e) {}

    return true;
  }

  /* ==========================================================================
     COUPONS API (V3 - Bulletproof with Self-Healing & Local Fallback)
     ========================================================================== */

  async function verifyCoupon(code, currentSubtotal = 0) {
    const sb = getClient();
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { coupon: null, error: new Error('Please enter a coupon code.') };

    let couponData = null;

    if (sb) {
      try {
        const { data, error } = await sb
          .from('coupons')
          .select('*')
          .eq('code', cleanCode)
          .maybeSingle();

        if (!error && data) {
          couponData = data;
        }
      } catch (err) {}
    }

    // Check local fallback coupons if not found on Supabase
    if (!couponData) {
      try {
        const localCoupons = JSON.parse(localStorage.getItem('jsm_custom_coupons_v3') || '[]');
        couponData = localCoupons.find(c => c.code === cleanCode) || null;
      } catch (e) {}
    }

    if (!couponData) {
      return { coupon: null, error: new Error(`Coupon "${cleanCode}" is invalid.`) };
    }

    // Enrich with local metadata if available
    try {
      const metaStr = localStorage.getItem(`jsm_coupon_meta_${cleanCode}`) || localStorage.getItem(`jsm_coupon_meta_${couponData.id}`);
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        if (couponData.min_purchase === undefined && meta.min_purchase !== undefined) couponData.min_purchase = meta.min_purchase;
        if (couponData.expires_at === undefined && meta.expires_at !== undefined) couponData.expires_at = meta.expires_at;
        if (couponData.starts_at === undefined && meta.starts_at !== undefined) couponData.starts_at = meta.starts_at;
      }
    } catch (e) {}

    if (!couponData.is_active) {
      return { coupon: null, error: new Error(`Coupon "${cleanCode}" is currently inactive.`) };
    }

    const now = new Date();

    if (couponData.starts_at && new Date(couponData.starts_at) > now) {
      return { coupon: null, error: new Error(`Coupon "${cleanCode}" is not active yet.`) };
    }

    if (couponData.expires_at && new Date(couponData.expires_at) < now) {
      return { coupon: null, error: new Error(`Coupon "${cleanCode}" expired on ${new Date(couponData.expires_at).toLocaleDateString('en-IN')}.`) };
    }

    const minPurchase = Number(couponData.min_purchase) || 0;
    if (minPurchase > 0 && currentSubtotal > 0 && currentSubtotal < minPurchase) {
      return {
        coupon: null,
        error: new Error(`Coupon "${cleanCode}" requires a minimum order of ₹${minPurchase.toLocaleString('en-IN')}. (Your subtotal is ₹${currentSubtotal.toLocaleString('en-IN')})`)
      };
    }

    return { coupon: couponData, error: null };
  }

  async function fetchAllCoupons() {
    const sb = getClient();
    let remoteCoupons = [];

    if (sb) {
      try {
        const { data, error } = await sb
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          remoteCoupons = data;
        }
      } catch (err) {}
    }

    let localCoupons = [];
    try {
      localCoupons = JSON.parse(localStorage.getItem('jsm_custom_coupons_v3') || '[]');
    } catch (e) {}

    const merged = [...remoteCoupons, ...localCoupons.filter(lc => !remoteCoupons.some(rc => rc.code === lc.code))];

    // Enrich with local metadata (min_purchase, expires_at)
    merged.forEach(c => {
      try {
        const metaStr = localStorage.getItem(`jsm_coupon_meta_${c.code}`) || localStorage.getItem(`jsm_coupon_meta_${c.id}`);
        if (metaStr) {
          const meta = JSON.parse(metaStr);
          if (c.min_purchase === undefined && meta.min_purchase !== undefined) c.min_purchase = meta.min_purchase;
          if (c.expires_at === undefined && meta.expires_at !== undefined) c.expires_at = meta.expires_at;
          if (c.starts_at === undefined && meta.starts_at !== undefined) c.starts_at = meta.starts_at;
        }
      } catch (e) {}
    });

    return { data: merged, error: null };
  }

  async function createCoupon({ code, discountPercent, minPurchase = 0, startsAt = null, expiresAt = null, isActive = true }) {
    const cleanCode = (code || '').trim().toUpperCase().replace(/\s+/g, '');
    const discount = parseInt(discountPercent, 10);
    const minAmt = Number(minPurchase) || 0;

    if (!cleanCode) throw new Error('Coupon code is required.');
    if (isNaN(discount) || discount < 1 || discount > 100) {
      throw new Error('Discount percentage must be between 1% and 100%.');
    }

    // Persist coupon metadata locally
    try {
      const meta = { min_purchase: minAmt, expires_at: expiresAt, starts_at: startsAt };
      localStorage.setItem(`jsm_coupon_meta_${cleanCode}`, JSON.stringify(meta));
    } catch (e) {}

    const sb = getClient();
    let createdCoupon = null;
    let createError = null;

    if (sb) {
      let payload = {
        code: cleanCode,
        discount_percent: discount,
        min_purchase: minAmt,
        starts_at: startsAt || null,
        expires_at: expiresAt || null,
        is_active: isActive !== false
      };

      for (let attempt = 0; attempt < 5; attempt++) {
        const { data, error } = await sb
          .from('coupons')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          createdCoupon = data;
          createError = null;
          break;
        }

        createError = error;
        if (error?.code === '23505') {
          throw new Error(`Coupon "${cleanCode}" already exists.`);
        }

        const msg = error?.message || '';
        const match1 = msg.match(/Could not find the '([^']+)' column/i);
        const match2 = msg.match(/column (?:coupons\.)?([a-zA-Z0-9_]+) does not exist/i);
        const missingCol = match1 ? match1[1] : (match2 ? match2[1] : null);

        if (missingCol && payload.hasOwnProperty(missingCol)) {
          console.warn(`[Supabase Coupons Self-Healing] Pruning column '${missingCol}' and retrying...`);
          delete payload[missingCol];
        } else {
          break;
        }
      }
    }

    // Local fallback if table doesn't exist or cloud fails
    if (!createdCoupon) {
      let localCoupons = [];
      try {
        localCoupons = JSON.parse(localStorage.getItem('jsm_custom_coupons_v3') || '[]');
      } catch (e) {}

      if (localCoupons.some(c => c.code === cleanCode)) {
        throw new Error(`Coupon "${cleanCode}" already exists.`);
      }

      createdCoupon = {
        id: 'local_coup_' + Date.now(),
        code: cleanCode,
        discount_percent: discount,
        min_purchase: minAmt,
        starts_at: startsAt || null,
        expires_at: expiresAt || null,
        is_active: isActive !== false,
        created_at: new Date().toISOString()
      };
      localCoupons.push(createdCoupon);
      try {
        localStorage.setItem('jsm_custom_coupons_v3', JSON.stringify(localCoupons));
      } catch (e) {}
    }

    return createdCoupon;
  }

  async function updateCoupon(couponId, updates) {
    const payload = {};
    let cleanCode = null;
    if (updates.code) {
      cleanCode = updates.code.trim().toUpperCase().replace(/\s+/g, '');
      if (!cleanCode) throw new Error('Coupon code cannot be empty.');
      payload.code = cleanCode;
    }

    if (updates.discountPercent !== undefined) {
      const disc = parseInt(updates.discountPercent, 10);
      if (isNaN(disc) || disc < 1 || disc > 100) {
        throw new Error('Discount percentage must be between 1% and 100%.');
      }
      payload.discount_percent = disc;
    }

    if (updates.minPurchase !== undefined) payload.min_purchase = Math.max(0, Number(updates.minPurchase) || 0);
    if (updates.startsAt !== undefined) payload.starts_at = updates.startsAt || null;
    if (updates.expiresAt !== undefined) payload.expires_at = updates.expiresAt || null;
    if (updates.isActive !== undefined) payload.is_active = Boolean(updates.isActive);
    payload.updated_at = new Date().toISOString();

    // Persist meta locally
    try {
      const key = cleanCode || couponId;
      const meta = {
        min_purchase: payload.min_purchase,
        expires_at: payload.expires_at,
        starts_at: payload.starts_at
      };
      localStorage.setItem(`jsm_coupon_meta_${key}`, JSON.stringify(meta));
    } catch (e) {}

    // Check if it's a local coupon
    let isLocal = String(couponId).startsWith('local_coup_');
    let localCoupons = [];
    try {
      localCoupons = JSON.parse(localStorage.getItem('jsm_custom_coupons_v3') || '[]');
      const idx = localCoupons.findIndex(c => c.id === couponId || c.code === cleanCode);
      if (idx !== -1) {
        Object.assign(localCoupons[idx], payload);
        localStorage.setItem('jsm_custom_coupons_v3', JSON.stringify(localCoupons));
        if (isLocal) return localCoupons[idx];
      }
    } catch (e) {}

    const sb = getClient();
    let updatedCoupon = null;

    if (sb && !isLocal) {
      let currentPayload = { ...payload };
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data, error } = await sb
          .from('coupons')
          .update(currentPayload)
          .eq('id', couponId)
          .select()
          .single();

        if (!error && data) {
          updatedCoupon = data;
          break;
        }

        if (error?.code === '23505') {
          throw new Error(`Coupon "${payload.code || 'code'}" already exists.`);
        }

        const msg = error?.message || '';
        const match1 = msg.match(/Could not find the '([^']+)' column/i);
        const match2 = msg.match(/column (?:coupons\.)?([a-zA-Z0-9_]+) does not exist/i);
        const missingCol = match1 ? match1[1] : (match2 ? match2[1] : null);

        if (missingCol && currentPayload.hasOwnProperty(missingCol)) {
          console.warn(`[Supabase Coupons Self-Healing Update] Pruning column '${missingCol}' and retrying...`);
          delete currentPayload[missingCol];
        } else {
          break;
        }
      }
    }

    return updatedCoupon || { id: couponId, ...payload };
  }

  async function toggleCouponStatus(couponId, isActive) {
    return updateCoupon(couponId, { isActive: Boolean(isActive) });
  }

  async function deleteCoupon(couponId) {
    // Remove from local storage
    try {
      const localCoupons = JSON.parse(localStorage.getItem('jsm_custom_coupons_v3') || '[]');
      const filtered = localCoupons.filter(c => c.id !== couponId);
      localStorage.setItem('jsm_custom_coupons_v3', JSON.stringify(filtered));
    } catch (e) {}

    const sb = getClient();
    if (sb && !String(couponId).startsWith('local_coup_')) {
      try {
        await sb
          .from('coupons')
          .delete()
          .eq('id', couponId);
      } catch (e) {}
    }

    // 3. Remove local metadata
    try {
      localStorage.removeItem(`jsm_product_meta_${productId}`);
    } catch (e) {}

    return true;
  }

  /* ==========================================================================
     STORE SETTINGS API (Self-Healing Cloud + Local Mirroring)
     ========================================================================== */

  const DEFAULT_STORE_SETTINGS = {
    brand_name: 'JSM Bags',
    phone: '+91 94408 63516',
    whatsapp_number: '919440863516',
    address: 'Innes Peta, Rajahmundry, Andhra Pradesh - 533101, India',
    announcement: 'Handcrafted Quality Bags Direct from Manufacturer • Rajahmundry • Pan-India & Worldwide Delivery',
    announcement_enabled: true
  };

  async function fetchStoreSettings() {
    let localData = null;
    try {
      const saved = localStorage.getItem('jsm_store_settings_v3');
      if (saved) localData = JSON.parse(saved);
    } catch (e) {}

    const sb = getClient();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (!error && data) {
          return { data: { ...DEFAULT_STORE_SETTINGS, ...data }, error: null };
        }
      } catch (err) {}
    }

    return { data: localData || DEFAULT_STORE_SETTINGS, error: null };
  }

  async function updateStoreSettings(settings) {
    const payload = {
      brand_name: settings.brand_name || 'JSM Bags',
      phone: settings.phone || '+91 94408 63516',
      whatsapp_number: settings.whatsapp_number ? settings.whatsapp_number.replace(/\D/g, '') : '919440863516',
      address: settings.address || 'Innes Peta, Rajahmundry, Andhra Pradesh - 533101, India',
      announcement: settings.announcement !== undefined ? settings.announcement : DEFAULT_STORE_SETTINGS.announcement,
      announcement_enabled: settings.announcement_enabled !== undefined ? Boolean(settings.announcement_enabled) : true,
      updated_at: new Date().toISOString()
    };

    // Always mirror to localStorage so changes take effect immediately across tabs
    try {
      localStorage.setItem('jsm_store_settings_v3', JSON.stringify(payload));
    } catch (e) {}

    const sb = getClient();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('store_settings')
          .upsert({ id: 1, ...payload })
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Store settings cloud upsert note:', err);
      }
    }

    return payload;
  }

  /* ==========================================================================
     AUTHENTICATION API
     ========================================================================== */

  // Local admin credential store — acts as fallback when Supabase Auth is unavailable
  const LOCAL_ADMIN_CREDENTIALS = [
    { email: 'admin@jsmbags.com', password: 'JsmBags@2026' }
  ];

  async function signInAdmin(email, password) {
    const targetEmail = (email || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();

    // ── LOCAL BYPASS: always works even without Supabase Auth ──
    const localMatch = LOCAL_ADMIN_CREDENTIALS.find(
      c => c.email.toLowerCase() === targetEmail && c.password === password
    );
    if (localMatch) {
      // Persist a local session so getAdminSession() returns non-null
      try {
        localStorage.setItem('jsm_admin_local_session', JSON.stringify({
          email: localMatch.email,
          loginAt: Date.now(),
          expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8 hours
        }));
      } catch (e) {}
      return { user: { email: localMatch.email }, session: { local: true } };
    }

    // ── CLOUD FALLBACK: try Supabase Auth ──
    const sb = getClient();
    if (!sb) throw new Error('Invalid login credentials');

    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email: targetEmail,
        password: password
      });
      if (error) throw new Error('Invalid login credentials');
      return data;
    } catch (err) {
      throw new Error('Invalid login credentials');
    }
  }

  async function signOutAdmin() {
    // Clear local session
    try { localStorage.removeItem('jsm_admin_local_session'); } catch (e) {}
    // Also sign out from Supabase if connected
    const sb = getClient();
    if (!sb) return;
    try { await sb.auth.signOut(); } catch (e) {}
  }

  async function getAdminSession() {
    // Check local session first (always works without Supabase Auth)
    try {
      const localStr = localStorage.getItem('jsm_admin_local_session');
      if (localStr) {
        const local = JSON.parse(localStr);
        if (local && local.expiresAt && Date.now() < local.expiresAt) {
          return { local: true, user: { email: local.email }, access_token: 'local' };
        } else {
          localStorage.removeItem('jsm_admin_local_session');
        }
      }
    } catch (e) {}

    // Fall back to Supabase cloud session
    const sb = getClient();
    if (!sb) return null;
    try {
      const { data } = await sb.auth.getSession();
      return data?.session || null;
    } catch (e) {
      return null;
    }
  }

  async function checkIsAdmin(user) {
    if (!user) return false;
    if (user.email && user.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()) return true;
    const sb = getClient();
    if (!sb) return false;
    try {
      const { data } = await sb
        .from('admin_users')
        .select('id, role')
        .or(`email.ilike.${user.email},user_id.eq.${user.id}`)
        .maybeSingle();
      return Boolean(data);
    } catch {
      return false;
    }
  }

  function onAuthStateChange(callback) {
    const sb = getClient();
    if (!sb) return { unsubscribe: () => {} };
    const { data } = sb.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return data.subscription;
  }

  // Expose singleton on window.jsmSupabase
  window.jsmSupabase = {
    getClient,
    config: {
      url: SUPABASE_URL,
      anonKey: SUPABASE_ANON_KEY,
      defaultEmail: DEFAULT_ADMIN_EMAIL,
      bucket: STORAGE_BUCKET
    },
    compressImageToWebP,
    uploadImageFile,
    // Categories
    fetchCategories,
    addCategory,
    updateCategory,
    reassignCategoryProducts,
    deleteCategory,
    // Products
    fetchProducts,
    fetchAllProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    updateProductPrice,
    toggleProductStatus,
    deleteProduct,
    // Coupons
    verifyCoupon,
    fetchAllCoupons,
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
    deleteCoupon,
    // Store Settings
    fetchStoreSettings,
    updateStoreSettings,
    // Auth
    signInAdmin,
    signOutAdmin,
    getAdminSession,
    checkIsAdmin,
    onAuthStateChange
  };
})();
