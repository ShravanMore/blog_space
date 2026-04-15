# BlogSpace Deployment Guide

## 🚀 Complete Step-by-Step Deployment Instructions

---

## Prerequisites
- GitHub account
- Credit/debit card (for verification, most services have free tiers)
- Your project code ready

---

## 📋 Deployment Options

### **Option A: Render + PlanetScale (Recommended - Easiest)**
### **Option B: Railway (All-in-one)**
### **Option C: Vercel + Railway**
### **Option D: VPS (DigitalOcean/AWS)**

---

## 🎯 OPTION A: Render + PlanetScale (FREE TIER)

### Step 1: Setup Database on PlanetScale

1. **Create PlanetScale Account**
   - Go to https://planetscale.com
   - Sign up with GitHub
   - Click "Create database"
   - Name: `blogspace-db`
   - Region: Choose closest to you
   - Plan: Select "Hobby" (Free)

2. **Setup Database Schema**
   - Click "Console" tab
   - Copy and paste your `database_setup.sql` content
   - Execute the SQL commands

3. **Get Connection String**
   - Click "Connect" button
   - Select "Node.js"
   - Copy the connection details:
     ```
     Host: xxxxx.us-east-1.psdb.cloud
     Username: xxxxx
     Password: xxxxx
     Database: blogspace-db
     ```

### Step 2: Push Code to GitHub

```bash
cd blog_space
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blogspace.git
git push -u origin main
```

### Step 3: Deploy Backend API on Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `blogspace` repository

3. **Configure Backend Service**
   ```
   Name: blogspace-api
   Region: Choose closest
   Branch: main
   Root Directory: api
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**
   Click "Environment" tab and add:
   ```
   PORT=3000
   DB_HOST=xxxxx.us-east-1.psdb.cloud
   DB_USER=xxxxx
   DB_PASSWORD=xxxxx
   DB_NAME=blogspace-db
   JWT_SECRET=your_super_secret_jwt_key_12345
   CLIENT_URL=https://your-frontend-url.onrender.com
   NODE_ENV=production
   ```
   (You'll update CLIENT_URL after deploying frontend)

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your API URL: `https://blogspace-api.onrender.com`

### Step 4: Deploy Frontend on Render

1. **Create Another Web Service**
   - Click "New +" → "Static Site"
   - Select same repository

2. **Configure Frontend**
   ```
   Name: blogspace-frontend
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Add Environment Variable**
   ```
   VITE_API_URL=https://blogspace-api.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Copy your frontend URL: `https://blogspace-frontend.onrender.com`

5. **Update Backend Environment**
   - Go back to your API service
   - Update `CLIENT_URL` to your frontend URL
   - Service will auto-redeploy

### Step 5: Fix File Upload Issue

Since Render's filesystem is ephemeral, you need cloud storage:

**Option 1: Use Cloudinary (Recommended)**

1. Sign up at https://cloudinary.com (free tier)
2. Install in API:
   ```bash
   cd api
   npm install cloudinary multer-storage-cloudinary
   ```
3. Update your upload configuration (I can help with this)

**Option 2: Use AWS S3**
- More complex but scalable

---

## 🎯 OPTION B: Railway (Easiest All-in-One)

### Step 1: Create Railway Account
- Go to https://railway.app
- Sign up with GitHub
- Add payment method (free $5 credit monthly)

### Step 2: Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

### Step 3: Deploy Database
- Click "New" → "Database" → "MySQL"
- Railway automatically provisions MySQL
- Copy connection details from "Variables" tab

### Step 4: Deploy Backend
- Click "New" → "GitHub Repo"
- Select your repo
- Configure:
  ```
  Root Directory: api
  Start Command: npm start
  ```
- Add environment variables (same as above)
- Railway auto-detects Node.js

### Step 5: Deploy Frontend
- Click "New" → "GitHub Repo" again
- Configure:
  ```
  Root Directory: client
  Build Command: npm run build
  Start Command: npm run preview
  ```
