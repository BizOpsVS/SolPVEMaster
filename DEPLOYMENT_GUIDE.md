# 🚀 Quick Production Deployment Guide

## **Option 1: Vercel (Recommended for Frontend)**

### **Step 1: Prepare for Deployment**
```bash
# Build the application
npm run build

# Test the build locally
npm run preview
```

### **Step 2: Deploy to Vercel**
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure Environment Variables:**
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
   - `NEXT_PUBLIC_SOLANA_RPC_URL` - Solana RPC endpoint

### **Step 3: Custom Domain**
1. Add your domain in Vercel dashboard
2. Update DNS records
3. Enable SSL automatically

---

## **Option 2: Netlify**

### **Step 1: Build Configuration**
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Step 2: Deploy**
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

---

## **Option 3: AWS S3 + CloudFront**

### **Step 1: Build and Upload**
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

### **Step 2: Configure CloudFront**
1. Create CloudFront distribution
2. Set S3 as origin
3. Configure custom domain
4. Enable HTTPS

---

## **Backend Deployment Options**

### **Option 1: Vercel API Routes**
- Use Next.js API routes
- Deploy with frontend
- Good for simple APIs

### **Option 2: Railway**
- Easy PostgreSQL setup
- Automatic deployments
- Good for full-stack apps

### **Option 3: Supabase**
- PostgreSQL database
- Real-time subscriptions
- Built-in authentication

### **Option 4: AWS**
- EC2 for backend
- RDS for database
- More complex but scalable

---

## **Database Setup**

### **Option 1: Supabase (Recommended)**
1. Create account at supabase.com
2. Create new project
3. Get connection string
4. Run migrations

### **Option 2: PlanetScale**
1. Create account at planetscale.com
2. Create database
3. Get connection string
4. Run migrations

### **Option 3: Railway**
1. Create account at railway.app
2. Add PostgreSQL service
3. Get connection string
4. Run migrations

---

## **Environment Variables**

Create `.env.production`:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Solana
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
SOLANA_NETWORK="mainnet-beta"

# WalletConnect
WALLETCONNECT_PROJECT_ID="your-project-id"

# API Keys
COINGECKO_API_KEY="your-api-key"
DEXSCREENER_API_KEY="your-api-key"

# Security
JWT_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-encryption-key"
```

---

## **Quick Start Commands**

```bash
# 1. Build for production
npm run build

# 2. Test production build
npm run preview

# 3. Deploy to Vercel
vercel --prod

# 4. Set up database
npx prisma migrate deploy

# 5. Seed database
npm run db:seed
```

---

## **Monitoring Setup**

### **Vercel Analytics**
- Built-in performance monitoring
- User analytics
- Error tracking

### **Sentry**
- Error tracking
- Performance monitoring
- User feedback

### **Google Analytics**
- User behavior tracking
- Conversion tracking
- Custom events

---

## **Security Checklist**

- [ ] Enable HTTPS
- [ ] Set up CSP headers
- [ ] Configure CORS
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection

---

## **Performance Optimization**

- [ ] Enable compression
- [ ] Optimize images
- [ ] Code splitting
- [ ] Lazy loading
- [ ] CDN setup
- [ ] Caching strategy

---

**Your app is ready for production deployment!** 🎊

Choose your preferred hosting platform and follow the steps above. I recommend starting with Vercel for the frontend and Supabase for the database - they're the easiest to set up and scale.
