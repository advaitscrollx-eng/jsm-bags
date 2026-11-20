# JSM Bags V3 — Store Owner & Client Admin Manual
## Complete Guide to Managing Products, Colours, Sizes, Pricing, Categories & Coupons from Your Shop

Welcome to the **JSM Bags V3 Store Management System**. This system was specially designed so that the shop owner, manager, or staff can stand directly inside the physical shop and upload the entire bag catalog using a mobile phone, tablet, or laptop.

**Key Advantages:**
* **Zero coding or file handling required:** You never need to touch project folders, write code, or manually resize photos.
* **Instant Phone Camera Uploads:** Take photos directly from your phone camera; they are automatically converted into ultra-lightweight WebP format (~120KB) in your browser before saving.
* **Live Storefront Sync:** Every product, colour, price change, or coupon published in the dashboard instantly updates on your live website.
* **Safe Cloud Storage:** All bag photos are securely stored in Supabase Storage (`bag-images` bucket), and catalog records are stored in Supabase Database.

---

## 1. Accessing the Admin Dashboard

1. Open your live website on any device (phone, laptop, desktop).
2. Scroll to the very bottom footer of the website.
3. At the bottom right of the footer, click the subtle button labeled **Admin / Manage Store**.
4. The secure **Supabase Admin Login** window will appear.
5. Enter your administrative credentials:
   - **Email:** `admin@jsmbags.com`
   - **Password:** *(Your configured Supabase Admin Password)*
6. Click **Sign In & Access Dashboard**.
7. Once logged in, your session stays securely saved on your device until you choose to click **Sign Out**.

---

## 2. Adding a New Bag Product (Step-by-Step)

Click **Add New Product** in the dashboard sidebar (or top navigation on mobile).

### Step 1: Basic Information
* **Category \*:** Choose from the 19 standard categories (e.g., *Canvas Bags*, *Potli Bags*, *Jute Bags*, *Handbags*, *Eco-Friendly Biodegradable Return Gift Bags*, etc.) or any custom category you have created.
* **Subcategory / Style (Optional):** Specify the style, such as *Digital Print Canvas*, *Velvet Round*, *Executive Leather*, or *Transparent Window*.
* **Product Name \*:** Enter a clear, attractive title (e.g., *Canvas Digital Peacock Bag*, *Golden Zari Potli Bag*).
* **Product Code / SKU (Optional):** Enter your shop's inventory barcode or code (e.g., *JSM-CAN-001*).
* **Brand:** Defaults to *JSM Bags*.
* **Stock Quantity:** Enter current quantity available in physical shop (e.g., `100`).
* **Description:** Add details about the fabric, stitching quality, handle strength, lining, and ideal gifting occasions.
* **Promotional Badge (Optional):** Highlights the item with a ribbon (e.g., *Bestseller*, *100% Eco-Friendly*, *New Arrival*).
* **Active Status:** Checked by default. Uncheck to save as draft without showing on storefront.
* **⭐ Featured Product:** Check this if you want this product showcased prominently on the homepage.

---

### Step 2: Pricing & Minimum Order Quantities (MOQs)
* **Retail Price (₹) \*:** Single piece retail price (e.g., `₹380`).
* **Original Price / MRP (₹):** Enter the higher MRP (e.g., `₹550`) to display a strike-through discount on the storefront.
* **Bulk Price (₹):** Discounted rate for 50+ pieces (e.g., `₹240`). Auto-calculated if left blank.
* **Wholesale Price (₹):** Factory rate for 250+ pieces (e.g., `₹175`). Auto-calculated if left blank.
* **MOQ Bulk & Wholesale:** Defaults to `50` and `250` pieces, adjustable as needed.

---

### Step 3: Product Colours & Colour-Specific Photos
JSM Bags supports dynamic colour options with interactive storefront swatches:
1. Click **+ Add Colour**.
2. **Colour Name:** Type the colour (e.g., `Royal Blue`, `Beige`, `Maroon`, `Emerald Green`, `Black`).
3. **Colour Swatch & HEX:** Click the colour square to pick the exact shade visually, or type the HEX code (e.g., `#1E3A8A`).
4. **Colour-Specific Photo (Optional):** Tap the file button and snap or select a photo of this bag in this specific colour.
   * *When a customer clicks this colour swatch on your website, the product image automatically switches to this colour's photo!*
5. Add as many colours as you stock in your shop.

---

### Step 4: Product Sizes & Dimensions
Define standard or custom bag sizes:
1. Click **+ Add Size Option**.
2. **Size Name:** Enter dimensions or size label (e.g., `8x10`, `10x12`, `12x14`, `14 inch`, `Saree Size`).
3. **Capacity / Notes:** Enter capacity information (e.g., `Holds 5kg, saree box size`, `Fits 15.6 inch laptop`).
4. **Price Offset (₹):** If this size costs more than the base retail price, enter the addition (e.g., `+50`, `+100`). Enter `0` for base size.

---

### Step 5: Variant Combinations & Custom Pricing (Matrix)
If certain colour and size combinations have unique prices:
1. Click **⚡ Auto-Generate Combinations**.
2. The dashboard automatically calculates the full matrix of all active colours and sizes.
3. For any special variant (e.g., *Black 14 inch with extra zipper*), type a custom price.
4. Leave blank to automatically use the standard base price + size offset.
5. Toggle **In Stock** on/off for specific variants that may be sold out.

---

