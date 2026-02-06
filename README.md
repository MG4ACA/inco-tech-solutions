# 🖥️ Inco Tech Solutions

> **Premium Computer Retail & Repair Service** — Built with Vue.js 3, PrimeVue (Aura Dark Theme), Node.js/Express, and MySQL.

---

## 📁 Project Structure

```
inco-tech-solutions/
├── client/                          # Vue.js 3 Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── api/                     # Axios API service layer
│   │   │   └── index.js
│   │   ├── assets/styles/           # Custom CSS
│   │   │   └── main.css
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Footer.vue
│   │   │   ├── HeroSection.vue
│   │   │   ├── Navbar.vue
│   │   │   ├── ProductCard.vue      # ⭐ Product card component
│   │   │   ├── ProductSkeleton.vue  # Loading skeleton
│   │   │   └── RepairForm.vue       # ⭐ Repair booking dialog
│   │   ├── composables/             # Vue composables
│   │   │   └── useTheme.js
│   │   ├── router/                  # Vue Router config
│   │   │   └── index.js
│   │   ├── views/                   # Page views
│   │   │   ├── CatalogPage.vue      # Product catalog with filters
│   │   │   ├── HomePage.vue         # Landing page with hero
│   │   │   ├── ProductDetail.vue    # Product specs & details
│   │   │   └── admin/               # Admin dashboard
│   │   │       ├── AdminLayout.vue
│   │   │       ├── CategoryManagement.vue
│   │   │       ├── Dashboard.vue
│   │   │       ├── ProductManagement.vue
│   │   │       └── RepairRequests.vue
│   │   ├── App.vue                  # Root component
│   │   └── main.js                  # ⭐ App entry + PrimeVue config
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                          # Node.js/Express Backend
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── middleware/
│   │   └── upload.js                # Multer image upload
│   ├── routes/
│   │   ├── categories.js            # Category CRUD API
│   │   ├── products.js              # Product CRUD API
│   │   └── repairs.js               # Repair request API
│   ├── uploads/                     # Uploaded product images
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # ⭐ Express server entry
├── database/
│   └── schema.sql                   # MySQL schema + seed data
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MySQL** >= 8.0
- **npm** or **yarn**

### 1. Database Setup

```bash
# Login to MySQL and run the schema
mysql -u root -p < database/schema.sql
```

This creates the `inco_tech_solutions` database with tables and seed data.

### 2. Backend Setup

```bash
cd server
npm install

# Edit .env with your MySQL credentials if needed
# Default: root with no password on localhost

npm run dev    # Development with nodemon
# or
npm start      # Production
```

The API will start on **http://localhost:5000**.

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will start on **http://localhost:3000** with API proxy to the backend.

---

## 🔌 API Endpoints

### Products

| Method | Endpoint            | Description                                      |
| ------ | ------------------- | ------------------------------------------------ |
| GET    | `/api/products`     | List products (with filters, pagination, search) |
| GET    | `/api/products/:id` | Get product by ID or slug                        |
| POST   | `/api/products`     | Create product (multipart/form-data)             |
| PUT    | `/api/products/:id` | Update product                                   |
| DELETE | `/api/products/:id` | Delete product                                   |

### Categories

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/categories`     | List all categories |
| POST   | `/api/categories`     | Create category     |
| PUT    | `/api/categories/:id` | Update category     |
| DELETE | `/api/categories/:id` | Delete category     |

### Repair Requests

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/api/repairs`     | List repair requests          |
| POST   | `/api/repairs`     | Submit new repair request     |
| PUT    | `/api/repairs/:id` | Update repair request (admin) |

### Dashboard

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/dashboard/stats` | Get dashboard statistics |

---

## 🎨 Tech Stack

- **Frontend:** Vue.js 3 (Composition API) + Vue Router 4
- **UI Library:** PrimeVue 4 with Aura Dark Theme + PrimeFlex
- **Backend:** Node.js + Express.js
- **Database:** MySQL with mysql2 driver
- **Image Upload:** Multer
- **HTTP Client:** Axios
- **Build Tool:** Vite

---

## 🎯 Features

### Public Website

- ✅ Hero section with CTA buttons
- ✅ Dynamic product catalog with DataView filtering
- ✅ Product detail page with technical specs
- ✅ Repair booking dialog (PrimeVue Dialog)
- ✅ Skeleton loading screens
- ✅ Dark/Light mode toggle
- ✅ Responsive design

### Admin Dashboard (`/admin`)

- ✅ Dashboard with statistics overview
- ✅ Product CRUD with DataTable
- ✅ Category management
- ✅ Inventory status toggle (In Stock/Out of Stock/Sold)
- ✅ Product image upload (FileUpload)
- ✅ Repair request management with status tracking

---

## 📝 License

© 2026 Inco Tech Solutions. All rights reserved.
