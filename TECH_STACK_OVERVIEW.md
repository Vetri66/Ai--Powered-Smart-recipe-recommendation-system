# 🍳 Smart Recipe System - Tech Stack Overview

## 🚀 **Core Framework & Runtime**
- **Next.js 15.2.4** - React framework with App Router, SSR, and API routes
- **React 19** - Frontend library with latest features
- **TypeScript 5** - Type-safe JavaScript development
- **Node.js** - Server-side runtime environment

## 🎨 **UI & Styling**
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Framer Motion** - Advanced animations and transitions
- **Radix UI** - Accessible, unstyled UI components
  - Dialogs, Dropdowns, Tooltips, Tabs, Progress bars, etc.
- **Lucide React** - Beautiful SVG icons
- **Geist Font** - Modern typography (Sans & Mono)
- **Next Themes** - Dark/light mode support

## 🤖 **AI & Machine Learning**
- **OpenAI API** - GPT-powered recipe generation
- **Google Gemini AI** - Alternative AI model integration
- **AI SDK React** - React hooks for AI interactions
- **Tesseract.js** - OCR for ingredient recognition from images

## 🗄️ **Database & Backend**
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Auth** - User authentication and authorization
- **Supabase SSR** - Server-side rendering support
- **SWR** - Data fetching with caching and revalidation

## 📊 **Data Visualization & Charts**
- **Recharts** - Responsive charts for nutrition analytics
- **React Day Picker** - Calendar components for meal planning

## 🛠️ **Development Tools**
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixes
- **ESLint** - Code linting and quality checks
- **Tailwind Merge** - Utility class merging
- **Class Variance Authority** - Component variant management

## 📱 **User Experience**
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **CMDK** - Command palette interface
- **Input OTP** - One-time password inputs
- **Vaul** - Mobile-friendly drawer components

## 🎛️ **Interactive Components**
- **Embla Carousel** - Touch-friendly carousels
- **React Resizable Panels** - Resizable layout panels
- **React Router DOM** - Client-side routing

## 📈 **Analytics & Monitoring**
- **Vercel Analytics** - Performance and usage analytics

## 🏗️ **Project Structure**
```
smartrecipesystem/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── home/              # Home page
│   ├── planner/           # Meal planner
│   ├── shopping/          # Shopping list
│   └── profile/           # User profile
├── components/            # Reusable UI components
├── src/
│   ├── context/          # React Context providers
│   ├── data/             # Static data and mock data
│   └── components/       # Additional components
├── lib/                  # Utility functions and configs
└── public/               # Static assets
```

## 🔧 **Key Features Implemented**

### 🤖 **AI-Powered Features**
- Recipe generation from ingredients using OpenAI
- Smart ingredient suggestions
- Nutrition optimization recommendations
- Shopping list optimization

### 📱 **Core Functionality**
- Recipe search and filtering
- Meal planning calendar
- Shopping list management
- Favorite recipes system
- User authentication
- Dark/light mode
- Responsive design

### 🎨 **UI/UX Features**
- Smooth animations with Framer Motion
- Accessible components with Radix UI
- Modern design with Tailwind CSS
- Interactive charts and visualizations
- Mobile-optimized interface

## 🌐 **Deployment & Hosting**
- **Vercel** - Optimized for Next.js deployment
- **Environment Variables** - Secure API key management
- **Edge Functions** - Fast global performance

## 🔐 **Security & Authentication**
- Supabase Row Level Security (RLS)
- JWT-based authentication
- Secure API key management
- Environment variable protection

## 📊 **Performance Optimizations**
- Next.js Image optimization
- Lazy loading components
- SWR caching strategies
- Code splitting and tree shaking
- Static generation where possible

## 🧪 **Development Workflow**
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

This tech stack provides a modern, scalable, and maintainable foundation for the Smart Recipe System with AI integration, real-time features, and excellent user experience.