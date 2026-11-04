# Mishra Ji Champaran Wale — Deployment & Configuration Guide

Yeh project **MERN Stack** (MongoDB, Express, React, Node.js) par bana hai aur Render par deploy karne ke liye 100% ready hai.

---

## 1. Local Testing (Abhi Live Running Hai)

- **Frontend Website:** [http://localhost:5173/](http://localhost:5173/)
- **Public Shops Directory:** [http://localhost:5173/shops](http://localhost:5173/shops)
- **Sample Shop Details Page:** [http://localhost:5173/shops/prakash-sweets](http://localhost:5173/shops/prakash-sweets)
- **Admin Login:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Backend API:** `http://localhost:5000/api`

### 🔑 Admin Credentials (Pre-seeded):
- **Email:** `admin@mishrajichamparanwale.com`
- **Password:** `Admin@123456`

*(Aap login karne ke baad Dashboard ya Shop Manager se koi bhi nayi shop, photo ya menu item add kar sakte hain).*

---

## 2. Render Deployment (Kaise Deploy Karein)

Aap Render par 2 services banayenge:

### A. Backend Service (Web Service on Render)
1. **GitHub Repository** ko Render se connect karein.
2. Select karein **New Web Service**.
3. Settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. **Environment Variables (Render Dashboard mein Add karein):**
   - `MONGODB_URI` = Aapka MongoDB Atlas connection string (Neeche Section 3 dekhein)
   - `JWT_SECRET` = `mishra_ji_super_secure_jwt_token_champaran_2026`
   - `ADMIN_EMAIL` = `admin@mishrajichamparanwale.com`
   - `ADMIN_PASSWORD` = `Aapka_Strong_Password`
   - `CLOUDINARY_CLOUD_NAME` = Aapka Cloudinary Cloud Name (Neeche Section 4 dekhein)
   - `CLOUDINARY_API_KEY` = Aapka Cloudinary API Key
   - `CLOUDINARY_API_SECRET` = Aapka Cloudinary API Secret
5. Deploy hone ke baad Render aapko ek URL dega, jaise:
   `https://mishra-ji-backend.onrender.com`

### B. Frontend Service (Static Site on Render)
1. Select karein **New Static Site**.
2. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. **Environment Variables:**
   - `VITE_API_URL` = `https://mishra-ji-backend.onrender.com` (Jo Backend ka URL mila)
4. **Redirects/Rewrites (SPA Routing):**
   - Render ke **Redirects/Rewrites** tab mein add karein:
     - **Source:** `/*`
     - **Destination:** `/index.html`
     - **Action:** `Rewrite`

---

## 3. Database: MongoDB Atlas (Free Cloud Database)
Render par local MongoDB nahi hota, isliye Cloud Database chahiye hota hai (jo bilkul Free hai):

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) par free account banayein.
2. Ek free cluster (M0 Free Tier) create karein.
3. **Database Access** mein jakar ek username aur password banayein (jaise user: `mishraji`, pass: `SecurePass123`).
4. **Network Access** mein jakar `0.0.0.0/0` (Allow Access from Anywhere) allow karein.
5. **Connect** par click karein -> **Drivers (Node.js)** choose karein.
6. Aapko aisa connection string milega:
   ```
   mongodb+srv://mishraji:<password>@cluster0.abcde.mongodb.net/mishrajichamparan?retryWrites=true&w=majority
   ```
7. Yeh string aapko Render ke `MONGODB_URI` mein dalna hai.

---

## 4. Cloudinary (Cloud Photo & PDF Storage)
Images aur Menu PDFs Render par store karne ke liye Cloudinary sabse best aur free service hai:

1. [cloudinary.com](https://cloudinary.com) par free sign up karein.
2. Dashboard par aapko 3 cheezein dikhengi:
   - **Cloud Name** (jaise: `dxyz1234`)
   - **API Key** (jaise: `123456789012345`)
   - **API Secret** (jaise: `abcdefghijklmnopqrstuvwxyz`)
3. Inhe Render ke Environment Variables mein daal dein.
*(Note: Jab tak aap Cloudinary credentials nahi dalte, project local storage `/uploads` use karta hai jo local testing ke liye 100% ready hai).*