### Step 6: Product Images & In-Browser WebP Conversion
1. **Main Product Image \*:** Tap to select the primary cover photo from your camera or gallery.
2. **Additional Gallery Photos (Optional):** Select multiple photos to show back views, interior lining, pockets, or zipper close-ups.
3. **Automatic WebP Conversion:**
   * Your phone camera might shoot 3 MB to 8 MB JPEG photos.
   * Our built-in HTML5 Canvas engine automatically converts them to lightweight WebP (~120 KB, max 1200px, 80% quality) inside your browser.
   * Uploads are lightning-fast and consume minimal mobile data.
4. Review the compression badge showing savings (e.g., `94% Smaller (118 KB WebP)`).

---

### Step 7: Features & Publishing
1. **Product Features:** Add 3-5 bullet points (one per line) emphasizing qualities (e.g., *100% natural organic canvas*, *Reinforced box-stitched handles*, *Eligible for custom logo screen printing*).
2. Click **🚀 Publish Product**.
3. Your product is instantly uploaded to Supabase and live on your website for customer browsing, cart additions, and WhatsApp orders!

---

## 3. Managing the Catalog (Products Tab)

Click **All Products** in the dashboard to view your live inventory.

### Searching & Filtering
* **Search Bar:** Type any part of a bag's name, category, subcategory, SKU code, or brand.
* **Category Filter:** View bags by any of the 19 categories.
* **Status Filter:** Switch between *All*, *Active Only*, or *Hidden Only*.
* **Colour Filter:** Filter the catalog to only show bags available in a specific colour (e.g. *Maroon* or *Beige*).
* **Sort Dropdown:** Sort by *Newest First*, *Price: Low to High*, *Price: High to Low*, or *Name A-Z*.

### Quick Inline Actions
* **Quick Price Save:** Change any retail price directly in the product row without opening the form. Type the new number and click **Save**.
* **👁️ Publish / 🚫 Hide:** Toggle a product active or hidden with one tap. If a bag is temporarily out of stock, hide it instantly without deleting it.
* **✏️ Full Edit:** Opens the full product form pre-filled with all information, colours, sizes, and existing photos. Make changes and click **Save Changes**.
* **🗑️ Delete:** Permanently deletes the product from the catalog and cleans up all associated photos from Supabase Storage. (A confirmation dialog prevents accidental clicks).

---

## 4. Managing Catalog Categories (Categories Tab)

Click **Categories** in the dashboard navigation:

* **View All Categories:** See all active categories, their display order, slugs, and live bag counts.
* **Add New Category:** Enter a name (e.g., *Velvet Potli Bags*), display order number, and click **+ Add Category**. The new category instantly appears in the storefront navigation and product forms.
* **Edit Category:** Click **✏️ Edit** on any category row to rename it or adjust its display order.
* **Disable Category:** Click **⏸️ Disable** to temporarily hide a category from the customer navigation.
* **Delete Category Guard:** A category **cannot** be deleted if it still has active bags assigned to it. This prevents accidental catalog corruption. Reassign or delete those bags first.

---

## 5. Discount Coupons (Coupons Tab)

Create promotional coupon codes for sales, festivals, or corporate clients:

1. **Coupon Code:** Enter promo code (e.g., `DIWALI20`, `WELCOME10`, `CORP15`).
2. **Discount %:** Enter the percentage discount (1 to 100).
3. **Min Purchase (₹):** Optional minimum cart value required to use the code (e.g., `1000` or `2500`).
4. **Expiry Date:** Optional calendar expiry date.
5. Click **+ Save Coupon**.
6. Customers can enter this code in their shopping cart. The discount is automatically calculated and included in the WhatsApp order message.
7. You can toggle any coupon **Active / Inactive** or delete it at any time.

---

## 6. Store Settings & Announcement Banner (Settings Tab)

Click **Store Settings** to manage business details:
* **Store Brand Name:** (Default: *JSM Bags*)
* **Primary Phone Number:** Contact number displayed across the website header and footer.
* **WhatsApp Number:** International format without plus (e.g., `919876543210`). All customer WhatsApp order messages are sent directly to this number!
* **Showroom Address:** Physical address shown in footer and contact sections.
* **Live Announcement Banner:** Toggle on/off and write custom messages (e.g., `🎉 Festive Bulk Sale: Flat 20% Off on all Jute & Canvas Return Bags!`).

---

## 7. Supabase Database & Storage Setup (One-Time)

To ensure all features work smoothly with your Supabase backend:

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Select your JSM Bags project (`ukckjaasspqqvdydnjih`).
3. Click **SQL Editor** in the left sidebar.
4. Open or copy the contents of `supabase-migration-v3.sql` from your project folder.
5. Paste into the SQL editor and click **Run**.
   * *This creates the `categories` table, updates `products` with columns for SKU, brand, colours, sizes, and variants, and configures the `bag-images` storage bucket.*
6. In **Storage**, ensure the `bag-images` bucket is set to **Public** so photos display on your live website.
7. In **Authentication > Users**, ensure your admin email (`admin@jsmbags.com`) has a secure password set.

---

## 8. Customer WhatsApp Ordering Flow

When a customer visits your website:
1. They browse products and select their preferred **Colour**, **Size**, and **Quantity** (Retail, Bulk, or Wholesale).
2. They add items to their Cart and can apply any active promo coupon.
3. When they click **Place Order via WhatsApp**, a pre-formatted message is automatically generated containing:
   - Complete item names, SKU, chosen colours, and sizes.
   - Exact quantities and pricing tier (Retail / Bulk / Wholesale).
   - Applied coupon discount and final order total.
   - Customer name, delivery address, and notes.
4. The message opens directly in WhatsApp to your configured business number for immediate order fulfillment!

---

*For technical assistance, Supabase credentials, or hosting questions, contact your website administrator.*
