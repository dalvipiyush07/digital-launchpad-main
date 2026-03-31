# Cloud Build - Complete Setup Guide

## 🚀 Running Both Servers

### Option 1: Automatic Startup (Recommended)

Double-click `start-servers.bat` in the project root.

This will automatically start:
- **Main Website** on http://localhost:8080
- **Admin Panel** on http://localhost:8081

### Option 2: Manual Startup

**Terminal 1 - Main Website:**
```bash
npm run dev
```
Runs on: http://localhost:8080

**Terminal 2 - Admin Panel:**
```bash
cd admin
npm install  # First time only
npm start
```
Runs on: http://localhost:8081

---

## 📋 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Main Website | 8080 | http://localhost:8080 |
| Admin Panel | 8081 | http://localhost:8081 |

---

## 🔐 Admin Login

**URL:** http://localhost:8081/login.html

**Credentials:**
- Email: `admin@cloud.in`
- Password: `admin2107`

---

## 📁 Project Structure

```
digital-launchpad/
├── src/                    ← Main website source
├── public/                 ← Main website assets
├── vite.config.ts         ← Main app config (port 8080)
├── package.json           ← Main app dependencies
├── start-servers.bat      ← Start both servers
└── admin/                 ← Admin panel
    ├── server.js          ← Admin server (port 8081)
    ├── package.json       ← Admin dependencies
    ├── public/            ← Admin frontend
    │   ├── login.html
    │   ├── dashboard.html
    │   └── uploads/       ← Uploaded images
    └── data/              ← JSON data storage
        ├── works.json
        ├── clients.json
        └── videos.json
```

---

## 🎯 First Time Setup

### 1. Install Main App Dependencies
```bash
npm install
```

### 2. Install Admin Panel Dependencies
```bash
cd admin
npm install
cd ..
```

### 3. Start Both Servers
```bash
# Option A: Automatic
start-servers.bat

# Option B: Manual (2 terminals)
# Terminal 1:
npm run dev

# Terminal 2:
cd admin
npm start
```

---

## 🔄 How It Works

### Main Website (Port 8080)
- Built with React + Vite
- Displays content from admin panel
- Reads data from `admin/data/*.json` files
- Shows projects, testimonials, videos

### Admin Panel (Port 8081)
- Built with Express + Vanilla JS
- Manages all website content
- Provides CRUD operations
- Handles image uploads
- Stores data in JSON files

### Data Flow
```
Admin Panel (8081)
    ↓
Saves to JSON files
    ↓
Main Website (8080)
    ↓
Reads and displays
```

---

## 🛠️ Development Workflow

1. **Start both servers** using `start-servers.bat`
2. **Edit content** via Admin Panel (http://localhost:8081)
3. **View changes** on Main Website (http://localhost:8080)
4. Changes reflect instantly!

---

## 📝 Admin Panel Features

### Our Work Manager
- Add/edit/delete projects
- Upload project thumbnails
- Set category, description, URL

### Client Love Manager
- Add/edit/delete testimonials
- Upload client photos
- Set star ratings (1-5)
- Write testimonial text

### Video Reviews Manager
- Add YouTube/Instagram videos
- Upload custom thumbnails
- Manage video library

---

## 🔧 Troubleshooting

### Port Already in Use

**Main App (8080):**
Edit `vite.config.ts`:
```typescript
server: {
  port: 8082, // Change to any available port
}
```

**Admin Panel (8081):**
Edit `admin/server.js`:
```javascript
const PORT = 8082; // Change to any available port
```

### Can't Access Admin Panel
- Check server is running: `cd admin && npm start`
- Check URL: http://localhost:8081/login.html
- Clear browser cache and localStorage

### Images Not Uploading
- Check `admin/public/uploads/` folder exists
- Check folder permissions
- Check file size (max 10MB)

### CORS Errors
- Make sure both servers are running
- Check admin server allows port 8080
- Clear browser cache

---

## 🚀 Production Deployment

### Main Website
```bash
npm run build
# Deploy dist/ folder to hosting
```

### Admin Panel
```bash
cd admin
# Deploy to Node.js hosting (Heroku, Railway, etc.)
# Set environment variables
# Configure production database if needed
```

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Check `admin/README.md`
3. Check `admin/QUICKSTART.md`
4. Contact development team

---

**Cloud Build - Main App (8080) + Admin Panel (8081)**
