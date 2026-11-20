# JSM BAGS RAJAHMUNDRY — CLIENT HANDOVER & ADMIN OPERATIONS GUIDE
**Version:** 3.0 Production  
**Website:** JSM Bags (Jai Sundha Mata Bags And Decoration)  
**Location:** Innes Peta, Rajahmundry, Andhra Pradesh, India  
**WhatsApp / Phone:** +91 94408 63516  

---

## 1. What the Admin Dashboard Does

The JSM Bags Admin Dashboard empowers the store owner and non-technical staff to independently operate the entire online storefront without editing any HTML, CSS, or JavaScript code.

From this single, private control center, you can:
- **Add New Bag Products** with automated browser-side WebP photo compression (~120KB avg per photo for ultra-fast customer loading and zero-cost Supabase storage).
- **Manage Product Sizes & Dimensions** (e.g., 8×10, 10×12, 12×14, 18×10) with optional size-specific pricing.
- **Set Retail, Bulk (50+ pcs), and Wholesale (250+ pcs) Prices** with automatic tier discount calculations.
- **Edit or Delete Products** with real-time storefront synchronization and automated storage cleanup.
- **Hide / Publish Products** with a single click (instant visibility toggle).
- **Create & Manage Discount Promo Coupons** (e.g., `JSM10`, `FESTIVE15`, `WELCOME5`) with minimum purchase conditions and expiry dates.
- **Update Store Information** (store name, phone numbers, WhatsApp, and live announcement banner).

All changes are saved permanently to your live **Supabase Cloud Database** and reflected across customer cards, detail views, and WhatsApp checkout instantly.

---

## 2. How the Client Logs In

