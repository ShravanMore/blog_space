# ✅ Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deploying your blog.

---

## 📋 Local Setup Verification

### Database
- [ ] MySQL is installed and running
- [ ] Database `blog` exists
- [ ] Tables created (users, posts, likes)
- [ ] Can connect to database from API

### Backend (API)
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file exists with all variables
- [ ] Database credentials correct in `.env`
- [ ] JWT_SECRET set in `.env`
- [ ] Server starts without errors (`npm run dev`)
- [ ] API responds at http://localhost:3000

### Frontend (Client)
- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file exists
- [ ] VITE_API_URL points to backend
- [ ] App starts without errors (`npm run dev`)
- [ ] Can access at http://localhost:5173

### Cloudinary Setup
- [ ] Cloudinary account created
- [ ] Email verified
- [ ] Cloudinary packages installed (`cloudinary`, `multer-storage-cloudinary`)
- [ ] Credentials added to `api/.env`
- [ ] Test upload successful
- [ ] Image appears in Cloudinary dashboard

---

## 🧪 Feature Testing

### Authentication
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can logout
- [ ] Protected routes work (redirects to login)
- [ ] JWT token stored in cookies

### Blog Posts
- [ ] Can create new post
- [ ] Can view all posts on homepage
- [ ] Can view single post
- [ ] Can edit own post
- [ ] Can delete own post
- [ ] Rich text editor works
- [ ] Categories work

### Images
- [ ] Can upload image when creating post
- [ ] Image displays in post
- [ ] Image URL starts with `https://res.cloudinary.com/`
- [ ] Image appears in Cloudinary Media Library
- [ ] Can create post without image

### Interactions
- [ ] Can like/unlike posts
- [ ] Like count updates
- [ ] View count increments
- [ ] Related posts show up

---

## 📦 Code Preparation

### Git Repository
- [ ] Git initialized (`git init`)
- [ ] `.gitignore` files present
- [ ] `.env` files NOT committed (check with `git status`)
- [ ] All changes committed
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub

### Environment Files
- [ ] `api/.env.example` exists with all variables
- [ ] `client/.env.example` exists
- [ ] Actual `.env` files excluded from git
- [ ] No sensitive data in committed code

### Dependencies
- [ ] `package.json` has all dependencies
- [ ] `package-lock.json` committed
- [ ] No missing dependencies
- [ ] Cloudinary packages in `api/package.json`

---

## 🚀 Deployment Platform Choice

Choose ONE platform and check its requirements:

### Option A: Railway
- [ ] Railway account created
- [ ] GitHub connected
- [ ] Payment method added (for free credits)
- [ ] Ready to deploy

### Option B: Render + PlanetScale
- [ ] Render account created
- [ ] PlanetScale account created
- [ ] GitHub connected to Render
- [ ] Ready to deploy

### Option C: Vercel + Railway
- [ ] Vercel account created
- [ ] Railway account created
- [ ] GitHub connected
- [ ] Ready to deploy

### Option D: VPS
- [ ] VPS purchased (DigitalOcean, AWS, etc.)
- [ ] SSH access configured
- [ ] Domain name purchased (optional)
- [ ] Ready to setup

---

## 🔑 Environment Variables Ready

### For Backend Deployment
Have these values ready to paste:

```
PORT=3000
DB_HOST=_______________
DB_USER=_______________
DB_PASSWORD=_______________
DB_NAME=blog
JWT_SECRET=_______________
CLIENT_URL=_______________
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=_______________
CLOUDINARY_API_KEY=_______________
CLOUDINARY_API_SECRET=_______________
```

### For Frontend Deployment
```
VITE_API_URL=_______________
```

---

## 📝 Information to Have Ready

### Database Info
- Host: _______________
- Username: _______________
- Password: _______________
- Database name: blog
- Port: 3306 (usually)

### Cloudinary Info
- Cloud Name: _______________
- API Key: _______________
- API Secret: _______________

### JWT Secret
- Generate a random string (32+ characters)
- Example: `openssl rand -base64 32`

---

## 🎯 Deployment Steps Overview

### 1. Setup Database
- [ ] Create production database
- [ ] Run `database_setup.sql`
- [ ] Note connection details

### 2. Deploy Backend
- [ ] Create web service
- [ ] Connect GitHub repo
- [ ] Set root directory to `api`
- [ ] Add all environment variables
- [ ] Deploy and get URL

### 3. Deploy Frontend
- [ ] Create static site/web service
- [ ] Connect GitHub repo
- [ ] Set root directory to `client`
- [ ] Add `VITE_API_URL` environment variable
- [ ] Deploy and get URL

### 4. Update CORS
- [ ] Update `CLIENT_URL` in backend environment
- [ ] Redeploy backend if needed

### 5. Test Production
- [ ] Visit frontend URL
- [ ] Test registration
- [ ] Test login
- [ ] Test creating post with image
- [ ] Verify image in Cloudinary
- [ ] Test all features

---

## 🐛 Common Issues Checklist

If something doesn't work:

### Backend Issues
- [ ] Check deployment logs
- [ ] Verify all environment variables set
- [ ] Check database connection
- [ ] Verify Cloudinary credentials
- [ ] Check CORS settings

### Frontend Issues
- [ ] Check browser console for errors
- [ ] Verify `VITE_API_URL` is correct
- [ ] Check network tab for failed requests
- [ ] Verify backend is running

### Database Issues
- [ ] Database exists
- [ ] Tables created
- [ ] Connection string correct
- [ ] IP whitelist configured (if needed)

### Image Upload Issues
- [ ] Cloudinary credentials correct
- [ ] Account verified
- [ ] Check Cloudinary dashboard for errors
- [ ] File size under 10MB
- [ ] File is an image type

---

## 📊 Post-Deployment Verification

After deployment:

### Functionality
- [ ] Can access website
- [ ] HTTPS working (SSL certificate)
- [ ] Can register new user
- [ ] Can login
- [ ] Can create post
- [ ] Can upload image
- [ ] Images load correctly
- [ ] Can like posts
- [ ] Can edit/delete own posts

### Performance
- [ ] Pages load quickly
- [ ] Images load from Cloudinary CDN
- [ ] No console errors
- [ ] Mobile responsive

### Security
- [ ] HTTPS enabled
- [ ] Environment variables not exposed
- [ ] CORS configured correctly
- [ ] JWT authentication working

---

## 🎉 Ready to Deploy?

If you've checked all the boxes above, you're ready!

### Next Steps:
1. Choose your deployment platform
2. Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. Deploy and test
4. Share your blog with the world! 🌍

---

## 📞 Need Help?

- **Setup Issues**: See [SETUP_SUMMARY.md](./SETUP_SUMMARY.md)
- **Cloudinary Issues**: See [CLOUDINARY_VISUAL_GUIDE.md](./CLOUDINARY_VISUAL_GUIDE.md)
- **Deployment Issues**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **General Info**: See [README.md](./README.md)

---

## 💡 Pro Tips

1. **Test locally first** - Make sure everything works before deploying
2. **Start simple** - Use Railway or Render for easiest deployment
3. **Keep credentials safe** - Never commit `.env` files
4. **Monitor usage** - Check Cloudinary dashboard regularly
5. **Backup database** - Export your data regularly
6. **Use HTTPS** - Most platforms provide this automatically
7. **Test on mobile** - Ensure responsive design works

---

Good luck with your deployment! 🚀
