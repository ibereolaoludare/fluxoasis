# 🥤 FluxOasis - Premium Beverages & Drinks

[![FluxOasis](https://img.shields.io/badge/FluxOasis-Premium%20Beverages-blue?style=for-the-badge&logo=react)](https://fluxoasis.vercel.app)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-green?style=for-the-badge)](https://fluxoasis.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-React%20%7C%20TypeScript%20%7C%20Supabase-blue?style=for-the-badge)](https://fluxoasis.vercel.app)

> **Your Ultimate Destination for Premium Beverages** 🚀

FluxOasis is a modern, full-stack e-commerce platform specializing in premium beverages and drinks. Built with cutting-edge technologies, it offers a seamless shopping experience with secure payments, real-time inventory management, and an intuitive admin dashboard.

![FluxOasis Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=FluxOasis+Preview)

## ✨ Features

### 🛍️ **E-Commerce Excellence**

-   **Product Catalog** - Browse 100+ premium beverages across categories
-   **Smart Cart System** - Persistent cart with localStorage and real-time updates
-   **Secure Checkout** - Paystack integration for seamless payments
-   **Order Management** - Track orders with real-time status updates
-   **Inventory Tracking** - Real-time stock management

### 🎨 **Modern UI/UX**

-   **Responsive Design** - Perfect experience on all devices
-   **Smooth Animations** - Framer Motion powered interactions
-   **Dark/Light Mode** - Theme switching capability
-   **Accessibility** - WCAG compliant design
-   **Performance Optimized** - React.memo and useMemo optimizations

### 🔐 **Authentication & Security**

-   **Supabase Auth** - Secure user authentication
-   **Role-Based Access** - Admin and user permissions
-   **Protected Routes** - Secure page access
-   **Data Validation** - Form validation and error handling

### 📊 **Admin Dashboard**

-   **Sales Analytics** - Real-time sales data and charts
-   **Product Management** - CRUD operations for products
-   **Order Processing** - Manage and update order status
-   **User Management** - Customer data and insights
-   **Inventory Control** - Stock level monitoring

### 🚀 **Performance & SEO**

-   **SEO Optimized** - Meta tags, structured data, sitemap
-   **PWA Ready** - Service worker and manifest
-   **Fast Loading** - Vite build optimization
-   **Search Engine Friendly** - Proper meta tags and schema

## 🛠️ Tech Stack

### **Frontend**

-   ![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
-   ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)
-   ![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF?style=flat-square&logo=vite)
-   ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-06B6D4?style=flat-square&logo=tailwindcss)

### **UI Components**

-   ![Radix UI](https://img.shields.io/badge/Radix%20UI-Primitive%20Components-161618?style=flat-square)
-   ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.0-0055FF?style=flat-square)
-   ![Phosphor Icons](https://img.shields.io/badge/Phosphor%20Icons-2.1.10-000000?style=flat-square)

### **Backend & Database**

-   ![Supabase](https://img.shields.io/badge/Supabase-2.50.3-3ECF8E?style=flat-square&logo=supabase)
-   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)

### **Payment & Analytics**

-   ![Paystack](https://img.shields.io/badge/Paystack-Payment%20Gateway-0BA4DB?style=flat-square)
-   ![Chart.js](https://img.shields.io/badge/Chart.js-5.3.0-FF6384?style=flat-square&logo=chart.js)

## 🚀 Quick Start

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   Supabase account

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/fluxoasis.git
    cd fluxoasis
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
    ```

4. **Start development server**

    ```bash
    npm run dev
    ```

5. **Build for production**
    ```bash
    npm run build
    ```

## 📁 Project Structure

```
fluxoasis/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── header.tsx     # Navigation header
│   │   │   ├── footer.tsx     # Site footer
│   │   │   ├── button.tsx     # Button components
│   │   │   └── ...
│   │   └── SEO.tsx            # SEO component
│   ├── pages/                  # Application pages
│   │   ├── Home.tsx           # Landing page
│   │   ├── Shop.tsx           # Product catalog
│   │   ├── Cart.tsx           # Shopping cart
│   │   ├── Admin.tsx          # Admin dashboard
│   │   └── ...
│   ├── lib/                   # Utility functions
│   ├── supabase.ts            # Supabase configuration
│   └── main.tsx               # Application entry
├── public/                    # Static assets
├── package.json
└── README.md
```

## 🎯 Key Features Deep Dive

### **Shopping Experience**

-   **Product Discovery**: Browse by categories (Soft Drinks, Energy, Juice, Water)
-   **Smart Search**: Find products quickly with search functionality
-   **Wishlist**: Save favorite items for later
-   **Real-time Inventory**: See stock levels in real-time

### **Payment Integration**

-   **Paystack Gateway**: Secure payment processing
-   **Multiple Payment Methods**: Cards, bank transfers, USSD
-   **Transaction Tracking**: Real-time payment status
-   **Receipt Generation**: Automatic order confirmations

### **Admin Capabilities**

-   **Dashboard Analytics**: Sales charts and metrics
-   **Product Management**: Add, edit, delete products
-   **Order Processing**: Update order status and track deliveries
-   **Customer Insights**: User data and purchase history

## 🔧 Configuration

### **Supabase Setup**

1. Create a new Supabase project
2. Set up the database schema
3. Configure authentication
4. Add environment variables

### **Paystack Integration**

1. Create a Paystack account
2. Get your public and secret keys
3. Configure webhook endpoints
4. Test payment flow

## 📱 Responsive Design

FluxOasis is fully responsive and optimized for:

-   📱 **Mobile** (320px - 768px)
-   📱 **Tablet** (768px - 1024px)
-   💻 **Desktop** (1024px+)

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
npm run build
vercel --prod
```

### **Netlify**

```bash
npm run build
netlify deploy --prod --dir=dist
```

### **Manual Deployment**

1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting provider
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Development Guidelines**

-   Follow TypeScript best practices
-   Use meaningful commit messages
-   Test your changes thoroughly
-   Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   **Supabase** for the amazing backend-as-a-service
-   **Paystack** for seamless payment processing
-   **Framer Motion** for beautiful animations
-   **Tailwind CSS** for the utility-first CSS framework
-   **Phosphor Icons** for the beautiful icon set

## 📞 Support

-   **Live Demo**: [https://fluxoasis.vercel.app](https://fluxoasis.vercel.app)
-   **Issues**: [GitHub Issues](https://github.com/yourusername/fluxoasis/issues)
-   **Email**: support@fluxoasis.com

---

<div align="center">

**Made with ❤️ by the Ibereola Oludare**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/fluxoasis?style=social)](https://github.com/yourusername/fluxoasis)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/fluxoasis?style=social)](https://github.com/yourusername/fluxoasis)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/fluxoasis)](https://github.com/yourusername/fluxoasis/issues)

</div>
