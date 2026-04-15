# BlogSpace - Full Stack Blog Application

A modern, full-stack blog platform built with React, Node.js, Express, and MySQL.

## Features

- 🔐 User authentication (register/login)
- ✍️ Create, edit, and delete blog posts
- 📝 Rich text editor for post content
- 🖼️ Image upload for posts
- 👍 Like system for posts
- 📊 Post views tracking
- 🏷️ Category-based organization
- 📱 Responsive design

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- React Quill (Rich text editor)
- Moment.js

### Backend
- Node.js
- Express
- MySQL
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blog_space
   ```

2. **Setup Database**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Run the database setup script
   source database_setup.sql
   ```

3. **Setup Backend**
   ```bash
   cd api
   npm install
   
   # Create .env file (already created, update if needed)
   # Update DB credentials in .env file
   
   npm run dev
   ```
   Backend will run on http://localhost:3000

4. **Setup Frontend**
   ```bash
   cd client
   npm install
   
   # .env file already created
   
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deployment Options:
- **Railway** - Easiest all-in-one solution
- **Render + PlanetScale** - Free tier available
- **Vercel + Railway** - Great for static frontend
- **VPS** - Full control (DigitalOcean, AWS, etc.)

## Project Structure

```
blog_space/
├── api/                    # Backend API
│   ├── controllers/        # Route controllers
│   ├── routes/            # API routes
│   ├── db.js              # Database connection
│   ├── index.js           # Express app entry
│   └── package.json
├── client/                # Frontend React app
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/          # API configuration
│   │   ├── components/   # React components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Page components
│   │   └── main.jsx      # App entry
│   └── package.json
└── database_setup.sql     # Database schema
```

## Environment Variables

### Backend (.env)
```
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Users
- `GET /api/users/:id` - Get user profile

### Uploads
- `POST /api/uploads` - Upload image

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For deployment help, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

For issues and questions, please open an issue on GitHub.