1. Scroll to the very bottom of any page on [JSM Bags](file:///d:/jsm-bags-v3/index.html).
2. Click the subtle **"Admin / Manage Store"** button located in the footer copyright strip.
3. The secure login window will appear:
   - **Admin Email:** `admin@jsmbags.com` (or your registered admin email)
   - **Admin Password:** Enter your secure password (passwords are never saved in code or localStorage).
4. Click **"Sign In to Dashboard"**.
5. Once authenticated, your full SaaS store dashboard will open immediately.
6. If you refresh the page while still signed in, clicking the Admin link opens the dashboard directly without asking for your password again.

---

## 3. How to Add a New Product

1. In the Admin Dashboard sidebar, click **"Add Product"** (or "+ Add New Product" from the Overview).
2. **Category:** Choose one of the 19 standard categories from the dropdown (e.g., *Canvas Bags, Potli Bags, Jute Bags, Laptop Bags*).
3. **Subcategory (Optional):** Enter style details (e.g., *Digital Print Canvas, Round Potli, Ergonomic Backpack*).
4. **Product Name:** Enter the title (e.g., *Canvas Digital Peacock Tote Bag*).
5. **Description:** Enter description, materials, care instructions, and event suitability.
6. **Retail Price (₹):** Enter the single-piece retail price.
7. **Bulk & Wholesale Rates:** Enter specific prices or leave blank to automatically calculate standard wholesale tiers (68% bulk / 50% wholesale).
8. **Sizes:** See Section 5 below to add one or more sizes.
9. **Photo Upload:** Select an image from your computer or phone (`.jpg`, `.jpeg`, `.png`, `.webp`).
   - The browser automatically compresses the photo to high-resolution WebP format and shows you the before-and-after size savings.
10. Click **"Publish Product"**. The product is immediately live on your storefront!

---

## 4. How to Upload and Replace Product Images

- **When adding a product:** Click **"Main Product Image"** to choose your file. You can also select additional photos under **"Additional Gallery Photos"** for alternate views or back-side prints.
- **When replacing a photo:**
  1. Go to the **"Products"** tab.
  2. Click **"Edit"** on the product you want to change.
  3. Under Section 4 (*Product Images*), choose a new file.
  4. Click **"Save Changes"**.
  5. The new photo will be uploaded to Supabase Storage, and the old photo will be automatically deleted from cloud storage to keep your usage minimal.

---

## 5. How to Add Sizes & Variant Options

Every bag can have one standard size or multiple custom sizes:

1. In the product form, locate Section 3: **"Product Sizes & Dimensions"**.
2. Click **"+ Add Size Option"** to add a new row:
   - **Size Name:** e.g., `8x10 inches`, `10x12 inches`, `12x14 inches`, `Compact`, `Jumbo`.
   - **Capacity / Notes:** e.g., `Holds 5 kg`, `Standard Thamboolam Size`, `Fits 16" Laptop`.
   - **Price Offset (₹):** Extra cost for larger sizes (e.g., `0` for base size, `20` for medium, `40` for large).
3. Customers clicking on this product will see interactive size pills (`8x10`, `10x12`, `12x14`). Selecting a size updates the displayed price and passes the exact dimensions to WhatsApp!

---

## 6. How to Change Prices

### Method A: Quick Inline Price Editor (Fastest)
1. Go to the **"Products"** tab.
2. Find the bag you want to edit.
3. In the **"Retail Price (₹)"** box, enter the new price.
4. Click **"Save"**. The price updates on the storefront in real time!

### Method B: Full Product Edit
1. Click **"Edit"** on any product row.
2. Adjust the Retail, Original MRP, Bulk, or Wholesale rates.
3. Click **"Save Changes"**.

---

## 7. How to Edit, Hide, or Delete a Product

- **Full Edit:** Click **"✏️ Edit"** on any product in the **"Products"** tab to modify description, sizes, photos, badges, or categories.
- **Hide from Customers:** Click **"🚫 Hide"** to temporarily remove the product from the storefront without deleting it. When you are ready to sell it again, click **"👁️ Publish"**.
- **Permanent Delete:** Click **"🗑️ Delete"**. A confirmation window will appear showing the bag name. Deleting safely removes the product from your catalog and permanently purges its images from Supabase Storage.

---

## 8. How to Create & Manage Coupon Codes

1. In the Admin Dashboard sidebar, click **"Coupons"**.
2. Fill in the **"Create New Promo Coupon"** form:
   - **Coupon Code:** e.g., `FESTIVE20`, `WEDDING15`, `JSM10` (automatically capitalized).
   - **Discount %:** Enter any percentage between 1% and 100%.
   - **Minimum Purchase (Optional):** e.g., `1000` (customers must have at least ₹1,000 in their cart to use this coupon).
   - **Expiry Date (Optional):** Select a date when the promotion should end.
3. Click **"+ Save Coupon"**.
4. **Instant Storefront Verification:** Customers can immediately type this code in their shopping cart. Valid codes display savings (e.g., *Code FESTIVE20 applied: 20% OFF*), recalculate cart totals, and pass the discount to WhatsApp!
5. **To pause or delete:** Use the **Toggle Switch** to deactivate a coupon temporarily, or click **"Delete"** to remove it completely.

---

## 9. How to Update Store Settings

1. In the Admin Dashboard sidebar, click **"Store Settings"**.
2. You can update:
   - **Store Brand Name:** e.g., *JSM Bags*
   - **Contact Phone Display:** e.g., *+91 94408 63516*
   - **WhatsApp Number:** e.g., *919440863516* (country code + mobile number)
   - **Store Address:** Factory & showroom address
   - **Announcement Banner:** Promotional marquee at top of website
3. Click **"Save Store Settings"**.

---

## 10. How to Log Out

1. Click **"Sign Out"** in the top-right header of the dashboard, or go to **"Account / Logout"** in the sidebar and click **"Sign Out of Admin"**.
2. Your session token is immediately cleared from Supabase Auth. Unauthenticated visitors cannot access administrative actions.

---

## 11. What to Do if You Forget Your Admin Password

Because authentication is managed directly by your Supabase project:
1. Log into your [Supabase Cloud Dashboard](https://supabase.com/dashboard).
2. Select your JSM Bags project.
3. Go to **Authentication** -> **Users**.
4. Find `admin@jsmbags.com`.
5. Click the three dots (`...`) -> **"Send Password Reset"** or **"Update User"** to set a new password.

---

## 12. Supabase Pre-Launch Configuration Checklist

Before handing over to the client, perform these two one-time steps in your Supabase project:

### Step 1: Run the Database Migration
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **"New query"**.
3. Open the file [`supabase-migration-v2.sql`](file:///d:/jsm-bags-v3/supabase-migration-v2.sql) in this repository, copy its entire contents, paste it into the editor, and click **"RUN"**.
4. You will see `JSM Bags Supabase V2 Migration successfully applied!`.

### Step 2: (Optional) Strict UUID Locking
If you wish to lock write operations strictly to a single admin user UUID:
1. Go to **Authentication** -> **Users**.
2. Copy the **User UID** for `admin@jsmbags.com`.
3. In SQL Editor, run Section 7 of [`supabase-migration-v2.sql`](file:///d:/jsm-bags-v3/supabase-migration-v2.sql#L210) with your copied UID.

---
*Prepared by Antigravity Engineering for JSM Bags, Rajahmundry.*
