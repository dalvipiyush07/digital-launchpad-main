# Connection Test Guide

## Step 1: Stop All Servers
Press `Ctrl+C` in all terminal windows to stop both servers.

## Step 2: Start Admin Server
```bash
cd admin
node server.js
```

You should see:
```
========================================
  Cloud Build Admin Panel
========================================
  Running on: http://localhost:8081
  Login page: http://localhost:8081/login.html
========================================
```

## Step 3: Test Admin API Directly
Open browser and go to: `http://localhost:8081/api/works`

You should see JSON data like:
```json
[
  {
    "id": "1773437882697",
    "name": "Terraa AI",
    "tag": "laac",
    "desc": "Build Cloud Infrastructure in Seconds with A",
    "url": "https://terraa.online/",
    "coverImage": "/uploads/1773437882541-494712915.png",
    "priority": 1
  }
]
```

## Step 4: Start Main Website (New Terminal)
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
```

## Step 5: Check Browser Console
1. Open `http://localhost:8080` in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these messages:
   - `🔄 Fetching projects from /api/works...`
   - `✅ Received projects: [...]`
   - `📊 Sorted projects: [...]`

## Step 6: Check Network Tab
1. In Developer Tools, go to Network tab
2. Refresh the page
3. Look for request to `/api/works`
4. Click on it and check:
   - Status should be `200 OK`
   - Response should show your projects JSON

## Troubleshooting

### If you see CORS errors:
- Make sure admin server is running on port 8081
- Check that vite.config.ts has proxy configuration

### If images don't load:
- Check that `/uploads` folder exists in `admin/public/`
- Verify image paths in works.json start with `/uploads/`

### If data is empty:
- Check `admin/data/works.json` file exists and has data
- Restart admin server after adding data

## Quick Test Commands

Test admin API:
```bash
curl http://localhost:8081/api/works
```

Test proxy through main site:
```bash
curl http://localhost:8080/api/works
```

Both should return the same JSON data!
