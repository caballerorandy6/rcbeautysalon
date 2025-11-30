# 📸 Where to Place Each Image

## 🖼️ LOCAL IMAGES (`/public/images/` folder)

### Logo and Branding
```
/public/images/logo/
├── logo.svg              → Header, navbar (150x50px)
├── logo-dark.svg         → Dark mode
└── logo-icon.svg         → Favicon, app icon (64x64px)
```

### Hero / Landing Page
```
/public/images/hero/
├── hero-bg.jpg           → Main hero background (1920x1080px)
└── salon-interior.jpg    → Salon photo for "About" section
```

### Placeholders (when there's no image)
```
/public/images/placeholders/
├── service-placeholder.svg    → Service card without photo
├── product-placeholder.svg    → Product card without photo
├── avatar-placeholder.svg     → User/staff avatar without photo
└── gallery-placeholder.svg    → Gallery without image
```

### Icons and Static Assets
```
/public/images/static/
├── payment-icons.png     → Visa, Mastercard, Amex (footer)
└── certifications.png    → Professional certificates
```

---

## ☁️ CLOUDINARY IMAGES (dynamic, from database)

### Services (`services/`)
```
cloudinary.com/services/
├── haircut.jpg           → Service: Haircut
├── coloring.jpg          → Service: Hair Coloring
├── manicure.jpg          → Service: Manicure
├── pedicure.jpg          → Service: Pedicure
├── facial.jpg            → Service: Facial
└── massage.jpg           → Service: Massage

Save in DB (Service table):
imageUrl: "services/haircut"
```

### Staff (`staff/`)
```
cloudinary.com/staff/
├── sarah-johnson.jpg     → Photo of Sarah Johnson
├── michael-brown.jpg     → Photo of Michael Brown
├── emma-davis.jpg        → Photo of Emma Davis
└── lisa-chen.jpg         → Photo of Lisa Chen

Save in DB (Staff table):
imageUrl: "staff/sarah-johnson"
```

### Products (`products/`)
```
cloudinary.com/products/
├── shampoo-premium.jpg   → Product: Premium Shampoo
├── conditioner.jpg       → Product: Conditioner
├── serum.jpg             → Product: Hair Serum
├── nail-polish-red.jpg   → Product: Red Nail Polish
└── face-cream.jpg        → Product: Face Cream

Save in DB (Product table):
imageUrl: "products/shampoo-premium"
```

### Gallery (`gallery/`)
```
cloudinary.com/gallery/
├── work-1.jpg            → Before/After work 1
├── work-2.jpg            → Before/After work 2
├── salon-1.jpg           → Salon photo 1
├── salon-2.jpg           → Salon photo 2
└── event-1.jpg           → Special event

Display on:
- Homepage (gallery section)
- "Our Work" page
```

---

## 📍 PAGE-BY-PAGE USAGE MAP

### 🏠 Homepage (`/`)
- **Hero background**: `/public/images/hero/hero-bg.jpg`
- **Logo**: `/public/images/logo/logo.svg`
- **Featured services**: Cloudinary `services/*`
- **Featured staff**: Cloudinary `staff/*`
- **Featured products**: Cloudinary `products/*`
- **Gallery**: Cloudinary `gallery/*`

### 🔐 Login/Register (`/login`, `/register`)
- **Logo**: `/public/images/logo/logo.svg`
- **Background**: `/public/images/hero/salon-interior.jpg` (optional)

### 📅 Booking (`/booking`)
- **Logo**: `/public/images/logo/logo.svg`
- **Available services**: Cloudinary `services/*`
- **Staff photos**: Cloudinary `staff/*`

### 🛍️ Shop (`/tienda`)
- **Logo**: `/public/images/logo/logo.svg`
- **Products**: Cloudinary `products/*`
- **Placeholder**: `/public/images/placeholders/product-placeholder.svg`

### 👤 My Account (`/mis-citas`)
- **Logo**: `/public/images/logo/logo.svg`
- **User avatar**: Cloudinary `users/*` or placeholder

### 🔧 Admin Dashboard (`/dashboard`)
- **Logo**: `/public/images/logo/logo.svg`
- **Service photos**: Cloudinary `services/*`
- **Staff photos**: Cloudinary `staff/*`
- **Product photos**: Cloudinary `products/*`

---

## 🎯 QUICK SUMMARY

| Type | Location | When to Use |
|------|----------|-------------|
| **Logo** | `/public/images/logo/` | Always |
| **Hero/Backgrounds** | `/public/images/hero/` | Static |
| **Services** | Cloudinary `services/` | Dynamic (DB) |
| **Staff** | Cloudinary `staff/` | Dynamic (DB) |
| **Products** | Cloudinary `products/` | Dynamic (DB) |
| **Gallery** | Cloudinary `gallery/` | Dynamic |
| **Placeholders** | `/public/images/placeholders/` | When image is missing |
| **Icons/Static** | `/public/images/static/` | Footer, badges |

---

## 🔑 ENVIRONMENT VARIABLE

Add to `.env`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
```

Get it from: https://console.cloudinary.com/
