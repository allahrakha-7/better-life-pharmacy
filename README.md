# Better Life Pharmacy 💊✨

A premium, modern, and fully responsive e-commerce web application for authentic pharmaceutical products, medical supplies, and wellness essentials. Built with the MERN stack (MongoDB, Express, React, Node.js), featuring a fluid UI, dynamic product filters, doctor prescription uploads via Cloudinary, and a comprehensive admin management dashboard.

---

## 🚀 Key Features

* **💎 Gorgeous & Fluid UI**: High-end styling powered by TailwindCSS with Outfit typography, custom animations, glassmorphism layers, and responsive layouts.
* **📱 Fully Responsive Design**: Mobile-first grid layouts, responsive navigation header, and a collapsible mobile filter sidebar for a seamless browsing experience.
* **🔍 Smart Search & Categorized Filters**: Real-time search suggestions with a price slider and dynamic categorization list.
* **prescription Required Flow**: Supports dynamic image uploading of doctor prescriptions for specialized medicines, with fallbacks.
* **📦 Complete Admin Panel**:
  * Manage inventory: Create, edit, and delete medicines with image upload previews (supported by Cloudinary).
  * Update stock statuses instantly.
  * Verify customer prescriptions.
* **🔐 Persistent Auth & "Keep me logged in"**: Clean session management synchronizing tokens between `sessionStorage` (for temporary sessions) and `localStorage` (for persistent log-ins).

---

## 🛠️ Technology Stack

### Frontend

* **Core**: React 18, Vite
* **Styling**: TailwindCSS, Lucide React (for icons)
* **State & Networking**: Axios, React Context API

### Backend

* **Runtime & Framework**: Node.js, Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Media Uploads**: Cloudinary integration with local disk backup
* **Security & Auth**: JSON Web Tokens (JWT), bcryptjs

---

## 🔑 Demo Admin Credentials

* **Email**: `admin@betterlife.com`
* **Password**: `admin1234@`

---

## ⚙️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) installed
* [MongoDB](https://www.mongodb.com/) running locally or an Atlas connection string

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/better-life-pharmacy.git
   cd better-life-pharmacy
   ```

2. **Backend Configuration**

   Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

   Create a `.env` file in the `backend/` directory:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/betterlife
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=dd4kaitne
   CLOUDINARY_API_KEY=517481697424924
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
   ```

   Install dependencies and start development server:

   ```bash
   npm install
   npm run dev
   ```

3. **Frontend Configuration**

   Navigate to the `frontend` folder:

   ```bash
   cd ../frontend
   ```

   Install dependencies and start development server:

   ```bash
   npm install
   npm run dev -- --host
   ```

Open your browser and visit: `http://localhost:5173` to explore Better Life Pharmacy!
