# Cloud Build Admin Panel - Quick Start

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd admin
npm install
```

### Step 2: Start the Server
```bash
npm start
```

Server will start on: **http://localhost:8081**

### Step 3: Login
Open browser and go to: **http://localhost:8081/login.html**

**Credentials:**
- Email: `admin@cloud.in`
- Password: `admin2107`

---

## 📋 What You Can Do

### Our Work Section
- ✅ Add new projects with images
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Upload project thumbnails

### Client Love Section
- ✅ Add client testimonials
- ✅ Upload client photos
- ✅ Set star ratings (1-5)
- ✅ Edit/delete testimonials

### Video Reviews Section
- ✅ Add YouTube videos
- ✅ Add Instagram Reels
- ✅ Upload custom thumbnails
- ✅ Manage video library

---

## 🎯 Quick Tips

1. **Images**: All uploaded images go to `admin/public/uploads/`
2. **Data**: All content stored in `admin/data/*.json` files
3. **Changes**: Updates reflect instantly on main site
4. **Logout**: Click logout button in sidebar
5. **Session**: Login persists until you logout

---

## 📁 File Locations

```
admin/
├── server.js          ← Backend server
├── public/
│   ├── login.html     ← Login page
│   ├── dashboard.html ← Admin dashboard
│   ├── uploads/       ← Uploaded images
│   └── ...
└── data/
    ├── works.json     ← Projects data
    ├── clients.json   ← Testimonials data
    └── videos.json    ← Videos data
```

---

## 🔧 Troubleshooting

**Port 8081 already in use?**
- Change PORT in `server.js` line 6

**Can't upload images?**
- Check `public/uploads/` folder exists
- Check folder permissions

**Login not working?**
- Clear browser localStorage
- Check server is running on port 8081

---

## 🎨 Admin Panel Features

- ✅ Clean, professional UI
- ✅ Responsive design
- ✅ Image preview before upload
- ✅ Confirmation dialogs
- ✅ Success/error notifications
- ✅ Real-time data updates
- ✅ Secure authentication

---

**Ready to manage your Cloud Build website! 🚀**