- Add `VITE_API_URL` environment variable

### Step 6: Setup Custom Domains (Optional)
- Railway provides free `.railway.app` domains
- Or connect your own domain

---

## 🎯 OPTION C: Vercel + Railway MySQL

### Backend on Railway (Same as Option B, Steps 1-4)

### Frontend on Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repo
   - Configure:
     ```
     Framework Preset: Vite
     Root Directory: client
     Build Command: npm run build
     Output Directory: dist
     ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-railway-api-url.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Get your URL: `https://blogspace.vercel.app`

---

## 🎯 OPTION D: VPS Deployment (Advanced)

### Using DigitalOcean Droplet

1. **Create Droplet**
   - Ubuntu 22.04 LTS
   - $6/month plan
   - Add SSH key

2. **Connect via SSH**
   ```bash
   ssh root@your_droplet_ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   
   # Install MySQL
   apt install -y mysql-server
   mysql_secure_installation
   
   # Install Nginx
   apt install -y nginx
   
   # Install PM2
   npm install -g pm2
   ```

4. **Setup MySQL**
   ```bash
   mysql -u root -p
   ```
   Run your `database_setup.sql`

5. **Clone and Setup Project**
   ```bash
   cd /var/www
   git clone https://github.com/YOUR_USERNAME/blogspace.git
   cd blogspace
   
   # Setup API
   cd api
   npm install
   cp .env.example .env
   nano .env  # Edit with your values
   pm2 start index.js --name blogspace-api
   pm2 save
   pm2 startup
   
   # Build Frontend
   cd ../client
   npm install
   npm run build
   ```

6. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/blogspace
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;
       
       # Frontend
       location / {
           root /var/www/blogspace/client/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # API
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/blogspace /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d your_domain.com
   ```

---

## 🔧 Post-Deployment Checklist

- [ ] Database is accessible and tables created
- [ ] Backend API responds at `/api/posts`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] Login/logout works
- [ ] Creating posts works
- [ ] Image upload works (or migrated to cloud storage)
- [ ] Environment variables are set correctly
- [ ] CORS is configured for production URLs
- [ ] SSL certificate is active (HTTPS)

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Update `CLIENT_URL` in backend environment variables to match your frontend URL

### Issue 2: Database Connection Failed
**Solution**: Check DB credentials, ensure database is running, whitelist IP addresses

### Issue 3: Images Not Loading
**Solution**: Migrate to Cloudinary or S3 for production file storage

### Issue 4: 502 Bad Gateway
**Solution**: Check if backend is running, verify PORT environment variable

### Issue 5: Build Fails
**Solution**: Check Node.js version compatibility, clear cache and rebuild

---

## 📊 Monitoring & Maintenance

1. **Setup Monitoring**
   - Use Render/Railway built-in logs
   - Consider UptimeRobot for uptime monitoring

2. **Database Backups**
   - PlanetScale: Automatic backups
   - Railway: Enable backup add-on
   - VPS: Setup cron job for mysqldump

3. **Updates**
   ```bash
   git pull origin main
   # Rebuild and redeploy
   ```

---

## 💰 Cost Breakdown

### Free Tier (Render + PlanetScale)
- Database: Free (5GB storage)
- Backend: Free (sleeps after inactivity)
- Frontend: Free
- **Total: $0/month**

### Railway
- $5 free credit/month
- Typically $5-10/month after credit
- **Total: ~$5-10/month**

### VPS (DigitalOcean)
- Droplet: $6/month
- Domain: ~$12/year
- **Total: ~$7/month**

---

## 🎓 Recommended Path for Beginners

1. **Start with Railway** - Easiest, everything in one place
2. **Then try Render + PlanetScale** - Learn to connect services
3. **Finally VPS** - Full control, best for learning

---

## 📞 Need Help?

If you encounter issues:
1. Check the service logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Check database connectivity

---

## 🎉 You're Ready!

Choose your deployment option and follow the steps. Start with Railway if you're unsure - it's the quickest path to getting your blog live!
